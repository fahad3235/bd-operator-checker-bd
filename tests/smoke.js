// Headless-Chrome smoke test for bd-operator-checker-bd via raw CDP.
// Run: node tests/smoke.js [390]
'use strict';
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const MOBILE = process.argv[2] === '390';
const PORT = 9400 + (process.pid % 500);
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell';
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const errors = [];
let ws, nextId = 1;
const pending = new Map();
function send(method, params) {
  const id = nextId++;
  return new Promise((res) => { pending.set(id, { res }); ws.send(JSON.stringify({ id, method, params })); });
}
function req(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const r = http.request({ host: '127.0.0.1', port: PORT, path: urlPath, method }, (res) => {
      let d = ''; res.on('data', (c) => d += c); res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    r.on('error', reject); if (body) r.write(body); r.end();
  });
}
function ev(expr) {
  return send('Runtime.evaluate', { expression: expr, returnByValue: true }).then((r) => {
    if (r.exceptionDetails) throw new Error('eval failed: ' + expr + ' :: ' + JSON.stringify(r.exceptionDetails).slice(0, 300));
    return r.result.value;
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(cond, label, timeout) {
  timeout = timeout || 8000; const t0 = Date.now();
  while (Date.now() - t0 < timeout) { if (await cond()) return; await sleep(150); }
  throw new Error('timeout waiting for: ' + label);
}
let checks = 0;
function check(name, ok, extra) {
  checks++;
  if (!ok) throw new Error('CHECK FAILED: ' + name + (extra !== undefined ? ' :: ' + extra : ''));
  console.log('ok ' + checks + ' - ' + name);
}
async function main() {
  const prof = '/tmp/op-smoke-' + process.pid;
  const chrome = spawn(CHROME, ['--headless=new', '--no-sandbox', '--disable-gpu',
    '--window-size=' + (MOBILE ? '390,844' : '1280,900'),
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
  try {
    await waitFor(async () => (await req('GET', '/json/version').catch(() => ({ status: 0 }))).status === 200, 'debug port', 20000);
    const created = await req('PUT', '/json/new?' + encodeURIComponent(FILE));
    if (created.status !== 200) throw new Error('/json/new PUT status ' + created.status);
    const target = JSON.parse(created.body);
    ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); p.res(d.result); }
      if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push('console.error');
      if (d.method === 'Runtime.exceptionThrown') errors.push('exception: ' + JSON.stringify(d.exceptionDetails).slice(0, 200));
    };
    await send('Page.enable', {}); await send('Runtime.enable', {});
    if (MOBILE) await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: FILE });
    await waitFor(async () => (await ev('document.readyState')) === 'complete', 'page load');
    await sleep(500);
    check('title is BD Operator Checker', (await ev('document.title')) === 'BD Operator Checker');
    check('4 tabs render', (await ev('document.querySelectorAll(".tab-btn").length')) === 4);
    // Checker: GP number
    await ev('document.getElementById("number-input").value="01712345678"');
    await ev('document.getElementById("check-btn").click()');
    await sleep(300);
    check('GP result shows Grameenphone', (await ev('document.getElementById("result").textContent')).includes('Grameenphone'));
    check('formats show +880 form', (await ev('document.getElementById("formats").textContent')).includes('+8801712345678'));
    check('MNP note present', (await ev('document.getElementById("result").textContent')).includes('Portability'));
    // Invalid input
    await ev('document.getElementById("number-input").value="123"');
    await ev('document.getElementById("check-btn").click()');
    await sleep(200);
    check('short number shows inline error', (await ev('document.getElementById("result").textContent')).includes('11 digits'));
    // Prefix table: filter Robi -> 2 rows (016, 018)
    await ev('document.querySelector(\'[data-tab="table"]\').click()');
    await sleep(200);
    await ev('document.querySelector(\'[data-op="Robi"]\').click()');
    await sleep(200);
    check('Robi filter shows 2 rows', (await ev('document.querySelectorAll("#table-body tr").length')) === 2);
    await ev('document.querySelector(\'[data-op="All"]\').click()');
    await sleep(200);
    check('All filter shows 10 rows', (await ev('document.querySelectorAll("#table-body tr").length')) === 10);
    // Batch
    await ev('document.querySelector(\'[data-tab="batch"]\').click()');
    await sleep(200);
    await ev('document.getElementById("batch-input").value=["01712345678","01887654321","01111111111"].join(String.fromCharCode(10))');
    await ev('document.getElementById("batch-btn").click()');
    await sleep(300);
    check('batch shows 3 rows', (await ev('document.querySelectorAll("#batch-body tr").length')) === 3);
    check('batch summary counts 2 known', (await ev('document.getElementById("batch-summary").textContent')).includes('2'));
    // Language toggle renders Bengali title
    await ev('document.getElementById("lang-btn").click()');
    await sleep(300);
    check('BN toggle changes title', (await ev('document.title')) !== 'BD Operator Checker');
    check('BN digits render in table', (await ev('document.querySelector(\'[data-tab="table"]\').click(), document.querySelectorAll("#table-body td")[0].textContent')) !== '');
    // History persists (GP check earlier)
    await ev('document.querySelector(\'[data-tab="history"]\').click()');
    await sleep(200);
    check('history has entry', (await ev('document.querySelectorAll(".hist-row").length')) >= 1);
    if (MOBILE) {
      const ow = await ev('Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) <= 390');
      check('390px no horizontal overflow', ow);
    }
    check('zero console/page errors', errors.length === 0, errors.join(' | '));
    console.log('ALL ' + checks + ' smoke checks passed' + (MOBILE ? ' (mobile)' : ' (desktop)'));
  } finally { chrome.kill(); }
}
main().catch((e) => { console.error('SMOKE FAILED: ' + e.message); process.exit(1); });
