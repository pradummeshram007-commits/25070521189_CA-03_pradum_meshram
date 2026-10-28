# 📌 Campus Hub · SIT Nagpur
> **A Modern Student Portal & Collegiate Noticeboard for Symbiosis Institute of Technology, Nagpur**  
> *Developed by Pradum Meshram (PRN: 25070521189)*

---

## 🏛️ Project Concept & Design Philosophy

**Campus Hub** is designed around the concept of a **modern campus noticeboard**. It evokes the warmth of physical university pinboards, paired with the sharp typography and precision of modern tools like Linear or Notion:
- **Warm Paper Background (`#F5F1E8`)** with crisp **Ink Typography (`#1A1A17`)**.
- **Flat cards** with thin borders (`#DDD6C7`) that lift on hover, completely avoiding generic drop shadows, neon gradients, or glassmorphism.
- **Index-tab hub colors** giving each of the 6 academic hubs a distinct identity.
- **AppShell** providing a 248px desktop left sidebar, desktop search with permanent Emergency pill, and a 390px mobile bottom navigation bar with drawer sheet.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Pure JavaScript (No TypeScript), Vanilla CSS Tokens |
| **Typography** | Google Fonts: `Bricolage Grotesque` (Headings), `Instrument Sans` (UI/Body), `IBM Plex Mono` (Data) |
| **Icons** | Custom Lucide-style SVG line suite (1.5px stroke, 20px, strictly zero emoji) |
| **Backend** | Node.js, Express.js REST API |
| **Database** | MongoDB with Mongoose (8 data models) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing, protected middleware (`protect`, `adminOnly`) |
| **Media Handling** | Multer file uploads (JPG, PNG, WebP with 2MB limits) |

---

## 🎨 Design System & Color Tokens

```
- Page Background (Paper):       #F5F1E8
- Card Surface:                  #FFFDF9
- Sunken Surface / Skeleton:     #EDE7DA
- Borders & Dividers (Line):     #DDD6C7
- Text Primary (Ink):            #1A1A17
- Text Secondary:                #57534A
- Text Muted:                    #8C867A
- Brand Oxblood:                 #7B1E2E (Tint: #F3E3E3)
- Highlight Marigold:            #F2B33D (Highlighter-pen marks & focus rings)
- Primary Button:                Ink background (#1A1A17) with Paper text (#FFFDF9)
```

### 🏷️ Dedicated Hub Palette
Each hub uses its color **strictly** on its icon chip, header strip, tags, and active states:
- **Hub 01 · Lost & Found:** `#A0660E` (Tint: `#FBF0D9`)
- **Hub 02 · Sports Hub:** `#2E6B4E` (Tint: `#E2EFE7`)
- **Hub 03 · Booking Board:** `#2C5A8C` (Tint: `#E1EAF4`)
- **Hub 04 · Market Hub:** `#B4532A` (Tint: `#F7E6DC`)
- **Hub 05 · Emergency Hub:** `#D7261E` (Tint: `#FCE4E2`)
- **Hub 06 · Feedback Hub:** `#1E6E6A` (Tint: `#DDEFED`)

---

## 🚀 Important Features & Visual Walkthrough

### 1. Landing Page (Public Campus Noticeboard)
The public noticeboard showcases live student stats, highlighter-pen headline highlights, 6 interactive hub cards, a 3-step student onboarding guide, and collegiate FAQ accordions.

![Landing Page Desktop](./Design-by_pradum/landing_page_campus_hub/screen.png)

#### Mobile View (390px Viewport)
Clean responsive noticeboard flow optimized for mobile students:

![Landing Page Mobile](./Design-by_pradum/landing_page_mobile_campus_hub/screen.png)

---

### 2. Authentication (Sign Up & Login)
- **Sign Up:** Enforces institutional email validation (`@sitnagpur.siu.edu.in`), verified 8-digit PRN enrollment, and branch/year selection.
- **Login:** Split-panel editorial layout with pre-configured quick demo logins for both Student and Admin roles.

| Sign Up Screen | Login Screen |
| :---: | :---: |
| ![Sign Up](./Design-by_pradum/sign_up_campus_hub/screen.png) | ![Login](./Design-by_pradum/log_in_campus_hub/screen.png) |

---

### 3. Student Dashboard
The student command center wrapped in the persistent **AppShell** (248px left desktop sidebar with initials avatar and active hub indicator). Features:
- Real-time dateline header.
- **Your Stuff:** Live active slot bookings formatted as noticeboard **TicketCards** with perforated dashed dividers and semicircular notches.
- Quick navigation cards for all 6 campus hubs.

![Dashboard](./Design-by_pradum/dashboard_campus_hub/screen.png)

---

### 4. Hub 01 · Lost & Found
A digital lost-property ledger for reporting and recovering items left across SIT campus:
- Segmented control toggling between **Lost Items** and **Found Items**.
- Luggage tag noticeboard cards with status chips (`Open`, `Claimed`, `Resolved`).
- **Report Item Modal:** Multi-field reporting with campus handover spots (Academic Block, Canteen, Library, Hostels) and photo uploads.
- **Claim Modal:** Ownership verification workflow.

| Lost & Found Feed | Report Item Modal |
| :---: | :---: |
| ![Lost & Found](./Design-by_pradum/lost_found_campus_hub/screen.png) | ![Report Item](./Design-by_pradum/report_item_modal_campus_hub/screen.png) |

---

### 5. Hub 02 · Sports Hub
Facility management and slot booking system for campus sports:
- **9 Seeded Facilities:** Badminton Courts 1 & 2, Basketball Court, Football Turf, Cricket Nets, Table Tennis 1 & 2, Volleyball Court, Gymnasium.
- **1-Hour Slot Matrix:** Interactive time slot selector (06:00 to 22:00) with occupancy indicators.
- **Strict Rule Enforcement:** Double-booking prevention algorithm and strict **2-bookings-per-day** limit per student.
- **"Need Players" Polls:** Match recruitment cards where students can create match alerts or join/leave open player slots.

| Slot Booking Matrix | Create Match Poll |
| :---: | :---: |
| ![Sports Hub](./Design-by_pradum/sports_hub_book_a_slot/screen.png) | ![Match Poll](./Design-by_pradum/sports_hub_find_players_create_poll/screen.png) |

---

### 6. Hub 03 · Sports Booking Board
Master campus ledger showing a facility-by-facility occupancy grid across all courts and hours, complete with date selector and open student match polls.

![Booking Board](./Design-by_pradum/booking_board_campus_hub/screen.png)

---

### 7. Hub 04 · Market Hub (Peer-to-Peer Exchange)
Campus student exchange for second-hand textbooks, engineering drafters, scientific calculators, bicycles, and hostel gear:
- **Product Cards:** Photos, condition badges (`LIKE NEW`, `USED`), and prices in bold **IBM Plex Mono** (`₹350`).
- **Detail View:** PRN verification badge, technical specifications, and instant 1-tap buyer actions:
  - **Chat on WhatsApp (`wa.me`)** prefilled with item inquiries.
  - **Direct Phone Call (`tel:`)**.
- **Sell an Item:** Form with condition segmented control, suggested price guides, pickup locations, and up to 3 photo uploads.

| Browse Marketplace | Item Detail (Casio fx-991EX) | Sell an Item Modal |
| :---: | :---: | :---: |
| ![Market Listings](./Design-by_pradum/market_hub_browse_listings/screen.png) | ![Detail View](./Design-by_pradum/market_hub_casio_fx_991ex_detail/screen.png) | ![Sell Modal](./Design-by_pradum/market_hub_sell_an_item/screen.png) |

---

### 8. Hub 05 · Emergency Hub
Emergency crisis desk with instant one-tap dialing:
- **112 National Callout Banner:** Prominent red banner for all-in-one national emergency dispatch.
- **Quick Tiles:** 1-tap buttons for Ambulance (108), Police (100), Fire (101), and Women Helpline (1091).
- **Categorized Directory:** College security desks, hostel wardens, medical rooms, campus electricians, and helplines.
- Direct `Call` and `Copy Number` buttons on every contact card.
- Admin directory controls (Add, Edit, Delete).

![Emergency Hub](./Design-by_pradum/emergency_hub_campus_hub/screen.png)

---

### 9. Hub 06 · Feedback Hub (Campus Voice)
Open campus forum for suggestions, complaints, and facility requests:
- **Vertical Upvote Buttons (`▲`):** PRN-verified student upvoting with real-time score updates.
- **Status Lifecycle:** `Open` → `Under Review` → `Resolved` with admin status controls.
- **Strict Anonymity:** When checked, student identity is completely masked as `"Anonymous Student"`.
- **Discussion Threads:** Collapsible comment accordion with constructive discussion.
- **Weekly Resolution Sidebar:** Real-time resolution rate progress bar and Top 3 upvoted campus issues.

![Feedback Hub](./Design-by_pradum/feedback_hub_campus_hub/screen.png)

---

## 📂 Project Directory Structure

```
25070521189-CA-03-pradum/
├── client/                              # Frontend React (Vite)
│   ├── public/                          # Static assets & favicon
│   ├── src/
│   │   ├── assets/                      # Local images
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── AppShell.jsx         # 248px desktop sidebar + 390px mobile nav
│   │   │       ├── Avatar.jsx           # Oxblood student initials avatar
│   │   │       ├── Button.jsx           # 44px Ink, Secondary, & Oxblood buttons
│   │   │       ├── Chip.jsx             # Hub colored round pill chips
│   │   │       ├── EmptyState.jsx       # Clean noticeboard empty card
│   │   │       ├── HubHeader.jsx        # 6px hub accent strip + title + actions
│   │   │       ├── Icons.jsx            # Lucide-style SVG line icon suite
│   │   │       ├── Input.jsx            # 44px input with label & error text
│   │   │       ├── Modal.jsx            # Desktop dialog / Mobile bottom sheet
│   │   │       ├── PublicHeader.jsx     # Landing navbar (Login / Sign Up)
│   │   │       ├── SegmentedControl.jsx # Sunken tab pill switcher
│   │   │       ├── Select.jsx           # 44px dropdown select
│   │   │       ├── Skeleton.jsx         # Sunken pulse loader
│   │   │       ├── TicketCard.jsx       # Perforated sports booking ticket stub
│   │   │       └── Toast.jsx            # Floating notification toasts
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # JWT authentication state & authFetch
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx        # Command center & active bookings
│   │   │   ├── EmergencyPage.jsx        # 112 banner & emergency contacts
│   │   │   ├── FeedbackPage.jsx         # Upvotes, anonymous posts, & comments
│   │   │   ├── LandingPage.jsx          # Public noticeboard collage & FAQ
│   │   │   ├── LoginPage.jsx            # Split-panel login with demo chips
│   │   │   ├── LostFoundPage.jsx        # Lost & found ledger & claims
│   │   │   ├── MarketPage.jsx           # Second-hand buy/sell marketplace
│   │   │   ├── NotFoundPage.jsx         # 404 noticeboard slip error page
│   │   │   ├── SignupPage.jsx           # Split-panel institutional sign up
│   │   │   ├── SportsBookingBoardPage.jsx # Master occupancy ledger
│   │   │   └── SportsPage.jsx           # Slot matrix & player polls
│   │   ├── App.jsx                      # Route definitions
│   │   ├── index.css                    # Design tokens & styling
│   │   └── main.jsx                     # Entry point
│   ├── index.html                       # Google Fonts & oxblood favicon
│   ├── package.json
│   └── vite.config.js
│
├── server/                              # Backend Node.js + Express
│   ├── middleware/
│   │   ├── auth.js                      # protect & adminOnly middleware
│   │   └── upload.js                    # Multer image storage & 2MB limits
│   ├── models/
│   │   ├── Booking.js                   # Sports court reservations
│   │   ├── EmergencyContact.js          # Verified helplines & wardens
│   │   ├── Facility.js                  # Sports courts & time slots
│   │   ├── Feedback.js                  # Forum posts, upvotes, & comments
│   │   ├── LostFoundItem.js             # Lost/found property registry
│   │   ├── MarketItem.js                # Student buy/sell listings
│   │   ├── PlayerPoll.js                # Need players match polls
│   │   └── User.js                      # PRN, branch, year, hashed password
│   ├── routes/
│   │   ├── auth.js                      # Register, login, me
│   │   ├── emergency.js                 # Directory CRUD
│   │   ├── feedback.js                  # Posts, upvoting, comments, status
│   │   ├── lostFound.js                 # Items, claims, status
│   │   ├── market.js                    # Marketplace listings & status
│   │   └── sports.js                    # Facilities, slots, bookings, polls
│   ├── seed.js                          # Initial database seed script
│   ├── server.js                        # Express app & MongoDB connection
│   ├── verify_flow.js                   # Automated 10-step flow test suite
│   ├── .env.example
│   └── package.json
│
└── Design-by_pradum/                    # Google Stitch UI screen exports & assets
```

---

## ⚡ Installation & Running Locally

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally or via MongoDB Atlas URI

### 2. Backend Setup
```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and adjust variables if needed
cp .env.example .env

# Seed initial sports facilities, admin, and demo student data
npm run seed

# Start Express server (runs on http://localhost:5000)
npm start
```

### 3. Frontend Setup
```bash
# Navigate to client
cd ../client

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev

# Or build production bundle
npm run build
```

---

## 🧪 Automated Testing & Verification

The repository includes a comprehensive end-to-end integration test runner validating all features, business rules, and security protections:

```bash
cd server
node verify_flow.js
```

### Verified Test Cases:
1. **User Sign Up:** Institutional email validation & PRN registration.
2. **User Login:** Bcrypt credential verification & JWT issuance.
3. **Protected Route:** Protected `/auth/me` token authentication.
4. **Lost & Found:** Reporting items with photo support & status updating.
5. **Sports Slot Booking:** Slot reservation, double-booking rejection (Status 400), and 2-booking daily limit enforcement.
6. **Need Players Polls:** Match poll creation & join/leave logic.
7. **Sports Master Board:** Master occupancy table querying across facilities.
8. **Marketplace:** Item creation, price indexing, and marking as Sold.
9. **Emergency Hub:** Retrieval of hotlines and college contacts.
10. **Feedback Hub:** Post creation, strict anonymous author masking, upvote toggling, and comment threads.

---

## 🔑 Demo Credentials

To test user roles immediately, use the following pre-seeded credentials:

| Role | Email | Password | PRN |
| :--- | :--- | :--- | :--- |
| **Student** | `student@sitnagpur.siu.edu.in` | `Student@12345` | `21070123045` |
| **Admin** | `admin@sitnagpur.siu.edu.in` | `Admin@12345` | `20000000001` |

---

## 📜 License
Developed as CA-03 for Symbiosis Institute of Technology (SIT), Nagpur. All rights reserved.
