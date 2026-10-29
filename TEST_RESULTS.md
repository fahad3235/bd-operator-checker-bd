# Test results — bd-operator-checker-bd (2026-10-29, 18:00 slot)

## Unit tests — 31/31 passed (`node tests/test.js`)

- All 7 active prefixes map correctly: 013/017 Grameenphone, 014/019 Banglalink,
  015 Teletalk, 016/018 Robi (016 brand notes formerly Airtel).
- Format acceptance: +880, 880, 00880, dashed, and spaced forms all normalize
  to the 11-digit local form.
- Formats for 01712345678: local `01712-345678`, intl `+880 1712-345678`,
  compact `+8801712345678`.
- Unassigned: 011 citycell_closed, 010/012 spare.
- Errors: empty, 10-digit, 12-digit, letters, non-BD country code, 02 landline-style.
- Batch of 5 (3 known + Citycell + garbage): total 5, valid 3, invalid 2,
  counts {Grameenphone 1, Robi 1, Banglalink 1}.
- Bengali digits: `01712` -> Bengali digits, mixed text round-trips.

## Headless-Chrome smoke — 14/14 desktop, 15/15 mobile (`node tests/smoke.js [390]`)

Headless shell from the Playwright cache (the meta-chromium build refuses to
start in this VM: "Hatch WebGL domain policy is required"). Checks: title,
4 tabs, GP result + formats + MNP note, short-number inline error, Robi
filter = 2 rows, All filter = 10 rows, batch 3 rows with 2-known summary,
BN toggle changes title, history entry persists, 390 px no overflow,
zero console/page errors.

## Repairs

- 1 test-harness fix only: batch textarea value set via `join(...)` instead of
  a newline-containing eval string (SyntaxError in the harness, not the app).
- 0 app-logic bugs found. Sources are pure ASCII (Bengali as \uXXXX escapes
  in JS, numeric entities in HTML); verified with grep.
