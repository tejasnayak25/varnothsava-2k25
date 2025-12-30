# 🎨 Varnothsava 2K26 - Quick Reference Guide

## 🚀 Quick Start

```bash
# The dev server is already running!
# Visit: http://localhost:3000
```

---

## 📍 Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Hero + Events + Chronicles + Gallery + Leaderboard |
| `/events` | EventsPage | Full event grid with filters |
| `/leaderboard` | LeaderboardPage | Rankings and eco-scores |
| `/gallery` | GalleryPage | Photo gallery masonry |
| `/dashboard` | DashboardPage | User dashboard |
| `/checkout` | CheckoutPage | Cart and payment |

---

## 🎨 Design Tokens

### Colors
```css
/* Use these in your components */
className="text-green-400"     /* #00ff88 - Eco green */
className="text-cyan-400"      /* #00d9ff - Tech cyan */
className="text-purple-400"    /* #a855f7 - Accent */
className="bg-[#0a0f0d]"       /* Dark forest background */
```

### Gradients
```css
className="text-gradient-eco"  /* Green → Cyan → Purple */
className="bg-gradient-to-r from-green-500 to-cyan-500"
```

### Effects
```css
className="glass-card"         /* Glassmorphism effect */
className="eco-event-card"     /* Hexagonal event card */
className="eco-btn"            /* Eco-themed button */
className="pulse-glow"         /* Breathing glow animation */
className="shimmer"            /* Shimmer effect */
className="organic-blob"       /* Morphing blob shape */
```

---

## 🎯 Component Classes

### Event Card (Full Example)
```tsx
<div className="eco-event-card pulse-glow">
  {/* Side notches */}
  <div className="eco-side-notch left-0" />
  <div className="eco-side-notch right-0" />
  
  {/* Content */}
  <div className="p-6">
    {/* Your content */}
  </div>
  
  {/* Footer with gradient */}
  <div className="eco-card-footer p-4">
    {/* Footer content */}
  </div>
</div>
```

### Button
```tsx
<button className="eco-btn">
  <span>Click Me</span>
</button>

<button className="eco-btn eco-btn-secondary">
  <span>Secondary</span>
</button>
```

### Glass Card
```tsx
<div className="glass-card p-6 rounded-2xl">
  {/* Content with frosted glass effect */}
</div>
```

---

## 🎬 Animations

### Framer Motion Examples
```tsx
// Fade in on scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  Content
</motion.div>

// Stagger children
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.1 }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 🔧 Utility Classes

### Text Effects
```css
.text-glow-green    /* Green text shadow */
.text-glow-cyan     /* Cyan text shadow */
.text-gradient-eco  /* Gradient text */
```

### Backgrounds
```css
.eco-grid-overlay   /* Animated grid background */
.floating-particles /* Particle container */
```

### Shapes
```css
.organic-blob       /* Morphing blob shape */
```

---

## 📱 Responsive Utilities

```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop Only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile Only</div>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Cards */}
</div>

// Responsive text
<h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl">
  Responsive Heading
</h1>
```

---

## 🎨 Icon Usage

```tsx
import { Leaf, Zap, Sparkles, Trophy } from 'lucide-react'

<Leaf className="w-5 h-5 text-green-400" />
<Zap className="w-5 h-5 text-cyan-400" />
<Sparkles className="w-5 h-5 text-green-400" />
<Trophy className="w-5 h-5 text-yellow-400" />
```

---

## 🎯 Common Patterns

### Section Header
```tsx
<div className="text-center mb-16">
  <div className="flex items-center justify-center gap-3 mb-6">
    <Leaf className="w-6 h-6 text-green-400" />
    <span className="text-green-300 font-mono text-sm tracking-[0.6em] uppercase font-bold">
      Section Subtitle
    </span>
  </div>
  
  <h2 className="text-7xl font-black tracking-tighter leading-none">
    <span className="text-white">MAIN</span>
    <span className="text-gradient-eco">TITLE</span>
  </h2>
</div>
```

### Geometric Card Container
```tsx
<div
  className="glass-card p-6"
  style={{
    clipPath: 'polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)'
  }}
>
  {/* Content */}
</div>
```

### Stats Grid
```tsx
<div className="grid grid-cols-3 gap-4">
  <div className="glass-card p-4 text-center">
    <div className="text-3xl font-black text-gradient-eco">500+</div>
    <div className="text-xs text-white/50 uppercase">Label</div>
  </div>
</div>
```

---

## 🎨 Color Reference

### Primary Palette
- **Eco Green**: `#00ff88` - Nature, sustainability, success
- **Tech Cyan**: `#00d9ff` - Innovation, technology, links
- **Accent Purple**: `#a855f7` - Premium, highlights, CTAs
- **Gold**: `#ffd700` - Awards, rankings, special

### Backgrounds
- **Primary**: `#0a0f0d` - Main background
- **Secondary**: `#0d1410` - Card backgrounds
- **Nature Dark**: `#1a2f23` - Darker sections

### Text
- **White**: `#ffffff` - Primary text
- **White/90**: `rgba(255,255,255,0.9)` - Body text
- **White/60**: `rgba(255,255,255,0.6)` - Secondary text
- **White/40**: `rgba(255,255,255,0.4)` - Tertiary text

---

## 🚀 Performance Tips

1. **Use `viewport={{ once: true }}`** for scroll animations
2. **Lazy load images** with Next.js Image component
3. **Minimize 3D complexity** on mobile
4. **Use CSS transforms** instead of position changes
5. **Debounce scroll events** if adding custom handlers

---

## 🎯 Best Practices

### DO ✅
- Use semantic HTML (`<section>`, `<article>`, `<nav>`)
- Add alt text to images
- Use the design system classes
- Test on mobile devices
- Keep animations smooth (60fps)
- Use the eco color palette

### DON'T ❌
- Use inline styles (use Tailwind classes)
- Create new color schemes
- Ignore mobile responsiveness
- Add heavy animations on mobile
- Use non-semantic divs everywhere

---

## 🐛 Common Issues & Fixes

### Issue: 3D scene not loading
```tsx
// Wrap in Suspense
<Suspense fallback={null}>
  <YourComponent />
</Suspense>
```

### Issue: Animations janky on mobile
```tsx
// Reduce animation complexity
const isMobile = window.innerWidth < 768
<motion.div
  animate={isMobile ? {} : { scale: 1.1 }}
>
```

### Issue: Clip-path not showing
```css
/* Add overflow: hidden to parent */
.parent {
  overflow: hidden;
}
```

---

## 📚 Resources

- **Tailwind Docs**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **Lucide Icons**: https://lucide.dev/

---

## 🎉 You're All Set!

The redesign is complete and ready to use. All components are:
✅ Eco-futuristic themed
✅ Fully responsive
✅ Animated and interactive
✅ Performance optimized

**Happy coding! 🌿**
