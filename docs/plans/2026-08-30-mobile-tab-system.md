# Mobile Dual-Style Tab System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unify every mobile tab control under the approved style A or style B without changing page-specific filtering behavior.

**Architecture:** Add shared semantic tab classes to existing markup and a final shared CSS contract that overrides page-specific legacy presentation. Add one reusable vanilla-JavaScript controller for style A selection, keyboard navigation, indicator positioning, resize handling, and programmatic state changes.

**Tech Stack:** Static HTML5, shared CSS custom properties, vanilla JavaScript, existing mobile design tokens.

---

### Task 1: Classify and mark up all tab surfaces

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-home.html`
- Modify: `outputs/community-homepage-style-exploration/mobile-community.html`
- Modify: `outputs/community-homepage-style-exploration/mobile-create.html`
- Modify: `outputs/community-homepage-style-exploration/mobile-generation-history.html`
- Modify: `outputs/community-homepage-style-exploration/mobile-my-works.html`
- Modify: `outputs/community-homepage-style-exploration/mobile-messages.html`
- Modify: `outputs/community-homepage-style-exploration/mobile-my-submissions.html`
- Modify: `outputs/community-homepage-style-exploration/mobile-points-records.html`

**Steps:**
1. Add `.mobile-tabs-style-a` to every content, mode, and status tablist.
2. Add `.mobile-tabs-style-b` to the community channel tablist.
3. Normalize `role="tablist"`, `role="tab"`, `aria-selected`, and existing `aria-pressed` values.
4. Run an `rg` inventory and expect exactly eight style A tablists and one style B tablist.

### Task 2: Add the shared visual contracts

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-h5.css`

**Steps:**
1. Add the style A track, button, active, focus, indicator, scrollbar, narrow-screen, and reduced-motion rules at the end of the shared stylesheet.
2. Add the style B channel text, active underline, focus, narrow-screen, and reduced-motion rules.
3. Keep page layout rules such as sticky positioning and AIGC composer width outside the shared component.
4. Run CSS brace and selector checks; expect balanced braces and both shared classes to be referenced by markup.

### Task 3: Add shared style A interaction

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-h5.js`

**Steps:**
1. Initialize or reuse one indicator per `.mobile-tabs-style-a` tablist.
2. Synchronize `.is-active`, `aria-selected`, and `aria-pressed` on click without replacing page-specific listeners.
3. Add arrow, Home, and End navigation only when another handler has not already prevented the event.
4. Observe class and ARIA state changes so URL/hash-driven selections also move the indicator.
5. Recalculate on fonts ready, resize, and visibility changes.
6. Run `node --check`; expect no syntax errors.

### Task 4: Update the design guide and verify

**Files:**
- Modify: `outputs/community-homepage-style-exploration/UI设计规范.html`

**Steps:**
1. Replace statements that claim only one Tab exists with the approved A/B rules.
2. Run local `href/src`, duplicate-ID, ARIA-state, and `git diff --check` validation.
3. Render representative pages at 360px, 390px, and 430px: home, community, create, generation history, my works, messages, submissions, and points records.
4. Verify no overflow, clipped labels, duplicate indicators, or selection mismatches.
