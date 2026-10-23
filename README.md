# Oasis Healthcare Group — Multi-Facility Healthcare Platform (Concept Demonstration)

> **Independent concept demonstration.** This project is not an official Oasis Healthcare Group website. It is not commissioned, endorsed, sponsored, or operated by Oasis Healthcare Group. All facility, doctor, appointment and operational data shown is demonstration data and must be verified before any real-world use.

A frontend-only demonstration of how a modern digital platform could support a multi-facility healthcare group in Kenya: a public patient experience plus a functional administrative dashboard sharing one data model.

---

## 1. Project overview

The project explores two connected experiences:

- **Public website (`index.html`)** — patient discovery of facilities, services and demonstration doctors; appointment requests; patient resources; contact and emergency access.
- **Admin dashboard (`admin.html`)** — a working enterprise-style interface for managing facilities, appointments, doctors, services, enquiries, website content, reports and demo settings.

There is no backend. All state is stored in the browser using `localStorage` and shared by both applications. Changes made in the dashboard are reflected on the public site, and submissions from the public site appear in the dashboard.

**Design language:** deep medical teal, navy, restrained green accents, warm neutral surfaces, editorial serif headings (Fraunces) and a clean sans-serif body (Inter), with custom SVG iconography and an original vector logo mark.

---

## 2. Features implemented

### Public website
- Responsive header, emergency call action, mobile navigation drawer with Escape/close behaviour.
- Editorial hero with East African healthcare photography and a graceful SVG fallback.
- About the group with a visible demonstration notice.
- **Facility finder:** search by name/town/service, filter by category, county and verification status, facility detail modal, telephone links, directions only where an address exists, appointment prefill.
- **Medical services:** searchable service categories from the shared data layer, service detail views, facility availability counts, appointment prefill.
- **Doctor discovery:** search, specialty and facility filters, profile view, visible `Demo data` labels on every profile.
- **Appointment request wizard:** six steps (service, facility, date, time, details, review) with back/forward state retention, validation, demo reference generation and a confirmation screen clearly stating it is not a real booking.
- **Patient resources:** before your visit, preparation, general guidance, billing/insurance verification note, contact support, accessibility information and FAQ accordion.
- **Contact:** main call centre, email, office, facility phone list, validated contact form stored locally with confirmation.
- Responsive layouts, reduced-motion support, skip link, visible focus states, semantic landmarks and image fallbacks.
- SEO metadata, Open Graph tags, favicon, `robots.txt` and a `sitemap.xml` template.

### Admin dashboard
- Demo login and logout, session handling via `sessionStorage`, visible demo-mode banner.
- Collapsible sidebar, top bar, breadcrumb-style page subtitle, global search, notification panel, profile area.
- **Overview:** KPI cards derived from live demo data; appointment-by-month, status, facility-category and verification charts rendered from local data; recent activity feed.
- **Facilities:** search/filter, add, edit, publish/unpublish, verification status, merge records, delete with confirmation, CSV export, reset demo data.
- **Appointments:** search, status/facility/date filters, detail view, status updates, internal notes, delete, CSV export.
- **Doctors:** add/edit demo profiles, assign facility, publish/unpublish, demo flag, delete.
- **Services:** add/edit, assign to facilities, publish/unpublish, search, delete.
- **Enquiries:** view, search/filter by status, mark reviewed, internal notes, archive.
- **Content management:** edit homepage headline and supporting copy, about text, contact details, featured service/facility IDs; changes propagate to the public site.
- **Reports:** facility inventory, appointment counts/status distribution, service availability, verification progress, CSV exports.
- **Settings:** reset demo data, clear session, storage key and credential reference.
- Responsive dashboard with mobile sidebar and horizontally scrollable tables.

---

## 3. File structure

```
oasis-healthcare-group/
├── index.html            Public application entry point
├── admin.html            Admin dashboard entry point
├── css/
│   ├── style.css         Public design system
│   └── admin.css         Dashboard design system
├── js/
│   ├── utils.js          Shared helpers (escaping, dates, CSV, toasts, modals)
│   ├── data.js           Central data layer, seed data, localStorage persistence
│   ├── components.js     Shared SVG icons, logo, cards, badges, empty states
│   ├── main.js           Public website logic
│   └── admin.js          Admin dashboard logic
├── assets/
│   ├── favicon.svg
│   └── og-image.svg
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## 4. How to run locally

No build step or package installation is required.

1. Open the project folder in VS Code.
2. Install the **Live Server** extension (or use any static server).
3. Right-click `index.html` → **Open with Live Server**.
4. Visit the URL shown (typically `http://127.0.0.1:5500/index.html`).

Alternative with Python:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/index.html`.

> Opening the files directly with `file://` may block some browser features. A local static server is recommended.

---

## 5. How to access the public website

Open `index.html` from the server root. The public site is a single-page experience with anchored sections:

`#home`, `#about`, `#facilities`, `#services`, `#doctors`, `#appointment`, `#resources`, `#contact`.

---

## 6. How to access the admin dashboard

Open `admin.html` from the same server root, or use the **Admin dashboard** link in the public footer.

---

## 7. Demonstration authentication

The login screen is explicitly labelled **DEMO ONLY**.

```
Username: admin
Password: demo
```

These credentials are stored in the demonstration settings object and are visible in client-side code by design. **This is not secure authentication.** Do not reuse real credentials and do not deploy this demo publicly as a secure admin portal.

Logout clears the session flag. Closing the browser tab/session also clears the demo session.

---

## 8. How to reset demonstration data

Use **Admin → Settings → Reset demo data** (or the Facilities view reset button). Confirm the dialog. The original seed dataset is restored.

Developers can also run in the browser console:

```js
OasisData.resetData();
```

---

## 9. How localStorage works

- Storage key: `oasis_demo_v1`.
- Both `index.html` and `admin.html` load `js/data.js`, which reads and writes the same key.
- Writes trigger an `oasis:data-changed` event for the current tab and the native `storage` event for other tabs.
- Data survives refresh in the same browser profile.
- Malformed or inaccessible storage falls back to the seed dataset.
- Use **Reset demo data** to recover a clean state.

**Do not store real patient data, national IDs, payment details or medical histories in this demo.**

---

## 10. Current limitations

- Frontend-only; no server, database, messaging, mapping or payment integration.
- Appointment confirmations, contact messages and status changes exist only in browser storage.
- Doctor profiles are fictional demonstration records and are visibly labelled.
- Facility listing currently contains the 19 entries supplied in the brief while the brief also mentions 17 facilities; this discrepancy is intentionally unresolved and records are flagged for verification.
- No live map integration; directions are offered only when an address exists and open an external map service.
- Photography is externally hosted and may fail offline; a designed SVG fallback is used.
- No real insurance/SHA validation, pricing, clinical records or medical advice.

---

## 11. Deployment (static hosting)

The project is a static site and can be deployed to Vercel, Netlify, Cloudflare Pages or GitHub Pages.

**Vercel:** import the folder as a project, framework preset **Other**, build command empty, output directory `.` (root).

Before deployment:
1. Replace the canonical placeholder `https://example.com/` in `index.html` with the intended URL.
2. Update `sitemap.xml` with the real domain.
3. Keep `admin.html` out of public indexing (`noindex` is already set).
4. Remove or replace demonstration login and data before any real deployment.

---

## 12. Future backend architecture recommendations

Replace `js/data.js` with a service layer that calls authenticated APIs:

- `FacilityService`, `ServiceCatalog`, `ClinicianService`, `AppointmentService`, `EnquiryService`, `ContentService`, `ReportService`, `AuthService`.
- Server-side validation and authorization on every endpoint.
- Role-based access control (administrator, facility manager, clinician, content editor).
- Database persistence with migrations and backups.
- Server-side authentication, secure session management (HTTP-only cookies or token rotation), MFA for administrators.
- Audit logging for all record changes and exports.
- Rate limiting, request validation, CSRF protection and output encoding.
- Data retention and deletion controls.
- Monitoring, error reporting and uptime checks.
- Kenya Data Protection Act (2019) compliance assessment, consent management and data subject request handling.
- Secure integration with approved hospital systems only after formal agreements.

The UI is intentionally separated from data access so these services can replace the local layer without a redesign.

---

## 13. Security limitations

- Authentication is a client-side demonstration check only.
- Anyone can read or modify localStorage data using browser tools.
- No transport security, server authorization, audit log or real session protection is provided.
- User content is inserted using escaping and DOM text APIs; `eval()` is never used. However, this does not replace server-side input validation and output encoding in production.
- The demo must not be used to collect real personal or clinical information.

---

## 14. Facility data verification notes

The initial brief states **17 facilities** but lists **19 entries** across hospitals, doctors' plazas and care centres. This project does not silently invent a resolution.

- All 19 supplied entries are present in `js/data.js`.
- Every record carries `verification`: `verified`, `pending`, `needs_correction` or `possible_duplicate`.
- Phone numbers are included only where supplied in the brief.
- Addresses are included only where supplied or clearly inferable from the supplied town (e.g. “Westlands, Nairobi”); otherwise the interface honestly states that the address must be confirmed.
- Opening hours and services are marked as requiring confirmation.
- The Makadara doctors' plaza and Makadara care-centre records are flagged as a possible overlap.
- Administrators can edit, mark verification status, publish/unpublish, merge or delete records.

No doctor names, qualifications, prices, insurance arrangements or clinical outcomes have been fabricated as real Oasis information.

---

## 15. Photography and assets

- Demonstration photography is loaded from Unsplash (external CDN) with a built-in local SVG fallback if an image fails.
- The logo mark, favicon, social sharing image and interface icons are original SVG/CSS assets created for this concept.
- No image is presented as a photograph of an actual Oasis facility, clinician or patient.
- Replace external photography with licensed, locally sourced images before any real deployment.

---

## 16. Testing performed

The following checks were run during development in a local browser against a static Python server:

- Page load and console-error checks for public and admin pages.
- Demo login/logout and session behaviour.
- All nine admin views opened without JavaScript errors.
- Facility add/edit/publish/merge/delete flows.
- Appointment submission, status changes and persistence.
- Contact submission and dashboard visibility.
- Content editing and public headline propagation.
- Facility search, category, county and verification filters; service and doctor filters.
- Appointment wizard validation and demo confirmation.
- CSV export content generation.
- Demo reset restoring the seed dataset.
- Horizontal-overflow check at a 390px-wide iframe viewport.
- Keyboard Escape/close behaviour and modal focus handling were reviewed in code and manually exercised.

These are demonstration-level checks, not a production security or clinical audit.

---

## 17. Independence notice

This is an independent portfolio/engineering concept. It does not imply any existing commercial relationship with Oasis Healthcare Group. All trademarks and organisational names belong to their respective owners. Any real deployment would require written authorisation, verified content and a production-grade secure backend.
