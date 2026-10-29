'use strict';
const assert = require('assert');
const L = require('../js/logic.js');
let n = 0;
function eq(a, b, label) { n++; assert.deepStrictEqual(a, b, label); console.log('ok ' + n + ' - ' + label); }

// All 7 active prefixes map to the right operator
eq(L.checkNumber('01312345678').operator, 'Grameenphone', '013 -> Grameenphone');
eq(L.checkNumber('01712345678').operator, 'Grameenphone', '017 -> Grameenphone');
eq(L.checkNumber('01412345678').operator, 'Banglalink', '014 -> Banglalink');
eq(L.checkNumber('01912345678').operator, 'Banglalink', '019 -> Banglalink');
eq(L.checkNumber('01512345678').operator, 'Teletalk', '015 -> Teletalk');
eq(L.checkNumber('01612345678').operator, 'Robi', '016 -> Robi');
eq(L.checkNumber('01612345678').brand, 'Robi (formerly Airtel)', '016 brand notes ex-Airtel');
eq(L.checkNumber('01812345678').operator, 'Robi', '018 -> Robi');
// Format acceptance
eq(L.checkNumber('+8801712345678').digits, '01712345678', '+880 form normalizes');
eq(L.checkNumber('8801712345678').digits, '01712345678', '880 form normalizes');
eq(L.checkNumber('008801712345678').digits, '01712345678', '00880 form normalizes');
eq(L.checkNumber('01712-345678').digits, '01712345678', 'dashed form normalizes');
eq(L.checkNumber('017 1234 5678').digits, '01712345678', 'spaced form normalizes');
// Formats
const r = L.checkNumber('01712345678');
eq(r.local, '01712-345678', 'local format'); eq(r.intl, '+880 1712-345678', 'intl format'); eq(r.compact, '+8801712345678', 'compact format');
// Unassigned / closed / unknown
eq(L.checkNumber('01112345678').status, 'citycell_closed', '011 Citycell closed');
eq(L.checkNumber('01012345678').status, 'spare', '010 spare');
eq(L.checkNumber('01212345678').status, 'spare', '012 spare');
// Errors
eq(L.checkNumber('').error, 'empty', 'empty rejected');
eq(L.checkNumber('0171234567').error, 'bad_length', '10 digits rejected');
eq(L.checkNumber('017123456789').error, 'bad_length', '12 digits rejected');
eq(L.checkNumber('01712abc678').error, 'non_digit', 'letters rejected');
eq(L.checkNumber('+44207123456').error, 'not_bd', 'non-BD country code rejected');
eq(L.checkNumber('02123456789').error, 'not_mobile', '02 landline-style rejected');
// Batch
const b = L.checkBatch('01712345678, 01887654321\n+8801912345678\n01111111111\nbad');
eq(b.total, 5, 'batch total 5'); eq(b.valid, 3, 'batch valid 3'); eq(b.invalid, 2, 'batch invalid 2');
eq(b.counts, { Grameenphone: 1, Robi: 1, Banglalink: 1 }, 'batch operator counts');
// Bengali digits
eq(L.toBnDigits('01712'), '০১৭১২', 'Bengali digits 01712');
eq(L.toBnDigits('Price 123'), 'Price ১২৩', 'Bengali digits mixed text');
console.log('ALL ' + n + ' unit tests passed');
