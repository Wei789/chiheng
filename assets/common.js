/* 共用工具函式 + JS 產生字串的多語字典 */
const f0 = n => Math.round(n).toLocaleString('en-US');
/* 結果摘要的大數字：只在千分位逗號後換行，窄欄時不會從數字中間斷開（f0 只輸出數字、逗號與負號） */
const setBigNum = (id, n) => { document.getElementById(id).innerHTML = f0(n).replace(/,/g, ',<wbr>'); };
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
    saveTitle:'我的暫存（存在此瀏覽器）', saveBtn:'暫存目前內容', nameLabel:'暫存名稱',
    namePh:'例如：保守方案', nameRequired:'請先輸入暫存名稱。',
    savedToast:'已暫存「{n}」。', loadBtn:'載入', delBtn:'刪除', loadedToast:'已載入「{n}」。',
    emptyHint:'還沒有暫存。填好上方內容後，輸入名稱再按「暫存目前內容」。',
    deletedMsg:'已刪除「{n}」。', undoBtn:'復原', rowDeleted:'已刪除「{n}」這一列。', delRow:'刪除', delRowAria:'刪除這列：{n}',
    errNumber:'請輸入數字。', errRange:'請輸入 {min} 到 {max} 之間的數字。', errReturns:'有 {n} 格不是數字，已用紅框標出，請修正後再執行。',
    errNoValue:'請至少輸入一筆大於 0 的目前市值。', cookieUnavailable:'目前無法開啟 Cookie 設定：你所在的地區可能不需要同意訊息，或廣告服務被瀏覽器擋下。你可以在瀏覽器設定中清除本站 Cookie。', adLabel:'廣告',
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
    saveTitle:'Saved (in this browser)', saveBtn:'Save current', nameLabel:'Name',
    namePh:'e.g. Conservative plan', nameRequired:'Please enter a name first.',
    savedToast:'Saved "{n}".', loadBtn:'Load', delBtn:'Delete', loadedToast:'Loaded "{n}".',
    emptyHint:'Nothing saved yet. Fill in the form above, enter a name, then "Save current".',
    deletedMsg:'Deleted "{n}".', undoBtn:'Undo', rowDeleted:'Deleted row "{n}".', delRow:'Delete', delRowAria:'Delete row: {n}',
    errNumber:'Please enter a number.', errRange:'Please enter a number from {min} to {max}.', errReturns:'{n} cells are not numbers (outlined in red). Please fix them and run again.',
    errNoValue:'Please enter at least one current value above 0.', cookieUnavailable:'Cookie settings are not available right now: your region may not require a consent message, or ad services are blocked by your browser. You can clear this site\'s cookies in your browser settings.', adLabel:'Advertisement',
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
    saveTitle:'我的暂存（存在此浏览器）', saveBtn:'暂存当前内容', nameLabel:'暂存名称',
    namePh:'例如：保守方案', nameRequired:'请先输入暂存名称。',
    savedToast:'已暂存「{n}」。', loadBtn:'载入', delBtn:'删除', loadedToast:'已载入「{n}」。',
    emptyHint:'还没有暂存。填好上方内容后，输入名称再按「暂存当前内容」。',
    deletedMsg:'已删除「{n}」。', undoBtn:'复原', rowDeleted:'已删除「{n}」这一行。', delRow:'删除', delRowAria:'删除这一行：{n}',
    errNumber:'请输入数字。', errRange:'请输入 {min} 到 {max} 之间的数字。', errReturns:'有 {n} 格不是数字，已用红框标出，请修正后再执行。',
    errNoValue:'请至少输入一笔大于 0 的当前市值。', cookieUnavailable:'目前无法打开 Cookie 设置：你所在的地区可能不需要同意消息，或广告服务被浏览器拦截。你可以在浏览器设置中清除本站 Cookie。', adLabel:'广告',
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
    saveTitle:'保存済み（このブラウザ）', saveBtn:'現在の内容を保存', nameLabel:'保存名',
    namePh:'例：保守的プラン', nameRequired:'先に名前を入力してください。',
    savedToast:'「{n}」を保存しました。', loadBtn:'読込', delBtn:'削除', loadedToast:'「{n}」を読み込みました。',
    emptyHint:'保存はまだありません。上記を入力し、名前を付けて「現在の内容を保存」を押してください。',
    deletedMsg:'「{n}」を削除しました。', undoBtn:'元に戻す', rowDeleted:'「{n}」の行を削除しました。', delRow:'削除', delRowAria:'この行を削除：{n}',
    errNumber:'数字を入力してください。', errRange:'{min}〜{max} の数字を入力してください。', errReturns:'数字でないマスが {n} 個あります（赤枠）。修正してから実行してください。',
    errNoValue:'現在の評価額を 1 件以上（0 より大きく）入力してください。', cookieUnavailable:'現在 Cookie 設定を開けません：お住まいの地域では同意メッセージが不要か、広告サービスがブラウザにブロックされています。ブラウザ設定で本サイトの Cookie を削除できます。', adLabel:'広告',
    storageNote:'データはこの端末のブラウザにのみ保存され、アップロードされません。'
  }
};
const pageLang = () => window.LANG || ({en:'en', ja:'ja', 'zh-Hans':'zh-CN', 'zh-CN':'zh-CN'}[document.documentElement.lang]) || 'zh-TW';
const T = key => (I18N[pageLang()] || I18N['zh-TW'])[key];

/* 儲存抽象層：目前寫 localStorage；第二階段把這四個方法換成 Supabase 即可（介面不變）。 */
const Store = {
  _key: kind => 'chiheng_' + kind,
  list(kind){ try { return JSON.parse(localStorage.getItem(this._key(kind)) || '{}'); } catch(e){ return {}; } },
  save(kind, name, data){ const all = this.list(kind); all[name] = data; localStorage.setItem(this._key(kind), JSON.stringify(all)); },
  remove(kind, name){ const all = this.list(kind); delete all[name]; localStorage.setItem(this._key(kind), JSON.stringify(all)); },
  get(kind, name){ return this.list(kind)[name]; }
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tr = (key, vars = {}) => Object.keys(vars).reduce((s, k) => s.split('{' + k + '}').join(vars[k]), T(key));

/* ===== 就地錯誤提示（規範 6：錯誤提示在欄位旁，不清空已輸入內容）===== */
/* 數字欄位：允許千分位逗號與全形數字；空白或非數字回傳 NaN */
function parseNum(str){
  const s = String(str).trim().replace(/[０-９．－]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/,/g, '');
  return s === '' ? NaN : Number(s);
}
/* 在欄位下方顯示／清除錯誤；anchor 為錯誤訊息要接在誰後面（預設為欄位本身） */
function fieldError(input, msg, anchor){
  const id = (input.id || ('f' + Math.random().toString(36).slice(2))) + '_err';
  if (!input.id) input.id = id.slice(0, -4);
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.className = 'field-error'; el.id = id; el.setAttribute('role', 'alert'); el.hidden = true;
    (anchor || input).insertAdjacentElement('afterend', el);
  }
  if (msg) {
    el.textContent = msg; el.hidden = false;
    input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', id);
  } else {
    el.hidden = true; el.textContent = '';
    input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby');
  }
}
/* 驗證單一數字欄位；不合格時就地提示並回傳 null（不改動使用者輸入） */
function checkNumber(input, min, max){
  const v = parseNum(input.value);
  if (Number.isNaN(v)) { fieldError(input, T('errNumber')); return null; }
  if ((min !== undefined && v < min) || (max !== undefined && v > max)) {
    fieldError(input, tr('errRange', {min, max})); return null;
  }
  fieldError(input, null);
  return v;
}
/* 錯誤狀態時隱藏廣告（保留空間，版面不跳動）；規範 8.6 */
const setAdsSuppressed = on => document.documentElement.classList.toggle('ads-suppressed', !!on);

/* 「已刪除…［復原］」提示列：破壞性操作以復原取代彈窗確認（規範 6） */
function makeUndoBar(afterEl){
  const bar = document.createElement('div');
  bar.className = 'undo-bar'; bar.hidden = true; bar.setAttribute('role', 'status');
  bar.innerHTML = `<span></span><button type="button" class="btn ghost btn-sm">${T('undoBtn')}</button>`;
  afterEl.insertAdjacentElement('afterend', bar);
  let undoFn = null;
  bar.querySelector('button').onclick = () => { bar.hidden = true; if (undoFn) undoFn(); undoFn = null; };
  return {
    show(msg, onUndo){ bar.querySelector('span').textContent = msg; undoFn = onUndo; bar.hidden = false; },
    hide(){ bar.hidden = true; undoFn = null; }
  };
}

/* 在第一個 <section> 的結果區之後（廣告版位之前）注入「我的暫存」面板；gather() 收集目前內容，apply(obj) 套回表單 */
function buildStorageUI(kind, gather, apply){
  const mount = document.querySelector('main section');
  if (!mount) return;
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.marginTop = '1.5rem';
  panel.innerHTML = `
    <h4>${T('saveTitle')}</h4>
    <label class="hint" for="st_name" style="display:block;margin-bottom:5px">${T('nameLabel')}</label>
    <div class="save-row">
      <input class="name-input" id="st_name" maxlength="40" placeholder="${esc(T('namePh'))}" autocomplete="off">
      <button type="button" class="btn ghost btn-sm" id="st_save">${T('saveBtn')}</button>
    </div>
    <div class="realized" id="st_toast" role="status"></div>
    <div id="st_list" style="margin-top:14px"></div>
    <p class="hint" style="margin-top:10px">${T('storageNote')}</p>`;
  const adSlot = mount.querySelector(':scope > .ad-slot');
  adSlot ? mount.insertBefore(panel, adSlot) : mount.appendChild(panel);
  const listEl = panel.querySelector('#st_list');
  const nameEl = panel.querySelector('#st_name');
  const toast = panel.querySelector('#st_toast');
  const undo = makeUndoBar(listEl);

  function render(){
    const all = Store.list(kind);
    const names = Object.keys(all);
    if (!names.length){ listEl.innerHTML = `<p class="hint">${T('emptyHint')}</p>`; return; }
    listEl.innerHTML = names.map(n => `
      <div class="saved-row">
        <span class="saved-name">${esc(n)}</span>
        <button type="button" class="btn ghost btn-sm" data-load="${encodeURIComponent(n)}" aria-label="${esc(T('loadBtn') + '：' + n)}">${T('loadBtn')}</button>
        <button type="button" class="btn-del" data-del="${encodeURIComponent(n)}" aria-label="${esc(T('delBtn') + '：' + n)}">${T('delBtn')}</button>
      </div>`).join('');
    listEl.querySelectorAll('[data-load]').forEach(b => b.onclick = () => {
      const n = decodeURIComponent(b.dataset.load);
      apply(Store.get(kind, n));
      toast.textContent = tr('loadedToast', {n});
    });
    listEl.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      const n = decodeURIComponent(b.dataset.del);
      const data = Store.get(kind, n);
      Store.remove(kind, n); render();
      undo.show(tr('deletedMsg', {n}), () => { Store.save(kind, n, data); render(); });
    });
  }
  const save = () => {
    const name = nameEl.value.trim();
    if (!name) { fieldError(nameEl, T('nameRequired'), panel.querySelector('.save-row')); nameEl.focus(); return; }
    fieldError(nameEl, null);
    Store.save(kind, name, gather());
    toast.textContent = tr('savedToast', {n: name});
    nameEl.value = '';
    undo.hide();
    render();
  };
  panel.querySelector('#st_save').onclick = save;
  nameEl.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
  render();
}

/* ===== 廣告版位（規範第 8 節）=====
   只使用「手動」多媒體廣告單元；AdSense 後台的「自動廣告」（含插頁／Vignette、錨定）必須保持關閉，見 docs/ADSENSE_SETUP.md。
   總開關：ADS_ENABLED=false 時，所有 .ad-slot 維持 hidden（不顯示、不佔空間、不呼叫 adsbygoogle.push）。
   過審後：在 AdSense 建立廣告單元 → 把 ID 填進 AD_SLOTS → 改成 true。
   各版位以 <div class="ad-slot" data-ad-key="..."> 的 data-ad-key 對應下方設定；ID 空白的版位不會啟用。
   啟用時固定預留高度（CSS），未填滿或載入失敗則整塊收起；廣告出錯不影響任何功能。 */
const ADS_ENABLED = false;
const AD_SLOTS = {
  tool:       '',   // 工具頁：計算結果與「我的暫存」下方
  articleMid: '',   // 文章：內文中段
  articleEnd: ''    // 文章：內文結尾
};
const AD_LOAD_TIMEOUT = 8000; // 毫秒；逾時仍未處理（例如被擋、斷網）就收起版位

(function initAdSlots(){
  if (!ADS_ENABLED) return;
  try {
    document.querySelectorAll('.ad-slot').forEach(slot => {
      const id = AD_SLOTS[slot.dataset.adKey];
      const ins = slot.querySelector('ins.adsbygoogle');
      if (!id || !ins || ins.dataset.adsbygoogleStatus) return;
      ins.dataset.adSlot = id;
      if (!slot.querySelector('.ad-label')) {
        const label = document.createElement('div');
        label.className = 'ad-label'; label.textContent = T('adLabel');
        slot.insertBefore(label, ins);
      }
      slot.setAttribute('role', 'complementary');
      slot.setAttribute('aria-label', T('adLabel'));
      slot.hidden = false;
      const collapse = () => { slot.hidden = true; };
      /* 未填滿 → 收起（不支援 :has() 的瀏覽器也適用） */
      new MutationObserver(() => { if (ins.dataset.adStatus === 'unfilled') collapse(); })
        .observe(ins, {attributes: true, attributeFilter: ['data-ad-status']});
      /* 載入失敗（腳本被擋、斷網）→ 逾時收起 */
      setTimeout(() => { if (ins.dataset.adStatus !== 'filled') collapse(); }, AD_LOAD_TIMEOUT);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e){ collapse(); }
    });
  } catch(e){ /* 廣告出錯不得影響功能 */ }
})();

/* ===== Cookie 設定（Google 隱私權與訊息 CMP）=====
   CMP 由 AdSense 載入碼自動帶入；只有在 CMP 已載入（例如 EEA/英國/瑞士訪客）時才能重新開啟同意訊息。
   無法開啟時在頁尾就地顯示說明，不用彈窗。 */
document.querySelectorAll('.cookie-settings').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const fc = window.googlefc;
  if (fc && fc.callbackQueue && typeof fc.callbackQueue.push === 'function') {
    fc.callbackQueue.push(() => window.googlefc.showRevocationMessage());
    return;
  }
  const footer = document.querySelector('footer');
  if (!footer) return;
  let msg = footer.querySelector('.footer-msg');
  if (!msg) {
    msg = document.createElement('p');
    msg.className = 'footer-msg'; msg.setAttribute('role', 'status');
    footer.insertBefore(msg, footer.querySelector('.fl').nextSibling);
  }
  msg.textContent = T('cookieUnavailable');
  msg.hidden = false;
}));
