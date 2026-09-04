# FoodShare LK 🇱🇰
### Surplus Food Donation & Redistribution Platform for Sri Lanka
**Built for SE3090 Assignment 2 — Mini Hackathon (MERN Stack + Google Gemini AI)**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-forestgreen.svg)](https://www.mongodb.com/atlas)
[![AI Assistant](https://img.shields.io/badge/Google%20Gemini-Flash-orange.svg)](https://ai.google.dev/)

---

## 1. Overview & Problem Statement

### The Food Waste Paradox in Sri Lanka
In Sri Lanka, hospitality, bakeries, and food service establishments account for roughly **25% of total food waste**, with thousands of kilograms of wholesome, freshly prepared food discarded at end-of-day closing hours. Concurrently, vulnerable communities, orphanages, elders' homes, low-income families, and animal welfare shelters face acute daily shortages of edible food and animal feed.

### Root Causes
- **Lack of Rapid Channels:** Food businesses have no instant, zero-friction medium to notify local recipients when surplus food remains unsold at closing time.
- **Coordination Asymmetry:** Community organizations, charity workers, and shelter volunteers cannot track real-time food availability, quantities, or pickup locations.
- **Time Criticality:** Prepared food is perishable; manual phone calls and ad-hoc word-of-mouth coordination fail to beat the end-of-day expiration window.

### The FoodShare LK Solution
**FoodShare LK** digitizes and streamlines surplus food rescue:
1. **Donors (Hotels, Bakeries, Restaurants, Households)** can list surplus items in under 60 seconds with pickup time limits, quantities, and intended beneficiaries (human vs. animal).
2. **Recipients (Individuals, NGOs, Elders' Homes, Animal Shelters)** discover available food instantly through localized search and multi-parameter filters.
3. **Conflict-Free One-Click Claiming** locks the listing in real-time, preventing wasted trips and connecting claimant and donor directly.
4. **Grounded AI Donation Assistant (Google Gemini)** analyzes live, real-time database snapshots to advise donors on which categories and areas have the most critical shortage of donations.

---

## 2. Key Features

| Feature | Description | Target Role |
|---|---|---|
| **Frictionless Role Switching** | Instant toggle between **Donor**, **Recipient**, and **Guest** modes stored in reactive state context — no tedious account creation or login walls during crisis redistribution. | All |
| **Rapid Donation Publishing** | Form with 10 strict validation rules (PRD §12), automated Sri Lankan phone number validation (`+94` or `0` prefix), and pickup window verification. | Donor |
| **My Listings Dashboard** | Live listing control room allowing donors to monitor their active posts, modify pickup details, cancel listings, or manually flag donations as claimed. | Donor |
| **Multi-Filter Discovery Feed** | Responsive card grid with instant client/server filtering across **Food Item / Type**, **Location / Town**, and **Beneficiary Target** (`people`, `animals`, `both`). | Recipient |
| **Atomic Claiming Engine** | Real-time state transition (`available` → `claimed`) with concurrency guard (HTTP 409 Conflict if claimed simultaneously), capturing claimant organization details and unlocking direct contact numbers. | Recipient |
| **Grounded AI Donation Assistant** | Embedded floating assistant powered by **Google Gemini** (`gemini-3.6-flash`), dynamically injected with live MongoDB need-aggregations to provide real-time, data-backed guidance on where donations are needed most. | Donor / Guest |
| **Live Impact Analytics** | Dedicated platform stats endpoint (`/api/v1/stats`) serving aggregated counts for total donations, claimed food packages, and active opportunities. | Public / Guest |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│          React 19 + TypeScript + Vite + Modern CSS3         │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Node.js / Express 5 API Server              │
│       Routes, Validation Middlewares, Error Handlers        │
└──────────────┬──────────────────────────────┬───────────────┘
               │ Mongoose ODM                 │ Google GenAI REST
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      MongoDB Atlas (Cloud)   │ │   Google Gemini AI API     │
│   `listings` collection &    │ │  Grounded Advice Engine    │
│    Compound Text Indexes     │ │  (gemini-3.6-flash)        │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 4. Technology Stack

### Frontend
- **Framework:** React 19 (`react`, `react-dom`) with TypeScript 6
- **Routing:** React Router v7 (`react-router-dom`)
- **HTTP Client:** Axios
- **Build Tooling:** Vite 8 with `@vitejs/plugin-react` & `@rolldown/plugin-babel`
- **Styling:** CSS3 Variables, Responsive Flexbox & Grid, Mobile-First layout

### Backend
- **Runtime:** Node.js v18+ (CommonJS)
- **Web Framework:** Express 5 (`express@^5.2.1`)
- **Database ODM:** Mongoose 9 (`mongoose@^9.9.4`)
- **Cross-Origin & Config:** `cors`, `dotenv`
- **Generative AI:** Google Gemini API (`gemini-3.6-flash`)

### Database
- **Host:** MongoDB Atlas
- **Key Models:** `Listing` (with compound text indexes on `foodItem` and `location`, ascending index on `status` and `createdAt`)

---

## 5. API Specification

Base URL: `/api/v1` (with fallback support on `/api`)

### Endpoints Overview

| Method | Route | Description | Request Body / Parameters | Success Code |
|---|---|---|---|---|
| `GET` | `/health` | Server health check | None | `200 OK` |
| `GET` | `/listings` | Query all listings with optional filters | Query: `?foodType=...&location=...&forWhom=...&status=...` | `200 OK` |
| `GET` | `/listings/:id` | Get single listing by ID | URL param: `id` | `200 OK` |
| `POST` | `/listings` | Create a new surplus food listing | JSON body (see schema below) | `201 Created` |
| `PATCH` | `/listings/:id` | Partially update listing details | JSON body with updated fields | `200 OK` |
| `PATCH` | `/listings/:id/claim` | Claim an available food listing | `{ "claimedBy": "Community Volunteer Name/Org" }` | `200 OK` |
| `DELETE` | `/listings/:id` | Permanently cancel / delete listing | URL param: `id` | `200 OK` |
| `GET` | `/stats` | Aggregate donation and claiming counts | None | `200 OK` |
| `POST` | `/assistant` | Chat with Gemini AI grounded on live data | `{ "messages": [{ "role": "user", "text": "..." }] }` | `200 OK` |

### Sample Payload: `POST /api/v1/listings`
```json
{
  "donorName": "Perera Bakery",
  "donorType": "bakery",
  "foodItem": "Fresh Bread Loaves",
  "quantity": 25,
  "quantityUnit": "loaves",
  "forWhom": "both",
  "location": "Ratnapura Town",
  "pickupWindowStart": "2026-09-04T18:30:00.000Z",
  "pickupWindowEnd": "2026-09-04T21:30:00.000Z",
  "contactNumber": "0771234567",
  "notes": "Freshly baked today, packed in clean boxes."
}
```

### Standard Error Format
```json
{
  "success": false,
  "errors": [
    { "field": "quantity", "message": "Quantity must be a positive number." },
    { "field": "contactNumber", "message": "Enter a valid Sri Lankan phone number, e.g. 0771234567." }
  ]
}
```

---

## 6. Project Structure

```
Mini HackerThon/
├── README.md                     # Root project documentation
├── LICENSE                       # Apache License 2.0
├── docs/                         # Specification & Engineering Artifacts
│   ├── PRD.md                    # Product Requirements Document
│   ├── plan.md                   # 4-member task allocation & hackathon schedule
│   ├── FOODSHARE_DFD.md          # Data Flow Diagrams (Context, L1, L2 + Dictionary)
│   └── FOODSHARE_SRS.md          # IEEE 830 Software Requirements Specification
├── backend/                      # Node.js + Express + Mongoose Backend
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend scripts and dependencies
│   ├── server.js                 # HTTP server bootstrap & DNS configuration
│   ├── src/
│   │   ├── app.js                # Express application configuration & middleware pipeline
│   │   ├── config/db.js          # MongoDB Atlas connection handler
│   │   ├── controllers/          # Request handlers (listings, health, assistant)
│   │   ├── middlewares/          # Validation & centralized error handlers
│   │   ├── models/Listing.js     # Mongoose listing schema & text indexes
│   │   ├── routes/               # Modular Express routing definitions
│   │   └── seed/seedListings.js  # 12 pre-built realistic Sri Lankan listings
│   └── test/core-api.test.js     # Automated core API unit/integration tests
└── frontend/                     # React 19 + TypeScript + Vite Client
    ├── package.json              # Client scripts and dependencies
    ├── vite.config.ts            # Vite configuration & proxy settings
    ├── index.html                # Single Page Application HTML root
    └── src/
        ├── App.tsx               # Root component & Route declarations
        ├── main.tsx              # React DOM mounting
        ├── api/                  # Axios service integrations (listingsApi, assistantApi)
        ├── components/           # Reusable UI components (Navbar, FilterBar, ListingCard, RoleSwitcher, DonationAssistant)
        ├── context/RoleContext.tsx # Lightweight session role state management
        ├── pages/                # Views (Home, DonateForm, MyListings, BrowseListings, ListingDetail, ClaimConfirmation, About, NotFound)
        ├── styles/               # CSS stylesheets & theme variables
        └── types/                # TypeScript interfaces & enums
```

---

## 7. Getting Started & Local Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher (`node -v`)
- **npm:** v9.0.0 or higher (`npm -v`)
- **MongoDB Atlas Cluster:** Free M0 cluster connection URI
- **Google Gemini API Key:** (Optional for AI assistant) Obtain from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone Repository
```bash
git clone https://github.com/pasan-wijekoon/SEF-Mini-Hackerthon.git
cd SEF-Mini-Hackerthon
```

---

### Step 2: Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment file:
   ```bash
   copy .env.example .env
   ```
4. Configure `.env` values:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/foodshare?retryWrites=true&w=majority
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.6-flash
   ```
5. Seed initial realistic dataset (12 Sri Lankan food listings):
   ```bash
   npm run seed
   ```
6. Start backend development server:
   ```bash
   npm run dev
   ```
   *The backend will boot on `http://localhost:5000`.*

---

### Step 3: Frontend Setup
1. Open a new terminal and navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`.*

---

### Step 4: Running Verification Tests
Execute automated backend tests verifying seed data integrity, middleware validation, and error shape contracts:
```bash
cd backend
npm test
```
Execute frontend TypeScript check and production build:
```bash
cd frontend
npm run build
```

---

## 8. Preloaded Sample Data

The seed dataset (`backend/src/seed/seedListings.js`) populates 12 realistic Sri Lankan surplus listings to demonstrate varied locations, food types, and beneficiary groups:

| Donor Name | Donor Type | Food Item | Quantity | Beneficiary | Location |
|---|---|---|---|---|---|
| **Perera Bakery** | Bakery | Fresh Bread Loaves | 20 loaves | Both | Ratnapura Town |
| **Green Leaf Hotel** | Hotel | Rice & Curry Packets | 15 packets | People | Colombo 6 |
| **Sunrise Restaurant** | Restaurant | Cooked Veg Trimmings & Rice | 8 kg | Animals | Kandy |
| **Mount Bakers** | Bakery | Cakes & Pastries | 30 items | People | Nugegoda |
| **Ocean View Hotel** | Hotel | Buffet Surplus (Curries & Hoppers) | 12 kg | Both | Galle Fort |
| **Heritage Cafe** | Restaurant | String Hoppers with Sodi | 50 items | People | Kurunegala |
| **City Central Bakery** | Bakery | Buns and Savoury Rolls | 25 items | People | Negombo |
| **Golden Spoon Caterers** | Other | Fried Rice & Devilled Chicken | 18 plates | People | Maharagama |
| **Paws & Tails Care Community**| Household | Meat Broth & Rice Mix | 10 kg | Animals | Dehiwala |
| **Southern Palms Resort** | Hotel | Assorted Breads & Fruits | 15 kg | Both | Bentota |
| **Lakeside Dining** | Restaurant | Boiled Lentils, Rice & Bread | 14 kg | Animals | Nuwara Eliya |
| **Suburban Kitchen** | Household | Vegetable Rice Packets | 8 packets | People | Malabe |

---

## 9. Team & Hackathon Contribution Split

In adherence to the SE3090 Mini Hackathon guidelines, responsibilities were evenly distributed across frontend and backend tracks:

| Team Member | Student ID | Track & Role | Modules Owned & Contributions |
|---|---|---|---|
| **Member 1** | IT24102690 | **Frontend — Donor Track** | `Home.tsx`, `DonateForm.tsx` (all 10 validation rules), `MyListings.tsx`, `Navbar.tsx`, `RoleSwitcher.tsx`, `RoleContext.tsx`. |
| **Member 2** | Yashodha | **Frontend — Recipient Track** | `BrowseListings.tsx` (search & multi-filter), `ListingDetail.tsx`, `ClaimConfirmation.tsx`, `About.tsx`, `NotFound.tsx`, `ListingCard.tsx`, `FilterBar.tsx`. |
| **Member 3** | Pasan Wijekoon | **Backend — Core API & Data** | MongoDB Atlas schema (`Listing.js`), compound text indexing, `POST /listings`, `GET /listings`, `GET /listings/:id`, `validateListing.js` middleware, `seedListings.js`, `core-api.test.js`. |
| **Member 4** | Ransidu Subasinghe | **Backend — Actions & AI Ops** | `PATCH /listings/:id`, `PATCH /listings/:id/claim`, `DELETE /listings/:id`, `/stats` endpoint, `errorHandler.js`, Google Gemini AI integration (`assistantController.js`, `DonationAssistant.tsx`), deployment configs. |

---

## 10. AI Tools Disclosure & Prompt Log

In compliance with hackathon assessment requirements, AI tools were leveraged to accelerate boilerplate creation, formulate realistic test data, and refine schema validation:

1. **Google Gemini Flash (`gemini-3.6-flash`):** Powering the in-app Donation Assistant to analyze real-time database demand snapshots and advise donors.
2. **Claude / Antigravity CLI:** Assisting with architecture design, DFD/SRS technical documentation generation, and error schema standardization.

### Sample AI Prompts Used During Development:
- *"Draft a Mongoose schema for a Sri Lankan surplus food platform with enum constraints for donor types, food units, and beneficiary targets (people vs animals)."*
- *"Implement an Express validation middleware that tests for valid Sri Lankan telephone numbers starting with +94 or 0 and rejects pickup window end dates that precede start dates."*
- *"Construct an AI prompt injection function that queries MongoDB for unclaimed food counts by location and category to ground Gemini recommendations in real inventory data."*

---

## 11. License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.
