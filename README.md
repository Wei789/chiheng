# 持衡理財 — 靜態網站

繁體中文退休／資產配置工具站。純 HTML/CSS/JS，無後端，計算全在前端。

## 檔案結構

```
index.html                  首頁
tools/                      工具總覽
tools/gk-withdrawal/        GK 動態提領模擬器（含原理、範例、FAQ）
tools/rebalance/            資產再平衡計算機（含原理、範例、FAQ）
articles/                   文章索引與 8 篇繁中長文（articles/<slug>/）
app/                        WealthPoise 下載導流頁
about/  contact/  privacy/  關於我們、聯絡方式、隱私權政策
en/  zh-cn/  ja/            其他語言（noindex,follow，不列入 sitemap）
assets/                     style.css / common.js / gk.js / rebalance.js
docs/                       ADSENSE_SETUP.md（AdSense 後台步驟）、PLACEHOLDERS.md（營運者資料填寫紀錄）、UX_AUDIT.md（體驗規範稽核）
sitemap.xml  robots.txt  ads.txt
_redirects                  Cloudflare Pages 轉址：/docs/*、/README.md 等內部檔案 302 導回首頁
```

## 內部文件不公開

網站根目錄就是 repo 根目錄，所以 `docs/`、`README.md` 原本會被公開存取。根目錄的 `_redirects`（Cloudflare Pages 專用，檔案本身不會被提供下載）把下列路徑 302 導回首頁：

```
/docs  /docs/*  /README.md  /.gitignore
```

新增其他內部檔案時，放進 `docs/` 即自動套用；放在別處就要在 `_redirects` 加一行。注意：本機用 `python3 -m http.server` 預覽時不會套用此規則。

## 本機預覽

絕對路徑（`/assets/...`）需要用伺服器預覽，不能直接雙擊開檔：

```
cd site
python3 -m http.server 8765
# 開 http://localhost:8765/
```

## 正式網域

正式網域為 **chihengfinance.com**（已套用到全站 canonical / OG / sitemap / robots）。
線上位置：GitHub `Wei789/chiheng` → Cloudflare 部署，push 到 main 會自動重新部署。

> 若日後要換網域，在 site 資料夾執行（把 NEW-DOMAIN 換成新網域）：
> `grep -rl "chihengfinance.com" . --exclude=README.md | xargs sed -i '' 's/chihengfinance\.com/NEW-DOMAIN/g'`

## 廣告與 Cookie 同意

- 廣告版位總開關：`assets/common.js` 的 `ADS_ENABLED`（預設 `false`）與 `AD_SLOTS`。只用手動頁內版位；AdSense「自動廣告」（含插頁／Vignette、錨定）必須保持關閉。
- 介面須符合團隊《簡單體驗設計規範》（字級 rem、對比 ≥ 7:1 含深色模式、點擊區 ≥ 48px、廣告規則），稽核結果見 `docs/UX_AUDIT.md`。
- Cookie 同意使用 AdSense 內建的 Google「隱私權與訊息」CMP，頁尾「Cookie 設定」可重新開啟。
- 後台設定步驟見 `docs/ADSENSE_SETUP.md`；營運者資料的填寫位置見 `docs/PLACEHOLDERS.md`。

## 部署到 Cloudflare Pages（規格第 6.4）

1. GitHub 開一個 repo，把 `site/` 內容推上去（或讓 Pages 的 Build output 指到 `site`）。
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → 選 repo。
   - 框架預設選「None / 靜態」，Build command 留空，Build output directory 填 `site`（若你把內容放在 repo 根目錄則留空）。
3. 部署完成得到 `xxx.pages.dev`，先用它驗收。
4. 買網域（Cloudflare Registrar 最省事）→ Pages 專案 → Custom domains → 輸入網域，DNS 自動設定、HTTPS 自動開啟。
5. 換掉佔位網域（見上）→ 重新 push → 自動重新部署。
6. Google Search Console 提交網域與 `sitemap.xml`。

## 第二階段（使用者變多後）

接 Supabase 做登入 + 跨裝置儲存（規格第 6.5、7.3⑤）。目前儲存邏輯尚未實作；屆時把「儲存」抽成一個函式（先寫 localStorage，再換成 Supabase）即可。
