# BD Operator Checker

Offline, bilingual (English / বাংলা) web app that identifies which Bangladeshi
mobile operator a phone number originally belonged to, from its 3-digit prefix.

## Problem

Bangladesh has four active mobile operators sharing seven number prefixes, and
since Mobile Number Portability (MNP, 2018) a number's prefix no longer
guarantees its current operator. People still ask "017 — whose number is this?"
This tool answers that question honestly: it reports the **original**
operator for a prefix, with the MNP caveat stated wherever a result appears.

## Features

1. **Single-number checker** — accepts `01XXXXXXXXX`, `+8801XXXXXXXXX`,
   `8801XXXXXXXXX`, `008801XXXXXXXXX`, plus spaces and dashes. Validates
   length, digits, and the `01` mobile start, with a specific inline error
   for each failure.
2. **Three formats + copy** — every known number is shown as local
   (`01712-345678`), international (`+880 1712-345678`), and compact
   (`+8801712345678`), each copyable.
3. **Prefix reference table** — all 10 `01X` prefixes: the 7 active ones
   (013/017 Grameenphone, 014/019 Banglalink, 015 Teletalk, 016/018 Robi),
   plus spare 010/012 and closed 011 (Citycell, 2016). Filter by operator,
   search by prefix or operator.
4. **Batch checker** — paste many numbers (lines or commas); get a per-number
   result table plus counts by operator and a not-identified count.
5. **Recent checks** — the last 10 checked numbers persist in localStorage
   (clearable). Nothing leaves the device; zero network requests.
6. **Bilingual UI** — English / বাংলা toggle, persisted, with Bengali digits
   in Bengali mode. Responsive down to 390 px.

## Prefix table (original allocations)

| Prefix | Operator | Note |
|---|---|---|
| 013 | Grameenphone | |
| 014 | Banglalink | |
| 015 | Teletalk | State-owned |
| 016 | Robi | Formerly Airtel (merged into Robi, 2016) |
| 017 | Grameenphone | |
| 018 | Robi | |
| 019 | Banglalink | |
| 010 | — | Spare, unassigned |
| 011 | Citycell | Closed in 2016 |
| 012 | — | Spare, unassigned |

Sources: BTRC National Numbering Plan (2017) as summarised on Wikipedia's
"Telephone numbers in Bangladesh", BTRC's 2018 approvals of 013 for
Grameenphone and 014 for Banglalink (The Daily Star / New Age), and the
Robi–Airtel merger (2016). MNP (2018) means a prefix identifies the original
operator only — the app states this on every result.

## Stack

Vanilla HTML/CSS/JavaScript, no build step, no dependencies, no network calls.
Pure logic lives in `js/logic.js` (importable from Node for tests); `js/app.js`
handles DOM rendering and the EN/BN dictionary.

## Run locally

Open `index.html` in any modern browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Tests

```sh
node tests/test.js        # 31 unit tests (prefix map, formats, errors, batch, digits)
node tests/smoke.js       # 14 headless-Chrome desktop checks (raw CDP)
node tests/smoke.js 390   # 15 headless-Chrome mobile checks incl. overflow
```

Test results are recorded in `TEST_RESULTS.md`.

## Limitations

- A prefix shows the **original** operator only. After MNP, the current
  serving operator may differ; the app cannot determine it offline.
- Landline numbers (e.g. Dhaka `02`) are out of scope and rejected with a
  clear message.
- No subscriber data is looked up, stored, or transmitted — this is a
  prefix reference tool, not a number directory.

## Status

Demo / personal reference tool. Not an official BTRC application. Verify
before relying on a result for anything important.
