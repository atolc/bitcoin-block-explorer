---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

## Reusable Component Architecture

All components must follow these principles to ensure consistency, scalability, and composability:

### Variant-Driven Design with CVA
- Use `class-variance-authority` (CVA) for **every** component that has visual variants (size, state, style).
- Define variants as explicit enums: `variant`, `size`, `state`, `colorScheme`, etc.
- Always provide `defaultVariants` so components render correctly without explicit props.
- Export both the component and its variants type (e.g., `export { Button, buttonVariants }`).

```tsx
// Example pattern:
const componentVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", primary: "...", ghost: "..." },
    size: { sm: "...", md: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "md" },
})
```

### Component Contract & API Design
- **`forwardRef`**: Always wrap components with `React.forwardRef`. This enables parent refs, animations, and third-party integrations.
- **`className` merging**: Always accept a `className` prop and merge it using `cn()` (clsx + tailwind-merge). Never hardcode classes without allowing overrides.
- **Spread `...props`**: Always spread remaining HTML attributes onto the root element.
- **`displayName`**: Always set `Component.displayName = "Component"` for React DevTools.

```tsx
const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(myComponentVariants({ variant, size }), className)}
      {...props}
    />
  )
)
MyComponent.displayName = "MyComponent"
```

### Composition & Slot Patterns
- Prefer **compound components** (e.g., `Card`, `CardHeader`, `CardContent`, `CardFooter`) over monolithic props-heavy components.
- Use **children** for flexible content rather than rendering strings via props.
- Accept **icon props** as `React.ElementType` or `LucideIcon` (not JSX) for maximum flexibility.
- For optional sub-elements, accept them as **named props** (e.g., `icon`, `badge`, `action`) rather than forcing complex children.

### Naming & Prop Conventions
- **Consistent naming**: `variant`, `size`, `disabled`, `loading`, `className`
- **Event handlers**: `onValueChange`, `onSearch`, `onSelect` (not `handleChange`)
- **Boolean props**: `copyable`, `showPagination`, `loading` (affirmative names, no `isXxx` unless disambiguation is needed)
- **Data props**: Use typed interfaces for structured data (e.g., `block: BlockData` not scattered individual props)

### Dark Mode Compatibility
- **Every component must look great in both light and dark modes.**
- Use semantic color tokens from CSS variables (`bg-background`, `text-foreground`, `border-border`) rather than arbitrary Tailwind colors.
- Test both modes for contrast, readability, and visual hierarchy.
- Use `dark:` variant or CSS variable switching—never rely on a single static palette.

### File Organization
- **UI primitives**: `src/components/ui/` — Shadcn base components + generic reusables
- **Domain components**: `src/components/{domain}/` — Feature-specific compositions (e.g., `bitcoin/`, `dashboard/`)
- **Layout components**: `src/components/layout/` — Headers, footers, sidebars, page wrappers
- **One component per file** with co-located types and variants

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
