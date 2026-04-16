# ExpiryGuard

**ExpiryGuard** is a full-stack web application that helps users track expiration dates of documents, subscriptions, warranties, and more — with automated reminders, family sharing, OCR scanning, and emergency access.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Client Pages](#client-pages)
- [Environment Variables](#environment-variables)

---

## Features

### 1. User Authentication
- Secure registration and login with hashed passwords (bcrypt, 12 salt rounds)
- JWT-based authentication with access tokens (15 min) and refresh tokens (7 days)
- Refresh tokens stored in HTTP-only secure cookies
- Auto-refresh mechanism for seamless sessions
- Protected routes with middleware

### 2. Item / Document Tracking
- Add items with name, description, expiry date, purchase date, cost, and notes
- Upload supporting documents (stored on Cloudinary)
- Item statuses: **Active**, **Expired**, **Renewed**, **Archived**
- Assign items to categories and family members
- Mark items as emergency-critical

### 3. Smart Reminders & Notifications
- Configurable reminder schedule per item (default: 30, 7, and 1 day before expiry)
- Automated cron jobs check for upcoming expirations daily
- Email notifications sent via SMTP (Nodemailer + Gmail)
- In-app notification center with pagination

### 4. Category Management
- Default system categories available to all users
- Create, update, and delete custom categories
- Each category has a name, icon, and color
- Items grouped and filterable by category

### 5. Family Member Management
- Auto-created "Self" member on registration
- Add family members with relation type: Self, Spouse, Child, Parent, Other
- Optional email per family member
- Assign items to specific family members
- Delete protection for the "Self" member

### 6. OCR Document Scanning
- Client-side OCR powered by Tesseract.js
- Upload or capture an image of a document
- Automatically extracts text and detects dates using regex patterns
- Select an extracted date to auto-fill the expiry date field
- Progress bar during OCR processing

### 7. Analytics Dashboard
- Overview stats: Total Items, Expiring Soon, Expired, Active
- Items grouped by category (with color-coded bars)
- Upcoming expirations by month (next 12 months)
- Items grouped by family member
- Items expiring within the next 30 days

### 8. Emergency Card
- Generate a unique shareable link containing critical document information
- Public access via token — no login required for viewers
- Useful for medical emergencies, travel, or sharing with trusted contacts
- Copy-to-clipboard functionality

### 9. Advanced Search & Filtering
- Full-text search across item names
- Filter by category, status, and family member
- Sort by expiry date, creation date, or name
- Paginated results
- Debounced search input (300ms)

### 10. Document Upload
- Cloudinary integration for secure document storage
- Server-signed uploads for security
- Automatic cleanup of Cloudinary assets on item deletion

### 11. Responsive UI
- Mobile-first responsive design
- Bottom navigation bar for mobile
- Sidebar navigation for desktop
- Dark/light theme support (next-themes)
- Toast notifications (Sonner)

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.2 | React framework with App Router, SSR, route groups |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **shadcn/ui** | 4.2.0 | Pre-built accessible UI components |
| **SWR** | 2.4.1 | Data fetching with caching and revalidation |
| **React Hook Form** | 7.72.1 | Form state management and validation |
| **Zod** | 4.3.6 | Schema-based form validation |
| **@hookform/resolvers** | 5.2.2 | Zod integration with React Hook Form |
| **Axios** | 1.14.0 | HTTP client for API requests |
| **Tesseract.js** | 7.0.0 | Client-side OCR engine |
| **Lucide React** | 1.7.0 | Icon library |
| **date-fns** | 4.1.0 | Date utility functions |
| **react-day-picker** | 9.14.0 | Calendar/date picker component |
| **next-themes** | 0.4.6 | Dark/light theme switching |
| **Sonner** | 2.0.7 | Toast notification library |
| **class-variance-authority** | 0.7.1 | Component variant management |
| **tailwind-merge** | 3.5.0 | Tailwind class conflict resolution |
| **tw-animate-css** | 1.4.0 | Tailwind animation utilities |
| **@tailwindcss/postcss** | 4.x | PostCSS plugin for Tailwind |
| **ESLint** | 9.x | Code linting |
| **eslint-config-next** | 16.2.2 | Next.js ESLint rules |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | — | JavaScript runtime |
| **Express** | 5.2.1 | Web framework |
| **Mongoose** | 9.4.1 | MongoDB ODM |
| **jsonwebtoken** | 9.0.3 | JWT creation and verification |
| **bcryptjs** | 3.0.3 | Password hashing |
| **Cloudinary** | 2.9.0 | Cloud image/document storage |
| **Nodemailer** | 8.0.5 | Email sending (SMTP) |
| **node-cron** | 4.2.1 | Scheduled tasks for expiry checks |
| **Zod** | 4.3.6 | Request body validation |
| **cookie-parser** | 1.4.7 | Parse cookies from requests |
| **cors** | 2.8.6 | Cross-Origin Resource Sharing |
| **dotenv** | 17.4.1 | Environment variable management |
| **nodemon** | 3.1.14 | Development auto-restart (dev dependency) |

### Database

| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |

### External Services

| Service | Purpose |
|---|---|
| **Cloudinary** | Document/image upload and storage |
| **Gmail SMTP** | Email delivery for notifications |

### Root Level

| Technology | Version | Purpose |
|---|---|---|
| **PDFKit** | 0.18.0 | PDF generation |

---

## Project Structure

```
expiryguard/
├── package.json                    # Root package (PDF generation)
├── generate-pdf.js                 # PDF generation script
├── ExpiryGuard-Project-Plan.pdf    # Project plan document
│
├── client/                         # Frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── globals.css         # Global styles
│   │   │   ├── (auth)/
│   │   │   │   ├── layout.tsx      # Auth layout
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx      # Dashboard layout (sidebar + topbar)
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── items/
│   │   │   │   │   ├── page.tsx          # All items (search/filter/sort)
│   │   │   │   │   ├── new/page.tsx      # Create new item
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx      # Item detail
│   │   │   │   │       └── edit/page.tsx # Edit item
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   ├── family/page.tsx
│   │   │   │   ├── scan/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   └── emergency/
│   │   │       └── [token]/page.tsx  # Public emergency card
│   │   ├── components/
│   │   │   ├── items/
│   │   │   │   ├── item-card.tsx
│   │   │   │   ├── item-filters.tsx
│   │   │   │   ├── item-form.tsx
│   │   │   │   └── urgency-badge.tsx
│   │   │   ├── layout/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── topbar.tsx
│   │   │   │   └── mobile-nav.tsx
│   │   │   └── ui/                 # shadcn/ui components
│   │   │       ├── avatar.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── card.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── popover.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sonner.tsx
│   │   │       └── tabs.tsx
│   │   ├── hooks/
│   │   │   ├── use-analytics.ts
│   │   │   ├── use-categories.ts
│   │   │   ├── use-family.ts
│   │   │   └── use-items.ts
│   │   ├── lib/
│   │   │   ├── api.ts              # Axios instance with interceptors
│   │   │   ├── auth-context.tsx    # Auth context provider
│   │   │   ├── utils.ts           # Utility functions (cn)
│   │   │   └── validations.ts     # Zod schemas for forms
│   │   └── types/
│   │       └── index.ts           # TypeScript interfaces
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   └── components.json            # shadcn/ui config
│
└── server/                         # Backend (Express)
    ├── src/
    │   ├── index.js                # Server entry point
    │   ├── seed.js                 # Database seeder
    │   ├── config/
    │   │   ├── db.js               # MongoDB connection
    │   │   ├── cloudinary.js       # Cloudinary config
    │   │   └── email.js            # SMTP transporter config
    │   ├── controllers/
    │   │   ├── auth.controller.js
    │   │   ├── item.controller.js
    │   │   ├── category.controller.js
    │   │   ├── family.controller.js
    │   │   ├── analytics.controller.js
    │   │   ├── upload.controller.js
    │   │   ├── notification.controller.js
    │   │   └── emergency.controller.js
    │   ├── middleware/
    │   │   ├── auth.middleware.js     # JWT verification
    │   │   ├── error.middleware.js    # Global error handler
    │   │   └── validate.middleware.js # Zod validation middleware
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Item.js
    │   │   ├── Category.js
    │   │   ├── FamilyMember.js
    │   │   └── Notification.js
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   ├── item.routes.js
    │   │   ├── category.routes.js
    │   │   ├── family.routes.js
    │   │   ├── analytics.routes.js
    │   │   ├── upload.routes.js
    │   │   ├── notification.routes.js
    │   │   └── emergency.routes.js
    │   ├── utils/
    │   │   ├── cronJobs.js           # Scheduled expiry checker
    │   │   ├── generateToken.js      # JWT helper
    │   │   └── sendEmail.js          # Email sender utility
    │   └── validations/
    │       ├── auth.validation.js
    │       ├── item.validation.js
    │       ├── category.validation.js
    │       └── family.validation.js
    └── package.json
```

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | Server health check |

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Validation | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | No | registerSchema | Register a new user (auto-creates "Self" family member) |
| `POST` | `/auth/login` | No | loginSchema | Login with email and password |
| `POST` | `/auth/refresh` | No (cookie) | — | Refresh access token using refresh token cookie |
| `POST` | `/auth/logout` | Yes | — | Logout and clear refresh token |
| `GET` | `/auth/me` | Yes | — | Get current user profile |

### Items (`/api/items`)

| Method | Endpoint | Auth | Validation | Description |
|---|---|---|---|---|
| `GET` | `/items` | Yes | — | Get all items (supports search, filter, sort, pagination) |
| `POST` | `/items` | Yes | itemSchema | Create a new item |
| `GET` | `/items/:id` | Yes | — | Get a single item by ID |
| `PATCH` | `/items/:id` | Yes | itemUpdateSchema | Update an item |
| `DELETE` | `/items/:id` | Yes | — | Delete an item (also removes Cloudinary asset) |

**Query Parameters for `GET /items`:**

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Search items by name |
| `category` | string | Filter by category ID |
| `status` | string | Filter by status (active, expired, renewed, archived) |
| `member` | string | Filter by family member ID |
| `sort` | string | Sort field (expiryDate, createdAt, name) |
| `page` | number | Page number for pagination |

### Categories (`/api/categories`)

| Method | Endpoint | Auth | Validation | Description |
|---|---|---|---|---|
| `GET` | `/categories` | Yes | — | Get all categories (user's custom + defaults) |
| `POST` | `/categories` | Yes | categorySchema | Create a custom category |
| `PATCH` | `/categories/:id` | Yes | categorySchema | Update a custom category |
| `DELETE` | `/categories/:id` | Yes | — | Delete a custom category (cannot delete defaults) |

### Family Members (`/api/family`)

| Method | Endpoint | Auth | Validation | Description |
|---|---|---|---|---|
| `GET` | `/family` | Yes | — | Get all family members |
| `POST` | `/family` | Yes | familyMemberSchema | Add a new family member |
| `PATCH` | `/family/:id` | Yes | familyMemberSchema | Update a family member |
| `DELETE` | `/family/:id` | Yes | — | Delete a family member (cannot delete "Self") |

### Analytics (`/api/analytics`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/analytics` | Yes | Get analytics data (status counts, items by category, expirations by month, items by member, expiring soon) |

### Upload (`/api/upload`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/upload/signature` | Yes | Generate a Cloudinary upload signature |

### Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/notifications` | Yes | Get paginated notifications with item details |

### Emergency Card (`/api/emergency-card`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/emergency-card/generate` | Yes | Generate an emergency card token |
| `GET` | `/emergency-card/:token` | No | Get emergency card data (public access) |

---

## Database Models

### User
| Field | Type | Details |
|---|---|---|
| `name` | String | Required, max 50 chars |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, min 6 chars, hidden from queries |
| `avatar` | String | Default empty |
| `emergencyToken` | String | Unique, sparse index |
| `refreshToken` | String | Hidden from queries |
| `timestamps` | — | createdAt, updatedAt |

### Item
| Field | Type | Details |
|---|---|---|
| `name` | String | Required, max 100 chars |
| `description` | String | Max 500 chars |
| `expiryDate` | Date | Required |
| `purchaseDate` | Date | Optional |
| `cost` | Number | Min 0 |
| `status` | String | Enum: active, expired, renewed, archived |
| `notes` | String | Max 2000 chars |
| `documentUrl` | String | Cloudinary URL |
| `documentPublicId` | String | Cloudinary public ID |
| `reminderDays` | [Number] | Default: [30, 7, 1] |
| `isEmergency` | Boolean | Default: false |
| `userId` | ObjectId → User | Required |
| `categoryId` | ObjectId → Category | Required |
| `familyMemberId` | ObjectId → FamilyMember | Optional |
| `timestamps` | — | createdAt, updatedAt |

**Indexes:** `(userId, expiryDate)`, `(userId, status)`

### Category
| Field | Type | Details |
|---|---|---|
| `name` | String | Required, max 50 chars |
| `icon` | String | Optional |
| `color` | String | Hex color code |
| `isDefault` | Boolean | Default: false |
| `userId` | ObjectId → User | Optional (null for defaults) |
| `timestamps` | — | createdAt, updatedAt |

### FamilyMember
| Field | Type | Details |
|---|---|---|
| `name` | String | Required, max 50 chars |
| `relation` | String | Enum: Self, Spouse, Child, Parent, Other |
| `email` | String | Optional, lowercase |
| `avatarUrl` | String | Optional |
| `userId` | ObjectId → User | Required, indexed |
| `timestamps` | — | createdAt, updatedAt |

### Notification
| Field | Type | Details |
|---|---|---|
| `userId` | ObjectId → User | Required |
| `itemId` | ObjectId → Item | Required |
| `type` | String | Notification type |
| `message` | String | Notification text |
| `isRead` | Boolean | Default: false |
| `timestamps` | — | createdAt, updatedAt |

---

## Client Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Hero section, feature showcase, login/register links |
| `/login` | Login | Email + password login form |
| `/register` | Register | Name + email + password registration form |
| `/dashboard` | Dashboard | Stats overview, expiring soon list, expired items |
| `/items` | All Items | Search, filter, sort, paginated item grid |
| `/items/new` | New Item | Create item form with category, family member, OCR |
| `/items/[id]` | Item Detail | View full item details and document |
| `/items/[id]/edit` | Edit Item | Edit existing item |
| `/analytics` | Analytics | Charts and stats (by category, month, member) |
| `/family` | Family | Manage family members (add, edit, delete) |
| `/scan` | OCR Scan | Upload document image, extract dates via Tesseract.js |
| `/settings` | Settings | Profile info, emergency card generation |
| `/emergency/[token]` | Emergency Card | Public page showing critical documents (no auth) |

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiry (e.g., 15m) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry (e.g., 7d) |
| `CLIENT_URL` | Frontend URL for CORS (e.g., http://localhost:3000) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | SMTP server host (e.g., smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (e.g., 587) |
| `SMTP_USER` | SMTP email address |
| `SMTP_PASS` | SMTP app password |
| `EMAIL_FROM` | Sender name and email |
