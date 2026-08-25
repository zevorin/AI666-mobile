# Mobile Typography Guideline Implementation Plan

> **For Claude:** Implement this plan task-by-task in the current clean `AI666-mobile` workspace.

**Goal:** Unify typography across the 24 mobile H5 pages, using the 11px homepage tabbar label as the hard minimum, and publish a complete interactive `UI设计规范.html` reference.

**Architecture:** Keep `mobile-design-tokens.css` as the single source of truth for type sizes, line heights, weights, and text colors. Add one final compatibility contract to `mobile-h5.css` that maps existing component selectors to semantic roles without rewriting page markup. Build the guideline as a standalone HTML file that imports the same tokens and documents both semantic roles and existing shared components.

**Tech Stack:** Static HTML, CSS custom properties, vanilla JavaScript, existing mobile H5 components and assets.

---

### Task 1: Establish the canonical type tokens

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-design-tokens.css`

**Steps:**
1. Preserve 11px as `--ds-type-min` and reserve it for tabbar and dense micro-labels.
2. Define semantic sizes for caption, meta, body, control, card title, nav title, section title, page title, hero title, and numeric display.
3. Define matching line-height, weight, tracking, and text-color aliases.
4. Verify every semantic size is at least 11px.

### Task 2: Map existing components to the type system

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-h5.css`

**Steps:**
1. Add reusable `.mobile-type-*` utility classes for future page work.
2. Add a final compatibility layer for the shared app bar, section headings, cards, body copy, captions, controls, filters, badges, tabbar, hero titles, and numeric displays.
3. Keep campaign art typography and large numeric displays as documented expressive exceptions.
4. Verify no visible component resolves below the 11px baseline.

### Task 3: Build the interactive specification page

**Files:**
- Create: `outputs/community-homepage-style-exploration/UI设计规范.html`

**Steps:**
1. Create a responsive dark editorial documentation layout matching the existing black-and-gold product language.
2. Document principles, the complete type ramp, colors, spacing, radius, controls, tabs, badges, cards, forms, navigation, states, and accessibility.
3. Include existing component class names and usage guidance, plus a 24-page coverage matrix.
4. Add copy-token controls, section navigation, and a mobile preview panel with no external dependencies.

### Task 4: Verify the implementation

**Files:**
- Inspect all `outputs/community-homepage-style-exploration/mobile-*.html`
- Inspect `outputs/community-homepage-style-exploration/UI设计规范.html`

**Steps:**
1. Run static checks for missing local assets, invalid internal anchors, duplicate IDs, and font sizes below 11px.
2. Serve the folder locally and capture the guideline at desktop and mobile widths.
3. Capture representative existing pages at 390px and inspect title, body, caption, controls, and tabbar hierarchy.
4. Re-run `git diff --check` and summarize the final file changes.
