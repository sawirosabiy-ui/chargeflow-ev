# Product Requirement Document (PRD)

**Product Name:** ChargeFlow

**Document Version:** 1.0

**Target Platform:** Web App (Desktop / Cockpit Display) & Android Mobile

**Target Region:** Ethiopia (Addis Ababa launch; national expansion)

---

## 1. Executive Summary & Vision

ChargeFlow is an operations-first, real-time electric vehicle (EV) charging and telemetry ecosystem tailored for the Ethiopian EV market. Following Ethiopia's national transition to electric mobility, urban centers—specifically Addis Ababa—experience significant EV queue friction, fragmented DC fast charging standards (GB/T vs. CCS2), and opaque pricing.

ChargeFlow unifies station discovery, bay reservation, live queue position tracking, localized payment processing (Telebirr, CBE Birr), and an interactive 3D digital twin of the vehicle charging cycle into one interface.

---

## 2. Target Audience & Personas

* **Private EV Commuters:** Urban drivers (predominantly driving vehicles like the BYD Seagull, BYD Song Plus, or Toyota bZ4X) needing fast station discovery and queue predictability.
* **Commercial / Fleet Operators:** Delivery and ride-hailing drivers who cannot afford idle queue delays and require transparent kWh pricing and instant digital receipts.
* **Charging Point Operators (CPOs):** Station owners in Addis Ababa (Bole, Kazanchis, Mexico Square, CMC) who need structured bay queue management and automated billing.

---

## 3. Product Architecture & User Journey

The application follows a linear, 9-stage operational flow:

```
[01. Logo / Splash] ──> [02. Welcome / Auth] ──> [03. Vehicle Setup / Cockpit]
                                                            │
                                                            ▼
[06. Live Queue] <── [05. Bay Reservation] <── [04. Station Discovery Map]
       │
       ▼
[07. Active Charging (3D Digital Twin)] ──> [08. Charging History] ──> [09. Settings]

```

---

## 4. Functional Specifications by Screen Module

### Module 1: Splash & Authentication

* **Screen 01 (Logo Splash):** Pre-fetches WebGL assets and initializes local storage cache.
* **Screen 02 (Welcome & Auth):**
* Tabbed login: `Sign In` and `Create Account`.
* Multi-format credential input: Email or Ethiopian phone number format (`+251 9...`).
* 1-click bottom-bar localization: Switch dynamically between English (`EN`), Amharic (`አማ`), Afaan Oromoo (`ORM`), and Tigrinya (`TIR`).



### Module 2: Vehicle Setup & Digital Twin Cockpit

* **Screen 03 (Cockpit):**
* **3D Canvas Viewport:** Three.js / React Three Fiber interactive viewport displaying vehicle model on a glowing pedestal (`#10b981`).
* **Orbit Restrictions:** Horizontal 360° rotation enabled (`minPolarAngle: ~56°`, `maxPolarAngle: ~88°`) to prevent floor clipping.
* **Vehicle Configurator:** Dropdown selection for supported EV models (BYD Seagull default: 30.1 kWh battery, 305 km WLTP range, FWD).
* **SoC Telemetry:** Interactive slider / real-time battery status percentage bind.



### Module 3: Station Discovery & Reservation

* **Screen 04 (Find Charging - Geospatial Map):**
* **Geospatial Markers:** Addis Ababa station nodes (Bole, Kazanchis, Mexico Square, Yeka, CMC) with real-time port counters and peak kW outputs (e.g., `3 / 120 kW`).
* **Hardware Filter Engine:** Toggles for `Available`, `Fast DC`, `GB/T`, `CCS2`, and `24/7`.
* **Flyout Station Card:** Bay-level breakdown (Port ID, kW capacity, current occupancy, and vehicle type plugged in).


* **Screen 05 (Reservation System):**
* **Bay Selection:** Target bay lock with a 15-minute arrival deadline window.
* **Deposit Checkout:** Fixed reservation fee (`ETB 30.00`) deductible from final session cost, settled via Telebirr or CBE Birr.



### Module 4: Live Queue Management

* **Screen 06 (Queue Operations Timeline):**
* **Core Value Metric:** Answers *"When is my turn to charge?"*
* **Hero Indicators:** Position Badge (`#02`), Estimated Wait (`~12 min`), Current Active Charging vehicle telemetry (`Vehicle #01: 91% · 86 kW · ~8 min remaining`).
* **User Node Visibility:** Visually prominent user card (`POSITION #02 · Reserved · Ready`) with distinct styling compared to anonymous nodes.
* **Quick CTAs:** `[ Navigate to Station ]` and `[ View Reservation ]`.



### Module 5: Digital Twin Active Charging

* **Screen 07 (Active Charging Session):**
* **Physical Digital Twin Scene:** Side/rear perspective of the BYD Seagull plugged into an adjacent DC fast charging pedestal.
* **Modular Plug Attachment:** Dynamic CatmullRom spline cable connecting the pedestal socket to vehicle port coordinates, with an emissive pulsing teal shader along the spline.
* **Live Session Matrix:** Real-time metrics for State (`ACTIVE`), Target SoC (`90%`), Power Output (`86 kW`), Energy Delivered (`24.6 kWh`), Elapsed Cost (`ETB 576`), and Connector Type (`GB/T`).
* **Session Control:** Primary `[ Stop Charging ]` CTA with automatic cut-off when target SoC is reached, transitioning button state to `[ Disconnect / End Session ]`.



### Module 6: History & Settings

* **Screen 08 (Charging History Ledger):**
* **Macro Metrics:** Aggregate summary cards for Total Energy (`248.6 kWh`), Total Sessions (`18`), Total Spend (`ETB 5,728`), and Average Session Duration (`34 min`).
* **Chronological Session List:** Collapsible / clickable session cards with full transaction receipt breakdown and receipt PDF/image export.


* **Screen 09 (Settings & Profile):**
* Driver profile, notification toggles (push/SMS for queue turn alerts), security preferences, and language override.



---

## 5. Technical & Non-Functional Requirements

### 5.1 Technology Stack

* **Frontend Framework:** React 19 + TypeScript + Vite
* **Styling & Design System:** Tailwind CSS, Glassmorphism UI tokens, Dark Mode palette (`#0B0F17` background, `#10B981` emerald accent, `#1E293B` card surfaces)
* **3D Engine:** Three.js, `@react-three/fiber`, `@react-three/drei`
* **State Management:** Zustand (centralized store for vehicle telemetry, queue state, and session metrics)
* **Icons:** `lucide-react`

### 5.2 Performance & Asset Budgets

* **3D Asset Footprint:** Vehicle GLB models must be compressed via Draco/Meshopt to under **2.5 MB** for seamless loading in local bandwidth environments.
* **Framerate Target:** Consistent 60 FPS on desktop browsers and mobile WebGL viewports.
* **Context Preservation:** Single `<Canvas>` container hierarchy to avoid WebGL context loss when routing between views.

### 5.3 Localization & Regionalization

* Dynamic dictionary resource bundles supporting:
* English (`en`)
* Amharic (`am`) — Ethiopic script font rendering
* Afaan Oromoo (`om`)
* Tigrinya (`ti`)


* Currency formatting strictly in Ethiopian Birr (`ETB`).

---

## 6. Mathematical & Billing Formulas

**1. Dynamic Charging Session Cost:**


$$\text{Total Cost (ETB)} = \left( E_{\text{delivered}} \times R_{\text{base}} \right) + F_{\text{service}} + F_{\text{idle}} - F_{\text{reservation\_deposit}}$$

Where:

* $E_{\text{delivered}}$ = Energy consumed in $\text{kWh}$
* $R_{\text{base}}$ = Station base tariff per $\text{kWh}$ (e.g., $\text{ETB } 19.00 / \text{kWh}$)
* $F_{\text{service}}$ = Fixed grid / station operational fee (e.g., $\text{ETB } 4.50$)
* $F_{\text{idle}}$ = Overstay fee applied 10 minutes post-charging completion ($\text{ETB } 10.00 / \text{hour}$)
* $F_{\text{reservation\_deposit}}$ = Pre-paid booking credit ($\text{ETB } 30.00$)

**2. Queue Wait Time Estimation:**


$$T_{\text{wait}} = \sum_{i=1}^{n-1} \left( \frac{(\text{Target SoC}_i - \text{Current SoC}_i) \times \text{Capacity}_i}{P_{\text{avg\_kW}}} \right) + (n \times T_{\text{turnover}})$$

---

## 7. Success Metrics & KPIs

* **Queue Friction Reduction:** $< 2\text{ min}$ discrepancy between estimated and actual queue start times.
* **Onboarding Conversion:** $> 85\%$ completion rate from Step 01 to Step 04 setup.
* **3D Telemetry Render Time:** First Contentful Paint (FCP) of 3D canvas under $1.5\text{ seconds}$ on standard broadband.
* **Payment Settlement Reliability:** $99.9\%$ successful instant transaction verification on Telebirr / CBE Birr webhooks.
