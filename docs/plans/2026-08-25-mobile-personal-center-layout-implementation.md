# Mobile Personal Center Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the mobile personal center hierarchy while preserving the black-and-gold brand language and leaving the shared TabBar unchanged.

**Architecture:** Keep the existing static HTML, shared tokens, assets, navigation targets, and JavaScript behaviors. Add one page-scoped stylesheet loaded after `mobile-h5.css`, and make only the minimum markup changes needed to express the new featured-card and two-column layout.

**Tech Stack:** Static HTML5, scoped CSS, existing mobile design tokens, existing Remix Icon and 3D image assets, local browser breakpoint verification.

---

### Task 1: Preserve the approved design contract

**Files:**
- Create: `AI666-mobile/docs/plans/2026-08-25-mobile-personal-center-layout-design.md`

**Step 1:** Record the redesign mode, dial values, preserved behaviors, layout hierarchy, responsive rules, and TabBar exclusion.

**Step 2:** Verify the document explicitly states that TabBar HTML, CSS, scripts, and behavior are unchanged.

### Task 2: Restructure the personal-center content

**Files:**
- Modify: `AI666-mobile/outputs/community-homepage-style-exploration/mobile-my.html`

**Step 1:** Load a new page-scoped stylesheet after the shared stylesheet.

**Step 2:** Keep the profile, statistics, links, copy button, unread badge, and section content intact.

**Step 3:** Add layout-specific class names so the works entry spans both columns, the flash and favorites entries share the next row, and the two benefit entries form a two-column row.

**Step 4:** Confirm the `.mobile-bottom-nav` markup is byte-for-byte unchanged.

### Task 3: Implement the scoped visual system

**Files:**
- Create: `AI666-mobile/outputs/community-homepage-style-exploration/mobile-my-taste.css`

**Step 1:** Define page-scoped background, spacing, profile sizing, and frameless statistics styles using existing design tokens.

**Step 2:** Define one 14px card radius system, a full-width featured works card, paired compact content cards, and paired benefit cards.

**Step 3:** Add 360px compact overrides and 421px-plus spacious overrides without changing the TabBar.

**Step 4:** Add focus-visible, active, hover-capable, and reduced-motion states.

### Task 4: Run structural and visual verification

**Files:**
- Test: `AI666-mobile/outputs/community-homepage-style-exploration/mobile-my.html`
- Test: `AI666-mobile/outputs/community-homepage-style-exploration/mobile-my-taste.css`

**Step 1:** Run HTML/CSS reference checks and verify every referenced local asset returns HTTP 200.

**Step 2:** Render at 360x800, 390x844, and 430x932.

**Step 3:** At each width, assert `scrollWidth === innerWidth`, inspect card rectangles, and confirm the bottom navigation computed layout is unchanged.

**Step 4:** Test profile ID copy feedback and inspect console logs for errors.

**Step 5:** Run the design-taste pre-flight audit, including visible copy, accent consistency, shape consistency, touch targets, reduced motion, and zero em-dash checks.

