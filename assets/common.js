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
    seedRows:[['台股 ETF',620000,55],['美股 ETF',300000,35],['現金',80000,10]]
  },
  'en': {
    yearLabel:'Year {i}',
    freeze:'Freeze', yearsUnit:'yrs', avgWithdrawPrefix:'Avg/yr ',
    randomDone:'Generated {n} years of returns; actual CAGR = <b>{r}%</b> (target {t}%)',
    unnamed:'Unnamed', warnSum:'Target allocation sums to {s}%. Please adjust to 100%.',
    hold:'Hold', buy:'Buy', sell:'Sell', allocCurrent:'Current', allocTarget:'Target',
    phName:'Name', phValue:'Current value', phTarget:'Target %',
    seedRows:[['TW Stock ETF',620000,55],['US Stock ETF',300000,35],['Cash',80000,10]]
  },
  'zh-CN': {
    yearLabel:'第 {i} 年',
    freeze:'冻涨', yearsUnit:'年', avgWithdrawPrefix:'平均年提取 ',
    randomDone:'已随机生成 {n} 年收益，实际年化收益 = <b>{r}%</b>（目标 {t}%）',
    unnamed:'未命名', warnSum:'目标配置总和为 {s}%，请调整为 100%。',
    hold:'维持', buy:'买进', sell:'卖出', allocCurrent:'当前配置', allocTarget:'目标',
    phName:'名称', phValue:'当前市值', phTarget:'目标%',
    seedRows:[['台股 ETF',620000,55],['美股 ETF',300000,35],['现金',80000,10]]
  },
  'ja': {
    yearLabel:'{i}年目',
    freeze:'凍結', yearsUnit:'年', avgWithdrawPrefix:'平均年間引出 ',
    randomDone:'{n}年分のリターンを生成しました。実際の年率 = <b>{r}%</b>（目標 {t}%）',
    unnamed:'無名', warnSum:'目標配分の合計が {s}% です。100% に調整してください。',
    hold:'維持', buy:'購入', sell:'売却', allocCurrent:'現在の配分', allocTarget:'目標',
    phName:'名称', phValue:'現在の評価額', phTarget:'目標%',
    seedRows:[['台湾株 ETF',620000,55],['米国株 ETF',300000,35],['現金',80000,10]]
  }
};
const T = key => (I18N[window.LANG] || I18N['zh-TW'])[key];
