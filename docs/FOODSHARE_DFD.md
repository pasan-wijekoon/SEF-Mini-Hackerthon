# Data Flow Diagrams (DFD) — FoodShare LK
### Surplus Food Donation & Redistribution Platform for Sri Lanka
**Document Version:** 1.0 · **Date:** 4 September 2026 · **Standard:** Structured Analysis (Yourdon / DeMarco & Gane-Sarson Notations)

---

## 1. Introduction & Notation Overview

This document specifies the logical and physical data flows within the **FoodShare LK** platform. The system facilitates rapid, end-of-day food donation matching across commercial donors (hotels, bakeries, restaurants, households) and beneficiaries (NGOs, soup kitchens, eldercare homes, animal welfare groups).

### DFD Notation Conventions

| Element Type | Symbol / Representation | Description |
|---|---|---|
| **External Entity** | Rectangle `[Name]` | Boundary sources or sinks of data outside direct system control (e.g. Donor, Recipient, Gemini API). |
| **Process** | Rounded Rectangle `(Process Name)` | Transformations or operational procedures applied to data flows. |
| **Data Store** | Double Line / Open Rectangle `[(Data Store Name)]` | Persistent repository of state (e.g. MongoDB Atlas collections). |
| **Data Flow** | Arrow `-->|Label|` | Directed pipeline representing movement of typed information packets. |

---

## 2. DFD Level 0: Context Diagram

The Context Diagram defines the external boundaries, user actors, external cognitive services, and primary informational transactions interacting with the FoodShare LK core system.

```mermaid
graph TD
    %% External Entities
    Donor["External Entity: Food Donor<br/>(Hotel, Bakery, Restaurant, Household)"]
    Recipient["External Entity: Food Recipient<br/>(Individual, NGO, Elder's Home, Animal Shelter)"]
    GeminiAI["External Service: Google Gemini AI API<br/>(gemini-3.6-flash)"]
    Guest["External Entity: Platform Observer / Guest"]

    %% Central Process
    System["Process 0.0<br/><b>FoodShare LK Core Platform</b>"]

    %% Data Flows: Donor <-> System
    Donor -->|"Donation Listing Details & Expiration Window"| System
    Donor -->|"Listing Management (Update, Cancel, Manual Claim)"| System
    Donor -->|"Advisory Query on High-Need Beneficiaries"| System
    System -->|"Listing Confirmation & Assigned ID"| Donor
    System -->|"Listing Status & Real-time Claim Alerts"| Donor
    System -->|"AI-Driven Grounded Surplus Allocation Advice"| Donor

    %% Data Flows: Recipient <-> System
    Recipient -->|"Search Parameters (Food Type, Location, Beneficiary)"| System
    Recipient -->|"Claim Request (Claimant Name, Org Details)"| System
    System -->|"Filtered Available Listings Feed"| Recipient
    System -->|"Claim Confirmation & Donor Contact Details"| Recipient

    %% Data Flows: Gemini AI <-> System
    System -->|"Live Need Snapshot Data & System Prompt"| GeminiAI
    GeminiAI -->|"Synthesized Allocation Recommendation"| System

    %% Data Flows: Guest <-> System
    Guest -->|"Platform Stats & Impact Metrics Request"| System
    System -->|"Aggregate Rescue Metrics & Educational Content"| Guest
```

---

## 3. DFD Level 1: System Decomposition

The Level 1 diagram decomposes Process 0.0 into seven core discrete processing modules, detailing interactions with the persistent `D1: Listings Store` (MongoDB Atlas) and runtime context.

```mermaid
graph TB
    %% External Entities
    Donor["Food Donor"]
    Recipient["Food Recipient"]
    Gemini["Google Gemini API"]
    Guest["Guest / Public"]

    %% Sub-Processes
    P1["1.0<br/>Manage Session<br/>& Role Context"]
    P2["2.0<br/>Validate & Process<br/>Food Donation"]
    P3["3.0<br/>Manage Active<br/>Donor Listings"]
    P4["4.0<br/>Search, Filter &<br/>Query Feed"]
    P5["5.0<br/>Process Claim<br/>Transaction"]
    P6["6.0<br/>Aggregate Impact<br/>& Need Analytics"]
    P7["7.0<br/>Generate AI<br/>Donation Advisory"]

    %% Data Store
    D1[("D1: Listings Database<br/>(MongoDB Atlas - `listings`)")]

    %% P1 Flows
    Donor -->|"Select Role: Donor"| P1
    Recipient -->|"Select Role: Recipient"| P1
    Guest -->|"Browse as Guest"| P1
    P1 -->|"Active Role State Context"| P2
    P1 -->|"Active Role State Context"| P4

    %% P2 Flows (Donation Creation)
    Donor -->|"Raw Listing Payload"| P2
    P2 -->|"Write New Listing Document (status: 'available')"| D1
    P2 -->|"Listing Created Receipt (201 Created)"| Donor

    %% P3 Flows (Donor Management)
    Donor -->|"Edit / Cancel / Delete Listing"| P3
    P3 -->|"Fetch Donor's Listings"| D1
    P3 -->|"Update Status ('cancelled' / 'claimed')"| D1
    P3 -->|"Hard Delete Document"| D1
    P3 -->|"Action Status Confirmation"| Donor

    %% P4 Flows (Discovery)
    Recipient -->|"Search Filters (Town, Category, Type)"| P4
    D1 -->|"Query Result Stream (status == 'available')"| P4
    P4 -->|"Available Food Cards & Detail View"| Recipient

    %% P5 Flows (Claiming)
    Recipient -->|"Submit Claim (Listing ID + Claimant Org)"| P5
    P5 -->|"Verify Listing Availability"| D1
    P5 -->|"Mutate Status to 'claimed' & Set Timestamp"| D1
    P5 -->|"Claim Confirmation + Donor Contact Reveal"| Recipient

    %% P6 Flows (Stats & Analytics)
    D1 -->|"Raw Listing Status Counts"| P6
    P6 -->|"Serve Aggregate Metrics (/api/v1/stats)"| Guest

    %% P7 Flows (AI Assistant)
    Donor -->|"Donation Allocation Prompt"| P7
    D1 -->|"Inventory & Unmet Category Snapshot"| P7
    P7 -->|"Need Snapshot + Prompt Payload"| Gemini
    Gemini -->|"Grounded Advice Stream"| P7
    P7 -->|"Tailored Advisory Response"| Donor
```

---

## 4. DFD Level 2: Sub-Process Decompositions

### 4.1 Sub-Process 2.0: Process Food Donation Submission

Decomposes the donation registration and validation pipeline to ensure high data integrity, strict phone format adherence, and proper date ranges before persistence.

```mermaid
graph TD
    RawInput["Donor Form Input Payload"] --> P2_1["2.1<br/>Sanitize & Extract Fields"]
    P2_1 -->|"Sanitized Body"| P2_2["2.2<br/>Validate Mandatory Fields & Types"]
    
    P2_2 -->|"Missing / Invalid Fields"| P2_Err["2.3<br/>Format Error Payload<br/>(400 Bad Request)"]
    P2_Err -->|"Field-Level Error Messages"| DonorOutputErr["Return Validation Errors to Client"]
    
    P2_2 -->|"Passed Basic Types"| P2_4["2.4<br/>Validate Business Constraints<br/>(Phone Regex & Time Window)"]
    
    P2_4 -->|"Invalid Phone / Past Date"| P2_Err
    P2_4 -->|"Valid Business Logic"| P2_5["2.5<br/>Inject Defaults<br/>(status: 'available', createdAt)"]
    
    P2_5 -->|"Complete Document"| P2_6["2.6<br/>Execute Mongoose Insertion"]
    P2_6 -->|"Write Query"| DB[(D1: Listings Database)]
    DB -->|"Persisted Doc with _id"| P2_7["2.7<br/>Construct Success Response"]
    P2_7 -->|"201 Created + Listing Object"| DonorOutputSuccess["Donor Listing Success View"]
```

---

### 4.2 Sub-Process 5.0: Process Food Claim Transaction

Decomposes the atomic claiming process to prevent race conditions and ensure that already-claimed or expired food cannot be claimed more than once.

```mermaid
graph TD
    ClaimInput["Recipient Claim Submission<br/>(Listing ID, Claimant Name/Org)"] --> P5_1["5.1<br/>Parse Claim Request"]
    
    P5_1 --> P5_2["5.2<br/>Fetch Listing Document by ID"]
    P5_2 -->|"Find Query"| DB[(D1: Listings Database)]
    DB -->|"Listing Document"| P5_3["5.3<br/>Verify Current State"]
    
    P5_3 -->|"Status != 'available'"| P5_Conflict["5.4<br/>Reject Claim<br/>(409 Conflict / 400 Bad Request)"]
    P5_Conflict -->|"Alert: Item Already Claimed"| RecipientError["Display Claim Failure Alert"]
    
    P5_3 -->|"Status == 'available'"| P5_5["5.5<br/>Apply Atomic Status Mutation"]
    P5_5 -->|"Set status='claimed', claimedBy, claimedAt"| DB
    
    DB -->|"Updated Record Confirmation"| P5_6["5.6<br/>Unlock Donor Contact Info"]
    P5_6 -->|"Confirmation Receipt + Donor Telephone"| RecipientSuccess["Claim Confirmation Page (/confirmed)"]
```

---

### 4.3 Sub-Process 7.0: Grounded AI Advisory Pipeline

Decomposes the integration with the Google Gemini AI service, illustrating how live database aggregations eliminate AI hallucination and ground suggestions in actual real-time surplus need.

```mermaid
graph TD
    UserQuery["Donor Question / Chat Message"] --> P7_1["7.1<br/>Ingest Conversation History"]
    
    P7_1 --> P7_2["7.2<br/>Query D1 for Unclaimed Inventory"]
    P7_2 -->|"Aggregate by forWhom & location"| DB[(D1: Listings Database)]
    DB -->|"Count of Available Posts per Town & Category"| P7_3["7.3<br/>Compile Need Snapshot Matrix"]
    
    P7_3 -->|"Formatted Need Summary"| P7_4["7.4<br/>Synthesize Grounded System Prompt"]
    P7_1 -->|"User Query Payload"| P7_4
    
    P7_4 -->|"Structured LLM Request"| GeminiAPI["Google Gemini API (gemini-3.6-flash)"]
    GeminiAPI -->|"Context-Aware Output"| P7_5["7.5<br/>Sanitize & Parse Response"]
    
    P7_5 -->|"Actionable Advisory Message"| DonorUI["Floating Assistant Chat Window"]
```

---

## 5. Data Dictionary

### 5.1 Data Store Specifications

#### D1: `listings` Collection (MongoDB Atlas)
Stores all surplus food postings across their operational lifecycle.

| Field Name | Type | Key / Constraint | Description | Example |
|---|---|---|---|---|
| `_id` | ObjectId | Primary Key | MongoDB Unique Identifier | `66f81a29c1b...` |
| `donorName` | String | Required, Trim | Registered name of donor or business | `"Perera Bakery"` |
| `donorType` | String | Required, Enum | Entity classification: `hotel`, `bakery`, `restaurant`, `household`, `other` | `"bakery"` |
| `foodItem` | String | Required, Trim, Text Index | Description of surplus food available | `"Fresh Bread Loaves"` |
| `quantity` | Number | Required, Min: 1 | Numeric quantity offered | `20` |
| `quantityUnit` | String | Required, Enum | Standard measurement unit: `kg`, `packets`, `plates`, `loaves`, `items` | `"loaves"` |
| `forWhom` | String | Required, Enum, Index | Beneficiary target: `people`, `animals`, `both` | `"both"` |
| `location` | String | Required, Trim, Text Index | Town, suburb, or neighborhood | `"Ratnapura Town"` |
| `pickupWindowStart` | Date | Required | Earliest acceptable pickup timestamp | `"2026-09-04T18:00:00Z"` |
| `pickupWindowEnd` | Date | Required | Deadline pickup timestamp (must be > Start) | `"2026-09-04T21:00:00Z"` |
| `contactNumber` | String | Required, Regex Match | Sri Lankan phone format: `/^(?:\+94\|0)[0-9]{9}$/` | `"0771234567"` |
| `notes` | String | Optional, Trim | Extra handling/dietary notes | `"Warmly packed in cartons"` |
| `status` | String | Required, Enum, Default: `available` | State machine: `available`, `claimed`, `expired`, `cancelled` | `"available"` |
| `claimedBy` | String | Optional, Trim | Name / Organization of claiming party | `"Robin Hood Army SL"` |
| `claimedAt` | Date | Optional | Timestamp when claim transaction settled | `"2026-09-04T19:30:00Z"` |
| `createdAt` | Date | Auto Timestamp | Document generation timestamp | `"2026-09-04T17:00:00Z"` |
| `updatedAt` | Date | Auto Timestamp | Document mutation timestamp | `"2026-09-04T19:30:00Z"` |

---

### 5.2 Data Flow Specifications

| Data Flow Identifier | Source | Destination | Data Structure / Composition |
|---|---|---|---|
| `Donation_Listing_Request` | Food Donor | Process 2.0 | `donorName` + `donorType` + `foodItem` + `quantity` + `quantityUnit` + `forWhom` + `location` + `pickupWindowStart` + `pickupWindowEnd` + `contactNumber` + `[notes]` |
| `Validation_Error_Response` | Process 2.0 | Food Donor | `{ success: false, errors: [ { field: string, message: string } ] }` |
| `Listing_Persistence_Doc` | Process 2.0 | D1: Listings Store | Complete listing entity with `status: 'available'` |
| `Search_Query_Parameters` | Food Recipient | Process 4.0 | `?foodType=string & location=string & forWhom=enum & status=enum` |
| `Listings_Feed_Stream` | D1: Listings Store | Process 4.0 | Array of `Listing` objects sorted by `createdAt: -1` |
| `Claim_Execution_Request` | Food Recipient | Process 5.0 | `listingId: ObjectId` + `claimedBy: string` |
| `Claim_Receipt_Payload` | Process 5.0 | Food Recipient | `{ success: true, data: Listing }` revealing `contactNumber` and pickup instructions |
| `Need_Snapshot_Summary` | D1: Listings Store | Process 7.0 | Total unclaimed listings, breakdown by `forWhom`, top locations with surplus |
| `AI_Grounded_Prompt` | Process 7.0 | Google Gemini API | System instructions + Need Snapshot Summary + User Query History |
| `Aggregate_Stats_Payload` | Process 6.0 | Guest / Public | `{ success: true, stats: { totalListings, availableListings, claimedListings } }` |

---

## 6. Process State Transition Diagram

The lifecycle of each donation entry follows this deterministic finite state machine:

```mermaid
stateDiagram-v2
    [*] --> Available: Post Listing (Process 2.0)
    
    Available --> Claimed: Recipient Claims Listing (Process 5.0)
    Available --> Cancelled: Donor Cancels Listing (Process 3.0)
    Available --> Expired: Pickup Window Closes without Claim
    
    Claimed --> Cancelled: Donor Revokes Claim
    Claimed --> [*]: Physical Redistribution Complete
    Cancelled --> [*]: Document Retained or Deleted
    Expired --> [*]: Food Disposed Safely
```
