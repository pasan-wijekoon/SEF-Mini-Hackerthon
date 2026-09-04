# Software Requirements Specification (SRS) — FoodShare LK
### Surplus Food Donation & Redistribution Platform for Sri Lanka
**Standard:** IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018  
**Document Version:** 1.0 · **Date:** 4 September 2026 · **Status:** Approved Baseline  
**Academic Context:** SE3090 Assignment 2 — Mini Hackathon (MERN Stack + Google Gemini AI)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) specifies the complete functional, non-functional, interface, and behavioral requirements for **FoodShare LK**, a web-based surplus food matching and redistribution system tailored for Sri Lanka. It serves as the formal contractual agreement among developers, system architects, project evaluators, and end users.

### 1.2 Document Conventions
- **Requirement IDs:** `FR-x` denotes a Functional Requirement; `NFR-x` denotes a Non-Functional Requirement; `EIR-x` denotes an External Interface Requirement.
- **Priority Levels:**
  - **High:** Core MVP requirement necessary for demonstration and deployment.
  - **Medium:** Operational enhancements supporting workflow usability.
  - **Low:** Post-MVP or stretch enhancements.
- **Typographical Styles:** Code snippets, enum values, and field identifiers are styled in `monospace`.

### 1.3 Intended Audience & Reading Suggestions
- **Evaluators & Assessors:** Review Sections 2, 4, and 7 to assess specification completeness and functional mapping against hackathon evaluation rubrics.
- **Full-Stack Engineers:** Focus on Section 3 (Interface Specifications), Section 4 (Functional Requirements), and Section 6 (Data Model).
- **Quality Assurance & Testers:** Refer to Section 5 (Non-Functional Requirements) and Section 7 (Requirements Traceability Matrix).

### 1.4 Product Scope
FoodShare LK is engineered to address urban and suburban food waste in Sri Lanka. It targets hospitality providers, commercial bakeries, restaurants, and catering operations possessing wholesome surplus food at daily closing hours, directly connecting them with community charities, NGOs, eldercare shelters, low-income individuals, and animal welfare care groups.

### 1.5 References
1. FoodShare LK Product Requirements Document (`PRD.md`), Version 1.0, September 2026.
2. FoodShare LK Data Flow Diagrams (`FOODSHARE_DFD.md`), Version 1.0, September 2026.
3. IEEE Std 830-1998: *Recommended Practice for Software Requirements Specifications*.
4. SE3090 Mini Hackathon Assignment Brief, Faculty of Computing, SLIIT.

---

## 2. Overall Description

### 2.1 Product Perspective
FoodShare LK is a modern distributed cloud web application built on the MERN (MongoDB, Express, React, Node.js) technology stack, augmented with Google Gemini Generative AI. It functions as an autonomous, public-facing portal operating without commercial monetization or complex payment gateways.

```
┌─────────────────────────────────────────────────────────────┐
│                 Client-Side Application                     │
│    React 19 + TypeScript + Vite (Responsive Mobile/Web)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express 5 RESTful Backend                   │
│   Schema Validation, State Machine, Need Aggregations       │
└──────────────┬──────────────────────────────┬───────────────┘
               │ Mongoose ODM                 │ Google GenAI API
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      MongoDB Atlas Cloud     │ │   Google Gemini AI API     │
│   Listing Documents & Index  │ │     (gemini-3.6-flash)     │
└──────────────────────────────┘ └────────────────────────────┘
```

### 2.2 Product Functions Overview
- **Zero-Friction Role Context:** Instantly toggle between **Donor**, **Recipient**, and **Guest** modes without mandatory email/password account creation during urgent food redistribution.
- **Donation Publishing:** Capture food type, quantity, unit, target beneficiary (`people`, `animals`, `both`), pickup window, location, and verified phone number.
- **Dynamic Listing Management:** Donor portal to monitor active listings, modify details, cancel posts, or manually mark items as claimed.
- **Multi-Parameter Discovery Feed:** Searchable listing catalogue filterable by location/town, food category, and beneficiary type.
- **Conflict-Free Atomic Claiming:** Claim reservation system that locks records, transitions state to `claimed`, and discloses donor contact details.
- **Grounded AI Donation Assistant:** Intelligent chatbot backed by real-time MongoDB database aggregations advising donors on high-need items and underserved regions.
- **Live Impact Metrics:** Aggregated reporting of active vs. rescued food listings.

### 2.3 User Classes and Characteristics

| User Persona | Technical Literacy | Key Motivation | Typical Activities |
|---|---|---|---|
| **Commercial Donor** (Bakeries, Hotels, Restaurants) | Low to Medium (Mobile browser user) | Rapidly offload surplus food before spoilage; avoid landfill waste. | Fill donation form in <60 seconds; check claim status; manage active listings. |
| **Community Recipient** (NGOs, Eldercare Homes, Citizens) | Low to Medium | Source free, wholesome meals for vulnerable groups. | Search listings by town; inspect details; claim items; coordinate pickup. |
| **Animal Shelter Volunteer** | Medium | Secure bulk food scraps/rice for dog/cat rescues. | Filter by `forWhom: 'animals'`; claim bulk trimmings; call donor. |
| **Guest / Public Observer** | Any | Understand platform mission, explore stats, choose role. | Read problem statement, view impact metrics, select role to proceed. |

### 2.4 Operating Environment
- **Client Runtime:** Modern web browsers (Google Chrome 110+, Mozilla Firefox 110+, Apple Safari 16+, Microsoft Edge 110+) on mobile, tablet, and desktop viewports.
- **Server Runtime:** Node.js v18.0.0 or higher on Linux/Windows execution environments.
- **Database Engine:** MongoDB Atlas Cloud Database Engine (v6.0+ compatible).
- **External AI Integration:** Google Gemini API (`gemini-3.6-flash`).

### 2.5 Design and Implementation Constraints
1. **Time Constraint:** Built and deployed within the 4-hour SE3090 hackathon window.
2. **Authentication Simplicity:** No session cookies, OAuth, or JWT tokens in v1; role management is handled via reactive in-memory / localStorage state context.
3. **Geographic Localization:** Restriced to Sri Lankan phone number validation (`/^(?:\+94|0)[0-9]{9}$/`) and local towns/districts.
4. **Zero Financial Transactions:** No monetary checkout, tipping, or payment gateways.

### 2.6 Assumptions and Dependencies
- Donors accurately describe food safety and packaging conditions.
- Recipients possess adequate transport to collect food within the designated pickup window.
- MongoDB Atlas cluster connectivity is maintained with low latency.
- Google Gemini API key has adequate quota for conversational requests.

---

## 3. External Interface Requirements

### 3.1 User Interfaces
The system provides eight distinct, responsive views:
1. **Landing / Home Page (`/`):** Hero section, Sri Lankan food waste statistics, mission statement, role selection CTAs ("Donate Food" vs. "Find Food"), and aggregate metrics.
2. **Donate Food Form (`/donate`):** 10-field input form with real-time client validation and inline error messaging.
3. **My Listings Dashboard (`/my-listings`):** Table/card feed of donor-posted listings with options to edit, cancel, or flag as claimed.
4. **Browse Listings Feed (`/browse`):** Responsive grid of cards displaying available donations with a search bar and multi-select filter bar.
5. **Listing Detail View (`/listings/:id`):** Deep-dive screen detailing food quantities, handling notes, exact pickup time window, and a prominent "Claim This Food" CTA.
6. **Claim Confirmation Screen (`/listings/:id/confirmed`):** Post-claim receipt disclosing the donor's contact telephone and collection instructions.
7. **About & Problem Page (`/about`):** Detailed background on Sri Lanka's food insecurity and commercial waste challenges.
8. **Not Found Page (`*`):** 404 fallback page providing safe routing back to the home view.

### 3.2 Hardware Interfaces
- No direct physical hardware interfaces required. The platform standardizes on responsive web viewports (360px mobile to 1920px 4K desktop).

### 3.3 Software Interfaces
- **Express 5 API:** Exposes RESTful endpoints communicating via JSON over HTTPS.
- **Mongoose 9 ODM:** Object Document Mapper interfacing with MongoDB Atlas collections.
- **Google GenAI API:** External REST endpoint communicating with `gemini-3.6-flash` for conversational recommendations.

### 3.4 Communications Interfaces
- **Protocol:** HTTP/1.1 and HTTPS.
- **Payload Format:** `application/json; charset=UTF-8`.
- **CORS:** Configured to permit cross-origin requests from the frontend client domain.

---

## 4. System Features & Functional Requirements

### 4.1 Feature 1: Surplus Food Listing Registration (FR-1)

#### Description
Allows authenticated or role-selected Donors to publish surplus food items to the public catalog.

#### Inputs
`donorName`, `donorType`, `foodItem`, `quantity`, `quantityUnit`, `forWhom`, `location`, `pickupWindowStart`, `pickupWindowEnd`, `contactNumber`, `notes`.

#### Validation Rules (PRD §12)
- `donorName`: String, required, minimum length 2 characters.
- `donorType`: String, required, must match `['hotel', 'bakery', 'restaurant', 'household', 'other']`.
- `foodItem`: String, required, minimum length 2 characters.
- `quantity`: Number, required, strictly greater than 0.
- `quantityUnit`: String, required, must match `['kg', 'packets', 'plates', 'loaves', 'items']`.
- `forWhom`: String, required, must match `['people', 'animals', 'both']`.
- `location`: String, required, minimum length 2 characters.
- `pickupWindowStart`: ISO Date string, required, must be present or future timestamp at submission.
- `pickupWindowEnd`: ISO Date string, required, must be chronologically after `pickupWindowStart`.
- `contactNumber`: String, required, must match Sri Lankan phone regex `/^(?:\+94|0)[0-9]{9}$/`.

#### System Responses
- **Success:** HTTP `201 Created` with `{ success: true, data: { ...Listing } }`.
- **Validation Failure:** HTTP `400 Bad Request` with `{ success: false, errors: [ { field, message } ] }`.

---

### 4.2 Feature 2: Donor Listing Management (FR-2)

#### Description
Enables donors to inspect their previously submitted listings, update details, mark donations as claimed manually, or cancel/delete them.

#### Functional Details
- **Fetch Listings:** `GET /api/v1/listings?donor=...` filters listings matching the donor's identifier.
- **Update Listing:** `PATCH /api/v1/listings/:id` accepts partial field updates and validates input types.
- **Delete Listing:** `DELETE /api/v1/listings/:id` permanently removes the record from MongoDB.

---

### 4.3 Feature 3: Multi-Filter Search & Browse (FR-3)

#### Description
Allows Recipients and Guests to explore available surplus listings via structured search and filters.

#### Query Parameters (`GET /api/v1/listings`)
- `foodType`: Case-insensitive substring match against `foodItem`.
- `location`: Case-insensitive substring match against `location`.
- `forWhom`: Exact match filter against `people`, `animals`, or `both`.
- `status`: Defaults to `available` on public browse screens; allows querying `claimed` or `all`.

#### System Responses
- Returns HTTP `200 OK` with `{ success: true, count: number, data: Listing[] }` sorted by `createdAt` descending.

---

### 4.4 Feature 4: Atomic Claiming Workflow (FR-4)

#### Description
Facilitates the locking and reservation of an available food listing by a recipient.

#### Preconditions
Target listing document must have `status: 'available'`.

#### Processing Logic
1. Recipient submits `PATCH /api/v1/listings/:id/claim` with `{ claimedBy: "..." }`.
2. Backend queries listing by `_id`.
3. If listing status is not `available`, the request is rejected with HTTP `409 Conflict` (or `400 Bad Request`) preventing double claims.
4. If available, the backend updates `status` to `claimed`, sets `claimedBy`, and assigns `claimedAt = new Date()`.
5. Response reveals donor contact number for pickup coordination.

---

### 4.5 Feature 5: Role & Session Context Management (FR-5)

#### Description
Provides a reactive React Context (`RoleContext`) and UI switcher allowing instant toggling of user roles.

#### State Definitions
- `role`: `'donor'` | `'recipient'` | `'guest'`.
- Switching roles immediately tailors navbar links, call-to-actions, and available buttons without losing current browse position.

---

### 4.6 Feature 6: Aggregate Platform Analytics (FR-6)

#### Description
Computes and serves live aggregate platform metrics for landing page statistics.

#### Processing Logic (`GET /api/v1/stats`)
- Queries MongoDB `listings` collection using aggregation pipelines.
- Computes `totalListings`, `availableListings`, and `claimedListings`.
- Returns HTTP `200 OK` with JSON payload `{ success: true, stats: { ... } }`.

---

### 4.7 Feature 7: Grounded AI Donation Assistant (FR-7)

#### Description
Provides an interactive chat assistant embedded in the application powered by Google Gemini (`gemini-3.6-flash`).

#### Processing Logic (`POST /api/v1/assistant`)
1. Ingests user conversation history `{ messages: [...] }`.
2. Gathers a real-time need snapshot from MongoDB Atlas:
   - Total available unclaimed listings.
   - Breakdown of listings by `forWhom` (`people`, `animals`, `both`).
   - Top locations with available surplus.
3. Compiles a grounded system prompt injecting this inventory data.
4. Invokes Google Gemini API with system instructions and user history.
5. Returns actionable, concise suggestions guiding the donor to where their surplus creates the greatest impact.

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements (NFR-1)
- **API Response Latency:** Sub-second response times (<300ms) for standard listing queries.
- **Search Optimization:** Compound text indexes on `foodItem` and `location` ensuring sub-50ms text filtering.
- **Client Load Time:** Initial Vite application bundle parsed and rendered under 1.5 seconds on 4G connections.

### 5.2 Food Safety & Perishability (NFR-2)
- **Pickup Window Enforcement:** Listings reject pickup end times in the past.
- **Beneficiary Segregation:** Clear UI tags distinguishing food safe for human consumption from food suited for animal feed.

### 5.3 Security Requirements (NFR-3)
- **Input Validation & Sanitization:** Server-side validation middleware strips unwhitelisted fields and enforces regex constraints.
- **No Direct Credential Storage:** System avoids storing passwords or payment credentials.
- **Environment Isolation:** Database credentials and Gemini API keys isolated in backend `.env` variables, never exposed to client bundles.

### 5.4 Software Quality Attributes (NFR-4)
- **Usability:** Form submission achievable in under 1 minute; intuitive color-coded status badges (`available` in green, `claimed` in amber).
- **Reliability:** Graceful error handling for missing network connections, database dropouts, or AI API quota limits.
- **Maintainability:** Modular architecture adhering to separation of concerns (Controllers, Models, Routes, Middlewares).
- **Portability:** Cross-platform web application functioning across desktop and mobile devices.

---

## 6. Data Requirements & Model Specification

### 6.1 `Listing` Schema Definition
The core data entity is defined using Mongoose ODM:

```javascript
const listingSchema = new mongoose.Schema({
  donorName:          { type: String, required: true, trim: true },
  donorType:          { type: String, enum: ['hotel','bakery','restaurant','household','other'], required: true },
  foodItem:           { type: String, required: true, trim: true },
  quantity:           { type: Number, required: true, min: 1 },
  quantityUnit:       { type: String, enum: ['kg','packets','plates','loaves','items'], required: true },
  forWhom:            { type: String, enum: ['people','animals','both'], required: true },
  location:           { type: String, required: true, trim: true },
  pickupWindowStart:  { type: Date, required: true },
  pickupWindowEnd:    { type: Date, required: true },
  contactNumber:      { type: String, required: true, match: /^(?:\+94|0)[0-9]{9}$/ },
  notes:              { type: String, trim: true, default: '' },
  status:             { type: String, enum: ['available','claimed','expired','cancelled'], default: 'available' },
  claimedBy:          { type: String, trim: true },
  claimedAt:          { type: Date }
}, { timestamps: true });

listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ forWhom: 1 });
listingSchema.index({ foodItem: 'text', location: 'text' });
```

---

## 7. Requirements Traceability Matrix (RTM)

| Requirement ID | Requirement Description | PRD Reference | Implementation Components | Verification / Test Case |
|---|---|---|---|---|
| **FR-1** | Surplus Food Listing Registration | PRD §6.1, §10, §12 | `DonateForm.tsx`, `validateListing.js`, `listingController.js` | `core-api.test.js` [Test 2 & 3] |
| **FR-2** | Donor Listing Lifecycle Management | PRD §6.1, §11 | `MyListings.tsx`, `listings.routes.js`, `listings.controller.js` | Manual UI Test & Unit Route Test |
| **FR-3** | Multi-Parameter Search & Browse | PRD §6.2, §11 | `BrowseListings.tsx`, `FilterBar.tsx`, `listingController.js` | Live Query Filter Tests |
| **FR-4** | Atomic Claiming & Contact Unlock | PRD §6.2, §11 | `ListingDetail.tsx`, `ClaimConfirmation.tsx`, `listings.controller.js` | Claim Collision & State Mutation Test |
| **FR-5** | Dynamic Role Switching | PRD §5 | `RoleContext.tsx`, `RoleSwitcher.tsx`, `Navbar.tsx` | UI State Toggle Test |
| **FR-6** | Platform Impact Analytics | PRD §8, §11 | `Home.tsx`, `listings.controller.js` (`getStats`) | Endpoint Integration Test |
| **FR-7** | Grounded AI Donation Assistant | PRD §14 | `assistantController.js`, `DonationAssistant.tsx` | Gemini API Call & Grounding Test |
| **NFR-1** | High Performance & Indexed Search | PRD §13 | MongoDB Compound Text Indexes, Vite Bundler | Lighthouse Audit & Query Profiling |
| **NFR-2** | Food Safety & Expiration Guard | PRD §12 | `validateListing.js`, `ListingDetail.tsx` | Date Range Middleware Test |
| **NFR-3** | Security & Secret Protection | PRD §11, §12 | `errorHandler.js`, `.env` configuration | API Error Fuzzing & Static Secret Scan |
