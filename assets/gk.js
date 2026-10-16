/* GK 動態提領模擬器
   參照 gk-simulator.html 設計：可逐格編輯各年報酬率、情境填入、隨機年化情境、完整摘要。 */

/* 情境產生器：回傳「百分比」陣列，依年數縮放後填入各年格子 */
const scenarioGen = {
  bull:   y => Array.from({length:y}, (_,i) => i < y/2 ? 12 : -8),
  lost:   y => Array.from({length:y}, (_,i) => [2,-5,4,-3,1][i%5]),
  crash:  y => Array.from({length:y}, (_,i) => i === 0 ? -40 : 8),
  steady: y => Array.from({length:y}, () => 6),
  zero:   y => Array.from({length:y}, () => 0)
};

const getYears = () => Math.max(1, Math.min(40, Math.round(parseNum(document.getElementById('g_yr').value)) || 1));

/* 重建各年報酬率格子；preserve=true 時保留既有輸入值 */
function renderReturns(preserve) {
  const years = getYears();
  const grid = document.getElementById('g_returns');
  const old = preserve ? [...grid.querySelectorAll('input')].map(i => i.value) : [];
  grid.innerHTML = '';
  for (let i = 1; i <= years; i++) {
    const cell = document.createElement('div');
    cell.className = 'return-cell';
    const v = old[i-1] !== undefined ? old[i-1] : 6;
    cell.innerHTML = `<label for="g_r${i}">${T('yearLabel').replace('{i}', i)}</label><input id="g_r${i}" inputmode="decimal" autocomplete="off" value="${esc(v)}">`;
    grid.appendChild(cell);
  }
  colorReturns();
}

function colorReturns() {
  document.querySelectorAll('#g_returns input').forEach(inp => {
    const upd = () => inp.classList.toggle('neg', parseNum(inp.value) < 0);
    upd();
    inp.addEventListener('input', upd);
  });
}

/* 把一組百分比填入格子 */
function fillReturns(arr) {
  renderReturns(false);
  const inputs = document.querySelectorAll('#g_returns input');
  inputs.forEach((inp, i) => { inp.value = arr[i] ?? 6; });
  colorReturns();
}

function applyScenario(name) {
  fillReturns(scenarioGen[name](getYears()));
}

/* 標準常態亂數（Box-Muller） */
function gauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v);
}

/* 隨機產生 n 年報酬，使複利後的「年化報酬」精準等於 target（百分比） */
function randomReturnsForCAGR(targetPct, n) {
  const target = targetPct / 100;
  const vol = 0.15; // 年波動度（教學用）
  let raw = [];
  for (let i = 0; i < n; i++) {
    let factor = 1 + target + gauss() * vol;
    if (factor < 0.4) factor = 0.4; // 單年最多 -60%，避免不合理
    raw.push(factor);
  }
  // 以幾何平均正規化：∏(1+r_i) = (1+target)^n
  const g = Math.exp(raw.reduce((s,f) => s + Math.log(f), 0) / n);
  const adj = (1 + target) / g;
  return raw.map(f => +((f * adj - 1) * 100).toFixed(2)); // 回傳百分比，四捨五入到 0.01%
}

/* 由目前格子值計算實際年化報酬（CAGR），用於核對 */
function realizedCAGR() {
  const rets = [...document.querySelectorAll('#g_returns input')].map(i => (parseFloat(i.value)||0)/100);
  if (!rets.length) return 0;
  const product = rets.reduce((p, r) => p * (1 + r), 1);
  return (Math.pow(product, 1/rets.length) - 1) * 100;
}

/* 情境按鈕（aria-pressed 標示目前選取，不只靠顏色） */
const clearScenario = () => document.querySelectorAll('#g_scen .chip').forEach(x => x.setAttribute('aria-pressed', 'false'));
document.querySelectorAll('#g_scen .chip').forEach(c => c.addEventListener('click', () => {
  clearScenario();
  c.setAttribute('aria-pressed', 'true');
  applyScenario(c.dataset.s);
  showReturnsError(0);
  document.getElementById('g_realized').textContent = '';
}));

/* 各年報酬格：非數字的格子標紅框，並在格子下方顯示一則說明 */
function showReturnsError(n){
  const grid = document.getElementById('g_returns');
  let el = document.getElementById('g_returns_err');
  if (!el) {
    el = document.createElement('div');
    el.className = 'field-error'; el.id = 'g_returns_err'; el.setAttribute('role', 'alert');
    grid.insertAdjacentElement('afterend', el);
  }
  el.hidden = !n;
  el.textContent = n ? tr('errReturns', {n}) : '';
}
function validReturns(){
  let bad = 0;
  document.querySelectorAll('#g_returns input').forEach(inp => {
    const v = parseNum(inp.value);
    const ok = !Number.isNaN(v) && v >= -100;
    if (ok) inp.removeAttribute('aria-invalid'); else { inp.setAttribute('aria-invalid', 'true'); bad++; }
  });
  showReturnsError(bad);
  return bad === 0;
}

/* 隨機年化情境 */
document.getElementById('g_gen').addEventListener('click', () => {
  const target = checkNumber(document.getElementById('g_cagr'), -50, 50);
  const yrsOk = checkNumber(document.getElementById('g_yr'), 1, 40);
  if (target === null || yrsOk === null) { setAdsSuppressed(true); return; }
  fillReturns(randomReturnsForCAGR(target, getYears()));
  clearScenario();
  showReturnsError(0);
  document.getElementById('g_realized').innerHTML =
    T('randomDone').replace('{n}', getYears()).replace('{r}', realizedCAGR().toFixed(2)).replace('{t}', target);
});

/* 年數改變時重建格子並保留值 */
document.getElementById('g_yr').addEventListener('change', () => {
  if (checkNumber(document.getElementById('g_yr'), 1, 40) !== null) renderReturns(true);
});

/* 執行模擬 */
/* 各欄位合理範圍；不合格時就地提示，不清空輸入、不執行 */
const GK_RULES = {g_p:[1, 1e12], g_yr:[1, 40], g_wr:[0.1, 100], g_inf:[-20, 50], g_cprT:[1, 5], g_cprC:[0, 100], g_prT:[0, 1], g_prR:[0, 100]};
document.getElementById('g_run').addEventListener('click', () => {
  const val = {};
  let ok = true, firstBad = null;
  Object.keys(GK_RULES).forEach(id => {
    const el = document.getElementById(id);
    val[id] = checkNumber(el, ...GK_RULES[id]);
    if (val[id] === null) { ok = false; firstBad = firstBad || el; }
  });
  if (ok && Math.round(val.g_yr) !== document.querySelectorAll('#g_returns input').length) renderReturns(true);
  if (!validReturns()) { ok = false; firstBad = firstBad || document.querySelector('#g_returns [aria-invalid]'); }
  if (!ok) {
    const d = firstBad && firstBad.closest('details'); if (d) d.open = true;
    if (firstBad) firstBad.focus();
    setAdsSuppressed(true);
    return;
  }
  setAdsSuppressed(false);
  const p = val.g_p, wr = val.g_wr/100, inf = val.g_inf/100;
  const cprT = val.g_cprT, cprC = val.g_cprC/100, prT = val.g_prT, prR = val.g_prR/100;
  const rets = [...document.querySelectorAll('#g_returns input')].map(i => parseNum(i.value)/100);
  const years = rets.length;

  let bal = p, prevW = p*wr, prevRet = null, triggers = 0, totalW = 0, sumWR = 0, rows = '', done = 0;
  for (let y = 0; y < years; y++) {
    const start = bal;
    if (start <= 0) break;
    const ret = rets[y];
    let proposed, wInfl, tag = [];
    if (y === 0) { proposed = p*wr; wInfl = proposed; }
    else {
      wInfl = prevW*(1+inf); proposed = wInfl;
      if (prevRet !== null && prevRet < 0 && (proposed/start) > wr) { proposed = prevW; tag.push([T('freeze'),'t-fz']); }
      if ((proposed/start) > wr*cprT) { proposed = proposed*(1-cprC); tag.push(['CPR','t-cpr']); }
      else if ((proposed/start) < wr*prT) { proposed = proposed*(1+prR); tag.push(['PR','t-pr']); }
    }
    const finalW = Math.min(proposed, start);     // 提領不超過本金（極端值防呆）
    const rate = finalW/start, end = (start-finalW)*(1+ret);
    if (tag.length) triggers++;
    totalW += finalW; sumWR += rate; done++;
    rows += `<tr><td>${y+1}</td><td>${f0(start)}</td><td>${y===0?'—':f0(wInfl)}</td><td>${f0(finalW)}</td><td>${(rate*100).toFixed(2)}%</td><td class="${ret<0?'neg':'pos'}">${ret>=0?'+':''}${(ret*100).toFixed(1)}%</td><td>${f0(end)}</td><td>${tag.map(t=>`<span class="trig ${t[1]}">${t[0]}</span>`).join('')||'—'}</td></tr>`;
    prevW = finalW; prevRet = ret; bal = end < 0 ? 0 : end;
  }

  const avgWR = done ? sumWR/done*100 : 0;
  document.getElementById('g_body').innerHTML = rows;
  document.getElementById('g_end').textContent = f0(bal);
  document.getElementById('g_tot').textContent = f0(totalW);
  document.getElementById('g_avgwr').textContent = avgWR.toFixed(2)+'%';
  document.getElementById('g_avgw').textContent = T('avgWithdrawPrefix')+f0(done?totalW/done:0);
  document.getElementById('g_tri').textContent = triggers+' '+T('yearsUnit');
});

/* 暫存：收集 / 套回目前情境 */
const GK_IDS = ['g_p','g_yr','g_wr','g_inf','g_cprT','g_cprC','g_prT','g_prR'];
function gatherGK(){
  const o = {};
  GK_IDS.forEach(id => o[id] = document.getElementById(id).value);
  o.returns = [...document.querySelectorAll('#g_returns input')].map(i => i.value);
  return o;
}
function applyGK(o){
  if (!o) return;
  GK_IDS.forEach(id => { if (o[id] !== undefined) document.getElementById(id).value = o[id]; });
  if (o.returns) fillReturns(o.returns.map(Number));
  clearScenario();
  document.getElementById('g_realized').textContent = '';
}

/* 初始化：預設選取並填入「先牛後熊」 */
document.querySelector('#g_scen .chip').click();
buildStorageUI('gk', gatherGK, applyGK);
