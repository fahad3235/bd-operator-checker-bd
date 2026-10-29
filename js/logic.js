'use strict';
// Pure logic for BD Operator Checker \u2014 no DOM, unit-testable in Node.
// Prefix allocations: BTRC National Numbering Plan (see README sources).
// IMPORTANT: since MNP (2018), a prefix shows the ORIGINAL operator only.
const PREFIXES = {
  '013': { operator: 'Grameenphone', brand: 'Grameenphone', note: '' },
  '014': { operator: 'Banglalink', brand: 'Banglalink', note: '' },
  '015': { operator: 'Teletalk', brand: 'Teletalk', note: '' },
  '016': { operator: 'Robi', brand: 'Robi (formerly Airtel)', note: '' },
  '017': { operator: 'Grameenphone', brand: 'Grameenphone', note: '' },
  '018': { operator: 'Robi', brand: 'Robi', note: '' },
  '019': { operator: 'Banglalink', brand: 'Banglalink', note: '' }
};
const UNASSIGNED = {
  '010': 'spare',
  '011': 'citycell_closed',
  '012': 'spare'
};

function stripSeparators(s) {
  return String(s).replace(/[\s\-()]/g, '');
}

// Normalize any common BD mobile writing to 11-digit local form, or an error.
// Accepts: 01XXXXXXXXX, +8801XXXXXXXXX, 008801XXXXXXXXX, 8801XXXXXXXXX.
function normalize(raw) {
  if (raw === undefined || raw === null) return { ok: false, error: 'empty' };
  const cleaned = stripSeparators(String(raw).trim());
  if (!cleaned) return { ok: false, error: 'empty' };
  let digits = cleaned;
  if (digits.startsWith('+')) {
    if (!digits.startsWith('+880')) return { ok: false, error: 'not_bd' };
    digits = '0' + digits.slice(4);
  } else if (digits.startsWith('00880')) {
    digits = '0' + digits.slice(5);
  } else if (digits.startsWith('880') && digits.length === 13) {
    digits = '0' + digits.slice(3);
  }
  if (!/^[0-9]+$/.test(digits)) return { ok: false, error: 'non_digit' };
  if (digits.length !== 11) return { ok: false, error: 'bad_length' };
  if (!digits.startsWith('01')) return { ok: false, error: 'not_mobile' };
  return { ok: true, digits };
}

function formatLocal(d) { return d.slice(0, 5) + '-' + d.slice(5); }
function formatIntl(d) { return '+880 ' + d.slice(1, 5) + '-' + d.slice(5); }
function formatCompact(d) { return '+880' + d.slice(1); }

function checkNumber(raw) {
  const n = normalize(raw);
  if (!n.ok) return { ok: false, error: n.error, input: String(raw).trim() };
  const d = n.digits;
  const prefix = d.slice(0, 3);
  const base = {
    ok: true, digits: d, prefix: prefix,
    local: formatLocal(d), intl: formatIntl(d), compact: formatCompact(d)
  };
  if (PREFIXES[prefix]) {
    return Object.assign(base, {
      status: 'known', operator: PREFIXES[prefix].operator, brand: PREFIXES[prefix].brand
    });
  }
  if (UNASSIGNED[prefix]) {
    return Object.assign(base, { status: UNASSIGNED[prefix], operator: '', brand: '' });
  }
  return Object.assign(base, { status: 'unknown_prefix', operator: '', brand: '' });
}

function checkBatch(text) {
  const tokens = String(text || '').split(/[\n,;]+/).map((t) => t.trim()).filter(Boolean);
  const rows = tokens.map((t) => checkNumber(t));
  const counts = {};
  let valid = 0, invalid = 0;
  rows.forEach((r) => {
    if (r.ok && r.status === 'known') { valid++; counts[r.operator] = (counts[r.operator] || 0) + 1; }
    else invalid++;
  });
  return { rows, counts, valid, invalid, total: rows.length };
}

const BN_DIGITS = ['\u09e6', '\u09e7', '\u09e8', '\u09e9', '\u09ea', '\u09eb', '\u09ec', '\u09ed', '\u09ee', '\u09ef'];
function toBnDigits(s) {
  return String(s).replace(/[0-9]/g, (ch) => BN_DIGITS[Number(ch)]);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PREFIXES, UNASSIGNED, normalize, checkNumber, checkBatch, formatLocal, formatIntl, formatCompact, toBnDigits };
}
