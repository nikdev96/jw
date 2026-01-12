# 🧩 Component Structure

## Current UI Architecture

```
App
├── BottomNavigation (NEW - Fixed bottom)
│   └── Tabs: Home | Cart | Support
│
└── Routes
    ├── HomePage (UPDATED - Added pb-20)
    │   └── Categories Grid
    │
    ├── CategoryPage (UPDATED - Added pb-20)
    │   └── Products Grid
    │
    ├── CartPage (NEW - Empty State UI)
    │   ├── Header
    │   ├── Empty State
    │   │   ├── Icon 🛒
    │   │   ├── Title
    │   │   └── CTA Button
    │   └── [TODO: Cart Items List]
    │
    ├── SupportPage (NEW - Info Screen)
    │   ├── Header
    │   ├── Support Cards (4)
    │   │   ├── Contact Manager
    │   │   ├── Delivery Info
    │   │   ├── Payment Methods
    │   │   └── Working Hours
    │   ├── FAQ Section
    │   └── Contact CTA
    │
    ├── CheckoutPage (EXISTING - Has logic)
    └── OrderSuccessPage (EXISTING - Has logic)
```

---

## Component Props & State

### BottomNavigation
```tsx
Props: None (uses useNavigate, useLocation)
State: None (stateless)
Logic: Path-based active detection
```

### CartPage (New)
```tsx
Props: None
State: None (UI only - TODO: Add cart state)
Logic: None (TODO: Add cart operations)
```

### SupportPage
```tsx
Props: None
State: None (UI only)
Data: Hardcoded (TODO: API integration)
```

---

## File Locations

```
frontend/src/
├── components/
│   └── BottomNavigation.tsx ........... NEW ✨
│
├── pages/
│   ├── CartPage.tsx ................... REPLACED 🔄
│   ├── CartPage.old.tsx ............... BACKUP 💾
│   └── SupportPage.tsx ................ NEW ✨
│
└── App.tsx ............................ UPDATED 🔧
```

---

## Styling Pattern

All components follow:
- Tailwind CSS utility classes
- iOS-like rounded corners (rounded-xl, rounded-2xl)
- Consistent spacing (p-4, gap-3)
- Bottom padding pb-20 for bottom nav
- Active states: active:scale-95
- Shadows: shadow-lg shadow-{color}/20

---

## Animation Strategy

- **Framer Motion** for:
  - Page transitions (App.tsx)
  - Tab indicator (BottomNavigation)
  - Empty state entrance (CartPage)
  - Card stagger (SupportPage)

- **CSS transitions** for:
  - Button active states
  - Color changes

Keep animations < 0.3s for snappy UX
