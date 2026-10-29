'use strict';
/* BD Operator Checker UI: checker, formats, prefix table, batch, history. */
const I18N = {
  en: {
    title: 'BD Operator Checker', tagline: 'Which operator does a Bangladeshi mobile number belong to?',
    checkTab: 'Check a number', tableTab: 'Prefix table', batchTab: 'Batch check', historyTab: 'Recent',
    numberLabel: 'Mobile number', numberPh: 'e.g. 01712345678 or +8801712345678',
    checkBtn: 'Check', clearBtn: 'Clear', copyBtn: 'Copy', copied: 'Copied!',
    resultTitle: 'Result', originalOp: 'Original operator (by prefix)',
    mnpNote: 'Since Mobile Number Portability (MNP, 2018), a number may have moved to another operator. The prefix shows the original operator only \u2014 confirm the current operator with the operator if it matters.',
    formatsTitle: 'Same number, three formats', localFmt: 'Local', intlFmt: 'International', compactFmt: 'Compact',
    err_empty: 'Please enter a mobile number.', err_not_bd: 'This does not look like a Bangladeshi number. Use 01XXXXXXXXX or +8801XXXXXXXXX.',
    err_non_digit: 'Only digits (plus an optional +880) are allowed.', err_bad_length: 'A Bangladeshi mobile number has 11 digits (01 + 9 digits).',
    err_not_mobile: 'This does not start with 01, so it is not a Bangladeshi mobile number.',
    status_spare: 'Prefix not assigned', status_citycell_closed: 'Citycell \u2014 closed in 2016',
    status_unknown_prefix: 'Unknown prefix', spareNote: 'This prefix is spare in the numbering plan and is not assigned to an active mobile operator.',
    citycellNote: 'Citycell used the 011 series and closed in 2016. Numbers starting 011 are no longer active mobile numbers.',
    unknownNote: 'This 01X prefix is not in the current mobile allocation table.',
    tableTitle: 'All mobile prefixes', tableSub: 'Tap an operator chip to filter. Only the 7 active prefixes belong to operating networks.',
    filterAll: 'All', searchPh: 'Search prefix or operator\u2026', prefixCol: 'Prefix', operatorCol: 'Operator', brandCol: 'Brand / note', countCol: 'Count',
    batchLabel: 'Paste numbers (one per line, or comma-separated)', batchPh: '01712345678\n01887654321\n+8801912345678',
    batchBtn: 'Check all', batchEmpty: 'Paste at least one number.', batchSummary: 'checked', batchValid: 'known operator', batchInvalid: 'not identified',
    batchNumCol: 'Number', batchResultCol: 'Result', batchEmptyState: 'No numbers checked yet.',
    histTitle: 'Recent checks', histEmpty: 'No checks yet. Results you check appear here.', histClear: 'Clear history',
    footer: 'Offline tool. Prefix = original allocation only (MNP may differ). Not an official BTRC app \u2014 verify before relying on a result.',
    langBtn: '\u09ac\u09be\u0982\u09b2\u09be'
  },
  bn: {
    title: '\u09ac\u09bf\u09a1\u09bf \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0 \u099a\u09c7\u0995\u09be\u09b0', tagline: '\u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6\u09bf \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0\u099f\u09bf \u0995\u09cb\u09a8 \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0\u09c7\u09b0?',
    checkTab: '\u09a8\u09ae\u09cd\u09ac\u09b0 \u09af\u09be\u099a\u09be\u0987', tableTab: '\u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8 \u09a4\u09be\u09b2\u09bf\u0995\u09be', batchTab: '\u098f\u0995\u09b8\u09be\u09a5\u09c7 \u09af\u09be\u099a\u09be\u0987', historyTab: '\u09b8\u09be\u09ae\u09cd\u09aa\u09cd\u09b0\u09a4\u09bf\u0995',
    numberLabel: '\u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0', numberPh: '\u09af\u09c7\u09ae\u09a8 01712345678 \u0985\u09a5\u09ac\u09be +8801712345678',
    checkBtn: '\u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09c1\u09a8', clearBtn: '\u09ae\u09c1\u099b\u09c1\u09a8', copyBtn: '\u0995\u09aa\u09bf', copied: '\u0995\u09aa\u09bf \u09b9\u09af\u09bc\u09c7\u099b\u09c7!',
    resultTitle: '\u09ab\u09b2\u09be\u09ab\u09b2', originalOp: '\u09ae\u09c2\u09b2 \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0 (\u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8 \u0985\u09a8\u09c1\u09af\u09be\u09af\u09bc\u09c0)',
    mnpNote: '\u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0 \u09aa\u09cb\u09b0\u09cd\u099f\u09c7\u09ac\u09bf\u09b2\u09bf\u099f\u09bf (\u098f\u09ae\u098f\u09a8\u09aa\u09bf, \u09e8\u09e6\u09e7\u09ee) \u099a\u09be\u09b2\u09c1\u09b0 \u09aa\u09b0 \u09a8\u09ae\u09cd\u09ac\u09b0 \u0985\u09a8\u09cd\u09af \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0\u09c7 \u099a\u09b2\u09c7 \u09af\u09c7\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u0964 \u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8 \u09b6\u09c1\u09a7\u09c1 \u09ae\u09c2\u09b2 \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0 \u09a6\u09c7\u0996\u09be\u09af\u09bc \u2014 \u09aa\u09cd\u09b0\u09af\u09bc\u09cb\u099c\u09a8\u09c7 \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0\u09c7\u09b0 \u0995\u09be\u099b\u09c7 \u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8 \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0 \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09c1\u09a8\u0964',
    formatsTitle: '\u098f\u0995\u0987 \u09a8\u09ae\u09cd\u09ac\u09b0, \u09a4\u09bf\u09a8\u099f\u09bf \u09ab\u09b0\u09ae\u09cd\u09af\u09be\u099f', localFmt: '\u09a6\u09c7\u09b6\u09c0\u09af\u09bc', intlFmt: '\u0986\u09a8\u09cd\u09a4\u09b0\u09cd\u099c\u09be\u09a4\u09bf\u0995', compactFmt: '\u09b8\u0982\u0995\u09cd\u09b7\u09bf\u09aa\u09cd\u09a4',
    err_empty: '\u098f\u0995\u099f\u09bf \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0 \u09b2\u09bf\u0996\u09c1\u09a8\u0964', err_not_bd: '\u098f\u099f\u09bf \u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6\u09bf \u09a8\u09ae\u09cd\u09ac\u09b0 \u09ae\u09a8\u09c7 \u09b9\u099a\u09cd\u099b\u09c7 \u09a8\u09be\u0964 01XXXXXXXXX \u0985\u09a5\u09ac\u09be +8801XXXXXXXXX \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c1\u09a8\u0964',
    err_non_digit: '\u09b6\u09c1\u09a7\u09c1 \u09b8\u0982\u0996\u09cd\u09af\u09be (\u098f\u09ac\u0982 \u09aa\u09cd\u09b0\u09af\u09bc\u09cb\u099c\u09a8\u09c7 +880) \u09a6\u09c7\u0993\u09af\u09bc\u09be \u09af\u09be\u09ac\u09c7\u0964', err_bad_length: '\u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6\u09bf \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0\u09c7 \u09e7\u09e7\u099f\u09bf \u09b8\u0982\u0996\u09cd\u09af\u09be \u09a5\u09be\u0995\u09c7 (01 + \u09ef\u099f\u09bf \u09b8\u0982\u0996\u09cd\u09af\u09be)\u0964',
    err_not_mobile: '\u098f\u099f\u09bf 01 \u09a6\u09bf\u09af\u09bc\u09c7 \u09b6\u09c1\u09b0\u09c1 \u09b9\u09af\u09bc \u09a8\u09be, \u09a4\u09be\u0987 \u098f\u099f\u09bf \u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6\u09bf \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0 \u09a8\u09af\u09bc\u0964',
    status_spare: '\u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8 \u09ac\u09b0\u09be\u09a6\u09cd\u09a6 \u09a8\u09c7\u0987', status_citycell_closed: '\u09b8\u09bf\u099f\u09bf\u09b8\u09c7\u09b2 \u2014 \u09e8\u09e6\u09e7\u09ec \u09b8\u09be\u09b2\u09c7 \u09ac\u09a8\u09cd\u09a7',
    status_unknown_prefix: '\u0985\u099c\u09be\u09a8\u09be \u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8', spareNote: '\u098f\u0987 \u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8\u099f\u09bf \u09a8\u09ae\u09cd\u09ac\u09b0 \u09aa\u09b0\u09bf\u0995\u09b2\u09cd\u09aa\u09a8\u09be\u09af\u09bc \u09ab\u09be\u0981\u0995\u09be \u0986\u099b\u09c7; \u0995\u09cb\u09a8\u09cb \u09b8\u0995\u09cd\u09b0\u09bf\u09af\u09bc \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0\u09c7\u09b0 \u09a8\u09af\u09bc\u0964',
    citycellNote: '\u09b8\u09bf\u099f\u09bf\u09b8\u09c7\u09b2 011 \u09b8\u09bf\u09b0\u09bf\u099c \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09a4 \u098f\u09ac\u0982 \u09e8\u09e6\u09e7\u09ec \u09b8\u09be\u09b2\u09c7 \u09ac\u09a8\u09cd\u09a7 \u09b9\u09af\u09bc\u09c7 \u09af\u09be\u09af\u09bc\u0964 011 \u09a6\u09bf\u09af\u09bc\u09c7 \u09b6\u09c1\u09b0\u09c1 \u09b9\u0993\u09af\u09bc\u09be \u09a8\u09ae\u09cd\u09ac\u09b0 \u0986\u09b0 \u09b8\u0995\u09cd\u09b0\u09bf\u09af\u09bc \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0 \u09a8\u09af\u09bc\u0964',
    unknownNote: '\u098f\u0987 01X \u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8\u099f\u09bf \u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8 \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09ac\u09b0\u09be\u09a6\u09cd\u09a6 \u09a4\u09be\u09b2\u09bf\u0995\u09be\u09af\u09bc \u09a8\u09c7\u0987\u0964',
    tableTitle: '\u09b8\u09ac \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8', tableSub: '\u09ab\u09bf\u09b2\u09cd\u099f\u09be\u09b0 \u0995\u09b0\u09a4\u09c7 \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0 \u099a\u09bf\u09aa\u09c7 \u099f\u09cd\u09af\u09be\u09aa \u0995\u09b0\u09c1\u09a8\u0964 \u09b6\u09c1\u09a7\u09c1 \u09ed\u099f\u09bf \u09b8\u0995\u09cd\u09b0\u09bf\u09af\u09bc \u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8\u0987 \u099a\u09be\u09b2\u09c1 \u09a8\u09c7\u099f\u0993\u09af\u09bc\u09be\u09b0\u09cd\u0995\u09c7\u09b0\u0964',
    filterAll: '\u09b8\u09ac', searchPh: '\u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8 \u09ac\u09be \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0 \u0996\u09c1\u0981\u099c\u09c1\u09a8\u2026', prefixCol: '\u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8', operatorCol: '\u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0', brandCol: '\u09ac\u09cd\u09b0\u09cd\u09af\u09be\u09a8\u09cd\u09a1 / \u09ae\u09a8\u09cd\u09a4\u09ac\u09cd\u09af', countCol: '\u09b8\u0982\u0996\u09cd\u09af\u09be',
    batchLabel: '\u09a8\u09ae\u09cd\u09ac\u09b0\u0997\u09c1\u09b2\u09cb \u09aa\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09c1\u09a8 (\u09aa\u09cd\u09b0\u09a4\u09bf \u09b2\u09be\u0987\u09a8\u09c7 \u098f\u0995\u099f\u09bf, \u0985\u09a5\u09ac\u09be \u0995\u09ae\u09be \u09a6\u09bf\u09af\u09bc\u09c7)', batchPh: '01712345678\n01887654321\n+8801912345678',
    batchBtn: '\u09b8\u09ac \u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09c1\u09a8', batchEmpty: '\u0995\u09ae\u09aa\u0995\u09cd\u09b7\u09c7 \u098f\u0995\u099f\u09bf \u09a8\u09ae\u09cd\u09ac\u09b0 \u09aa\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09c1\u09a8\u0964', batchSummary: '\u099f\u09bf \u09af\u09be\u099a\u09be\u0987 \u09b9\u09af\u09bc\u09c7\u099b\u09c7', batchValid: '\u099f\u09bf\u09b0 \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0 \u099c\u09be\u09a8\u09be', batchInvalid: '\u099f\u09bf \u09b6\u09a8\u09be\u0995\u09cd\u09a4 \u09b9\u09af\u09bc\u09a8\u09bf',
    batchNumCol: '\u09a8\u09ae\u09cd\u09ac\u09b0', batchResultCol: '\u09ab\u09b2\u09be\u09ab\u09b2', batchEmptyState: '\u098f\u0996\u09a8\u09cb \u0995\u09cb\u09a8\u09cb \u09a8\u09ae\u09cd\u09ac\u09b0 \u09af\u09be\u099a\u09be\u0987 \u09b9\u09af\u09bc\u09a8\u09bf\u0964',
    histTitle: '\u09b8\u09be\u09ae\u09cd\u09aa\u09cd\u09b0\u09a4\u09bf\u0995 \u09af\u09be\u099a\u09be\u0987', histEmpty: '\u098f\u0996\u09a8\u09cb \u0995\u09bf\u099b\u09c1 \u09a8\u09c7\u0987\u0964 \u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09be \u09ab\u09b2\u09be\u09ab\u09b2 \u098f\u0996\u09be\u09a8\u09c7 \u09a6\u09c7\u0996\u09be \u09af\u09be\u09ac\u09c7\u0964', histClear: '\u0987\u09a4\u09bf\u09b9\u09be\u09b8 \u09ae\u09c1\u099b\u09c1\u09a8',
    footer: '\u0985\u09ab\u09b2\u09be\u0987\u09a8 \u099f\u09c1\u09b2\u0964 \u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8 \u09b6\u09c1\u09a7\u09c1 \u09ae\u09c2\u09b2 \u09ac\u09b0\u09be\u09a6\u09cd\u09a6 \u09a6\u09c7\u0996\u09be\u09af\u09bc (\u098f\u09ae\u098f\u09a8\u09aa\u09bf\u09a4\u09c7 \u09ad\u09bf\u09a8\u09cd\u09a8 \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7)\u0964 \u098f\u099f\u09bf \u09ac\u09bf\u099f\u09bf\u0986\u09b0\u09b8\u09bf\u09b0 \u0985\u09ab\u09bf\u09b8\u09bf\u09af\u09bc\u09be\u09b2 \u0985\u09cd\u09af\u09be\u09aa \u09a8\u09af\u09bc \u2014 \u09a8\u09bf\u09b0\u09cd\u09ad\u09b0 \u0995\u09b0\u09be\u09b0 \u0986\u0997\u09c7 \u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09c1\u09a8\u0964',
    langBtn: 'English'
  }
};
const OP_COLORS = { Grameenphone: '#0071bc', Robi: '#e40000', Banglalink: '#f26522', Teletalk: '#006837' };
const LS_LANG = 'bd-op-lang', LS_HIST = 'bd-op-hist';
let lang = localStorage.getItem(LS_LANG) || 'en';
let tab = 'check';
let tableFilter = 'All', tableQuery = '';

function t(k) { return I18N[lang][k]; }
function fmt(s) { return lang === 'bn' ? toBnDigits(s) : s; }
function hist() { try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch (e) { return []; } }
function pushHist(r) {
  const h = hist().filter((x) => x.digits !== r.digits);
  h.unshift({ digits: r.digits, operator: r.operator || '', status: r.status, ts: Date.now() });
  localStorage.setItem(LS_HIST, JSON.stringify(h.slice(0, 10)));
}
function opBadge(op) {
  const c = OP_COLORS[op] || '#666';
  return '<span class="badge" style="background:' + c + '">' + op + '</span>';
}
function resultHTML(r) {
  if (!r.ok) return '<div class="error" role="alert">' + t('err_' + r.error) + '</div>';
  if (r.status === 'known') {
    return '<div class="result-card"><div class="big">' + fmt(r.local) + '</div>' +
      '<div>' + t('originalOp') + ': ' + opBadge(r.operator) + ' <b>' + r.brand + '</b></div>' +
      '<div class="muted">Prefix ' + fmt(r.prefix) + '</div>' +
      '<div class="note">' + t('mnpNote') + '</div></div>';
  }
  const key = r.status === 'spare' ? 'spareNote' : (r.status === 'citycell_closed' ? 'citycellNote' : 'unknownNote');
  return '<div class="result-card"><div class="big">' + fmt(r.local) + '</div>' +
    '<div><b>' + t('status_' + r.status) + '</b> \u2014 ' + fmt(r.prefix) + '</div>' +
    '<div class="note">' + t(key) + '</div></div>';
}
function formatsHTML(r) {
  if (!r.ok || r.status !== 'known') return '';
  const rows = [[t('localFmt'), r.local], [t('intlFmt'), r.intl], [t('compactFmt'), r.compact]];
  return '<h3>' + t('formatsTitle') + '</h3><div class="fmt-list">' + rows.map((row) =>
    '<div class="fmt-row"><span>' + row[0] + ': <b>' + fmt(row[1]) + '</b></span>' +
    '<button class="copy-btn" data-copy="' + row[1] + '">' + t('copyBtn') + '</button></div>').join('') + '</div>';
}
function renderTable() {
  const q = tableQuery.trim().toLowerCase();
  const rows = Object.keys(PREFIXES).sort().map((p) => ({ p, o: PREFIXES[p] })).concat(
    Object.keys(UNASSIGNED).sort().map((p) => ({ p, o: null, un: UNASSIGNED[p] })));
  const filtered = rows.filter((r) => {
    if (tableFilter !== 'All' && (!r.o || r.o.operator !== tableFilter)) return false;
    if (q && !(r.p.includes(q) || (r.o && (r.o.operator.toLowerCase().includes(q) || r.o.brand.toLowerCase().includes(q))))) return false;
    return true;
  });
  document.getElementById('table-body').innerHTML = filtered.map((r) => r.o
    ? '<tr><td><b>' + fmt(r.p) + '</b></td><td>' + opBadge(r.o.operator) + '</td><td>' + r.o.brand + '</td></tr>'
    : '<tr class="dim"><td><b>' + fmt(r.p) + '</b></td><td>' + t('status_' + r.un) + '</td><td>' + (r.un === 'citycell_closed' ? t('citycellNote') : t('spareNote')) + '</td></tr>'
  ).join('') || '<tr><td colspan="3">\u2014</td></tr>';
  document.getElementById('table-count').textContent = fmt(String(filtered.length));
}
function renderHistory() {
  const h = hist();
  document.getElementById('hist-body').innerHTML = h.length ? h.map((x) =>
    '<div class="hist-row"><span><b>' + fmt(x.digits.slice(0, 5) + '-' + x.digits.slice(5)) + '</b></span>' +
    '<span>' + (x.status === 'known' ? opBadge(x.operator) : t('status_' + x.status)) + '</span></div>').join('')
    : '<div class="empty">' + t('histEmpty') + '</div>';
}
function render() {
  document.title = t('title');
  document.getElementById('app-title').textContent = t('title');
  document.getElementById('tagline').textContent = t('tagline');
  document.getElementById('lang-btn').textContent = t('langBtn');
  document.querySelectorAll('.tab-btn').forEach((b) => {
    b.textContent = t(b.dataset.tab + 'Tab');
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  document.querySelectorAll('.panel').forEach((p) => p.classList.toggle('hidden', p.id !== 'panel-' + tab));
  document.getElementById('number-label').textContent = t('numberLabel');
  document.getElementById('number-input').placeholder = t('numberPh');
  document.getElementById('check-btn').textContent = t('checkBtn');
  document.getElementById('clear-btn').textContent = t('clearBtn');
  document.getElementById('table-title').textContent = t('tableTitle');
  document.getElementById('table-sub').textContent = t('tableSub');
  document.getElementById('table-search').placeholder = t('searchPh');
  document.getElementById('th-prefix').textContent = t('prefixCol');
  document.getElementById('th-operator').textContent = t('operatorCol');
  document.getElementById('th-brand').textContent = t('brandCol');
  document.getElementById('batch-label').textContent = t('batchLabel');
  document.getElementById('batch-input').placeholder = t('batchPh');
  document.getElementById('batch-btn').textContent = t('batchBtn');
  document.getElementById('th-bnum').textContent = t('batchNumCol');
  document.getElementById('th-bresult').textContent = t('batchResultCol');
  document.getElementById('hist-title').textContent = t('histTitle');
  document.getElementById('hist-clear').textContent = t('histClear');
  document.getElementById('footer').textContent = t('footer');
  document.getElementById('filter-all').textContent = t('filterAll');
  renderTable(); renderHistory();
  const last = window.__lastResult;
  if (last) { document.getElementById('result').innerHTML = resultHTML(last); document.getElementById('formats').innerHTML = formatsHTML(last); }
}
document.addEventListener('click', (e) => {
  const cp = e.target.closest('[data-copy]');
  if (cp) { navigator.clipboard.writeText(cp.dataset.copy).then(() => { cp.textContent = t('copied'); }); }
});
document.getElementById('lang-btn').addEventListener('click', () => {
  lang = lang === 'en' ? 'bn' : 'en'; localStorage.setItem(LS_LANG, lang); render();
});
document.querySelectorAll('.tab-btn').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; render(); }));
document.querySelectorAll('.filter-chip').forEach((b) => b.addEventListener('click', () => {
  tableFilter = b.dataset.op;
  document.querySelectorAll('.filter-chip').forEach((x) => x.classList.toggle('active', x === b));
  renderTable();
}));
document.getElementById('table-search').addEventListener('input', (e) => { tableQuery = e.target.value; renderTable(); });
function doCheck() {
  const r = checkNumber(document.getElementById('number-input').value);
  window.__lastResult = r;
  document.getElementById('result').innerHTML = resultHTML(r);
  document.getElementById('formats').innerHTML = formatsHTML(r);
  if (r.ok) pushHist(r); renderHistory();
}
document.getElementById('check-btn').addEventListener('click', doCheck);
document.getElementById('number-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') doCheck(); });
document.getElementById('clear-btn').addEventListener('click', () => {
  document.getElementById('number-input').value = ''; window.__lastResult = null;
  document.getElementById('result').innerHTML = ''; document.getElementById('formats').innerHTML = '';
});
document.getElementById('batch-btn').addEventListener('click', () => {
  const text = document.getElementById('batch-input').value;
  if (!text.trim()) { document.getElementById('batch-summary').innerHTML = '<div class="error">' + t('batchEmpty') + '</div>'; return; }
  const b = checkBatch(text);
  document.getElementById('batch-summary').innerHTML =
    fmt(String(b.total)) + ' ' + t('batchSummary') + ' \u00b7 ' + fmt(String(b.valid)) + ' ' + t('batchValid') + ' \u00b7 ' + fmt(String(b.invalid)) + ' ' + t('batchInvalid');
  document.getElementById('batch-body').innerHTML = b.rows.map((r) => '<tr><td>' + (r.ok ? fmt(r.local) : r.input) + '</td><td>' +
    (r.ok && r.status === 'known' ? opBadge(r.operator) : (r.ok ? t('status_' + r.status) : t('err_' + r.error))) + '</td></tr>').join('');
});
document.getElementById('hist-clear').addEventListener('click', () => { localStorage.removeItem(LS_HIST); renderHistory(); });
render();
