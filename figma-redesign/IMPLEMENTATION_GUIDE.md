# Implementation Guide for Claude in Cursor

## How to Use These Designs in Your Existing App

### Step 1: Review Design System
Read `DESIGN_SYSTEM.md` for all the design patterns, spacing, and responsive breakpoints.

### Step 2: Key Components to Reference

#### Browse/List Page (`stylist-browse.tsx`)
- Mobile-first grid layout
- Horizontal scrolling filters
- Sticky search header
- Card hover effects

#### Detail/Profile Page (`stylist-profile.tsx`)
- Responsive layout (mobile stack → desktop sidebar)
- Tab navigation
- Avatar + header patterns
- Mobile CTA buttons

#### Chat Interface (`chat.tsx`)
- Two-pane responsive layout
- Mobile: Show list OR conversation
- Desktop: Side-by-side
- Message bubbles and input

#### Modals (`rate-review.tsx`, `paywall.tsx`)
- Bottom sheet on mobile
- Centered modal on desktop
- Touch-optimized interactions

#### Wallet/Transactions (`wallet.tsx`)
- Transaction list cards
- Stats overview
- Balance display

#### User Profile (`user-profile.tsx`)
- Settings and preferences
- Avatar upload
- Form layouts

### Step 3: Component Structure

All components follow this pattern:
```tsx
export function ComponentName({ onBack, ...props }) {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      {/* Header - sticky on mobile */}
      <div className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 sm:py-4">
          {/* Header content */}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Content */}
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Navigation Pattern

Bottom navigation (mobile-optimized):
```tsx
<nav className="border-t bg-background/95 backdrop-blur-sm sticky bottom-0 z-20">
  <div className="max-w-7xl mx-auto px-2 sm:px-4">
    <div className="flex items-center justify-around py-2 sm:py-3">
      <Button className="flex-col h-auto py-2 px-3 sm:px-4 gap-1">
        <Icon className="size-5" />
        <span className="text-xs">Label</span>
      </Button>
    </div>
  </div>
</nav>
```

### Step 5: Install Required Packages

```bash
# UI Components (if using shadcn/ui)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input textarea avatar badge progress tabs scroll-area separator switch

# Icons
npm install lucide-react

# Toast notifications
npm install sonner
npx shadcn-ui@latest add sonner

# Image handling
# Use the ImageWithFallback component pattern
```

### Step 6: Tell Claude in Cursor

Use this prompt in Cursor with Claude:

```
I want to redesign my app using these modern, mobile-first designs.

Key requirements:
1. Mobile-first approach (320px+)
2. Responsive breakpoints: sm (640px), lg (1024px)
3. Premium/luxury aesthetic with smooth animations
4. Bottom navigation for mobile
5. Follow the patterns in DESIGN_SYSTEM.md

Please review these component files and help me apply these patterns to my existing [YOUR APP NAME] app:
- stylist-browse.tsx (for list/grid pages)
- stylist-profile.tsx (for detail pages)
- chat.tsx (for messaging)
- rate-review.tsx and paywall.tsx (for modals)

Start by updating [SPECIFIC COMPONENT/PAGE] with these responsive patterns.
```

### Step 7: Component-by-Component Migration

**For List/Browse Pages:**
1. Reference `stylist-browse.tsx`
2. Copy: Header layout, grid system, card structure
3. Adapt: Your data model, filters, search

**For Detail Pages:**
1. Reference `stylist-profile.tsx`
2. Copy: Responsive layout, tabs pattern, sidebar
3. Adapt: Your content sections

**For Chat/Messaging:**
1. Reference `chat.tsx`
2. Copy: Two-pane layout, mobile toggle logic
3. Adapt: Your message data structure

**For Modals:**
1. Reference `rate-review.tsx` or `paywall.tsx`
2. Copy: Bottom sheet → modal pattern
3. Adapt: Your modal content

### Step 8: Styling Migration

**If using Tailwind v4:**
- All components use Tailwind CSS classes
- Copy the responsive class patterns directly

**If using different CSS:**
- Extract the responsive breakpoint logic
- Convert Tailwind classes to your CSS system
- Keep the mobile-first approach

### Step 9: Key Patterns to Implement

**1. Responsive Container:**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**2. Responsive Typography:**
```tsx
<h1 className="text-2xl sm:text-3xl">
<p className="text-sm sm:text-base">
```

**3. Responsive Spacing:**
```tsx
<div className="py-6 sm:py-12 space-y-4 sm:space-y-6">
```

**4. Show/Hide by Breakpoint:**
```tsx
<div className="sm:hidden">Mobile only</div>
<div className="hidden sm:block">Desktop only</div>
```

**5. Responsive Grid:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
```

### Step 10: Testing Checklist

- [ ] Test on 320px (small phone)
- [ ] Test on 375px (iPhone)
- [ ] Test on 768px (tablet)
- [ ] Test on 1024px+ (desktop)
- [ ] Test touch interactions on mobile
- [ ] Test hover states on desktop
- [ ] Test navigation flow
- [ ] Test modals on all sizes

## Common Patterns Quick Reference

**Card with hover effect:**
```tsx
<Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300">
  <ImageWithFallback className="group-hover:scale-105 transition-transform duration-500" />
</Card>
```

**Bottom sheet modal:**
```tsx
<div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-end sm:items-center">
  <Card className="w-full sm:max-w-lg rounded-t-3xl rounded-b-none sm:rounded-2xl">
```

**Sticky header:**
```tsx
<div className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
```

**Responsive button:**
```tsx
<Button className="w-full sm:w-auto h-12 sm:h-11">
```

## File Structure

```
src/
├── app/
│   ├── App.tsx                      # Main app with navigation
│   └── components/
│       ├── stylist-browse.tsx       # Browse/list page
│       ├── stylist-profile.tsx      # Detail/profile page
│       ├── chat.tsx                 # Messaging interface
│       ├── wallet.tsx               # Wallet/transactions
│       ├── user-profile.tsx         # User settings
│       ├── rate-review.tsx          # Review modal
│       ├── paywall.tsx              # Payment modal
│       └── ui/                      # shadcn/ui components
│           ├── button.tsx
│           ├── card.tsx
│           ├── input.tsx
│           └── ...
└── styles/
    ├── theme.css                    # CSS variables
    └── fonts.css                    # Font imports
```

## Next Steps

1. Download/export all component files
2. Share DESIGN_SYSTEM.md and component files with Claude in Cursor
3. Start with one page/component
4. Apply patterns incrementally
5. Test responsiveness at each step
6. Iterate based on your specific needs

Good luck with your redesign! 🎨
