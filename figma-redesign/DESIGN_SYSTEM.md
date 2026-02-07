# Stylist Marketplace Design System

## Design Philosophy
- **Mobile-First**: All components designed for mobile (320px+) first, then enhanced for tablet and desktop
- **Premium/Luxury Aesthetic**: Sophisticated color palette, smooth animations, generous spacing
- **Touch-Optimized**: Minimum 44px tap targets, large interactive elements

## Responsive Breakpoints
```tsx
- Mobile: < 640px (default)
- Tablet: 640px - 1024px (sm-lg)
- Desktop: > 1024px (lg+)

// Example usage in Tailwind:
className="px-4 sm:px-6 lg:px-8"  // Padding scales up
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"  // Grid columns
className="text-sm sm:text-base lg:text-lg"  // Typography
```

## Color System
Uses default Tailwind theme with gradients:
- **Primary**: Brand color for CTAs and accents
- **Background**: Clean white/dark base
- **Muted**: Subtle backgrounds (muted/20, muted/50)
- **Border**: Subtle borders (border/50)
- **Gradients**: `bg-gradient-to-b from-background to-muted/20`

## Typography Scale
- **Mobile**: Smaller base sizes
- **Desktop**: Larger, more spacious
```tsx
h1: "text-2xl sm:text-3xl"
h2: "text-xl sm:text-2xl"
h3: "text-base sm:text-lg"
body: "text-sm sm:text-base"
small: "text-xs sm:text-sm"
```

## Spacing System
```tsx
// Container padding
"px-4 sm:px-6 lg:px-8"

// Section spacing
"py-6 sm:py-12"

// Card padding
"p-4 sm:p-6"

// Gap between elements
"gap-4 sm:gap-6"
"space-y-4 sm:space-y-6"
```

## Component Patterns

### Cards
```tsx
<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50">
  {/* Hover effects, subtle borders, smooth transitions */}
</Card>
```

### Buttons
```tsx
// Mobile: h-12, Desktop: h-11
<Button className="h-12 sm:h-11 w-full sm:w-auto">

// Icon buttons maintain square aspect
<Button size="icon" className="size-10 sm:size-11">
```

### Images
```tsx
// Aspect ratios for consistency
<div className="aspect-[4/5]">  // Portrait cards
<div className="aspect-square">  // Portfolio grid

// Hover effects
className="group-hover:scale-105 transition-transform duration-500"
```

### Modals (Mobile-First)
```tsx
// Bottom sheet on mobile, centered modal on desktop
<div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 
                flex items-end sm:items-center justify-center p-0 sm:p-4">
  <Card className="w-full sm:max-w-lg 
                   rounded-t-3xl rounded-b-none sm:rounded-2xl 
                   border-0 sm:border">
    {/* Content */}
  </Card>
</div>
```

### Navigation
```tsx
// Bottom navigation (mobile-friendly)
<nav className="border-t bg-background/95 backdrop-blur-sm 
               sticky bottom-0 z-20">
  <Button className="flex-col h-auto py-2 px-3 sm:px-4 gap-1">
    <Icon className="size-5" />
    <span className="text-xs">Label</span>
  </Button>
</nav>
```

### Horizontal Scroll (Mobile)
```tsx
<div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
  <Badge className="whitespace-nowrap">Filter</Badge>
</div>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {/* Auto-responsive from 1 to 3 columns */}
</div>
```

### Show/Hide Elements by Breakpoint
```tsx
className="hidden sm:flex"  // Hidden on mobile, shown on desktop
className="sm:hidden"       // Shown on mobile, hidden on desktop
className="flex lg:hidden"  // Shown on mobile/tablet, hidden on desktop
```

## Key Interactions

### Touch-Optimized Buttons
```tsx
// Active states for touch
className="active:scale-90 sm:hover:scale-110"
className="transition-transform"
```

### Smooth Animations
```tsx
// Transitions
className="transition-all duration-300"
className="transition-colors"
className="transition-transform duration-500"

// Hover states
className="hover:shadow-xl"
className="hover:bg-primary/5"
className="group-hover:opacity-100"
```

### Loading States
```tsx
// Skeleton loaders, smooth fades
className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
```

## Page Layouts

### Browse Page
- Sticky header with search and filters
- Horizontal scrolling filter badges on mobile
- 1/2/3 column responsive grid
- Touch-optimized cards

### Profile Page
- Mobile: Centered avatar, stacked info
- Desktop: Horizontal layout with sidebar
- Tabs for content organization
- Sticky CTA sidebar on desktop

### Chat/Messages
- Two-pane layout
- Mobile: Show list OR chat (toggle)
- Desktop: Show both side-by-side
- Message bubbles: max-w-[85%] mobile, max-w-[70%] desktop

### Wallet
- Card-based transaction list
- Responsive stat cards
- Mobile-optimized forms

## Form Elements

### Inputs
```tsx
<Input className="h-12 sm:h-14 text-sm sm:text-base" />
```

### Textareas
```tsx
<Textarea className="min-h-[120px] sm:min-h-[140px]" />
```

### Select/Dropdowns
Full width on mobile, auto-width on desktop

## Icons
- Mobile: size-4 or size-5
- Desktop: size-5 or size-6
- Lucide React icon library

## Special Features

### Badges & Tags
```tsx
<Badge variant="secondary" className="text-xs sm:text-sm">
  <Icon className="size-3 mr-1" />
  Text
</Badge>
```

### Avatar Sizes
```tsx
// Small: w-10 h-10 sm:w-12 sm:h-12
// Medium: w-20 h-20 sm:w-24 sm:h-24
// Large: w-24 h-24 sm:w-32 sm:h-32
```

### Gradients & Effects
```tsx
// Background gradients
className="bg-gradient-to-b from-background to-muted/20"
className="bg-gradient-to-t from-black/60 via-black/0 to-transparent"

// Backdrop blur
className="bg-background/95 backdrop-blur-sm"
```

## Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states
- Screen reader text with `sr-only`

## Performance
- Lazy loading images
- Optimized animations (transform/opacity only)
- Minimal reflows
- Efficient state management
