# Web Curation Heading Mobile Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reproduce the Web homepage featured-work heading, filter tabs, and gliding-tab animation on the mobile homepage.

**Architecture:** Keep the existing mobile feed and filtering data flow, but align the heading and tab markup with `AI666-web/index.html`. Add a mobile-scoped presentation layer that mirrors the Web tokens and keyframes, plus a small local gliding-indicator controller integrated with the existing mobile filter state.

**Tech Stack:** Static HTML, CSS, and vanilla JavaScript.

---

### Task 1: Align the mobile heading and tab markup

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-home.html`

**Step 1: Reorder the heading content**

Place `<h1><span>爆款</span>作品</h1>` before the `COMMUNITY CURATION` kicker so the semantic and visual order matches the Web homepage.

**Step 2: Align the tab taxonomy and order**

Use the Web order: 全部、短剧漫剧、文本内容、图片生成、视频生成、Prompt. Keep the existing mobile filter data attributes and add an indicator element inside the tablist.

**Step 3: Update cache keys and acceptance copy**

Bump the CSS/JS query versions and update the walkthrough text from five to six categories.

### Task 2: Port the Web visual system to mobile

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-h5.css`

**Step 1: Add the heading composition**

Mirror the Web glow, title colors, gold emphasis, English pill, spacing, and entrance keyframes with mobile-scoped selectors.

**Step 2: Add the Web tab container and chip styling**

Mirror the dark glass pill, keyline, muted copy, gold active state, and focus behavior. Preserve horizontal overflow as the responsive mobile adaptation.

**Step 3: Add the gliding indicator styling**

Use the Web transform/width/height transition timings and easing, with a `prefers-reduced-motion` fallback.

### Task 3: Add gliding-tab behavior

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-h5.js`

**Step 1: Initialize the indicator from the selected tab**

Measure the active button against the tablist and set indicator position and size custom properties.

**Step 2: Synchronize selection and animation**

Move the indicator after each filter click, on horizontal scrolling, after fonts load, and when the viewport resizes.

**Step 3: Add keyboard parity**

Support ArrowLeft, ArrowRight, Home, and End with focus transfer and activation.

### Task 4: Verify responsive behavior

**Files:**
- Test: `outputs/community-homepage-style-exploration/mobile-home.html`

**Step 1: Run static checks**

Run `git diff --check` and confirm the expected selectors, taxonomy, and cache keys.

**Step 2: Test at mobile widths**

Render at 360px, 390px, and 430px. Confirm no page-level horizontal overflow, correct heading order, all six tabs reachable, the indicator lands on the selected tab, filtering still works, and the fixed tabbar remains at the viewport bottom.

**Step 3: Test reduced motion**

Confirm the heading and indicator remain usable without transitions when reduced motion is enabled.
