# Reusable Mobile Display Heading Design

## Scope

Promote the mobile homepage featured-work heading into a shared component for primary content headings. The component applies to the homepage curation heading, ordinary first-level content section headings, and the two editorial headings on the community page.

Navigation-bar titles, form labels, card titles, dialog titles, walkthrough titles, and status/result headings remain separate semantic components. Applying the homepage display treatment to those roles would flatten hierarchy and create excessive vertical space.

## Component contract

The shared API uses `.mobile-display-heading` with two variants:

- `.mobile-display-heading--feature`: the complete homepage composition, including the 24px title, optional gold accent, 8px English kicker pill, glow, 92px stage, and entrance motion.
- `.mobile-display-heading--compact`: a first-level content-section variant that reuses the title typography, color, accent, and optional kicker but keeps the existing compact section rhythm and companion action slot.

Elements use `.mobile-display-heading__content`, `.mobile-display-heading__title`, `.mobile-display-heading__accent`, and `.mobile-display-heading__kicker`. Direct child headings remain supported in the compact variant so existing section IDs and action links do not need structural rewrites.

## Single source of truth

`mobile-display-heading.css` owns the production component. `mobile-h5.css` imports it for every mobile page, and `UI设计规范.html` links the same file for its live component specimen. The guide therefore demonstrates production styles instead of maintaining a look-alike copy.

## Accessibility and motion

Heading levels and existing `aria-labelledby` relationships stay unchanged. English kickers remain supporting text, not replacement headings. Entrance motion is restricted to the feature variant and keeps the existing reduced-motion fallback. Compact headings do not animate repeatedly down long pages.

## Verification

Validate the homepage, community, activity, campaign detail, activity detail, points, exchange, and tasks pages at 360px, 390px, and 430px. Confirm heading hierarchy, companion actions, no horizontal overflow, UI Guide parity, and no regression in the homepage filter animation.
