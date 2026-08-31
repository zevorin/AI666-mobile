# Mobile Design System Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Repair mobile title color and typography drift, enforce one warm-gold primary system outside activity surfaces, and rebuild the deleted mobile UI guide from the current 24-page implementation.

**Architecture:** Keep `mobile-design-tokens.css` as the semantic source of truth, use the final cascade layer in `mobile-h5-controls.css` for cross-page contracts, and retain activity-specific color variables only on activity surfaces. Rebuild `UI设计规范.html` as a standalone, responsive, local-only reference that imports production tokens and demonstrates the current components without duplicating legacy rules.

**Tech Stack:** Static HTML5, CSS custom properties, vanilla JavaScript, existing mobile H5 assets and components.

---

### Task 1: Normalize semantic tokens and font weights

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-design-tokens.css`
- Modify: production CSS modules containing literal weights `620`, `640`, `650`, `680`, or `720`

**Steps:**
1. Add explicit warm-gold primary aliases and a 24px content-title role.
2. Map literal intermediate font weights to `--ds-weight-semibold` or `--ds-weight-bold`.
3. Run `rg` and expect zero remaining production declarations using the five non-token weights.
4. Verify user changes in `mobile-h5-create.css` remain intact.

### Task 2: Repair title hierarchy and non-activity primary color

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-h5-controls.css`

**Steps:**
1. Restore `--ds-text-primary` on image/video detail titles.
2. Set image/video detail titles, the points heading “你的创作资产”, and tutorial article title to the 24px content-title role.
3. Apply the warm-gold primary variables to non-activity pages while leaving `activity`, `activity-detail`, `campaign-detail`, and `tasks` theme colors untouched.
4. Preserve disabled button styling and state colors.

### Task 3: Rebuild the interactive design guide

**Files:**
- Create: `outputs/community-homepage-style-exploration/UI设计规范.html`
- Modify: `README_设计交接.md`

**Steps:**
1. Build a responsive editorial guide using production tokens and local assets only.
2. Document foundations, color rules, activity exceptions, typography, title hierarchy, spacing, radius, buttons, tabs, cards, forms, navigation, states, accessibility, and all 24 pages.
3. Add section navigation, live phone specimen, token copy controls, and current-version metadata.
4. Update the handoff README to point to the new guide and correct the page count to 24.

### Task 4: Verify code and visuals

**Files:**
- Inspect: all `outputs/community-homepage-style-exploration/mobile-*.html`
- Inspect: `outputs/community-homepage-style-exploration/UI设计规范.html`

**Steps:**
1. Run CSS brace, JavaScript syntax, local asset, duplicate-ID, and `git diff --check` validation.
2. Serve the project locally.
3. Capture the guide at desktop and 390px mobile widths.
4. Capture points, image detail, video detail, tutorial detail, one activity page, and one ordinary form page at 390px.
5. Confirm title size/color, tokenized weight, activity exception color, non-activity warm gold, and no horizontal overflow at 360/390/430px.
6. Stop the local server and report changed files without committing.
