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

const getYears = () => Math.max(1, Math.min(40, Math.round(num('g_yr')) || 1));

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
    cell.innerHTML = `<label>${T('yearLabel').replace('{i}', i)}</label><input type="number" step="0.1" value="${v}">`;
    grid.appendChild(cell);
  }
  colorReturns();
}

function colorReturns() {
  document.querySelectorAll('#g_returns input').forEach(inp => {
    const upd = () => inp.classList.toggle('neg', parseFloat(inp.value) < 0);
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

/* 情境按鈕 */
document.querySelectorAll('#g_scen .chip').forEach(c => c.addEventListener('click', () => {
  document.querySelectorAll('#g_scen .chip').forEach(x => x.style.cssText = '');
  c.style.cssText = 'border-color:var(--pine);color:var(--pine);background:rgba(31,74,60,.07)';
  applyScenario(c.dataset.s);
  document.getElementById('g_realized').textContent = '';
}));

/* 隨機年化情境 */
document.getElementById('g_gen').addEventListener('click', () => {
  const target = num('g_cagr');
  fillReturns(randomReturnsForCAGR(target, getYears()));
  document.querySelectorAll('#g_scen .chip').forEach(x => x.style.cssText = '');
  document.getElementById('g_realized').innerHTML =
    T('randomDone').replace('{n}', getYears()).replace('{r}', realizedCAGR().toFixed(2)).replace('{t}', target);
});

/* 年數改變時重建格子並保留值 */
document.getElementById('g_yr').addEventListener('change', () => renderReturns(true));

/* 執行模擬 */
document.getElementById('g_run').addEventListener('click', () => {
  const p = num('g_p'), wr = num('g_wr')/100, inf = num('g_inf')/100;
  const cprT = num('g_cprT'), cprC = num('g_cprC')/100, prT = num('g_prT'), prR = num('g_prR')/100;
  const rets = [...document.querySelectorAll('#g_returns input')].map(i => (parseFloat(i.value)||0)/100);
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
  document.querySelectorAll('#g_scen .chip').forEach(x => x.style.cssText = '');
  document.getElementById('g_realized').textContent = '';
}

/* 初始化：預設選取並填入「先牛後熊」 */
document.querySelector('#g_scen .chip').click();
buildStorageUI('gk', gatherGK, applyGK);
