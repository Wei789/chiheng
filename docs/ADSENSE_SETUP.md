# AdSense 重新送審設定步驟（chihengfinance.com）

> 本文件說明程式端已完成的部分，以及你需要在 AdSense／Search Console 後台手動完成的步驟。
> 發布商 ID：`ca-pub-1805145736120420`（已寫在每頁 `<head>` 的 AdSense 載入碼與 `/ads.txt`）。

## 程式端已完成的項目

- 每個繁中頁面 `<head>` 都有 AdSense 載入碼；Google「隱私權與訊息」的同意訊息（CMP）會由這段載入碼自動帶入，**不需要也不應該**另外放自製 Cookie 橫幅或 gtag。
- 頁尾有「Cookie 設定」連結：CMP 已載入時（例如歐洲經濟區／英國／瑞士訪客），點擊會重新開啟同意訊息（`googlefc.showRevocationMessage()`）；未載入時會顯示提示，不會出錯。
- 手動廣告版位已埋好但**預設關閉**：
  - 工具頁（`/tools/gk-withdrawal/`、`/tools/rebalance/`）：計算結果下方 → 設定鍵 `tool`
  - 每篇文章：內文中段 → `articleMid`；內文結尾 → `articleEnd`
  - 總開關在 `assets/common.js`：`ADS_ENABLED = false`。關閉時版位保持 `hidden`，不顯示、不佔空間、不呼叫 `adsbygoogle.push`。
  - 開啟後，每個版位上方有一行小字「廣告」，並**固定預留高度**（廣告單元 寬 ≤336px × 高 280px，手機 300×250、桌機 336×280 都放得下），廣告載入前後版面不跳動（團隊規範 8.4）。
  - 未填滿（`data-ad-status="unfilled"`）或 8 秒內未載入（被擋、斷網）的版位會整塊收起；`adsbygoogle.push` 包在 try/catch 中，廣告出錯不影響任何工具功能。
  - 輸入有錯誤時（工具頁顯示紅字提示），廣告會隱藏但保留空間（規範 8.6：錯誤畫面不放廣告）。
  - 版位上下各留 40px，與任何按鈕、連結距離 ≥ 24px，且不在「執行模擬」「計算再平衡」主要按鈕的正上下方（工具頁的版位在「我的暫存」面板之後）。
- 英文／簡中／日文頁面已設為 `noindex,follow`（內容單薄），並從 sitemap 與 hreflang 移除；頁面仍在線上。

---

## 必守規則：自動廣告（Auto ads）一律關閉

本站依團隊《簡單體驗設計規範》第 8 節，**只使用手動放置的頁內廣告單元**。AdSense 後台的「自動廣告」會自行插入插頁、錨定與頁內廣告，可能出現在使用者輸入或按按鈕時，違反規範，所以：

1. AdSense → **廣告 → 依網站** → `chihengfinance.com` 右側的編輯（鉛筆）圖示。
2. **自動廣告** 開關保持 **關閉**。
3. 若曾經開啟過，也請確認下列格式都是關閉：
   - **插頁廣告／Vignette（插頁式）**：關閉（規範 8.1、8.2：使用者操作中不得出現插頁）。
   - **錨定廣告（Anchor，畫面頂端／底端黏住的廣告）**：關閉（會蓋住內容與按鈕，規範 8.3）。
   - **側邊錨定廣告、多重聯播、頁內廣告的自動放置**：關閉。
4. 按 **套用到網站**。之後每次在後台改設定，都要回來確認上述開關仍為關閉。

> 不要使用有聲自動播放的影片廣告格式（規範 8.6）。若 AdSense 提供「廣告格式」或「影片」相關選項，一律不開。

## 步驟 1：建立並發布「歐洲法規（GDPR）」同意訊息（必做）

1. 登入 AdSense → 左側選單 **隱私權與訊息**。
2. 在 **歐洲法規** 卡片點 **管理** →（第一次使用會要求先同意條款）→ **建立訊息**。
3. 設定：
   - **網站**：選擇 `chihengfinance.com`。
   - **語言**：預設語言建議選「中文（繁體）」，可再加「英文」。
   - **使用者同意選項**：勾選「同意」與「管理選項」；建議同時勾選「不同意」（讓使用者可一鍵拒絕）。
   - **隱私權政策網址**：`https://chihengfinance.com/privacy/`
   - 可上傳網站標誌（選填）。
4. 預覽確認後按 **發布**。
5. 回到 **隱私權與訊息 → 歐洲法規**，確認訊息狀態為「已發布」，且套用到 chihengfinance.com。

> 補充：Google 要求在歐洲經濟區、英國與瑞士放送廣告的網站使用經 Google 認證、整合 IAB TCF 的 CMP；AdSense 內建的「隱私權與訊息」即符合此要求。

## 步驟 2（選做）：美國州法規訊息

1. **隱私權與訊息 → 美國州法規 → 管理 → 建立訊息**。
2. 網站選 `chihengfinance.com`，隱私權政策網址同上，發布。
3. 這會依美國部分州的隱私法規，向當地訪客顯示「不得販售或分享我的個人資訊」的選擇退出訊息。若主要讀者在台灣，可視需要再開。

## 步驟 3：重新申請審查

1. AdSense → **網站** → 找到 `chihengfinance.com`。
2. 確認 `ads.txt` 狀態為「已授權」（檔案在 `https://chihengfinance.com/ads.txt`）。
3. 確認本次改版已部署上線（push 到 main 約 1 分鐘後生效），並先完成下方「步驟 6：Search Console」，讓 Google 抓到新內容。
4. 補上 `docs/PLACEHOLDERS.md` 列出的所有【待老闆提供：…】資訊（尤其是聯絡信箱）。**佔位文字留在頁面上，可能被審查人員視為未完成的網站。**
5. 點 **要求審查**（或「我已修正問題」後重新提交）。審查通常需要數天到數週。

## 步驟 4：過審後建立廣告單元

1. AdSense → **廣告 → 依廣告單元 → 多媒體廣告**。
2. 建立 3 個「回應式」多媒體廣告單元，建議命名：
   - `chiheng-tool-result`（工具結果下方）
   - `chiheng-article-mid`（文章中段）
   - `chiheng-article-end`（文章結尾）
3. 每個單元建立後，複製程式碼中的 `data-ad-slot="1234567890"` 數字（只需要這個數字；網頁上的版位標記已寫好，尺寸由 `assets/style.css` 的 `.ad-slot` 控制，不要再加回 `data-ad-format="auto"`／`data-full-width-responsive="true"`，否則廣告高度會變動、版面會跳）。

## 步驟 5：填入 ID、打開開關

編輯 `assets/common.js`：

```js
const ADS_ENABLED = true;          // 由 false 改為 true
const AD_SLOTS = {
  tool:       '1234567890',        // chiheng-tool-result 的 data-ad-slot
  articleMid: '2345678901',        // chiheng-article-mid
  articleEnd: '3456789012'         // chiheng-article-end
};
```

- ID 留空的版位不會啟用，可以先只開其中幾個。
- commit → push 到 main → 自動部署。
- **不要開啟「自動廣告」（Auto ads）**，理由與設定位置見上方「必守規則」。

## 步驟 6：Google Search Console

1. 進入 Search Console → 選擇網域資源 `chihengfinance.com`。
2. 左側 **Sitemap** → 輸入 `https://chihengfinance.com/sitemap.xml` → **提交**（已提交過也可以重新提交，讓 Google 盡快讀到新增的文章頁）。
3. 用頂端 **網址審查** 檢查幾個重點頁並 **要求建立索引**：
   - `https://chihengfinance.com/`
   - `https://chihengfinance.com/articles/`
   - `https://chihengfinance.com/tools/gk-withdrawal/`
   - `https://chihengfinance.com/tools/rebalance/`
4. 之後在 **網頁（索引）** 報表中，英文／簡中／日文頁面會顯示為「已由『noindex』標記排除」，這是預期中的結果。

---

## 注意

- 本 repo 的根目錄就是網站根目錄。根目錄的 `_redirects` 會把 `/docs/*`、`/README.md` 等內部檔案 302 導回首頁，但檔案仍在 GitHub repo 中，**不要在這些檔案中放帳號密碼等機密**。
