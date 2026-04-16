const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  info: {
    Title: "ExpiryGuard - Project Plan & Documentation",
    Author: "ExpiryGuard Team",
    Subject: "Full-Stack Web Application Plan",
  },
});

const output = fs.createWriteStream(
  path.join(__dirname, "..", "..", "ExpiryGuard-Project-Plan.pdf")
);
doc.pipe(output);

// Colors
const PRIMARY = "#4f46e5";
const DARK = "#111827";
const GRAY = "#4b5563";
const LIGHT_BG = "#f3f4f6";
const GREEN = "#059669";
const RED = "#dc2626";
const YELLOW = "#d97706";
const BLUE = "#2563eb";

// Helpers
function heading1(text) {
  doc.moveDown(0.5);
  doc.fontSize(22).fillColor(PRIMARY).font("Helvetica-Bold").text(text);
  doc
    .moveTo(doc.x, doc.y + 4)
    .lineTo(doc.x + 495, doc.y + 4)
    .strokeColor(PRIMARY)
    .lineWidth(2)
    .stroke();
  doc.moveDown(0.6);
}

function heading2(text) {
  doc.moveDown(0.4);
  doc.fontSize(16).fillColor(DARK).font("Helvetica-Bold").text(text);
  doc
    .moveTo(doc.x, doc.y + 2)
    .lineTo(doc.x + 495, doc.y + 2)
    .strokeColor(LIGHT_BG)
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.4);
}

function heading3(text) {
  doc.moveDown(0.3);
  doc.fontSize(13).fillColor(PRIMARY).font("Helvetica-Bold").text(text);
  doc.moveDown(0.2);
}

function body(text) {
  doc.fontSize(10).fillColor(DARK).font("Helvetica").text(text, { lineGap: 3 });
}

function bodyGray(text) {
  doc.fontSize(10).fillColor(GRAY).font("Helvetica").text(text, { lineGap: 3 });
}

function bullet(text) {
  doc
    .fontSize(10)
    .fillColor(DARK)
    .font("Helvetica")
    .text(`  •  ${text}`, { lineGap: 3, indent: 10 });
}

function bulletBold(label, desc) {
  doc
    .fontSize(10)
    .fillColor(DARK)
    .font("Helvetica-Bold")
    .text(`  •  ${label}: `, { continued: true, indent: 10 })
    .font("Helvetica")
    .text(desc, { lineGap: 3 });
}

function codeBlock(text) {
  const x = doc.x;
  const y = doc.y + 4;
  const width = 495;
  const lines = text.split("\n");
  const height = lines.length * 13 + 16;

  doc.save();
  doc.roundedRect(x, y, width, height, 4).fill("#f9fafb").stroke("#e5e7eb");
  doc.restore();

  doc.moveDown(0.3);
  doc.fontSize(9).fillColor("#374151").font("Courier");
  lines.forEach((line) => {
    doc.text(`  ${line}`, { lineGap: 2 });
  });
  doc.moveDown(0.3);
}

function tableRow(cols, isHeader = false) {
  const startX = doc.x;
  const y = doc.y;
  const font = isHeader ? "Helvetica-Bold" : "Helvetica";
  const color = isHeader ? PRIMARY : DARK;
  const colWidths = cols.length === 2 ? [150, 345] : cols.length === 3 ? [100, 200, 195] : [80, 130, 50, 235];

  if (isHeader) {
    doc.save();
    doc.rect(startX, y - 2, 495, 18).fill("#eef2ff");
    doc.restore();
  }

  let xPos = startX;
  cols.forEach((col, i) => {
    doc.fontSize(9).fillColor(color).font(font).text(col, xPos, y, {
      width: colWidths[i],
      lineBreak: false,
    });
    xPos += colWidths[i];
  });
  doc.moveDown(0.1);
  doc.y = y + 16;
}

function checkPage(needed = 80) {
  if (doc.y > 740 - needed) {
    doc.addPage();
  }
}

// ============================================================
// PAGE 1: COVER PAGE
// ============================================================
doc.moveDown(6);
doc
  .fontSize(42)
  .fillColor(PRIMARY)
  .font("Helvetica-Bold")
  .text("ExpiryGuard", { align: "center" });
doc.moveDown(0.3);
doc
  .fontSize(16)
  .fillColor(GRAY)
  .font("Helvetica")
  .text("Never Miss an Expiry Date Again", { align: "center" });
doc.moveDown(2);

doc
  .moveTo(150, doc.y)
  .lineTo(445, doc.y)
  .strokeColor(PRIMARY)
  .lineWidth(2)
  .stroke();
doc.moveDown(1.5);

doc
  .fontSize(13)
  .fillColor(DARK)
  .font("Helvetica-Bold")
  .text("Full-Stack Web Application", { align: "center" });
doc
  .fontSize(13)
  .fillColor(DARK)
  .font("Helvetica-Bold")
  .text("Project Plan & Documentation", { align: "center" });
doc.moveDown(1.5);

doc
  .fontSize(11)
  .fillColor(GRAY)
  .font("Helvetica")
  .text("A comprehensive platform for tracking expiry dates of personal", {
    align: "center",
  });
doc.text(
  "documents, warranties, subscriptions, certifications, and more.",
  { align: "center" }
);
doc.text(
  "Smart reminders, OCR scanning, family sharing, and analytics.",
  { align: "center" }
);

doc.moveDown(4);
doc
  .fontSize(10)
  .fillColor(GRAY)
  .font("Helvetica")
  .text(`Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, { align: "center" });
doc.text("Type: Full-Stack Portfolio Project", { align: "center" });
doc.text("Stack: Next.js + Express.js + MongoDB", { align: "center" });

// ============================================================
// PAGE 2: TABLE OF CONTENTS
// ============================================================
doc.addPage();
heading1("Table of Contents");
doc.moveDown(0.5);

const toc = [
  ["1.", "Project Overview & Purpose"],
  ["2.", "Problem Statement"],
  ["3.", "Key Features"],
  ["4.", "Tech Stack"],
  ["5.", "System Architecture"],
  ["6.", "Database Schema"],
  ["7.", "API Endpoints"],
  ["8.", "Authentication Flow"],
  ["9.", "Frontend Pages"],
  ["10.", "Backend Structure"],
  ["11.", "Frontend Structure"],
  ["12.", "Implementation Phases"],
  ["13.", "Environment Variables"],
  ["14.", "Dependencies"],
  ["15.", "Deployment Strategy"],
  ["16.", "Verification Checklist"],
  ["17.", "Current Implementation Status"],
];

toc.forEach(([num, title]) => {
  doc
    .fontSize(11)
    .fillColor(DARK)
    .font("Helvetica-Bold")
    .text(num, doc.x, doc.y, { continued: true, width: 30 })
    .font("Helvetica")
    .fillColor(PRIMARY)
    .text(`  ${title}`, { lineGap: 6 });
});

// ============================================================
// SECTION 1: PROJECT OVERVIEW
// ============================================================
doc.addPage();
heading1("1. Project Overview & Purpose");

body(
  "ExpiryGuard is a full-stack web application designed to help individuals and families track expiry dates for all kinds of personal documents, products, and services. The application provides a centralized dashboard where users can monitor everything that has an expiration date — from passports and driver's licenses to insurance policies, warranties, subscriptions, and domain names."
);
doc.moveDown(0.5);

heading3("Purpose");
body(
  "The primary purpose of ExpiryGuard is to solve a universal problem: people forget when their important documents and subscriptions expire, leading to fines, lapses in coverage, lost money, and unnecessary stress. No single platform currently exists that tracks ALL types of expiring items in one place."
);
doc.moveDown(0.3);

heading3("Why This Project?");
bullet("Built as a portfolio/resume project to demonstrate full-stack development skills");
bullet("Showcases 10+ technical skills hiring managers look for (auth, CRUD, APIs, real-time, OCR, cron, charts, deployment)");
bullet("Solves a real-world problem with a unique approach — no direct competitor exists");
bullet("Separate frontend and backend architecture demonstrates ability to build both independently");
bullet("Production-ready code with proper error handling, validation, and security");

doc.moveDown(0.5);
heading3("Target Users");
bullet("Individuals managing personal documents (passport, license, insurance)");
bullet("Families tracking documents for multiple members (spouse, children, parents)");
bullet("Professionals managing certifications and subscriptions");
bullet("Anyone who has ever missed a renewal deadline");

// ============================================================
// SECTION 2: PROBLEM STATEMENT
// ============================================================
checkPage(200);
heading1("2. Problem Statement");

body(
  "People manage dozens of items with expiration dates throughout their lives. These include:"
);
doc.moveDown(0.3);

const items = [
  "Government IDs (passport, driver's license, national ID)",
  "Insurance policies (health, auto, home, life)",
  "Product warranties (electronics, appliances, vehicles)",
  "Subscriptions (software, streaming, gym memberships)",
  "Professional certifications (AWS, Google Cloud, medical licenses)",
  "Domain names and SSL certificates",
  "Credit cards and bank cards",
  "Vehicle registration and inspection stickers",
];
items.forEach((item) => bullet(item));

doc.moveDown(0.5);
body(
  "The consequences of missing these expirations can be severe: expired insurance means no coverage during emergencies, an expired passport means cancelled travel plans, a lapsed certification means inability to work, and expired warranties mean paying full price for repairs."
);
doc.moveDown(0.3);
body(
  "Current solutions are fragmented — people use calendar reminders (easy to dismiss), spreadsheets (not user-friendly), or simply try to remember. No existing application provides a unified tracking solution with smart reminders, family sharing, OCR scanning, and visual analytics."
);

// ============================================================
// SECTION 3: KEY FEATURES
// ============================================================
doc.addPage();
heading1("3. Key Features");

const features = [
  [
    "Universal Expiry Tracking",
    "Track any type of expiring item — documents, warranties, subscriptions, certifications — all in one dashboard with color-coded urgency indicators (green for safe, yellow for warning, red for critical/expired).",
  ],
  [
    "Smart Email Reminders",
    "Automated daily cron job checks all items and sends email reminders at configurable intervals (default: 30, 7, and 1 day before expiry). Prevents duplicate notifications via a unique compound index. Auto-marks items as expired when past due.",
  ],
  [
    "OCR Document Scanning",
    "Upload a photo of any receipt, warranty card, or document. The app uses Tesseract.js to extract text and automatically identifies dates using regex pattern matching. Users select the correct expiry date and pre-fill the item creation form.",
  ],
  [
    "Family Member Management",
    "Add family members (spouse, children, parents) and assign items to specific people. Filter the dashboard by family member to see each person's upcoming expirations. A 'Self' member is auto-created on registration.",
  ],
  [
    "Visual Analytics Dashboard",
    "Charts and statistics showing: items by category (pie chart), upcoming expirations by month (bar chart), counts by status (active/expired/renewed), and distribution by family member.",
  ],
  [
    "Document Storage",
    "Upload and attach documents (receipts, certificates, cards) to items via Cloudinary. Direct client-to-cloud uploads using signed parameters. Automatic cleanup when items are deleted.",
  ],
  [
    "Emergency Card",
    "Generate a shareable QR code / URL containing critical document information. The emergency card page is publicly accessible without authentication — useful during emergencies when you need document info quickly.",
  ],
  [
    "Search, Filter & Sort",
    "Full-text search across item names and descriptions. Filter by category, status, and family member. Sort by expiry date, name, or creation date. Debounced search with URL-persisted filter state.",
  ],
  [
    "JWT Authentication",
    "Secure authentication with short-lived access tokens (15 min) and long-lived refresh tokens (7 days in httpOnly cookies). Automatic token refresh via Axios interceptors. Protected routes with auth guards.",
  ],
  [
    "Responsive Design",
    "Mobile-first UI with collapsible sidebar (hamburger menu on mobile), responsive card grids, and adaptive layouts. Built with Tailwind CSS and shadcn/ui components.",
  ],
];

features.forEach(([title, desc]) => {
  checkPage(80);
  heading3(title);
  body(desc);
  doc.moveDown(0.3);
});

// ============================================================
// SECTION 4: TECH STACK
// ============================================================
doc.addPage();
heading1("4. Tech Stack");
doc.moveDown(0.3);

tableRow(["Layer", "Technology"], true);
tableRow(["Frontend", "Next.js 16 (App Router) + TypeScript"]);
tableRow(["UI/Styling", "Tailwind CSS + shadcn/ui (base-ui)"]);
tableRow(["Backend", "Node.js + Express.js 5"]);
tableRow(["Database", "MongoDB + Mongoose 9"]);
tableRow(["Authentication", "JWT (access + refresh tokens) + bcrypt"]);
tableRow(["OCR", "Tesseract.js (client-side)"]);
tableRow(["File Storage", "Cloudinary (signed uploads)"]);
tableRow(["Email", "Nodemailer (SMTP)"]);
tableRow(["Cron Jobs", "node-cron (server-side)"]);
tableRow(["Charts", "Recharts"]);
tableRow(["Forms", "React Hook Form + Zod validation"]);
tableRow(["Data Fetching", "SWR (stale-while-revalidate)"]);
tableRow(["HTTP Client", "Axios (with interceptors)"]);
tableRow(["Icons", "Lucide React"]);
tableRow(["Deployment", "Vercel (client) + Render (server) + MongoDB Atlas"]);

doc.moveDown(0.5);
heading3("Why These Choices?");
bulletBold("Next.js", "Industry-standard React framework with App Router, SSR, and file-based routing");
bulletBold("Express.js", "Proven, lightweight Node.js framework — demonstrates ability to build APIs from scratch");
bulletBold("MongoDB", "Flexible document database perfect for varied item schemas; free Atlas tier for deployment");
bulletBold("JWT", "Stateless auth that scales; demonstrates understanding of token-based security");
bulletBold("Tesseract.js", "Free, client-side OCR — no API keys needed, reduces server load");
bulletBold("Cloudinary", "Free tier for file storage with on-the-fly image transformations");
bulletBold("shadcn/ui", "Accessible, customizable component library built on base-ui primitives");

// ============================================================
// SECTION 5: SYSTEM ARCHITECTURE
// ============================================================
doc.addPage();
heading1("5. System Architecture");

body(
  "ExpiryGuard uses a decoupled client-server architecture with separate deployments:"
);
doc.moveDown(0.5);

codeBlock(
  `┌─────────────────────────┐       ┌──────────────────────────┐
│     CLIENT (Next.js)    │       │    SERVER (Express.js)   │
│     Port 3000           │──────>│    Port 5000             │
│     Vercel              │ REST  │    Render                │
│                         │<──────│                          │
│  - Pages / Components   │ JSON  │  - Routes / Controllers  │
│  - Auth Context         │       │  - Mongoose Models       │
│  - Axios + SWR          │       │  - JWT Middleware         │
│  - Tesseract.js (OCR)   │       │  - Cron Jobs             │
└─────────────────────────┘       └────────────┬─────────────┘
                                               │
        ┌──────────────────────────────────────┼───────────┐
        │                                      │           │
        v                                      v           v
┌───────────────┐                  ┌───────────────┐ ┌──────────┐
│  Cloudinary   │                  │  MongoDB      │ │  SMTP    │
│  (Files)      │                  │  Atlas        │ │  (Email) │
└───────────────┘                  └───────────────┘ └──────────┘`
);

doc.moveDown(0.5);
heading3("Request Flow");
bullet("Client makes API calls to Express server via Axios");
bullet("Access token sent in Authorization header on every request");
bullet("Server validates JWT, queries MongoDB, returns JSON");
bullet("SWR caches responses client-side for instant UI updates");
bullet("File uploads go directly from client to Cloudinary (signed)");
bullet("Cron job runs on server every day at 8 AM to process reminders");

// ============================================================
// SECTION 6: DATABASE SCHEMA
// ============================================================
doc.addPage();
heading1("6. Database Schema");
body("The application uses 5 Mongoose models with proper indexes and relations:");
doc.moveDown(0.5);

heading3("User Model");
codeBlock(
  `{
  name:           String (required, max 50)
  email:          String (required, unique, lowercase)
  password:       String (required, min 6, select: false)
  avatar:         String (default: "")
  emergencyToken: String (unique, sparse)
  refreshToken:   String (select: false)
  timestamps:     true (createdAt, updatedAt)
}`
);

heading3("Category Model");
codeBlock(
  `{
  name:      String (required, max 50)
  icon:      String (default: "FileText") — Lucide icon name
  color:     String (default: "#6366f1") — hex color
  isDefault: Boolean (default: false)
  userId:    ObjectId -> User (null = system default)
  timestamps: true
}
Index: { name: 1, userId: 1 } (unique)`
);

heading3("FamilyMember Model");
codeBlock(
  `{
  name:      String (required, max 50)
  relation:  String (enum: Self, Spouse, Child, Parent, Other)
  email:     String (optional, lowercase)
  avatarUrl: String (optional)
  userId:    ObjectId -> User (required, indexed)
  timestamps: true
}`
);

checkPage(200);
heading3("Item Model");
codeBlock(
  `{
  name:             String (required, max 100)
  description:      String (optional, max 500)
  expiryDate:       Date (required)
  purchaseDate:     Date (optional)
  cost:             Number (min 0, optional)
  status:           String (enum: active, expired, renewed, archived)
  notes:            String (optional, max 2000)
  documentUrl:      String (Cloudinary URL)
  documentPublicId: String (Cloudinary public_id)
  reminderDays:     [Number] (default: [30, 7, 1])
  isEmergency:      Boolean (default: false)
  userId:           ObjectId -> User (required)
  categoryId:       ObjectId -> Category (required)
  familyMemberId:   ObjectId -> FamilyMember (optional)
  timestamps:       true
}
Indexes: { userId: 1, expiryDate: 1 }, { userId: 1, status: 1 }`
);

checkPage(120);
heading3("Notification Model");
codeBlock(
  `{
  type:     String (enum: reminder, expired, follow_up)
  sentAt:   Date (default: now)
  channel:  String (enum: email, in_app)
  daysLeft: Number (snapshot of days remaining when sent)
  userId:   ObjectId -> User (required)
  itemId:   ObjectId -> Item (required)
}
Unique Index: { itemId: 1, daysLeft: 1, type: 1 }
Index: { userId: 1, sentAt: -1 }`
);

doc.moveDown(0.3);
heading3("Seed Data — 8 Default Categories");
const cats = [
  ["Passport", "BookOpen", "#3b82f6"],
  ["Driver's License", "Car", "#8b5cf6"],
  ["Insurance", "Shield", "#10b981"],
  ["Warranty", "BadgeCheck", "#f59e0b"],
  ["Subscription", "CreditCard", "#ec4899"],
  ["Certification", "Award", "#06b6d4"],
  ["Domain Name", "Globe", "#f97316"],
  ["Other", "FileText", "#6b7280"],
];
tableRow(["Name", "Icon", "Color"], true);
cats.forEach(([name, icon, color]) => tableRow([name, icon, color]));

// ============================================================
// SECTION 7: API ENDPOINTS
// ============================================================
doc.addPage();
heading1("7. API Endpoints");
body("All endpoints are prefixed with /api. Protected routes require Authorization: Bearer <token> header.");
doc.moveDown(0.5);

heading3("Authentication (/api/auth)");
tableRow(["Method", "Route", "Auth", "Purpose"], true);
tableRow(["POST", "/auth/register", "No", "Create account, return tokens"]);
tableRow(["POST", "/auth/login", "No", "Verify credentials, return tokens"]);
tableRow(["POST", "/auth/refresh", "No", "Exchange refresh token for new access token"]);
tableRow(["POST", "/auth/logout", "Yes", "Invalidate refresh token"]);
tableRow(["GET", "/auth/me", "Yes", "Get current user profile"]);

doc.moveDown(0.5);
heading3("Items (/api/items)");
tableRow(["Method", "Route", "Auth", "Purpose"], true);
tableRow(["GET", "/items", "Yes", "List items (search, filter, sort, paginate)"]);
tableRow(["POST", "/items", "Yes", "Create new item"]);
tableRow(["GET", "/items/:id", "Yes", "Get item detail (with populated refs)"]);
tableRow(["PATCH", "/items/:id", "Yes", "Update item fields"]);
tableRow(["DELETE", "/items/:id", "Yes", "Delete item + Cloudinary cleanup"]);

doc.moveDown(0.5);
heading3("Categories (/api/categories)");
tableRow(["Method", "Route", "Auth", "Purpose"], true);
tableRow(["GET", "/categories", "Yes", "List default + user custom categories"]);
tableRow(["POST", "/categories", "Yes", "Create custom category"]);
tableRow(["PATCH", "/categories/:id", "Yes", "Update custom category"]);
tableRow(["DELETE", "/categories/:id", "Yes", "Delete custom (not defaults)"]);

doc.moveDown(0.5);
heading3("Family (/api/family)");
tableRow(["Method", "Route", "Auth", "Purpose"], true);
tableRow(["GET", "/family", "Yes", "List family members"]);
tableRow(["POST", "/family", "Yes", "Add family member"]);
tableRow(["PATCH", "/family/:id", "Yes", "Update member"]);
tableRow(["DELETE", "/family/:id", "Yes", "Delete member (not Self)"]);

doc.moveDown(0.5);
heading3("Other Endpoints");
tableRow(["Method", "Route", "Auth", "Purpose"], true);
tableRow(["GET", "/analytics", "Yes", "Aggregated stats (MongoDB pipeline)"]);
tableRow(["POST", "/upload/signature", "Yes", "Cloudinary signed params"]);
tableRow(["GET", "/notifications", "Yes", "User notification history"]);
tableRow(["POST", "/emergency-card/generate", "Yes", "Generate emergency token"]);
tableRow(["GET", "/emergency-card/:token", "No", "Public emergency card data"]);
tableRow(["GET", "/health", "No", "Server health check"]);

// ============================================================
// SECTION 8: AUTH FLOW
// ============================================================
doc.addPage();
heading1("8. Authentication Flow");

body("The application uses a dual-token JWT authentication strategy:");
doc.moveDown(0.5);

heading3("Token Strategy");
bulletBold("Access Token", "Short-lived (15 minutes), stored in JavaScript memory (React state). Sent as Bearer token in every API request. Never stored in localStorage or cookies.");
doc.moveDown(0.2);
bulletBold("Refresh Token", "Long-lived (7 days), stored in httpOnly secure cookie. Cannot be accessed by JavaScript. Used only to obtain new access tokens.");
doc.moveDown(0.5);

heading3("Flow Diagram");
codeBlock(
  `1. User submits login form
       |
2. POST /api/auth/login { email, password }
       |
3. Server verifies password with bcrypt
       |
4. Server generates accessToken + refreshToken
       |
5. Server sets refreshToken as httpOnly cookie
       |
6. Server returns { accessToken, user }
       |
7. Client stores accessToken in memory (React state)
       |
8. Client attaches token to every request via Axios interceptor
       |
9. When accessToken expires (401 response):
       |
10. Axios interceptor calls POST /api/auth/refresh
        |
11. Server verifies refreshToken from cookie
        |
12. Server returns new { accessToken }
        |
13. Original failed request is retried automatically`
);

doc.moveDown(0.5);
heading3("Security Measures");
bullet("Passwords hashed with bcrypt (12 salt rounds)");
bullet("Refresh tokens stored in httpOnly cookies (not accessible via JS)");
bullet("Access tokens are short-lived to minimize exposure");
bullet("Refresh token rotation on each refresh (old token invalidated)");
bullet("CORS restricted to client origin only");
bullet("All API inputs validated with Zod schemas");
bullet("Ownership checks on all CRUD operations (userId matching)");

// ============================================================
// SECTION 9: FRONTEND PAGES
// ============================================================
doc.addPage();
heading1("9. Frontend Pages");
body("The client has 13 pages organized in route groups:");
doc.moveDown(0.5);

heading3("Public Pages");
bulletBold("/ (Landing)", "Hero section with features grid, CTA buttons to register/login");
bulletBold("/login", "Email + password form with validation, link to register");
bulletBold("/register", "Name + email + password form, creates account and redirects");
bulletBold("/emergency/[token]", "Public emergency card showing critical items without auth");

doc.moveDown(0.3);
heading3("Protected Pages (Dashboard Layout)");
body("All wrapped in sidebar + topbar layout with auth guard redirect:");
doc.moveDown(0.2);
bulletBold("/dashboard", "Overview with stat cards (total, expiring, expired, active), urgency-sorted item list");
bulletBold("/items", "Full item list with search, category/status/member filters, sort options");
bulletBold("/items/new", "Item creation form with category select, date pickers, family member assign");
bulletBold("/items/[id]", "Item detail view with all fields, edit/delete buttons, document viewer");
bulletBold("/items/[id]/edit", "Pre-filled edit form with all current values");
bulletBold("/family", "Family member cards with add/edit/delete dialog");
bulletBold("/analytics", "Stats cards + category bar chart + monthly expiration chart + member breakdown");
bulletBold("/scan", "OCR scanner — upload image, Tesseract.js extracts text, regex finds dates, pre-fill form");
bulletBold("/settings", "User profile info, emergency card generator with copy link");

// ============================================================
// SECTION 10 & 11: PROJECT STRUCTURE
// ============================================================
doc.addPage();
heading1("10. Backend Structure");
codeBlock(
  `server/
├── package.json
├── .env / .env.example
├── src/
│   ├── index.js                  # Express app entry point
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── cloudinary.js         # Cloudinary config
│   │   └── email.js              # Nodemailer transporter
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Category.js           # Category schema
│   │   ├── FamilyMember.js       # Family member schema
│   │   ├── Item.js               # Item schema (core)
│   │   └── Notification.js       # Notification log
│   ├── routes/                   # 8 route files
│   ├── controllers/              # 8 controller files
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification
│   │   ├── error.middleware.js    # Global error handler
│   │   └── validate.middleware.js # Zod validation
│   ├── utils/
│   │   ├── generateToken.js      # JWT sign helpers
│   │   ├── sendEmail.js          # Email sender + templates
│   │   └── cronJobs.js           # node-cron scheduler
│   ├── validations/              # 4 Zod schema files
│   └── seed.js                   # Seed default categories`
);

doc.moveDown(0.5);
heading1("11. Frontend Structure");
codeBlock(
  `client/src/
├── app/
│   ├── layout.tsx                # Root: AuthProvider + Toaster
│   ├── page.tsx                  # Landing page
│   ├── (auth)/                   # Auth route group
│   │   ├── layout.tsx            # Centered card layout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── layout.tsx            # Sidebar + topbar + auth guard
│   │   ├── dashboard/page.tsx    # 9 page files
│   │   └── ...
│   └── emergency/[token]/page.tsx
├── components/
│   ├── ui/           # 14 shadcn/ui components
│   ├── layout/       # sidebar, topbar, mobile-nav
│   └── items/        # item-form, item-card, urgency-badge, filters
├── hooks/            # useItems, useCategories, useFamily, useAnalytics
├── lib/
│   ├── api.ts        # Axios instance + interceptors
│   ├── auth-context.tsx  # Auth provider + useAuth hook
│   ├── utils.ts      # Urgency calc, date formatting
│   └── validations.ts    # Zod form schemas
└── types/index.ts    # TypeScript interfaces`
);

// ============================================================
// SECTION 12: IMPLEMENTATION PHASES
// ============================================================
doc.addPage();
heading1("12. Implementation Phases");

heading2("Phase 1: Foundation");
bulletBold("Step 1 — Project Scaffold", "Create client/ and server/ directories, install all dependencies, init shadcn/ui with 14+ components");
bulletBold("Step 2 — Database + Models", "Set up MongoDB connection, write 5 Mongoose models with indexes, seed 8 default categories");
bulletBold("Step 3 — Authentication", "JWT auth (register/login/refresh/logout/me), bcrypt hashing, auth middleware, Axios interceptors, auth context, login/register pages, auth guard");
doc.moveDown(0.3);

heading2("Phase 2: Core CRUD");
bulletBold("Step 4 — Dashboard", "Stat cards (total/expiring/expired/active), urgency-sorted item list with color-coded badges");
bulletBold("Step 5 — Item CRUD", "Full create/read/update/delete with react-hook-form + Zod, ownership checks, pagination, populated refs");
bulletBold("Step 6 — Categories", "System defaults + user custom categories, CRUD API, prevent deletion of defaults");
bulletBold("Step 7 — Search & Filters", "Debounced search, category/status/member dropdown filters, sort options, URL-persisted state");
doc.moveDown(0.3);

heading2("Phase 3: Smart Features");
bulletBold("Step 8 — Reminder System", "node-cron daily job, query expiring items, check reminderDays, prevent duplicate notifications, batch email per user, auto-expire past-due");
bulletBold("Step 9 — OCR Scanning", "Tesseract.js worker with progress bar, regex date extraction (6+ formats), date picker, pre-fill item form");
bulletBold("Step 10 — Document Storage", "Cloudinary signed uploads from client, attach to items, preview thumbnails, cleanup on delete");
doc.moveDown(0.3);

heading2("Phase 4: Family & Analytics");
bulletBold("Step 11 — Family Members", "CRUD routes, auto-create Self on registration, assign items to members, filter by member");
bulletBold("Step 12 — Analytics", "MongoDB aggregation pipelines ($group by category/month/status/member), bar/pie charts with Recharts");
bulletBold("Step 13 — Emergency Card", "Generate unique token, public endpoint, QR code generation, shareable URL");
doc.moveDown(0.3);

heading2("Phase 5: Polish & Deploy");
bulletBold("Step 14 — Responsive Design", "Sidebar collapse to sheet on mobile, responsive card grids, adaptive tables");
bulletBold("Step 15 — Dark Mode", "next-themes + shadcn dark mode, theme toggle in topbar");
bulletBold("Step 16 — Loading/Error States", "Skeleton loaders, global error boundary, toast notifications on all mutations");
bulletBold("Step 17 — Deployment", "MongoDB Atlas (free), Server on Render (free), Client on Vercel, env vars, CORS, end-to-end test");

// ============================================================
// SECTION 13: ENVIRONMENT VARIABLES
// ============================================================
doc.addPage();
heading1("13. Environment Variables");

heading3("Server (.env)");
codeBlock(
  `PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expiryguard
JWT_ACCESS_SECRET=<random-string>
JWT_REFRESH_SECRET=<random-string>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<app-password>
EMAIL_FROM=ExpiryGuard <noreply@expiryguard.app>`
);

heading3("Client (.env.local)");
codeBlock(
  `NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>`
);

// ============================================================
// SECTION 14: DEPENDENCIES
// ============================================================
heading1("14. Dependencies");

heading3("Server (12 packages)");
codeBlock(
  `express mongoose cors dotenv bcryptjs jsonwebtoken
cookie-parser zod nodemailer node-cron cloudinary
Dev: nodemon`
);

heading3("Client (11+ packages)");
codeBlock(
  `next react react-dom typescript tailwindcss
axios react-hook-form @hookform/resolvers zod
date-fns swr lucide-react tesseract.js sonner
shadcn/ui components (14 UI components)`
);

// ============================================================
// SECTION 15: DEPLOYMENT
// ============================================================
checkPage(200);
heading1("15. Deployment Strategy");

heading3("MongoDB Atlas (Database)");
bullet("Create free M0 cluster at mongodb.com");
bullet("Whitelist Render server IP (or 0.0.0.0/0 for free tier)");
bullet("Copy connection string to server environment variables");
bullet("Run seed script against production database");

doc.moveDown(0.3);
heading3("Render (Backend Server)");
bullet("Create free Web Service from GitHub repo (server directory)");
bullet("Set root directory to server/");
bullet("Build command: npm install");
bullet("Start command: node src/index.js");
bullet("Set all environment variables from .env.example");

doc.moveDown(0.3);
heading3("Vercel (Frontend Client)");
bullet("Import GitHub repo, select client/ as root directory");
bullet("Framework preset: Next.js (auto-detected)");
bullet("Set NEXT_PUBLIC_API_URL to Render server URL");
bullet("Update Google OAuth callback URL to production domain");
bullet("Verify all pages render correctly");

// ============================================================
// SECTION 16: VERIFICATION CHECKLIST
// ============================================================
doc.addPage();
heading1("16. Verification Checklist");
doc.moveDown(0.3);

const checks = [
  ["Phase 1", "MongoDB connection + seed works"],
  ["Phase 1", "Register new account + receive JWT tokens"],
  ["Phase 1", "Login with existing credentials"],
  ["Phase 1", "Token auto-refresh on 401"],
  ["Phase 1", "Auth guard redirects unauthenticated users"],
  ["Phase 2", "Create item with all fields"],
  ["Phase 2", "Edit item — changes persist"],
  ["Phase 2", "Delete item — removed from all views"],
  ["Phase 2", "Dashboard shows correct urgency colors"],
  ["Phase 2", "Search by name returns correct results"],
  ["Phase 2", "Filter by category/status/member works"],
  ["Phase 2", "Create and use custom category"],
  ["Phase 3", "Cron sends reminder emails at correct intervals"],
  ["Phase 3", "No duplicate notifications on repeated cron runs"],
  ["Phase 3", "Auto-expire past-due items"],
  ["Phase 3", "OCR extracts dates from receipt photo"],
  ["Phase 3", "Document upload + preview + delete works"],
  ["Phase 4", "Add/edit/delete family members"],
  ["Phase 4", "Assign items to family members"],
  ["Phase 4", "Analytics charts display correct data"],
  ["Phase 4", "Emergency card loads without authentication"],
  ["Phase 5", "Mobile responsive layout at 375px width"],
  ["Phase 5", "Dark mode toggle works across all pages"],
  ["Phase 5", "Skeleton loading states appear during data fetch"],
  ["Phase 5", "Production deploy works end-to-end"],
];

tableRow(["Phase", "Test"], true);
checks.forEach(([phase, test]) => {
  checkPage(20);
  tableRow([phase, test]);
});

// ============================================================
// SECTION 17: CURRENT STATUS
// ============================================================
doc.addPage();
heading1("17. Current Implementation Status");
doc.moveDown(0.3);

body("As of the current build, the following has been implemented and compiles successfully:");
doc.moveDown(0.5);

heading3("Completed");

const completed = [
  "Project scaffold with separate client/ and server/ directories",
  "All 5 Mongoose models with proper schemas, indexes, and relations",
  "Seed script for 8 default categories",
  "Complete JWT authentication system (register, login, refresh, logout)",
  "Auth middleware for protected routes",
  "Zod validation schemas for all inputs",
  "Global error handling middleware",
  "All 8 Express route files with full CRUD operations",
  "All 8 controllers (auth, items, categories, family, analytics, upload, notifications, emergency)",
  "Cron job scheduler for daily email reminders",
  "Email templates with HTML formatting and urgency colors",
  "Cloudinary integration for file uploads",
  "Next.js 16 client with 13 pages (all compiling)",
  "Landing page with hero section and feature grid",
  "Login and Register pages with form validation",
  "Dashboard with stat cards and urgency-sorted items",
  "Items list page with search, filter, sort",
  "Item creation form with all fields",
  "Item detail page with edit and delete",
  "Family members page with add/edit/delete dialog",
  "Analytics page with category bars and monthly chart",
  "OCR scan page with Tesseract.js and date extraction",
  "Settings page with emergency card generation",
  "Public emergency card page",
  "Sidebar navigation + mobile hamburger menu",
  "Topbar with user avatar dropdown",
  "Axios interceptors with automatic token refresh",
  "Auth context with login/register/logout functions",
  "SWR hooks for all data fetching",
  "TypeScript types for all entities",
  "Urgency badge component with color-coded status",
];

completed.forEach((item) => {
  checkPage(16);
  bullet(item);
});

doc.moveDown(0.5);
heading3("Remaining (Phase 5 Polish)");
bullet("Dark mode implementation (next-themes)");
bullet("Recharts integration for full chart rendering");
bullet("QR code generation (qrcode.react) on settings page");
bullet("Production deployment to Vercel + Render + MongoDB Atlas");

// ============================================================
// FINAL PAGE
// ============================================================
doc.addPage();
doc.moveDown(6);
doc
  .fontSize(24)
  .fillColor(PRIMARY)
  .font("Helvetica-Bold")
  .text("ExpiryGuard", { align: "center" });
doc.moveDown(0.5);
doc
  .fontSize(14)
  .fillColor(GRAY)
  .font("Helvetica")
  .text("Track What Matters. Never Miss a Deadline.", { align: "center" });
doc.moveDown(2);
doc
  .moveTo(150, doc.y)
  .lineTo(445, doc.y)
  .strokeColor(PRIMARY)
  .lineWidth(2)
  .stroke();
doc.moveDown(1.5);
doc
  .fontSize(11)
  .fillColor(DARK)
  .font("Helvetica")
  .text("Full-Stack Web Application", { align: "center" });
doc.text("Next.js  +  Express.js  +  MongoDB", { align: "center" });
doc.moveDown(1);
doc.text("Built for portfolio demonstration", { align: "center" });
doc.moveDown(3);
doc
  .fontSize(9)
  .fillColor(GRAY)
  .text("--- End of Document ---", { align: "center" });

// Finalize
doc.end();

output.on("finish", () => {
  console.log("PDF generated: ExpiryGuard-Project-Plan.pdf");
});
