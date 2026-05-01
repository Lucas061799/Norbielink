# Agency Section — Design Spec

Audience: dev. This doc describes **what was designed** and **the logic behind each decision** for the Agency section. It is a functional spec, not implementation guidance.

---

## 1. Glossary

These terms appear throughout the UI and have specific business meanings. Do not rename without consulting design.

| Term | Meaning |
| --- | --- |
| **Appointed** | Agency has an active appointment with us. Can write new business. |
| **Unappointed** | Agency cannot write new business. Either never appointed, removed, or sold via Book Roll. |
| **NEW** | Agency was appointed within the last **12 months**. Visual indicator only. |
| **Dormant** | Active agency with **no login activity for > 12 months**. Visual indicator only. |
| **Book Roll** | Action that transfers an agency's entire policy book to another agency. The source agency becomes Unappointed (Sold). One-way; not reversible. |
| **BOR** | Broker of Record letter. Authorizes the agency to manage policies for a client. |
| **W-9** | Tax form. Re-uploaded when key tax info (name, EIN, address) changes; old W-9 auto-archived. |
| **E&O** | Errors & Omissions insurance certificate. Required, read-only, synced from external source. |
| **Recognition Tag** | Optional badge shown on Agency Status card: Strategic Partner / VIP / Rising Star. Multi-select, editable in Add/Edit forms. |
| **Principal** | The user who owns the agency relationship. Cannot be archived without first reassigning their accounts. |

### NEW vs Dormant — precedence rule

A brand-new agency that hasn't logged in yet would technically meet both conditions. **NEW always wins.** See `getAgencyTimeStatus()` for the canonical logic.

```
if appointment date is < 12 months ago → "new"
else if last login is > 12 months ago  → "dormant"
else                                    → null (no badge)
```

---

## 2. Agency List View

The top-level table of all agencies the user has access to.

### Columns
- **Star** — pin/favorite (per-user, persisted)
- **Agency Name** — sortable; clicking row opens Agency Detail
- **Agency Code** — short code used as ID across UI (e.g. `PION01`)
- **Location** — city, state
- **Status** — Appointed / Unappointed pill (Title Case, NOT all-caps)
- **Last Login** — date
- **NEW / Dormant** indicator — small purple/gray dot icon next to the status (see precedence rule)

### Filters
- Status filter pills: All / Appointed / Unappointed / **Dormant**
- Search bar — placeholder unified to: `By agency, agency code, or user`

### Rules
- Sort by Agency Name uses a simple ascending/descending arrow toggle (no dropdown).
- Star column is per-user and does not change agency state.

---

## 3. Agency Detail View

Opened by clicking an agency row. Has 6 tabs: **Overview**, **Quotes**, **Policies**, **Users**, **Documents**, **Notes**.

### 3.1 Hero (top of detail page)
Shows: agency name, agency code (brand teal `#74C3B7` in dark mode), Appointed/Unappointed badge, Recognition tags, and the NEW/Dormant indicator.

### 3.2 Overview tab — Info cards
- **Agency Status card** — two rows:
  - Row 1: Appointed / Unappointed (or "Sold" pill if book-rolled)
  - Row 2: Recognition tags, if any (Strategic Partner / VIP / Rising Star). Tags are Title Case, NOT uppercase.
- **Appointed Date card** — swaps to "Sold Date" when the agency has been book-rolled.
- Other cards: Address, Contact, Bill methods (Agency Bill / Direct Bill / Premium Finance), Affiliations, Direct Appointments (Workers Comp).

---

## 4. Recognition Tags

Multi-select badges that highlight the agency's strategic standing. Editable from Add/Edit Agency form via checkboxes.

| Tag | Use case |
| --- | --- |
| Strategic Partner | Long-term high-value relationship |
| VIP | High premium volume / executive sponsorship |
| Rising Star | Strong recent growth |

**Display rules:**
- Title Case ("Strategic Partner"), not uppercase.
- Light mode background: `rgba(168,85,247,0.10)` with `#5C2ED4 → #A614C3` gradient text.
- Dark mode background: `rgba(168,85,247,0.22)` with `#A855F7 → #D946EF` gradient text (brighter for legibility).
- Persisted via `badgesOverride` so changes survive across sessions for the demo.

---

## 5. Documents tab

The Documents tab is the most complex surface. It manages all agency-related files.

### 5.1 Categories
1. **Broker of Record (BOR)**
2. **W-9**
3. **License**
4. **Agreements**
5. **Other**

### 5.2 View modes (toolbar)
- **All Documents** — flat list of every doc.
- **By Type** — grouped by category, with a category multi-select dropdown built into the button itself (shows "By Type" / "Category Name" / "X categories" depending on selection).
- **Table** — dense tabular view with sortable columns.

### 5.3 Toolbar actions
- **Archive** badge — count of archived docs, click to view archived list.
- **Trash** — moved-to-trash docs (with restore / permanently-delete actions).
- **Filter** (funnel icon) — multi-select category filter that mirrors the By Type dropdown.
- **Sort** — sort by name / date / category.
- **Search** — collapsible inline search.
- **Multi-select toggle** (CheckSquare icon) — enters select mode. While active, every doc row's file icon becomes a checkbox.
- **Upload** — opens the Document Upload modal.

### 5.4 Multi-select & bulk download
- Toggle with the CheckSquare button in the toolbar (matches the Notes pattern).
- In select mode, each row's `FileText` icon swaps to an empty checkbox; clicking selects it (filled gradient checkmark).
- Bulk action bar appears below the toolbar when select mode is on:
  - 0 selected → "Select documents to download" placeholder
  - ≥1 selected → "{N} document(s) selected" + gradient **Download N** button + Cancel
- Cancel exits select mode and clears selection.

### 5.5 Document Upload modal
- Drag-and-drop OR click to pick a file (PDF, JPG, PNG, max 10 MB).
- Category picker (required) — uses our branded dropdown.
- Filename is editable inline with a Replace action to swap files.

### 5.6 Documents Required modal (compliance gate)
- Triggered when user edits Agency Info and the change requires re-upload (e.g. tax ID change → new W-9; license expiry change → new license).
- **Save Changes is BLOCKED until uploads complete.**
- Drag-drop zone per required document.
- On save: old W-9 is auto-archived (W-9 archived label says "Replaced", not "Archived").

### 5.7 E&O Certificate
- Special read-only section at the bottom of All Documents view.
- Synced from external source — users do not upload E&O directly.
- Shows expiry date.
- **No "Read-only" badge** in the section header (intentionally removed — confused users).

### 5.8 Sync banner
- "Synced from **ImageRight** · 5 min ago" — only on Policy Documents views.
- "Sync now" link triggers a refresh and "Synced" toast.

### 5.9 Preview pane
- Right-side preview panel opens when clicking the eye icon on any doc row.
- Has expand/collapse — expanded mode is a right-side drawer matching the Notes drawer pattern.
- Shows breadcrumb (Documents › Category › Filename), meta strip, and a faux PDF body.

---

## 6. Users tab

Manages users associated with this agency.

### 6.1 Columns
Name, Job Title, Email, Phone, Last Login, **Status** (Active/Inactive badge), Actions.

### 6.2 Per-user actions
- **Reset Password** — fires a "Password reset link sent" toast.
- **Archive User** — always opens the **Reassign Accounts modal** first. Never undoable.

### 6.3 Archive User flow
1. User clicks Archive User.
2. Modal opens: "Continue" button → reassign step.
3. Reassign step: pick a target user to receive this user's accounts.
4. Confirm: "Reassign & Archive".
5. Toast confirms: "Their accounts went to {toName}." (No undo.)

The reasoning: **archiving a user with accounts must NOT orphan those accounts.** Reassignment is a hard requirement, hence one unified flow that ends in archive.

### 6.4 Principal handling
- Principal user is pinned at the top of the table.
- Same archive flow as anyone else (must reassign first).

### 6.5 Action menu position
- Action menu flips upward when the user row is near the bottom of the viewport. Prevents the menu from being clipped.

---

## 7. Book Roll

A destructive admin action. Sells the entire policy book to another agency.

### Flow
1. Admin clicks Book Roll.
2. **Step 1 — form:** pick target agency from a branded dropdown.
3. **Step 2 — confirm:** type the source agency's code to confirm. (Same pattern as deleting a GitHub repo.)
4. On confirm:
   - Source agency status flips to **Unappointed (Sold)**.
   - Appointed Date card flips to **Sold Date**.
   - Policies tab shows a gray banner: "These policies were transferred to {target} on {date}." with the table dimmed (`opacity: 0.65`, slight grayscale).
   - A "Sold to {targetCode}" pill appears on the agency card. **The pill is clickable** and navigates to the target agency's Policies tab.

Not reversible (in the demo).

---

## 8. Theming rules

The app supports light and dark mode. The Agency section enforces these conventions:

### Brand gradients
- **Light mode primary**: `#5C2ED4 → #A614C3` (purple → magenta)
- **Dark mode primary**: `#A855F7 → #D946EF` (brighter purple → fuchsia, for legibility)
- **Button gradient (`btnGrad`)** in dark mode adds a radial overlay on top of the linear gradient — used on Upload, Download N, and other primary CTAs.

### Brand teal
- `#74C3B7` (or `#73C9B7`) — used for agency codes, quote IDs, policy numbers, and active status pills in dark mode.

### Active button text in dark mode
- Yes/No, Agency Type (Retail/Wholesale), and Create Code buttons: when active, text is **solid white** in dark mode (gradient text in light mode). Gradient on dark backgrounds is hard to read.

### Inactive button border
- Use `c.border` (theme-aware), never hardcoded grays like `#E5E7EB`. Light gray borders look harsh in dark mode.

---

## 9. State persistence (demo notes)

These overrides exist so the demo behaves like a real app even though there's no backend:

| State | What it overrides |
| --- | --- |
| `badgesOverride` | Recognition tags after Save |
| `extraDocs` | Newly uploaded documents |
| `archivedDocIds` / `deletedDocIds` | Archive / Trash transitions |
| `docNameOverrides` | Renamed documents |
| `bookRolled` | Set of agencies that have been book-rolled |
| `removedUserIds` / `inactiveUserIds` / `statusInactiveUserIds` | User archive states |

When a real backend is wired up, these become regular DB writes — but the front-end state pattern stays the same.

---

## 10. Out of scope (intentionally)

- Hard delete of agencies (trash + permanent delete is doc-only).
- Manual override of NEW / Dormant indicator — purely date-driven.
- E&O upload from the agency-side UI — synced only.
- Undo for Archive User and Book Roll.

---

## 11. Open questions for backend

- What is the source of truth for `apptDate` (used for NEW indicator)?
- What is the threshold for "Dormant"? Currently 12 months of no login — confirm.
- Recognition Tags: stored on the agency record, or a separate `agency_tags` table?
- Book Roll: does it create a snapshot/audit log, or just flip a flag?
- E&O sync: which provider? What is the polling interval / webhook trigger?
- W-9 auto-archive on tax ID change: is this server-side enforced, or only UI-side?
