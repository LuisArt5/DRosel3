# Architectural Patterns

## 1. Single-File Monolith
All UI, business logic, and data access live in `app/page.js` (~2,300 lines). There are no sub-components, no separate files per feature, and no barrel exports. When adding new tabs or modals, follow the same file — don't extract to new files unless explicitly asked.

## 2. Centralized State via `useState`
All application state is declared at the top of `TuxedoAdmin()` (`app/page.js:~150–200`). No Context API, useReducer, Zustand, or Redux. Every piece of data (customers, rentals, inventory, payments, stores, auth, UI flags) is a flat `useState` at component root.

Pattern:
- State is loaded once on mount (and on store change) via a single `loadData()` call.
- Every mutation calls `loadData()` after write to re-sync from Supabase.
- No optimistic updates — UI reflects server truth after each operation.

## 3. Direct Supabase Client (No Abstraction Layer)
Supabase is instantiated once at module level (`app/page.js:19`) and called inline inside async functions throughout the component. There is no service layer, repository, or API route.

```
supabase.from('rentals').select('*, customers(name,phone)').order(...)
supabase.auth.signInWithPassword(...)
supabase.storage.from('id-photos').upload(...)
```

When adding data operations, write them inline in the same style — don't create utility wrappers.

## 4. Tab-Based Conditional Rendering
Navigation is driven by `activeTab` state. Each tab section is rendered with:
```jsx
{activeTab === '<tab-name>' && <div>...</div>}
```
Tabs: `dashboard`, `rentals`, `customers`, `inventory`, `billing`, `analytics`, `cleaner`, `stores` (admin-only), `users` (admin-only).

## 5. Generic Modal System
A single modal handles all create/edit flows. Key state: `showModal`, `modalType`, `formData`, `editingItem`.

- `openModal(type, item?)` — sets type and pre-fills `formData` from item if editing.
- `closeModal()` — resets all modal state.
- The modal JSX conditionally renders the correct form based on `modalType` (`'customer'`, `'inventory'`, `'rental'`, `'user'`, `'store'`).
- Multi-item rentals use a separate `selectedItems` array state.

## 6. Bilingual UI (EN/ES)
A `translations` object holds all UI strings in both languages (`app/page.js:~22–150`). The active language is stored in `language` state. All labels use `t.keyName` (where `t = translations[language]`). When adding UI text, add both `en` and `es` keys to `translations`.

## 7. Role-Based Access Control
`hasPermission(action)` checks `profile.role` against a fixed matrix:
- `admin` — full CRUD + user/store management + all-store view.
- `staff` — read + create + edit, no delete, locked to own store.
- `viewer` — read-only.

UI elements (edit/delete buttons, admin-only tabs) are conditionally rendered using `hasPermission(...)`. Supabase RLS enforces this server-side.

## 8. Multi-Store Isolation
Most tables carry a `store_id` FK. `currentStoreId` state (set via store selector in header) filters all `loadData()` queries. Staff users are assigned a fixed `store_id` in their profile and cannot change the selector.

## 9. File Upload Pattern (Supabase Storage)
ID photos and store logos follow the same pattern:
1. Generate a unique filename: `${Date.now()}-${file.name}`.
2. Upload via `supabase.storage.from('<bucket>').upload(filename, file)`.
3. Store the path string in the relevant DB column (not a full URL).
4. Retrieve with `supabase.storage.from('<bucket>').getPublicUrl(path)`.

Camera capture for ID photos uses `capture="environment"` on the file input (iPad/mobile-friendly).

## 10. Date Conflict Detection
Before saving a rental, an overlap check queries existing rentals for the same item IDs within the requested date range. This is done inline before the insert (`app/page.js`, inside `saveRental`). The check is manual SQL-free — it filters the in-memory `rentals` array already loaded.

## 11. Analytics Data Processing
Analytics are computed client-side from the already-loaded `rentals` array. No dedicated analytics queries. Filter period (`thisWeek`, `thisMonth`, `thisYear`, `allTime`) is state-driven via `analyticsFilter`.

Helper functions:
- `getFilteredRentals()` — filters by period
- `getRevenueData()` — monthly revenue for line chart
- `getWeeklyData()` — day-by-day data for current week (dual-axis bar chart)
- `getInventoryUtilization()` — top 10 items by times rented
- `getRentalsByStatus()` — count per status
- `getPaymentMethodBreakdown()` — revenue per payment method
- `getRentalsByDayOfWeek()` — count per day of week
- `getTopCustomers()` — top 10 by total spend
- `getOverdueRentals()` — picked_up rentals past return date

## 12. Print System
Two separate print targets both live at the top level of the JSX (siblings, not nested inside tab conditionals):

- `#contract-print-wrapper` — always in DOM, hidden by CSS (`display: none`). Populated by `contractRental` state. Shown by `window.print()`.
- `#analytics-print-wrapper` — always in DOM, hidden by CSS. Contains text-based analytics report (no charts). Shown by `window.print()`.

The inline `<style>` tag in the component controls print visibility:
```css
@media print {
  body > div > *:not(#contract-print-wrapper):not(#analytics-print-wrapper) { display: none !important; }
}
```

`globals.css` mirrors this with a fallback rule.

## 13. Inventory Status State Machine
```
available → rented       (on rental creation or pickup)
rented    → cleaning     (on rental return)
cleaning  → available    (on dry cleaner mark-returned)
any       → maintenance  (manual edit)
```

`saveRental` handles all transitions on status changes. `deleteItem` cascades deletes payments/alterations before deleting the rental and restores inventory to `available`.

## 14. Quick-Pay Modal (Balance Gate)
`handlePickup` checks `getRentalBalance(rental)`. If > 0, it opens a quick-pay modal (state: `quickPayRental`, `quickPayMethod`, `quickPayOnComplete`) instead of marking picked up immediately. After payment is saved, `quickPayOnComplete()` callback fires to complete the pickup. This avoids having unpaid balances on picked-up rentals.

## 15. Local Date (Not UTC)
`today` is computed as a local-timezone date string to avoid off-by-one errors in US timezones:
```js
const today = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
})();
```
