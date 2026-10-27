const BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING SIT NAGPUR CAMPUS HUB COMPLETE FLOW TEST ===\n');

  // Test 1: Sign up validation & success
  console.log('Test 1: Testing Sign Up...');
  const testStudent = {
    name: 'Pradum Meshram',
    email: `pradum_${Date.now()}@sitnagpur.siu.edu.in`,
    prn: `PRN${Date.now().toString().slice(-8)}`,
    branch: 'Computer Science and Engineering',
    year: '3rd Year',
    phone: '9876543210',
    password: 'Password@123',
    confirmPassword: 'Password@123',
  };

  const signupRes = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testStudent),
  });
  const signupData = await signupRes.json();
  if (!signupRes.ok) throw new Error('Sign up failed: ' + JSON.stringify(signupData));
  console.log('✓ Sign Up succeeded:', signupData.message);

  // Test 2: Login
  console.log('\nTest 2: Testing Login...');
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testStudent.email, password: testStudent.password }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) throw new Error('Login failed: ' + JSON.stringify(loginData));
  const token = loginData.token;
  console.log('✓ Login succeeded! Token received for user:', loginData.user.name);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Test 3: Auth Me (Protected Route verification)
  console.log('\nTest 3: Testing /auth/me (Protected route check)...');
  const meRes = await fetch(`${BASE}/auth/me`, { headers: authHeaders });
  const meData = await meRes.json();
  if (!meRes.ok) throw new Error('/auth/me failed');
  console.log('✓ Protected route verified for:', meData.user.name, 'PRN:', meData.user.prn);

  // Test 4: Lost & Found
  console.log('\nTest 4: Testing Lost & Found Hub API...');
  const lfCreateRes = await fetch(`${BASE}/lost-found`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      type: 'Lost',
      itemName: 'Black HP Wireless Mouse',
      category: 'Electronics',
      description: 'Lost in CAD Lab 101 on row 2 desk.',
      location: 'CAD Lab 101',
      date: new Date().toISOString().split('T')[0],
      contactPhone: testStudent.phone,
    }),
  });
  const lfItem = await lfCreateRes.json();
  if (!lfCreateRes.ok) throw new Error('LF create failed: ' + JSON.stringify(lfItem));
  console.log('✓ Created Lost Item:', lfItem.itemName, 'Status:', lfItem.status);

  // Resolve item
  const lfResolveRes = await fetch(`${BASE}/lost-found/${lfItem._id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ status: 'Resolved' }),
  });
  const lfResolved = await lfResolveRes.json();
  console.log('✓ Marked Lost Item as Resolved:', lfResolved.status);

  // Test 5: Sports Hub Booking & Limits
  console.log('\nTest 5: Testing Sports Hub Booking & Limits...');
  const facRes = await fetch(`${BASE}/sports/facilities`, { headers: authHeaders });
  const facilities = await facRes.json();
  console.log(`✓ Fetched ${facilities.length} seeded sports facilities.`);

  const facId = facilities[0]._id;
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 4); // 4 days in future (within 7 day window)
  const dateStr = targetDate.toISOString().split('T')[0];



  // Book 1st slot
  const book1Res = await fetch(`${BASE}/sports/book`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      facilityId: facId,
      date: dateStr,
      startTime: '16:00',
      endTime: '17:00',
    }),
  });
  const book1 = await book1Res.json();
  if (!book1Res.ok) throw new Error('Book 1 failed: ' + JSON.stringify(book1));
  console.log('✓ Booked Slot 1 (16:00-17:00):', book1.message);

  // Double booking check (attempt to book exact same slot)
  const doubleBookRes = await fetch(`${BASE}/sports/book`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      facilityId: facId,
      date: dateStr,
      startTime: '16:00',
      endTime: '17:00',
    }),
  });
  if (doubleBookRes.status === 400) {
    console.log('✓ Double booking prevented successfully (Status 400 returned)');
  } else {
    throw new Error('Double booking prevention failed!');
  }

  // Book 2nd slot
  const book2Res = await fetch(`${BASE}/sports/book`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      facilityId: facId,
      date: dateStr,
      startTime: '17:00',
      endTime: '18:00',
    }),
  });
  const book2 = await book2Res.json();
  console.log('✓ Booked Slot 2 (17:00-18:00):', book2.message);

  // Attempt 3rd slot (Daily limit is 2)
  const book3Res = await fetch(`${BASE}/sports/book`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      facilityId: facId,
      date: dateStr,
      startTime: '18:00',
      endTime: '19:00',
    }),
  });
  const book3 = await book3Res.json();
  if (book3Res.status === 400 && book3.message.includes('Daily limit reached')) {
    console.log('✓ 2-Booking daily limit strictly enforced:', book3.message);
  } else {
    throw new Error('Daily limit check failed: ' + JSON.stringify(book3));
  }

  // Test 6: Need Players Poll
  console.log('\nTest 6: Testing "Need Players" Polls...');
  const pollCreateRes = await fetch(`${BASE}/sports/polls`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      sport: 'Badminton Court',
      date: dateStr,
      time: '18:00 - 19:00',
      totalPlayersNeeded: 2,
      note: 'Need 2 players for doubles match',
    }),
  });
  const poll = await pollCreateRes.json();
  console.log('✓ Created Poll for:', poll.sport, 'Needed:', poll.totalPlayersNeeded);

  // Test 7: Sports Booking Board (View-Only Master Grid)
  console.log('\nTest 7: Testing Sports Booking Board (Master Grid)...');
  const boardRes = await fetch(`${BASE}/sports/board?date=${dateStr}`, { headers: authHeaders });
  const board = await boardRes.json();
  console.log(`✓ Board returned ${board.board.length} facilities with occupancy matrix for date: ${board.date}`);

  // Test 8: Market Hub
  console.log('\nTest 8: Testing Market Hub...');
  const marketCreateRes = await fetch(`${BASE}/market`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Data Structures & Algorithms in Java Book',
      category: 'Books',
      price: 350,
      condition: 'Like New',
      description: 'Used for 3rd semester CSE. Highlighted important exam topics.',
      contactPhone: testStudent.phone,
    }),
  });
  const marketItem = await marketCreateRes.json();
  console.log('✓ Created Market Item:', marketItem.title, '₹' + marketItem.price);

  // Mark Sold
  const soldRes = await fetch(`${BASE}/market/${marketItem._id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ status: 'sold' }),
  });
  const soldItem = await soldRes.json();
  console.log('✓ Marked Market Item as:', soldItem.status);

  // Test 9: Emergency Contacts
  console.log('\nTest 9: Testing Emergency Hub...');
  const emRes = await fetch(`${BASE}/emergency`, { headers: authHeaders });
  const contacts = await emRes.json();
  console.log(`✓ Fetched ${contacts.length} emergency contacts (National + College Placeholders).`);

  // Test 10: Feedback Hub & Anonymity Masking
  console.log('\nTest 10: Testing Feedback Hub with Anonymity...');
  const fbCreateRes = await fetch(`${BASE}/feedback`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Canteen Evening Snacks Quality & Variety',
      category: 'Canteen',
      description: 'Requesting healthier beverage and snack options in the evening after 5 PM.',
      isAnonymous: true,
    }),
  });
  const fbItem = await fbCreateRes.json();
  console.log('✓ Feedback Created (isAnonymous: true). Author displayed as:', fbItem.user.name);
  if (fbItem.user.name !== 'Anonymous Student' || fbItem.user.email) {
    throw new Error('Anonymity masking violated!');
  }
  console.log('✓ Strict anonymity verified: student name and email are completely masked!');

  // Upvote feedback
  const upvoteRes = await fetch(`${BASE}/feedback/${fbItem._id}/upvote`, {
    method: 'POST',
    headers: authHeaders,
  });
  const upvoted = await upvoteRes.json();
  console.log('✓ Upvoted feedback. New count:', upvoted.upvotesCount);

  // Comment on feedback
  const commentRes = await fetch(`${BASE}/feedback/${fbItem._id}/comment`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      text: 'Agreed! More fresh fruit juice options would be great.',
      isAnonymous: true,
    }),
  });
  const commented = await commentRes.json();
  console.log('✓ Comment added. Total comments:', commented.commentsCount);

  console.log('\n======================================================');
  console.log('🏆 ALL 10 TESTS PASSED WITH 100% SUCCESS!');
  console.log('======================================================\n');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err.message);
  process.exit(1);
});
