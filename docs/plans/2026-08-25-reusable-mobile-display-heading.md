# Reusable Mobile Display Heading Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the mobile homepage featured heading into a shared component documented in the UI Guide and reused by every primary mobile content-section heading.

**Architecture:** Add one production component stylesheet imported by the existing mobile bundle and linked directly by the UI Guide. Keep a feature variant for the homepage and a compact variant for other first-level content sections; preserve navigation, form, card, dialog, and status title components.

**Tech Stack:** Static HTML, shared CSS, existing vanilla JavaScript runtime.

---

### Task 1: Add the shared heading stylesheet

**Files:**
- Create: `outputs/community-homepage-style-exploration/mobile-display-heading.css`
- Modify: `outputs/community-homepage-style-exploration/mobile-h5.css`

**Steps:**
1. Define the base element API and feature/compact variants.
2. Move the homepage heading visuals and keyframes into the shared API.
3. Import the component after the shared token import.
4. Preserve reduced-motion behavior and existing content action slots.

### Task 2: Migrate production markup

**Files:**
- Modify: `outputs/community-homepage-style-exploration/mobile-home.html`
- Modify: `outputs/community-homepage-style-exploration/mobile-community.html`
- Modify: all mobile pages containing `.mobile-section-heading`

**Steps:**
1. Apply the feature component API to the homepage heading.
2. Apply the compact component API to community editorial headings.
3. Apply the compact component API to every `.mobile-section-heading` instance.
4. Preserve heading levels, IDs, counts, action links, and data attributes.

### Task 3: Document the live component in the UI Guide

**Files:**
- Modify: `outputs/community-homepage-style-exploration/UI设计规范.html`

**Steps:**
1. Link the production component stylesheet.
2. Add feature and compact specimens to the components section.
3. Document markup, variants, content rules, and excluded title roles.
4. Update the component registry to reference the shared API.

### Task 4: Verify coverage and regressions

**Files:**
- Test: `outputs/community-homepage-style-exploration/*.html`

**Steps:**
1. Verify every `.mobile-section-heading` also declares the compact component.
2. Run HTML/CSS static checks and `git diff --check`.
3. Render representative pages at 360px, 390px, and 430px.
4. Confirm no horizontal overflow, hierarchy regressions, console errors, or homepage tab-animation regression.
