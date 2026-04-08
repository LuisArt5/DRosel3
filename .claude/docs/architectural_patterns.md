# Architectural Patterns

## 1. Single-File Monolith
All UI, business logic, and data access live in `app/page.js`. There are no sub-components, no separate files per feature, and no barrel exports. When adding new tabs or modals, follow the same file — don't extract to new files unless explicitly asked.

## 2. Centralized State via `useState`
All application state is declared at the top of `TuxedoAdmin()` (`app/page.js:~50–100`). No Context API, useReducer, Zustand, or Redux. Every piece of data (customers, rentals, inventory, payments, stores, auth, UI flags) is a flat `useState` at component root.

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
Tabs: `dashboard`, `rentals`, `customers`, `inventory`, `billing`, `analytics`, `stores` (admin-only), `users` (admin-only).

## 5. Generic Modal System
A single modal handles all create/edit flows. Key state: `showModal`, `modalType`, `formData`, `editingItem`.

- `openModal(type, item?)` — sets type and pre-fills `formData` from item if editing.
- `closeModal()` — resets all modal state.
- The modal JSX conditionally renders the correct form based on `modalType` (`'customer'`, `'inventory'`, `'rental'`, `'user'`, `'store'`).
- Multi-item rentals use a separate `selectedItems` array state.

## 6. Bilingual UI (EN/ES)
A `translations` object holds all UI strings in both languages (`app/page.js:~22–80`). The active language is stored in `language` state. All labels use `t.keyName` (where `t = translations[language]`). When adding UI text, add both `en` and `es` keys to `translations`.

## 7. Role-Based Access Control
`hasPermission(action)` checks `profile.role` against a fixed matrix:
- `admin` — full CRUD + user/store management.
- `staff` — read + create + edit, no delete.
- `viewer` — read-only.

UI elements (edit/delete buttons, admin-only tabs) are conditionally rendered using `hasPermission(...)`. Supabase RLS enforces this server-side.

## 8. Multi-Store Isolation
Most tables carry a `store_id` FK. `currentStore` state (set by admins in the Stores tab) filters all `loadData()` queries. Staff users are assigned a fixed `store_id` in their profile.

## 9. File Upload Pattern (Supabase Storage)
ID photos and store logos follow the same pattern:
1. Generate a unique filename: `${Date.now()}-${file.name}`.
2. Upload via `supabase.storage.from('<bucket>').upload(filename, file)`.
3. Store the path string in the relevant DB column (not a full URL).
4. Retrieve with `supabase.storage.from('<bucket>').getPublicUrl(path)`.

## 10. Date Conflict Detection
Before saving a rental, an overlap check queries existing rentals for the same item IDs within the requested date range. This is done inline before the insert (`app/page.js`, inside `saveRental`). The check is manual SQL-free — it filters the in-memory `rentals` array already loaded.

## 11. Analytics Data Processing
Analytics are computed client-side from the already-loaded `rentals` array. No dedicated analytics queries. Revenue is grouped by month, top customers aggregated by total spend, overdue calculated by comparing `return_date` to today. Filter period (`thisMonth`, `thisYear`, `allTime`) is state-driven.
