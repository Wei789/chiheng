/* 共用工具函式 + JS 產生字串的多語字典 */
const f0 = n => Math.round(n).toLocaleString('en-US');
const num = id => parseFloat(document.getElementById(id).value) || 0;

/* 語言由各頁設定 window.LANG（'zh-TW' | 'en' | 'zh-CN' | 'ja'），預設繁中 */
const I18N = {
  'zh-TW': {
    yearLabel:'第 {i} 年',
    freeze:'凍漲', yearsUnit:'年', avgWithdrawPrefix:'平均年提領 ',
    randomDone:'已隨機產生 {n} 年報酬，實際年化報酬 = <b>{r}%</b>（目標 {t}%）',
    unnamed:'未命名', warnSum:'目標配置總和為 {s}%，請調整為 100%。',
    hold:'維持', buy:'買進', sell:'賣出', allocCurrent:'目前配置', allocTarget:'目標',
    phName:'名稱', phValue:'目前市值', phTarget:'目標%',
    seedRows:[['台股 ETF',620000,55],['美股 ETF',300000,35],['現金',80000,10]],
    saveTitle:'我的暫存（存在此瀏覽器）', saveBtn:'儲存目前內容', namePrompt:'為這筆命名：',
    savedToast:'已儲存', loadBtn:'載入', delBtn:'刪除',
    emptyHint:'尚無暫存。填好上方後按「儲存目前內容」。', confirmDel:'確定刪除「{n}」？',
    storageNote:'資料只存在你這台裝置的瀏覽器，不會上傳。'
  },
  'en': {
    yearLabel:'Year {i}',
    freeze:'Freeze', yearsUnit:'yrs', avgWithdrawPrefix:'Avg/yr ',
    randomDone:'Generated {n} years of returns; actual CAGR = <b>{r}%</b> (target {t}%)',
    unnamed:'Unnamed', warnSum:'Target allocation sums to {s}%. Please adjust to 100%.',
    hold:'Hold', buy:'Buy', sell:'Sell', allocCurrent:'Current', allocTarget:'Target',
    phName:'Name', phValue:'Current value', phTarget:'Target %',
    seedRows:[['TW Stock ETF',620000,55],['US Stock ETF',300000,35],['Cash',80000,10]],
    saveTitle:'Saved (in this browser)', saveBtn:'Save current', namePrompt:'Name this entry:',
    savedToast:'Saved', loadBtn:'Load', delBtn:'Delete',
    emptyHint:'Nothing saved yet. Fill in the form above, then "Save current".', confirmDel:'Delete "{n}"?',
    storageNote:'Data stays only in this device\'s browser; nothing is uploaded.'
  },
  'zh-CN': {
    yearLabel:'第 {i} 年',
    freeze:'冻涨', yearsUnit:'年', avgWithdrawPrefix:'平均年提取 ',
    randomDone:'已随机生成 {n} 年收益，实际年化收益 = <b>{r}%</b>（目标 {t}%）',
    unnamed:'未命名', warnSum:'目标配置总和为 {s}%，请调整为 100%。',
    hold:'维持', buy:'买进', sell:'卖出', allocCurrent:'当前配置', allocTarget:'目标',
    phName:'名称', phValue:'当前市值', phTarget:'目标%',
    seedRows:[['台股 ETF',620000,55],['美股 ETF',300000,35],['现金',80000,10]],
    saveTitle:'我的暂存（存在此浏览器）', saveBtn:'保存当前内容', namePrompt:'为这条命名：',
    savedToast:'已保存', loadBtn:'载入', delBtn:'删除',
    emptyHint:'尚无暂存。填好上方后按「保存当前内容」。', confirmDel:'确定删除「{n}」？',
    storageNote:'数据只存在你这台设备的浏览器，不会上传。'
  },
  'ja': {
    yearLabel:'{i}年目',
    freeze:'凍結', yearsUnit:'年', avgWithdrawPrefix:'平均年間引出 ',
    randomDone:'{n}年分のリターンを生成しました。実際の年率 = <b>{r}%</b>（目標 {t}%）',
    unnamed:'無名', warnSum:'目標配分の合計が {s}% です。100% に調整してください。',
    hold:'維持', buy:'購入', sell:'売却', allocCurrent:'現在の配分', allocTarget:'目標',
    phName:'名称', phValue:'現在の評価額', phTarget:'目標%',
    seedRows:[['台湾株 ETF',620000,55],['米国株 ETF',300000,35],['現金',80000,10]],
    saveTitle:'保存済み（このブラウザ）', saveBtn:'現在の内容を保存', namePrompt:'この項目に名前を付けてください：',
    savedToast:'保存しました', loadBtn:'読込', delBtn:'削除',
    emptyHint:'保存はまだありません。上記を入力して「現在の内容を保存」を押してください。', confirmDel:'「{n}」を削除しますか？',
    storageNote:'データはこの端末のブラウザにのみ保存され、アップロードされません。'
  }
};
const T = key => (I18N[window.LANG] || I18N['zh-TW'])[key];

/* 儲存抽象層：目前寫 localStorage；第二階段把這四個方法換成 Supabase 即可（介面不變）。 */
const Store = {
  _key: kind => 'chiheng_' + kind,
  list(kind){ try { return JSON.parse(localStorage.getItem(this._key(kind)) || '{}'); } catch(e){ return {}; } },
  save(kind, name, data){ const all = this.list(kind); all[name] = data; localStorage.setItem(this._key(kind), JSON.stringify(all)); },
  remove(kind, name){ const all = this.list(kind); delete all[name]; localStorage.setItem(this._key(kind), JSON.stringify(all)); },
  get(kind, name){ return this.list(kind)[name]; }
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* 在第一個 <section> 末端注入「我的暫存」面板；gather() 收集目前內容，apply(obj) 套回表單 */
function buildStorageUI(kind, gather, apply){
  const mount = document.querySelector('main section');
  if (!mount) return;
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.marginTop = '16px';
  panel.innerHTML = `
    <h4>${T('saveTitle')}</h4>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <button class="btn ghost btn-sm" id="st_save">${T('saveBtn')}</button>
      <span class="realized" id="st_toast"></span>
    </div>
    <div id="st_list" style="margin-top:14px"></div>
    <div style="font-size:11px;color:var(--ink-soft);margin-top:10px">${T('storageNote')}</div>`;
  mount.appendChild(panel);
  const listEl = panel.querySelector('#st_list');

  function render(){
    const all = Store.list(kind);
    const names = Object.keys(all);
    if (!names.length){ listEl.innerHTML = `<div style="font-size:12.5px;color:var(--ink-soft)">${T('emptyHint')}</div>`; return; }
    listEl.innerHTML = names.map(n => `
      <div class="saved-row">
        <span class="saved-name">${esc(n)}</span>
        <button class="btn ghost btn-sm" data-load="${encodeURIComponent(n)}">${T('loadBtn')}</button>
        <button class="btn-del" data-del="${encodeURIComponent(n)}">${T('delBtn')}</button>
      </div>`).join('');
    listEl.querySelectorAll('[data-load]').forEach(b => b.onclick = () => apply(Store.get(kind, decodeURIComponent(b.dataset.load))));
    listEl.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      const n = decodeURIComponent(b.dataset.del);
      if (confirm(T('confirmDel').replace('{n}', n))) { Store.remove(kind, n); render(); }
    });
  }
  panel.querySelector('#st_save').onclick = () => {
    const name = (prompt(T('namePrompt')) || '').trim();
    if (!name) return;
    Store.save(kind, name, gather());
    const toast = panel.querySelector('#st_toast');
    toast.textContent = T('savedToast');
    setTimeout(() => { toast.textContent = ''; }, 1800);
    render();
  };
  render();
}
