/* 資產再平衡計算機 — 計算邏輯沿用原型，未更動；輸入錯誤就地提示、刪除一列可復原 */
let mode = 'new';
const rowsEl = document.getElementById('r_rows');
const seed = T('seedRows');
const rowUndo = makeUndoBar(rowsEl);
let rowSeq = 0;

function addRow(n='', v='', t='', before=null) {
  const d = document.createElement('div'); d.className = 'holding-row';
  const k = ++rowSeq;
  /* 每格都有 <label>：桌機只給讀屏（上方有欄名），手機（<640px）每列變成卡片並顯示標籤 */
  d.innerHTML = `<div class="hf hf-nm"><label for="r_nm${k}">${T('phName')}</label><input class="nm" id="r_nm${k}" placeholder="${esc(T('phName'))}" value="${esc(n)}" autocomplete="off"></div>
    <div class="hf"><label for="r_v${k}">${T('phValue')}</label><input class="num v" id="r_v${k}" inputmode="decimal" placeholder="${esc(T('phValue'))}" value="${esc(v)}" autocomplete="off"></div>
    <div class="hf"><label for="r_t${k}">${T('phTarget')}</label><input class="num t" id="r_t${k}" inputmode="decimal" placeholder="${esc(T('phTarget'))}" value="${esc(t)}" autocomplete="off"></div>
    <button type="button" class="del">${T('delRow')}</button>`;
  const delBtn = d.querySelector('.del');
  const label = () => d.querySelector('.nm').value || T('unnamed');
  const syncLabel = () => delBtn.setAttribute('aria-label', tr('delRowAria', {n: label()}));
  syncLabel();
  d.querySelector('.nm').addEventListener('input', syncLabel);
  delBtn.onclick = () => {
    const next = d.nextElementSibling;
    d.remove();
    rowUndo.show(tr('rowDeleted', {n: label()}), () => { rowsEl.insertBefore(d, next && next.parentNode === rowsEl ? next : null); delBtn.focus(); });
  };
  rowsEl.insertBefore(d, before);
}
seed.forEach(s => addRow(...s));
document.getElementById('r_add').onclick = () => { addRow(); rowsEl.lastElementChild.querySelector('.nm').focus(); };

function setMode(m) {
  mode = m;
  const isNew = m === 'new';
  document.getElementById('m_new').classList.toggle('on', isNew);
  document.getElementById('m_full').classList.toggle('on', !isNew);
  document.getElementById('m_new').setAttribute('aria-pressed', String(isNew));
  document.getElementById('m_full').setAttribute('aria-pressed', String(!isNew));
  document.getElementById('cashWrap').style.display = isNew ? 'block' : 'none';
}
document.getElementById('m_new').onclick = () => setMode('new');
document.getElementById('m_full').onclick = () => setMode('full');

/* 驗證：空白視為 0；非數字或負數就地標紅框，訊息顯示在按鈕上方的提示區 */
function readRows() {
  const warn = document.getElementById('r_warn');
  let bad = 0, firstBad = null;
  const rows = [...rowsEl.querySelectorAll('.holding-row')].map(r => {
    const get = sel => {
      const el = r.querySelector(sel);
      const raw = el.value.trim();
      const v = raw === '' ? 0 : parseNum(raw);
      if (Number.isNaN(v) || v < 0) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', 'r_warn'); bad++; firstBad = firstBad || el; return 0; }
      el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby');
      return v;
    };
    return { name: r.querySelector('.nm').value || T('unnamed'), val: get('.v'), tgt: get('.t') };
  });
  return { rows, bad, firstBad, warn };
}
function showWarn(msg, focusEl) {
  const warn = document.getElementById('r_warn');
  warn.textContent = msg; warn.hidden = false;
  setAdsSuppressed(true);
  if (focusEl) focusEl.focus();
}

document.getElementById('r_run').addEventListener('click', () => {
  const warn = document.getElementById('r_warn');
  const { rows, bad, firstBad } = readRows();
  let cash = 0;
  if (mode === 'new') {
    cash = checkNumber(document.getElementById('r_cash'), 0, 1e13);
    if (cash === null) { setAdsSuppressed(true); document.getElementById('r_cash').focus(); return; }
  }
  if (bad) return showWarn(T('errNumber'), firstBad);
  const items = rows.filter(i => i.val > 0 || i.tgt > 0);
  const tsum = items.reduce((a,b) => a + b.tgt, 0);
  if (Math.abs(tsum - 100) > 0.5) {
    rowsEl.querySelectorAll('.t').forEach(el => { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', 'r_warn'); });
    return showWarn(T('warnSum').replace('{s}', +tsum.toFixed(2)), rowsEl.querySelector('.t'));
  }
  const total = items.reduce((a,b) => a + b.val, 0);
  if (total <= 0) return showWarn(T('errNoValue'), rowsEl.querySelector('.v'));
  warn.hidden = true; warn.textContent = '';
  setAdsSuppressed(false);
  let newTotal, actions;
  if (mode === 'new') {
    newTotal = total + cash;
    const need = items.map(i => Math.max(0, newTotal*i.tgt/100 - i.val));
    const needSum = need.reduce((a,b) => a + b, 0);
    actions = items.map((i,x) => needSum > 0 ? cash*need[x]/needSum : 0);
  } else {
    newTotal = total; actions = items.map(i => total*i.tgt/100 - i.val);
  }
  const moved = actions.reduce((a,b) => a + Math.abs(b), 0);
  setBigNum('r_total', total);
  setBigNum('r_after', newTotal);
  setBigNum('r_move', moved);
  document.getElementById('r_body').innerHTML = items.map((i,x) => {
    const a = actions[x], act = Math.abs(a) < 1 ? `<span style="color:var(--ink-soft)">${T('hold')}</span>` : (a > 0 ? `<span class="pos">${T('buy')} ${f0(a)}</span>` : `<span class="neg">${T('sell')} ${f0(-a)}</span>`);
    return `<tr><td>${esc(i.name)}</td><td>${f0(i.val)}</td><td>${(i.val/total*100).toFixed(1)}%</td><td>${i.tgt}%</td><td style="text-align:left">${act}</td></tr>`;
  }).join('');
  document.getElementById('r_alloc').innerHTML = items.map(i => `
    <div class="alloc-row"><span>${esc(i.name)}</span>
    <div class="bar-bg"><div class="bar-cur" style="width:${(i.val/total*100).toFixed(1)}%"></div><div class="bar-tgt" style="left:${Math.min(i.tgt, 100)}%"></div></div></div>`).join('')
    + `<p class="hint" style="margin-top:4px"><span style="color:var(--gold)">▰</span> ${T('allocCurrent')}　<span style="color:var(--pine)">▏</span> ${T('allocTarget')}</p>`;
});

/* 暫存：收集 / 套回目前組合 */
function gatherRebal(){
  return {
    mode,
    cash: document.getElementById('r_cash').value,
    rows: [...rowsEl.querySelectorAll('.holding-row')].map(r => ({
      name: r.querySelector('.nm').value, val: r.querySelector('.v').value, tgt: r.querySelector('.t').value
    }))
  };
}
function applyRebal(o){
  if (!o) return;
  setMode(o.mode === 'full' ? 'full' : 'new');
  document.getElementById('r_cash').value = o.cash || '';
  rowsEl.innerHTML = '';
  rowUndo.hide();
  (o.rows || []).forEach(r => addRow(r.name, r.val, r.tgt));
}
setMode('new');
buildStorageUI('rebal', gatherRebal, applyRebal);
