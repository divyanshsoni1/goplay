# Requirements Document

## Introduction

The Referral System adds a viral growth mechanism to the GoPlay11 user dashboard. Each authenticated user receives a unique, cryptographically random, permanent referral code. Users can share their personalised referral link (`/?ref=<CODE>`), and when a new visitor registers through that link, the referrer's count is incremented and a relationship record is persisted. The feature includes a dashboard card showing the referral link with copy/share controls, a referral history list, and complete tracking coverage across the landing-to-registration funnel. All functionality must seamlessly integrate with the existing Next.js App Router architecture, Prisma/NeonDB data layer, NextAuth v5 JWT sessions, and the project's dark-theme inline-style design system.

---

## Glossary

- **Referral_System**: The complete feature described in this document.
- **Referral_Code**: A cryptographically random, URL-safe string (minimum 12 characters) that uniquely identifies a referrer. Generated exactly once per user on first use; never regenerated.
- **Referral_Link**: The fully-qualified URL constructed as `<REFERRAL_BASE_URL>?ref=<Referral_Code>` where `REFERRAL_BASE_URL` defaults to the site root (`/`).
- **Referral_Cookie**: An HTTP cookie named `ref_code` that stores the visitor's referral code for up to 30 days (configurable via `REFERRAL_COOKIE_DAYS` env var).
- **Referral_Record**: A `Referral` database row linking a referrer `User` to a referred `User` with a `createdAt` timestamp and a `status` field.
- **Referral_Count**: The integer field `referralCount` on the `User` model tracking the number of successful referrals.
- **Successful_Referral**: A referral that completes the full funnel: visitor lands on the referral link → Referral_Cookie is stored → visitor registers a new account → Referral_Record is created → Referral_Count is incremented.
- **Dashboard**: The authenticated page at `/dashboard` displaying the user's profile and activity cards.
- **Referral_Card**: The dashboard UI component rendering the referral link, copy/share controls, referral count, and history.
- **Share_Modal**: A client-side modal providing WhatsApp, SMS, and copy fallback channels when the browser's Web Share API is unavailable.
- **Toast_Notification**: A transient, auto-dismissing status message rendered without a page reload.
- **Share_Analytics**: Optional tracking of share channel usage (copy click, WhatsApp, SMS, native share), stored separately from Referral_Count.
- **Middleware**: The Next.js Edge middleware at `middleware.ts` that runs on every request.
- **API_Response**: The standardised `{ success, data }` / `{ success, error }` shape produced by `lib/api-response.ts` helpers `ok()` and `err()`.
- **Rate_Limiter**: The sliding-window in-memory limiter in `lib/rate-limit.ts` used to throttle API endpoints.

---

## Requirements

### Requirement 1: Referral Code Generation

**User Story:** As a registered user, I want a unique referral code assigned to my account, so that I can share a personalised link that tracks sign-ups I bring in.

#### Acceptance Criteria

1. THE Referral_System SHALL generate a Referral_Code for a user lazily on the first request to `GET /api/referral`, storing it in the `referralCode` field of the User record.
2. WHEN a Referral_Code is generated, THE Referral_System SHALL use a cryptographically secure random source producing a URL-safe string of at least 12 characters.
3. WHEN a Referral_Code already exists for a user, THE Referral_System SHALL return the existing code without regenerating it.
4. THE Referral_System SHALL guarantee that every Referral_Code stored in the database is unique across all users by enforcing a unique database constraint on `User.referralCode`.
5. IF a Referral_Code generation collision occurs, THEN THE Referral_System SHALL retry generation up to 5 times before returning a server error.

---

### Requirement 2: Referral Link Construction

**User Story:** As a registered user, I want a shareable referral link displayed in my dashboard, so that I can copy or share it with potential new users.

#### Acceptance Criteria

1. WHEN a user's Referral_Code is available, THE Referral_System SHALL construct the Referral_Link as `<REFERRAL_BASE_URL>?ref=<Referral_Code>` where `REFERRAL_BASE_URL` is read from the `REFERRAL_LINK` environment variable, defaulting to the application's root URL when the variable is absent.
2. THE Referral_Card SHALL display the full Referral_Link in a read-only text field inside the Dashboard.
3. WHEN the Referral_Card mounts, THE Referral_System SHALL display a loading skeleton until the referral data response is received; WHEN cached or prefetched referral data is available, THE Referral_Card MAY display the link immediately before the full API response arrives.
4. IF the `GET /api/referral` request fails, THEN THE Referral_Card SHALL display an inline error message (and a retry button) without breaking other dashboard cards; the error SHALL always be displayed even when other dashboard functionality continues to operate normally.

---

### Requirement 3: Copy to Clipboard

**User Story:** As a registered user, I want to copy my referral link to the clipboard with one click, so that I can paste it anywhere quickly.

#### Acceptance Criteria

1. WHEN a user clicks the copy button, THE Referral_System SHALL attempt to write the Referral_Link to the system clipboard using the Clipboard API.
2. WHEN the clipboard write succeeds, THE Referral_System SHALL display a Toast_Notification with the text "✔ Link copied!" for 3 seconds, always showing this notification on a successful clipboard write regardless of any concurrent toast system issues.
3. IF the Clipboard API is unavailable or the clipboard write is rejected by the browser, THEN THE Referral_System SHALL display a Toast_Notification prompting the user to manually select and copy the link.
4. WHERE Share_Analytics is enabled via the `REFERRAL_ANALYTICS_ENABLED` environment variable, THE Referral_System SHALL record a copy-click event by incrementing the corresponding analytics counter.

---

### Requirement 4: Share Options

**User Story:** As a registered user, I want to share my referral link via WhatsApp, SMS, or the native share sheet, so that I can reach my contacts through their preferred channels.

#### Acceptance Criteria

1. WHEN a user clicks the share button and `navigator.share` is available in the browser, THE Referral_System SHALL invoke the Web Share API with the Referral_Link and a descriptive title.
2. WHEN a user clicks the share button and `navigator.share` is unavailable, THE Referral_System SHALL open the Share_Modal displaying WhatsApp, SMS, and copy-fallback options.
3. WHEN a user selects WhatsApp in the Share_Modal, THE Referral_System SHALL open `https://wa.me/?text=<encoded_message_with_Referral_Link>` in a new browser tab.
4. WHEN a user selects SMS in the Share_Modal, THE Referral_System SHALL open `sms:?body=<encoded_message_with_Referral_Link>` using the `sms:` URI scheme.
5. IF the Web Share API invocation is cancelled by the user, THEN THE Referral_System SHALL dismiss the share interaction without displaying an error.
6. WHEN the Share_Modal is open, THE Referral_System SHALL trap keyboard focus within the modal and close it when the user presses Escape, ensuring Escape closes the modal even if focus trapping encounters an error.
7. WHERE Share_Analytics is enabled, THE Referral_System SHALL record a share channel event (whatsapp, sms, or native) for each completed share action.

---

### Requirement 5: Referral Code Tracking via Cookie

**User Story:** As a site visitor arriving via a referral link, I want my referral source to be remembered during my session, so that my sign-up is correctly attributed to the referrer.

#### Acceptance Criteria

1. WHEN a visitor lands on any page with a `?ref=<code>` query parameter, THE Referral_System SHALL call `POST /api/referral/track` from the client with the code value.
2. WHEN `POST /api/referral/track` receives a valid code that exists in the database, THE Referral_System SHALL set the `ref_code` Referral_Cookie with `HttpOnly=false`, `SameSite=Lax`, `Secure` (in production), and a `Max-Age` derived from `REFERRAL_COOKIE_DAYS` (default 30 days).
3. IF the `?ref=<code>` parameter contains a code that does not exist in the database, THEN THE Referral_System SHALL respond with HTTP 422 and not set the cookie; this HTTP 422 response SHALL be returned even if a cookie is accidentally set, prioritising the code-validation feedback.
4. IF the visitor is not yet authenticated at the time of tracking, THE Referral_System SHALL set the Referral_Cookie so the visitor's subsequent registration can be attributed to the referrer; WHILE a visitor is authenticated, THE Referral_System SHALL also allow the cookie to be set (the self-referral check happens at registration time).
5. THE Referral_System SHALL validate the `?ref` parameter value against a safe-string pattern (alphanumeric and hyphens, 12–64 characters) before making any database query.
6. WHEN the Referral_Cookie is already present with a valid code, THE Referral_System SHALL NOT overwrite it with a new code on subsequent referral link visits.

---

### Requirement 6: Registration Hook — Referral Attribution

**User Story:** As a new user who registered through a referral link, I want the person who referred me to be credited automatically, so that the system correctly rewards referrers.

#### Acceptance Criteria

1. WHEN `POST /api/auth/register` creates a new user account and the request's cookie jar contains a valid `ref_code`, THE Referral_System SHALL look up the referrer User by the cookie value.
2. WHEN the referrer User is found and the new user is not the same person as the referrer, THE Referral_System SHALL create a Referral_Record linking `referrerId` and `referredUserId`, and atomically increment `referrer.referralCount` by 1 in a single database transaction.
3. WHEN the Referral_Record is successfully created, THE Referral_System SHALL set `referredById` on the new User record to the referrer's id.
4. IF the `ref_code` cookie contains a code that does not match any user, THEN THE Referral_System SHALL complete registration normally without creating a Referral_Record or modifying any counts.
5. IF the new user's email matches an existing account (registration collision), THEN THE Referral_System SHALL not create any Referral_Record and return the existing 409 conflict response.
6. IF a Referral_Record already exists for the `referredUserId` (duplicate referral attempt), THEN THE Referral_System SHALL skip creation silently and not double-increment the Referral_Count.
7. WHEN registration completes (with or without referral attribution), THE Referral_System SHALL clear the `ref_code` cookie from the response.
8. IF the referral attribution database transaction fails, THEN THE Referral_System SHALL complete user account creation (provided account creation itself succeeds) and log the attribution failure without rolling back the new user record; Referral_Record creation SHALL only be attempted after user account creation succeeds.

---

### Requirement 7: Referral Dashboard Card

**User Story:** As a registered user, I want a dedicated card on my dashboard showing my referral link and total successful referrals, so that I can monitor my referral activity at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL render the Referral_Card below the existing download card, preserving all existing cards (profile, stats, download, admin shortcut).
2. THE Referral_Card SHALL display the Referral_Link in a read-only input, a copy button, a share button, and the Referral_Count as a large bold number.
3. WHEN the Referral_Count is zero, THE Referral_Card SHALL display an encouraging empty state message below the count.
4. THE Referral_Card SHALL use inline styles consistent with the existing dark theme: background `rgba(255,255,255,0.04)`, border `rgba(255,255,255,0.08)`, accent colour `#ff5b16`, border-radius 16px.
5. THE Referral_Card SHALL be responsive: two-column layout on viewports ≥768px and single-column stacked layout on viewports <768px.
6. THE Referral_Card SHALL include ARIA labels on all interactive controls (copy button, share button) and ensure keyboard navigability with visible focus rings using the accent colour.

---

### Requirement 8: Referral History

**User Story:** As a registered user, I want to see a list of people I have referred who successfully registered, so that I can track the impact of my referrals.

#### Acceptance Criteria

1. THE Referral_Card SHALL render a Referral_History section listing Referral_Records for which the current user is the referrer, ordered newest-first.
2. WHEN displaying each Referral_Record, THE Referral_System SHALL show only the referred user's first name (first word of `name`, masked to first character + asterisks if name is absent), the registration date formatted as "DD MMM YYYY", and a status badge.
3. WHEN the referral history is empty, THE Referral_System SHALL display a message such as "No referrals yet. Share your link to get started."
4. THE Referral_System SHALL fetch referral history from `GET /api/referral/history` and return a maximum of 50 records per request to avoid N+1 queries and excessive payload sizes.
5. IF the `GET /api/referral/history` request fails, THEN THE Referral_Card SHALL display an inline error message (not the empty-state message) without breaking the rest of the Referral_Card.

---

### Requirement 9: Referral API Endpoints

**User Story:** As a developer, I want well-defined API routes for referral data, so that the frontend and backend are cleanly separated and each endpoint is independently testable.

#### Acceptance Criteria

1. THE Referral_System SHALL expose `GET /api/referral` returning `{ code, link, count }` for the authenticated user; unauthenticated requests SHALL receive HTTP 401.
2. THE Referral_System SHALL expose `GET /api/referral/history` returning an array of referral objects `{ referredUserFirstName, joinedAt, status }` for the authenticated user; unauthenticated requests SHALL receive HTTP 401.
3. THE Referral_System SHALL expose `POST /api/referral/track` accepting `{ code: string }` in the request body; this endpoint SHALL NOT require authentication.
4. WHEN any referral API endpoint receives more requests than permitted by its Rate_Limiter configuration, THE Referral_System SHALL respond with HTTP 429 and a `Retry-After` header.
5. ALL referral API responses SHALL use the existing `ok()` and `err()` helpers from `lib/api-response.ts` to produce consistent API_Response shapes.

---

### Requirement 10: Security and Validation

**User Story:** As a system operator, I want the Referral_System to be secure against abuse and injection attacks, so that referral counts cannot be gamed or manipulated.

#### Acceptance Criteria

1. THE Referral_System SHALL generate Referral_Codes using Node.js `crypto.randomBytes` or the Web Crypto API, ensuring unpredictability.
2. THE Referral_System SHALL validate all inbound referral code strings against a strict allowlist pattern (alphanumeric and hyphens, 12–64 characters) before any database lookup.
3. THE Referral_System SHALL enforce self-referral prevention: WHEN the authenticated new user's id matches the referrer's id, the Referral_System SHALL skip Referral_Record creation without error.
4. THE Referral_System SHALL perform all referral attribution logic server-side in a single atomic database transaction, never trusting client-supplied counts or IDs.
5. WHEN `POST /api/referral/track` is called, THE Referral_System SHALL apply rate limiting of 20 requests per minute per IP using the Rate_Limiter.
6. WHEN `GET /api/referral` and `GET /api/referral/history` are called, THE Referral_System SHALL apply rate limiting of 60 requests per minute per authenticated user using the Rate_Limiter, blocking all requests that exceed the limit to enforce the rate cap.

---

### Requirement 11: Database Schema Additions

**User Story:** As a developer, I want the database schema extended with referral-specific fields, so that referral relationships and counts are stored reliably and queryably.

#### Acceptance Criteria

1. THE Referral_System SHALL add three fields to the `User` model in `schema.prisma`: `referralCode String? @unique`, `referralCount Int @default(0)`, and `referredById String?` (FK to `User.id`).
2. THE Referral_System SHALL add a new `Referral` model with fields: `id String @id @default(cuid())`, `referrerId String`, `referredUserId String @unique`, `status ReferralStatus` (enum: `PENDING`, `CONFIRMED`), and `createdAt DateTime @default(now())`.
3. THE Referral_System SHALL define database indexes on `User.referralCode`, `User.referredById`, `Referral.referrerId`, and `Referral.referredUserId` to support efficient lookups.
4. THE Referral_System SHALL ensure all schema additions are additive and do not alter or remove any existing field, constraint, or index.
5. WHEN the Prisma migration is applied, THE Referral_System SHALL preserve all existing data in all existing tables.

---

### Requirement 12: Share Analytics (Optional)

**User Story:** As a product owner, I want to track how users are sharing their referral links (copy, WhatsApp, SMS, native share), so that I can optimise the sharing experience.

#### Acceptance Criteria

1. WHERE the `REFERRAL_ANALYTICS_ENABLED` environment variable is set to `"true"`, THE Referral_System SHALL increment a per-user analytics counter for each share action (copy, whatsapp, sms, native) via an optimistic server-side update.
2. WHERE Share_Analytics is enabled, THE Referral_System SHALL add a `ReferralShareAnalytics` model to `schema.prisma` with fields: `id`, `userId`, `channel` (enum: `COPY`, `WHATSAPP`, `SMS`, `NATIVE`), `createdAt`.
3. WHERE Share_Analytics is enabled, THE Referral_System SHALL expose `POST /api/referral/share-analytics` for authenticated users only, rejecting unauthenticated requests with HTTP 401, accepting `{ channel: "copy" | "whatsapp" | "sms" | "native" }`, rate-limited to 60 requests per minute per user.
4. IF Share_Analytics is disabled (env var absent or not `"true"`), THEN THE Referral_System SHALL skip all analytics writes without returning errors.

---

### Requirement 13: Accessibility and Responsive Design

**User Story:** As a user with accessibility needs, I want the Referral_Card to be fully keyboard-navigable and screen-reader-friendly, so that I can use all referral features without a mouse.

#### Acceptance Criteria

1. THE Referral_Card SHALL assign descriptive `aria-label` attributes to the copy button (`"Copy referral link"`), share button (`"Share referral link"`), and the referral link input (`"Your referral link"`).
2. WHEN a Toast_Notification appears, THE Referral_System SHALL announce it to screen readers using an ARIA live region with `aria-live="polite"`.
3. THE Share_Modal SHALL have `role="dialog"`, `aria-modal="true"`, and an `aria-labelledby` pointing to the modal's heading element.
4. WHEN the Share_Modal closes, THE Referral_System SHALL return focus to the share button that opened it.
5. THE Referral_Card SHALL display a visible focus ring on all interactive elements using `outline: 2px solid #ff5b16` whenever elements receive focus, regardless of input method (keyboard, mouse, or touch).

---

### Requirement 14: Error Handling and Resilience

**User Story:** As a registered user, I want the referral feature to degrade gracefully on network or server errors, so that failures in the referral system do not disrupt the rest of my dashboard experience.

#### Acceptance Criteria

1. IF `GET /api/referral` returns an error response, THEN THE Referral_Card SHALL display an error state with a retry button without affecting other dashboard cards; both the error display on the Referral_Card and the isolation of other cards are mandatory when the referral API fails.
2. IF the referral attribution transaction fails during registration, THEN THE Referral_System SHALL log the error using the existing `logger` utility and complete the user registration successfully.
3. WHEN a database query in any referral API route throws an unexpected exception, THE Referral_System SHALL return HTTP 500 using the `serverError()` helper and log the error via `logger`.
4. WHEN the Referral_Cookie is present but contains a malformed value, THE Referral_System SHALL ignore the cookie and proceed with registration without referral attribution.
5. IF a race condition results in a duplicate `Referral_Record` insertion (same `referredUserId`), THEN THE Referral_System SHALL handle the unique constraint violation gracefully and not increment `referralCount` twice.
