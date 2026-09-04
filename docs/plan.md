# PLAN.md — FoodShare LK Build Plan
### 4-Member Task Split · MERN Stack · 4-Hour Hackathon Session

Reference: `PRD.md` (pages, endpoints, DB schema, validation rules already defined there — this document only assigns who builds what and when).

---

## 1. Team Split (2 Frontend + 2 Backend, equal load)

| Member | Track | Owns |
|---|---|---|
| **Member 1** | Frontend — Donor side | Home, Donate Form, My Listings, Navbar, RoleSwitcher |
| **Member 2** | Frontend — Recipient side | Browse Listings, Listing Detail, Claim Confirmation, About/404, FilterBar |
| **Member 3** | Backend — Core API | DB setup, Listing model, `POST/GET/GET:id` endpoints, validation middleware, seed data |
| **Member 4** | Backend — Actions & Ops | `PATCH` (edit/claim), `DELETE`, `/stats` endpoint, error handling, deployment (both client + server), demo lead |

Each person owns **2 pages or ~2 endpoint groups + a supporting piece** — kept deliberately equal in count and complexity so no one is blocked waiting on the others for longer than the first 45 minutes (API contract in PRD §11 is agreed up front, so frontend and backend can build in parallel against that contract using dummy/mock data until integration).

---

## 2. Member 1 — Frontend: Donor Side

**Pages:** `Home.jsx`, `DonateForm.jsx`, `MyListings.jsx`
**Shared components owned:** `Navbar.jsx`, `RoleSwitcher.jsx`, `RoleContext.jsx`

**Tasks:**
- [ ] Landing page hero, problem stats, "Donate Food" / "Find Food" CTAs
- [ ] Donate Food form — all fields from PRD §10.1, client-side validation per PRD §12
- [ ] My Listings page — list donor's own posts, edit/cancel/mark-claimed buttons
- [ ] Navbar with role indicator, shared across all pages
- [ ] Wire form submit to `POST /api/v1/listings` (Member 3's endpoint)
- [ ] Wire My Listings to `GET /api/v1/listings?donor=me` and `PATCH`/`DELETE` (Member 4's endpoints)

**Dependencies:** Needs `POST /listings` contract from Member 3 by minute 45 (already fixed in PRD §11, so can build against a mock response before that).

---

## 3. Member 2 — Frontend: Recipient Side

**Pages:** `BrowseListings.jsx`, `ListingDetail.jsx`, `ClaimConfirmation.jsx`, `About.jsx`, `NotFound.jsx`
**Shared components owned:** `ListingCard.jsx`, `FilterBar.jsx`

**Tasks:**
- [ ] Browse page — responsive card grid, search bar, filters (food type, location, forWhom)
- [ ] Listing Detail page — full info + "Claim This" button
- [ ] Claim Confirmation page — shows donor contact after successful claim
- [ ] About page — problem explanation, stats, credits
- [ ] 404 fallback page
- [ ] Wire Browse to `GET /api/v1/listings` with query params (Member 3's endpoint)
- [ ] Wire Claim button to `PATCH /api/v1/listings/:id/claim` (Member 4's endpoint)

**Dependencies:** Needs `GET /listings` (with filters) from Member 3 and `/claim` from Member 4 — both fixed in PRD §11, build against mocks until ready.

---

## 4. Member 3 — Backend: Core API & Data

**Owns:** `models/Listing.js`, `config/db.js`, `middleware/validateListing.js`, `seed/seedListings.js`

**Tasks:**
- [ ] Set up Express app skeleton (`app.js`), MongoDB Atlas connection
- [ ] Build `Listing` Mongoose schema exactly per PRD §10.2
- [ ] `POST /api/v1/listings` — create, with server-side validation middleware (PRD §12)
- [ ] `GET /api/v1/listings` — list all + query param filters (`foodType`, `location`, `forWhom`, `status`)
- [ ] `GET /api/v1/listings/:id` — single listing
- [ ] Seed script with 10–12 sample listings (PRD §15), run on server start
- [ ] Standard error response shape (PRD §11) for all validation failures

**Dependencies:** None to start — can begin immediately at minute 0. This is the critical path; other three all depend on this schema/contract being stable early, so **lock the schema by minute 20** and don't change field names after that.

---

## 5. Member 4 — Backend: Actions, Ops & Deployment

**Owns:** `controllers/listings.controller.js` (update/delete/claim/stats), `middleware/errorHandler.js`, deployment configs

**Tasks:**
- [ ] `PATCH /api/v1/listings/:id` — edit a listing
- [ ] `PATCH /api/v1/listings/:id/claim` — claim action (sets `status`, `claimedBy`, `claimedAt`)
- [ ] `DELETE /api/v1/listings/:id` — cancel/remove
- [ ] `GET /api/v1/stats` — aggregate counts for landing page
- [ ] Global error-handling middleware
- [ ] Deploy backend to Render/Railway with env vars (Atlas URI)
- [ ] Deploy frontend to Vercel/Netlify, connect to deployed backend URL
- [ ] Test full deployed app in incognito window before submission
- [ ] Lead the 2-minute demo recording (walks through the working app)

**Dependencies:** Needs `Listing` model from Member 3 (shared file, coordinate via Git early — both push to `models/Listing.js` only once, at minute ~20).

---

## 6. Timeline (aligned to spec's 4-hour schedule)

| Time | All 4 members |
|---|---|
| 0–20 min | Together: confirm scope from PRD.md, assign yourselves to the roles above, agree not to change the API contract or DB schema after this point |
| 20–45 min | M3 sets up Express + Mongoose schema + Atlas connection (others wait/watch or scaffold their own files with mock data) |
| 45–175 min | **Parallel build.** M1 & M2 build pages against mocked API responses; M3 finishes core endpoints + seed data; M4 builds action endpoints. Integrate frontend↔backend calls as each endpoint goes live — don't wait until the end to connect everything at once |
| 175–205 min | Polish: validation error messages, responsive check on mobile widths, fix integration bugs |
| 205–225 min | M4 deploys both frontend and backend; whole team tests deployed link in incognito |
| 225–240 min | M4 leads demo recording; everyone fills their part of the README (contributions section); compile submission PDF together |

---

## 7. Git Workflow

- One shared repo, `main` branch protected
- Branch per member: `feature/donor-frontend`, `feature/recipient-frontend`, `feature/core-api`, `feature/actions-api`
- Commit early and often (meaningful messages) — commit history is graded (PRD §11.1, spec's Git & documentation criterion)
- Merge to `main` at natural integration points (after minute 45, and again at minute 175), not all at once at the end

---

## 8. Definition of Done — Per Member

- [ ] **M1:** Donor can post a listing end-to-end and see it in My Listings
- [ ] **M2:** Recipient can browse, filter, and successfully claim a listing
- [ ] **M3:** All read/create endpoints return correct data, seed data loads on fresh start
- [ ] **M4:** All update/delete/claim endpoints work, app is deployed and reachable publicly, demo video recorded

## 9. Contribution Log (fill in during the session for the README)

| Member | Name | Student ID | What they built |
|---|---|---|---|
| Member 1 | | | Donor-side frontend pages |
| Member 2 | | | Recipient-side frontend pages |
| Member 3 | | | Core backend API + DB + seed data |
| Member 4 | | | Actions API + deployment + demo |
