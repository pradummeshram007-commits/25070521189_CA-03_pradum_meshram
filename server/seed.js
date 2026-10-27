require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Facility = require('./models/Facility');
const EmergencyContact = require('./models/EmergencyContact');
const LostFoundItem = require('./models/LostFoundItem');
const MarketItem = require('./models/MarketItem');
const Feedback = require('./models/Feedback');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sit_nagpur_hub';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // 1. Seed Admin & Demo Student
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@12345', salt);
    const studentPassword = await bcrypt.hash('Student@12345', salt);

    let admin = await User.findOne({ email: 'admin@sitnagpur.siu.edu.in' });
    if (!admin) {
      admin = await User.create({
        name: 'SIT Campus Administrator',
        email: 'admin@sitnagpur.siu.edu.in',
        prn: 'ADMIN-SITN-001',
        branch: 'Administration',
        year: 'Staff',
        phone: '9876543210',
        password: adminPassword,
        role: 'admin',
      });
      console.log('[Seed] Admin user created: admin@sitnagpur.siu.edu.in / Admin@12345');
    }

    let demoStudent = await User.findOne({ email: 'student@sitnagpur.siu.edu.in' });
    if (!demoStudent) {
      demoStudent = await User.create({
        name: 'Aarav Sharma',
        email: 'student@sitnagpur.siu.edu.in',
        prn: '23070521001',
        branch: 'Computer Science and Engineering',
        year: '3rd Year',
        phone: '9823456780',
        password: studentPassword,
        role: 'student',
      });
      console.log('[Seed] Demo student created: student@sitnagpur.siu.edu.in / Student@12345');
    }

    // 2. Seed 9 Sports Facilities
    const facilitiesList = [
      { name: 'Table Tennis', icon: 'table-tennis', description: 'Indoor TT arena with tournament grade Stiga tables.', openTime: '06:00', closeTime: '22:00' },
      { name: 'Pool Table', icon: 'pool', description: 'Recreation room 8-ball billiards & pool tables.', openTime: '06:00', closeTime: '22:00' },
      { name: 'Badminton Court', icon: 'badminton', description: 'Wooden synthetic floor indoor badminton courts.', openTime: '06:00', closeTime: '22:00' },
      { name: 'Carrom', icon: 'carrom', description: 'Carrom boards in student recreation pavilion.', openTime: '06:00', closeTime: '22:00' },
      { name: 'Chess', icon: 'chess', description: 'Quiet brain-sports room with official boards and clocks.', openTime: '06:00', closeTime: '22:00' },
      { name: 'Cricket Ground', icon: 'cricket', description: 'Main campus turf cricket pitch and practice nets.', openTime: '06:00', closeTime: '22:00' },
      { name: 'Football Ground', icon: 'football', description: 'Full-size natural grass football field.', openTime: '06:00', closeTime: '22:00' },
      { name: 'Basketball Court', icon: 'basketball', description: 'Floodlit outdoor acrylic basketball court.', openTime: '06:00', closeTime: '22:00' },
      { name: 'Volleyball Court', icon: 'volleyball', description: 'Standard sand & hard court volleyball arenas.', openTime: '06:00', closeTime: '22:00' },
    ];

    for (const fac of facilitiesList) {
      await Facility.findOneAndUpdate(
        { name: fac.name },
        { ...fac },
        { upsert: true, new: true }
      );
    }
    console.log('[Seed] 9 Sports facilities verified/seeded.');

    // 3. Seed Emergency Contacts
    const emergencyList = [
      // National / Verified
      { category: 'Medical', name: 'Ambulance Emergency', role: 'National Medical Response', phone: '108', isPlaceholder: false, notes: 'Toll-free 24/7 National Emergency Ambulance' },
      { category: 'Police', name: 'Police Control Room', role: 'Emergency Police Assistance', phone: '112', isPlaceholder: false, notes: 'Unified Emergency Services (Police / Fire / Health)' },
      { category: 'Police', name: 'City Police Emergency', role: 'Local Police Dispatch', phone: '100', isPlaceholder: false, notes: 'Direct Police Control Line' },
      { category: 'Fire', name: 'Fire & Rescue Brigade', role: 'Fire Emergency Services', phone: '101', isPlaceholder: false, notes: 'Nagpur Fire Department Helpline' },
      { category: 'Helpline', name: 'Women Helpline', role: 'National Women Safety Helpline', phone: '1091', isPlaceholder: false, notes: '24/7 dedicated women distress support' },
      { category: 'Helpline', name: 'UGC Anti-Ragging Helpline', role: 'Toll-Free Anti-Ragging Cell', phone: '1800-180-5522', isPlaceholder: false, notes: 'Zero tolerance anti-ragging national cell' },
      // College Placeholders (Clearly marked)
      { category: 'College', name: 'Campus Security Main Gate', role: 'SIT Nagpur Security Office', phone: '+91 712-000-0001 (PLACEHOLDER)', isPlaceholder: true, notes: 'Main gate barrier & rapid reaction desk [PLACEHOLDER]' },
      { category: 'College', name: 'Central Admin Office', role: 'Administrative Superintendent', phone: '+91 712-000-0002 (PLACEHOLDER)', isPlaceholder: true, notes: 'Student affairs and general administrative queries [PLACEHOLDER]' },
      { category: 'College', name: 'Boys Hostel Warden', role: 'Hostel Administration', phone: '+91 712-000-0003 (PLACEHOLDER)', isPlaceholder: true, notes: 'Hostel Block A & B emergency supervisor [PLACEHOLDER]' },
      { category: 'College', name: 'Girls Hostel Warden', role: 'Hostel Administration', phone: '+91 712-000-0004 (PLACEHOLDER)', isPlaceholder: true, notes: 'Girls Hostel Block emergency supervisor [PLACEHOLDER]' },
      { category: 'College', name: 'Campus Medical Room & Nurse', role: 'First Aid & Health Center', phone: '+91 712-000-0005 (PLACEHOLDER)', isPlaceholder: true, notes: 'SIT Nagpur clinic resident nurse [PLACEHOLDER]' },
      { category: 'College', name: 'Campus Transport In-charge', role: 'Bus & Ambulance Transit', phone: '+91 712-000-0006 (PLACEHOLDER)', isPlaceholder: true, notes: 'Student bus transit & emergency transport [PLACEHOLDER]' },
      { category: 'Medical', name: 'AIIMS Nagpur Emergency Desk', role: 'Nearby Tertiary Care Hospital', phone: '+91 712-000-0007 (PLACEHOLDER)', isPlaceholder: true, notes: 'Nearest super-specialty hospital trauma care [PLACEHOLDER]' },
    ];

    for (const contact of emergencyList) {
      await EmergencyContact.findOneAndUpdate(
        { name: contact.name, role: contact.role },
        { ...contact },
        { upsert: true, new: true }
      );
    }
    console.log('[Seed] Emergency contacts seeded.');

    // 4. Sample Lost & Found item if empty
    const lostCount = await LostFoundItem.countDocuments();
    if (lostCount === 0 && demoStudent) {
      await LostFoundItem.create({
        type: 'Lost',
        itemName: 'Blue Milton Thermosteel Bottle',
        category: 'Bottle',
        description: 'Lost on 2nd floor lab corridor next to Lab 204. Has an SIT Nagpur sticker on the lid.',
        location: 'Academic Block B, 2nd Floor Corridor',
        date: new Date().toISOString().split('T')[0],
        contactPhone: '9823456780',
        user: demoStudent._id,
        status: 'Open',
      });
      await LostFoundItem.create({
        type: 'Found',
        itemName: 'Scientific Calculator Casio fx-991CW',
        category: 'Electronics',
        description: 'Found on desk row 3 in Lecture Hall 102 after Mathematics lecture.',
        location: 'Lecture Hall 102',
        date: new Date().toISOString().split('T')[0],
        contactPhone: '9823456780',
        user: demoStudent._id,
        status: 'Open',
      });
      console.log('[Seed] Sample Lost & Found items created.');
    }

    // 5. Sample Market item if empty
    const marketCount = await MarketItem.countDocuments();
    if (marketCount === 0 && demoStudent) {
      await MarketItem.create({
        user: demoStudent._id,
        title: 'Engineering Drawing Drafter & Set Squares',
        category: 'Lab Equipment/Drafter',
        price: 450,
        condition: 'Like New',
        description: 'Used for only 1 semester in 1st year Engineering Graphics. Excellent smooth condition with carrying bag.',
        contactPhone: '9823456780',
        status: 'available',
      });
      await MarketItem.create({
        user: demoStudent._id,
        title: 'Hero Sprint 21-Speed Mountain Bicycle',
        category: 'Cycles',
        price: 3200,
        condition: 'Used',
        description: 'Ideal for commuting between SIT campus and hostel. Brand new rear brake pads and front basket installed.',
        contactPhone: '9823456780',
        status: 'available',
      });
      console.log('[Seed] Sample Market items created.');
    }

    // 6. Sample Feedback if empty
    const fbCount = await Feedback.countDocuments();
    if (fbCount === 0 && demoStudent) {
      await Feedback.create({
        user: demoStudent._id,
        title: 'Extend Library Air-Conditioned Study Room Hours During Midterms',
        category: 'Infrastructure',
        description: 'Requesting the administration to keep the library study hall open till 11:00 PM during examination weeks for quiet revision.',
        isAnonymous: false,
        status: 'Under Review',
        upvotes: [demoStudent._id],
        comments: [
          {
            user: demoStudent._id,
            text: 'It would greatly help hostel students who need a quiet space.',
            isAnonymous: false,
          },
        ],
      });
      console.log('[Seed] Sample Feedback created.');
    }

    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedData();
