# PRD — FoodShare LK
### Surplus Food Donation Platform for Sri Lanka (MERN Stack)
**Version:** 1.0 · **Date:** 4 September 2026 · **Context:** SE3090 Assignment 2 — Mini Hackathon (4-hour build)

---

## 1. Overview

**FoodShare LK** connects hotels, bakeries, and restaurants that have surplus food at the end of the day with people and organizations who can use it — either for human consumption (individuals, NGOs, orphanages, elders' homes) or animal feed (shelters, community animal welfare groups). The goal is to reduce edible food going to landfill and make redistribution as fast as posting a listing.

**Real-world grounding:** Hospitality and food service account for roughly a quarter of Sri Lanka's food waste. Existing efforts (Robin Hood Army Sri Lanka, WGSA, academic projects like SharePlate and Saubhagya) currently rely on manual phone calls and word-of-mouth coordination. FoodShare LK digitizes and speeds up this matching process.

## 2. Problem Statement

Hotels and bakeries routinely discard unsold, still-edible food at closing time because:
- They have no fast channel to notify nearby people/NGOs who could use it
- Recipients (NGOs, individuals, animal shelters) don't know what's available, where, or when
- Manual coordination (calls, word of mouth) is slow and unreliable against a closing-time deadline

## 3. Goals

| Goal | Metric (for demo) |
|---|---|
| Let donors post surplus food in under 1 minute | Form completes in ≤5 fields |
| Let recipients find relevant food fast | Search/filter by food type, location, "for whom" |
| Prevent wasted trips | Real-time status (`available` → `claimed`) |
| Demonstrate a full donation lifecycle | Post → Browse → Claim, end to end, in the demo video |

## 4. Out of Scope (v1 / 4-hour build)

- Real user authentication / password login (use lightweight role selection instead)
- Payments
- Live GPS tracking or maps (use free-text location field)
- Push notifications / SMS
- Admin moderation dashboard (nice-to-have, not MVP)

---

## 5. User Roles

| Role | Description | Key permissions |
|---|---|---|
| **Donor** | Hotel, bakery, restaurant, or household staff posting surplus food | Create listing, edit/cancel own listing, mark as claimed manually |
| **Recipient** | Individual, NGO, orphanage, elder's home, or animal shelter volunteer | Browse/search/filter listings, claim a listing, view claim confirmation |
| **Guest (default/unauthenticated)** | Anyone landing on the site before choosing a role | View landing page, view problem explanation, choose to continue as Donor or Recipient |
| **Admin** *(stretch goal, not MVP)* | Session organizer / platform owner | View all listings, remove inappropriate/expired posts |

No password-based accounts in v1 — the "role" is a lightweight session choice (stored in React state / localStorage-equivalent in-memory context) that determines which views and actions are shown. This satisfies the "functional, working solution" requirement without burning build time on auth.

---

## 6. User Flows

### 6.1 Donor flow
1. Land on homepage → click **"Donate Food"**
2. Fill out listing form (food item, quantity, for whom, location, expiry/pickup window, contact number)
3. Submit → validation runs → listing appears in **My Listings** and the public feed
4. Donor can mark a listing **Claimed** or **Cancelled** manually from My Listings

### 6.2 Recipient flow
1. Land on homepage → click **"Find Food"**
2. Browse the listings feed (cards), or use search/filter (food type, location, for whom: people/animals)
3. Click a listing → view detail (contact number, pickup window, location)
4. Click **"Claim This"** → confirm dialog → status updates to `claimed`, claimant name/org saved
5. Confirmation screen with donor contact info to arrange pickup

### 6.3 Guest flow
1. Land on homepage → read problem statement and stats
2. Choose **Donor** or **Recipient** to proceed (no login wall)

---

## 7. Pages / Screens

| # | Page | Route | Purpose | Role access |
|---|---|---|---|---|
| 1 | **Landing / Home** | `/` | Hero, problem explanation, stats, role selection CTA | Guest |
| 2 | **Donate Food (form)** | `/donate` | Create a new surplus food listing | Donor |
| 3 | **My Listings** | `/my-listings` | View/edit/cancel/mark-claimed own posted listings | Donor |
| 4 | **Browse Listings** | `/browse` | Searchable, filterable grid/list of available listings | Recipient |
| 5 | **Listing Detail** | `/listings/:id` | Full details + Claim button | Recipient |
| 6 | **Claim Confirmation** | `/listings/:id/confirmed` | Shows donor contact + pickup instructions | Recipient |
| 7 | **About / How It Works** | `/about` | Explains the Sri Lankan food waste problem, how the platform helps, credits | Guest |
| 8 | **404 / Not Found** | `*` | Friendly fallback page | All |

Navigation bar present on every page: **Home · Donate · Browse · About**, plus a role indicator ("Browsing as Donor / Recipient").

---

## 8. Functional Requirements → Minimum Requirement Mapping

| Spec's minimum requirement | Satisfied by |
|---|---|
| 1. Clear landing page | Home page hero + CTAs |
| 2. Problem explanation in-app | Home page + About page |
| 3. ≥2 functional features | (a) Create listing (b) Search/filter/claim listing |
| 4. Form with input | Donate Food form |
| 5. Input validation, friendly errors | Field-level validation on Donate form (see §11) |
| 6. Display/search/filter/update/process info | Browse page (search + filters) + Claim action (status update) |
| 7. Responsive UI | Tailwind CSS responsive grid, mobile-first |
| 8. Basic navigation | Persistent navbar across all pages |
| 9. Sample data | Seed script with 10–12 realistic listings |
| 10. Clear demonstration of value | End-to-end donor→recipient claim flow in demo video |

---

## 9. Technical Architecture (MERN)

```
┌─────────────────────┐        HTTPS/JSON        ┌──────────────────────┐
│   React Frontend     │ ───────────────────────▶ │   Express REST API    │
│  (Vite + Tailwind)   │ ◀─────────────────────── │     (Node.js)         │
└─────────────────────┘                            └──────────┬───────────┘
                                                                │ Mongoose ODM
                                                                ▼
                                                     ┌──────────────────────┐
                                                     │      MongoDB Atlas    │
                                                     │   (free tier cluster) │
                                                     └──────────────────────┘
```

**Frontend:** React + Vite, React Router for the pages in §7, Tailwind CSS for responsive styling, Axios for API calls, React Context for the lightweight "current role" state.

**Backend:** Node.js + Express, Mongoose for schema/validation, `express-validator` (or manual middleware) for request validation, `cors` + `dotenv`.

**Database:** MongoDB Atlas (free M0 cluster) — single primary collection (`listings`), no auth-related collections needed for v1.

**Deployment (matches spec's "any free host"):**
- Frontend → Vercel or Netlify
- Backend → Render or Railway
- Database → MongoDB Atlas free tier

---

## 10. Database Design

### 10.1 Collection: `listings`

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | Mongo default |
| `donorName` | String | ✓ | e.g. "Perera Bakery" |
| `donorType` | String (enum) | ✓ | `hotel` \| `bakery` \| `restaurant` \| `household` \| `other` |
| `foodItem` | String | ✓ | e.g. "Bread loaves" |
| `quantity` | Number | ✓ | must be > 0 |
| `quantityUnit` | String (enum) | ✓ | `kg` \| `packets` \| `plates` \| `loaves` \| `items` |
| `forWhom` | String (enum) | ✓ | `people` \| `animals` \| `both` |
| `location` | String | ✓ | free-text area/town (e.g. "Ratnapura Town") |
| `pickupWindowStart` | Date | ✓ | must be present or future at creation |
| `pickupWindowEnd` | Date | ✓ | must be after `pickupWindowStart` |
| `contactNumber` | String | ✓ | validated Sri Lankan phone format |
| `notes` | String | ✗ | optional extra info |
| `status` | String (enum) | ✓ default `available` | `available` \| `claimed` \| `expired` \| `cancelled` |
| `claimedBy` | String | ✗ | recipient name/org, filled on claim |
| `claimedAt` | Date | ✗ | timestamp of claim |
| `createdAt` | Date | auto | Mongoose timestamps |
| `updatedAt` | Date | auto | Mongoose timestamps |

### 10.2 Mongoose Schema (reference)

```javascript
const listingSchema = new mongoose.Schema({
  donorName:   { type: String, required: true, trim: true },
  donorType:   { type: String, enum: ['hotel','bakery','restaurant','household','other'], required: true },
  foodItem:    { type: String, required: true, trim: true },
  quantity:    { type: Number, required: true, min: 1 },
  quantityUnit:{ type: String, enum: ['kg','packets','plates','loaves','items'], required: true },
  forWhom:     { type: String, enum: ['people','animals','both'], required: true },
  location:    { type: String, required: true, trim: true },
  pickupWindowStart: { type: Date, required: true },
  pickupWindowEnd:   { type: Date, required: true },
  contactNumber: { type: String, required: true, match: /^(?:\+94|0)[0-9]{9}$/ },
  notes:       { type: String, trim: true },
  status:      { type: String, enum: ['available','claimed','expired','cancelled'], default: 'available' },
  claimedBy:   { type: String, trim: true },
  claimedAt:   { type: Date }
}, { timestamps: true });
```

### 10.3 Optional v2 collection: `users` *(stretch, not required for MVP)*
If time allows near the end, a minimal `users` collection (`name`, `role`, `orgName`) could replace the in-memory role selector — **not required** for the 4-hour build.

---

## 11. API Endpoint Architecture

Base URL: `/api/v1`

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/listings` | Get all listings — supports query params below | None |
| `GET` | `/listings/:id` | Get one listing by ID | None |
| `POST` | `/listings` | Create a new listing (Donor form submit) | None |
| `PATCH` | `/listings/:id` | Update a listing (edit fields, or Donor cancels) | None |
| `PATCH` | `/listings/:id/claim` | Recipient claims a listing → sets `status: claimed`, `claimedBy`, `claimedAt` | None |
| `DELETE` | `/listings/:id` | Remove a listing (Donor cancels permanently) | None |
| `GET` | `/stats` | Aggregate counts (total listings, claimed, available) for landing page stats | None |

**Query parameters for `GET /listings`:**
- `?foodType=bread` — text search on `foodItem`
- `?location=ratnapura` — text search on `location`
- `?forWhom=animals` — exact filter
- `?status=available` — exact filter (default: only `available` shown on Browse page)

**Example request/response — `POST /listings`:**
```json
// Request body
{
  "donorName": "Perera Bakery",
  "donorType": "bakery",
  "foodItem": "Bread loaves",
  "quantity": 20,
  "quantityUnit": "loaves",
  "forWhom": "both",
  "location": "Ratnapura Town",
  "pickupWindowStart": "2026-09-04T18:00:00.000Z",
  "pickupWindowEnd": "2026-09-04T21:00:00.000Z",
  "contactNumber": "0771234567"
}

// Response 201
{
  "success": true,
  "data": { "_id": "66f...", "status": "available", ... }
}
```

**Example — `PATCH /listings/:id/claim`:**
```json
// Request body
{ "claimedBy": "Robin Hood Army SL - Ratnapura Chapter" }

// Response 200
{
  "success": true,
  "data": { "_id": "66f...", "status": "claimed", "claimedBy": "Robin Hood Army SL - Ratnapura Chapter", "claimedAt": "2026-09-04T19:12:00.000Z" }
}
```

**Standard error response shape (for validation errors):**
```json
{
  "success": false,
  "errors": [
    { "field": "quantity", "message": "Quantity must be a positive number" },
    { "field": "contactNumber", "message": "Enter a valid Sri Lankan phone number" }
  ]
}
```

### 11.1 Backend folder structure

```
server/
├── src/
│   ├── models/
│   │   └── Listing.js
│   ├── routes/
│   │   └── listings.routes.js
│   ├── controllers/
│   │   └── listings.controller.js
│   ├── middleware/
│   │   ├── validateListing.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── db.js
│   └── app.js
├── seed/
│   └── seedListings.js
├── .env
└── package.json
```

### 11.2 Frontend folder structure

```
client/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── DonateForm.jsx
│   │   ├── MyListings.jsx
│   │   ├── BrowseListings.jsx
│   │   ├── ListingDetail.jsx
│   │   ├── ClaimConfirmation.jsx
│   │   ├── About.jsx
│   │   └── NotFound.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ListingCard.jsx
│   │   ├── FilterBar.jsx
│   │   └── RoleSwitcher.jsx
│   ├── context/
│   │   └── RoleContext.jsx
│   ├── api/
│   │   └── listingsApi.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

---

## 12. Validation Rules (Requirement #5)

| Field | Rule | Friendly error message |
|---|---|---|
| `donorName` | Required, min 2 chars | "Please tell us who's donating." |
| `foodItem` | Required | "What food are you donating?" |
| `quantity` | Required, number > 0 | "Quantity must be a positive number." |
| `forWhom` | Required, one of enum | "Please select who this food is for." |
| `location` | Required | "Where can this be picked up?" |
| `pickupWindowStart` | Required, ≥ now | "Pickup time can't be in the past." |
| `pickupWindowEnd` | Required, after start | "Pickup end time must be after the start time." |
| `contactNumber` | Required, matches `^(?:\+94\|0)[0-9]{9}$` | "Enter a valid Sri Lankan phone number, e.g. 0771234567." |

Validation runs **client-side** (instant feedback, disable submit until valid) **and server-side** (Mongoose schema + middleware) so the API is never trusted blindly from the frontend.

---

## 13. Non-Functional Requirements

- **Responsive:** Tailwind breakpoints — single-column card stack on mobile, multi-column grid on desktop
- **Performance:** Listings fetched via a single paginated `GET /listings` call (limit 20 for demo)
- **Reliability:** Deployed build tested in an incognito window before submission (per spec instructions)
- **Simplicity:** No auth token handling, no third-party payment or SMS integration in v1

---

## 14. Optional AI-Powered Feature (Stretch Goal)

**"Smart Urgency & Category Tag"** — when a donor types the `foodItem`, call an LLM API (e.g. Anthropic/OpenAI) with a short prompt to classify:
- `perishability`: `high` | `medium` | `low`
- Suggested pickup urgency label shown on the listing card (e.g. "⚠ Pick up soon — perishable")

Implementation: one additional Express route `POST /api/v1/classify` that the frontend calls on form blur, result stored in the listing as `aiTag`. Keep this **last** in the build order — only attempt after all 10 minimum requirements are working (per the recommended schedule's "Polish" phase).

---

## 15. Seed Data (Requirement #9)

Seed script (`seed/seedListings.js`) inserts ~10–12 realistic entries on server start, e.g.:

| Donor | Item | Qty | For | Location |
|---|---|---|---|---|
| Perera Bakery | Bread loaves | 20 | Both | Ratnapura Town |
| Green Leaf Hotel | Rice & curry packets | 15 | People | Colombo 6 |
| Sunrise Restaurant | Cooked vegetables | 8 kg | Animals | Kandy |
| Mount Bakers | Cakes & pastries | 30 items | People | Nugegoda |
| Ocean View Hotel | Buffet leftovers | 10 kg | Both | Galle |
| ...(6–7 more) | | | | |

---

## 16. Team & Role Ownership (per spec's 1.4)

| Area | Owner | Covers |
|---|---|---|
| Problem & solution design | — | Framing, MVP scope, user flows (this document) |
| UI development | — | React pages, Tailwind styling, navigation |
| Functional implementation | — | Express API, Mongoose models, validation logic |
| Testing, Git & deployment | — | Seed data, testing edge cases, Vercel/Render deploy, demo lead |

*(Fill in actual member names before submission — required in README per spec §1.5.)*

---

## 17. Build Timeline (mapped to spec's 4-hour schedule)

| Time | Phase | This project's focus |
|---|---|---|
| 0–20 min | Plan | Lock this PRD's scope — no scope changes after this point |
| 20–45 min | Design | Wireframe the 8 pages, agree on API contract (§11) |
| 45–175 min | Build | Backend CRUD + seed data first, then frontend pages wired to API |
| 175–205 min | Polish | Validation messages, responsive check, optional AI tag if time allows |
| 205–225 min | Ship | Deploy client (Vercel), server (Render), Atlas connection string in env vars |
| 225–240 min | Submit | Record 2-min demo, fill README, compile submission PDF |

---

## 18. Definition of Done

- [ ] All 8 pages implemented and navigable
- [ ] Donor can create a listing; it appears in Browse immediately
- [ ] Recipient can search/filter and claim a listing; status updates persist in MongoDB
- [ ] All validation rules in §12 implemented client- and server-side
- [ ] Seed data present (10+ listings) on fresh deploy
- [ ] Responsive on mobile and desktop
- [ ] Deployed frontend + backend publicly reachable, tested in incognito
- [ ] README includes problem, solution, tech stack, AI tools used, install/run instructions, contributions, links
- [ ] AI Prompt Log completed if AI tools were used
