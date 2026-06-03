# 持衡理財 — 靜態網站

繁體中文退休／資產配置工具站。純 HTML/CSS/JS，無後端，計算全在前端。

## 檔案結構

```
index.html                  首頁
tools/gk-withdrawal/        GK 動態提領模擬器
tools/rebalance/            資產再平衡計算機
app/                        WealthPoise 下載導流頁
privacy/                    隱私權政策
about/                      關於
assets/                     style.css / common.js / gk.js / rebalance.js
sitemap.xml  robots.txt
```

## 本機預覽

絕對路徑（`/assets/...`）需要用伺服器預覽，不能直接雙擊開檔：

```
cd site
python3 -m http.server 8765
# 開 http://localhost:8765/
```

## ⚠️ 上線前：換掉佔位網域

全站用了佔位網域 `chiheng.example`（出現在 8 個檔案的 canonical / OG / sitemap / robots）。
買好真實網域後，在 site 資料夾執行（把 your-real-domain.com 換成你的網域）：

```
cd site
grep -rl "chiheng.example" . | xargs sed -i '' 's/chiheng\.example/your-real-domain.com/g'
```

執行後再 `grep -r "chiheng.example" .` 確認回傳 0 筆。

## 還沒補的素材

- `assets/og.png`：社群分享縮圖（建議 1200×630），目前 OG 標籤指向它但檔案還沒放。沒放不會壞，只是分享預覽沒圖。

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
