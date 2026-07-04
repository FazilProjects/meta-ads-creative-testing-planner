# Design System

## Visual Direction

The interface should feel like a clean, premium marketing dashboard. It should be professional, calm, and practical rather than flashy.

The design should use:

- Light background
- Dark readable text
- Structured cards and dashboard sections
- KPI cards
- Creative angle blocks
- Testing matrix tables
- Badges and chips
- Subtle animated background glow
- Faint grid texture

## Brand Accent Colors

Use Fazil's accent colors carefully and sparingly:

- Blue: `#2563eb`
- Red: `#e23b3b`
- Yellow: `#f4b400`
- Green: `#16a34a`

These should support hierarchy and recognition. They should not dominate the full page.

## Typography

Use the system font stack for speed and GitHub Pages compatibility.

Recommended style:

- Strong hero headline
- Compact dashboard headings
- Clear form labels
- Muted helper text
- Uppercase metadata only for small labels or table headers

## Layout

Use a max-width centered dashboard shell with responsive grids.

Primary sections:

- Header and hero
- Business brief form
- KPI summary cards
- Audience planner
- Creative angle generator
- Hook and CTA panels
- Copy variations
- Testing matrix
- Budget plan and checklist

## Components

### Cards

Use cards for discrete dashboard objects such as KPI cards, angle cards, copy cards, and checklist panels.

### Forms

Form controls should be clear, spacious, and easy to tap. Labels should always remain visible.

### Tables

Tables should use a responsive scroll wrapper on smaller screens. Avoid squeezing table content until it becomes unreadable.

### Buttons

Buttons should have clear hierarchy:

- Primary action: generate or export
- Secondary action: load sample
- Ghost action: reset

## Motion

Animation should feel subtle and premium.

Allowed:

- Soft background glow movement
- Smooth hover elevation
- Minimal transitions

Required:

- Respect `prefers-reduced-motion`.
- Avoid distracting loops.
- Avoid childish or flashy motion.

## Responsive Rules

- Include the viewport meta tag.
- Use global `box-sizing: border-box`.
- Keep containers at `max-width: 100%`.
- Avoid fixed widths that break mobile.
- Stack form fields on mobile.
- Stack cards and split layouts on mobile.
- Wrap tables in horizontal scroll containers.
- Keep buttons readable and tap-friendly.
- Prevent horizontal overflow on mobile.
