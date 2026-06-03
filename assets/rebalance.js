/* 資產再平衡計算機 — 計算邏輯沿用原型，未更動 */
let mode = 'new';
const rowsEl = document.getElementById('r_rows');
const seed = [['台股 ETF',620000,55],['美股 ETF',300000,35],['現金',80000,10]];

function addRow(n='', v='', t='') {
  const d = document.createElement('div'); d.className = 'holding-row';
  d.innerHTML = `<input class="nm" placeholder="名稱" value="${n}">
    <input class="num v" placeholder="目前市值" value="${v}">
    <input class="num t" placeholder="目標%" value="${t}">
    <button class="del">×</button>`;
  d.querySelector('.del').onclick = () => d.remove();
  rowsEl.appendChild(d);
}
seed.forEach(s => addRow(...s));
document.getElementById('r_add').onclick = () => addRow();
document.getElementById('m_new').onclick = () => { mode='new'; document.getElementById('m_new').classList.add('on'); document.getElementById('m_full').classList.remove('on'); document.getElementById('cashWrap').style.display='block'; };
document.getElementById('m_full').onclick = () => { mode='full'; document.getElementById('m_full').classList.add('on'); document.getElementById('m_new').classList.remove('on'); document.getElementById('cashWrap').style.display='none'; };

document.getElementById('r_run').addEventListener('click', () => {
  const items = [...rowsEl.querySelectorAll('.holding-row')].map(r => ({
    name: r.querySelector('.nm').value || '未命名',
    val: parseFloat(r.querySelector('.v').value) || 0,
    tgt: parseFloat(r.querySelector('.t').value) || 0
  })).filter(i => i.val > 0 || i.tgt > 0);
  const warn = document.getElementById('r_warn');
  const tsum = items.reduce((a,b) => a + b.tgt, 0);
  if (Math.abs(tsum - 100) > 0.5) { warn.style.display='block'; warn.textContent = `目標配置總和為 ${tsum}%，請調整為 100%。`; return; }
  warn.style.display = 'none';
  const total = items.reduce((a,b) => a + b.val, 0);
  let newTotal, actions;
  if (mode === 'new') {
    const cash = num('r_cash'); newTotal = total + cash;
    const need = items.map(i => Math.max(0, newTotal*i.tgt/100 - i.val));
    const needSum = need.reduce((a,b) => a + b, 0);
    actions = items.map((i,x) => needSum > 0 ? cash*need[x]/needSum : 0);
  } else {
    newTotal = total; actions = items.map(i => total*i.tgt/100 - i.val);
  }
  const moved = actions.reduce((a,b) => a + Math.abs(b), 0);
  document.getElementById('r_total').textContent = f0(total);
  document.getElementById('r_after').textContent = f0(newTotal);
  document.getElementById('r_move').textContent = f0(moved);
  document.getElementById('r_body').innerHTML = items.map((i,x) => {
    const a = actions[x], act = Math.abs(a) < 1 ? '<span style="color:var(--ink-soft)">維持</span>' : (a > 0 ? `<span class="pos">買進 ${f0(a)}</span>` : `<span class="neg">賣出 ${f0(-a)}</span>`);
    return `<tr><td>${i.name}</td><td>${f0(i.val)}</td><td>${(i.val/total*100).toFixed(1)}%</td><td>${i.tgt}%</td><td style="text-align:left">${act}</td></tr>`;
  }).join('');
  document.getElementById('r_alloc').innerHTML = items.map(i => `
    <div class="alloc-row"><span>${i.name}</span>
    <div class="bar-bg"><div class="bar-cur" style="width:${(i.val/total*100).toFixed(1)}%"></div><div class="bar-tgt" style="left:${i.tgt}%"></div></div></div>`).join('')
    + `<div style="font-size:11px;color:var(--ink-soft);margin-top:4px"><span style="color:var(--gold)">▰</span> 目前配置　<span style="color:var(--pine)">▏</span> 目標</div>`;
});
