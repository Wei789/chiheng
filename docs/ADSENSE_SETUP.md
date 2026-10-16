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
  - 未填滿（`data-ad-status="unfilled"`）的版位會由 CSS 自動收起；版位沒有預留高度，避免版面位移（CLS）。
- 英文／簡中／日文頁面已設為 `noindex,follow`（內容單薄），並從 sitemap 與 hreflang 移除；頁面仍在線上。

---

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
3. 每個單元建立後，複製程式碼中的 `data-ad-slot="1234567890"` 數字。

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
- 若之後也開啟「自動廣告」（Auto ads），兩者可以並存；但請留意廣告不要過多，以免影響閱讀與速度。

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

- 本 repo 的根目錄就是網站根目錄，`docs/`、`README.md` 也會被公開存取。不要在這些檔案中放帳號密碼等機密。
