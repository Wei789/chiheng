# 營運者資料（原【待老闆提供：…】）— 已全部填寫

所有佔位文字皆已依網站負責人提供的資料替換完成（2026-10-16）。目前對外頁面沒有任何 `【待老闆提供：…】`。

## 提供的資料

| 項目 | 內容 |
|---|---|
| 聯絡信箱 | revok117@hotmail.com |
| 營運者 | 持衡理財團隊／Chiheng Finance Team／持衡理财团队／持衡理財チーム |
| 簡介（繁中原文） | 持衡理財團隊相信，好的退休規劃不該複雜。我們把專業的提領與資產配置方法做成免費、免註冊的工具，讓每個人都能自己算清楚。 |
| 專業背景／證照 | 不適用，整段已刪除 |
| 所在地 | 不適用，整段已刪除 |

## 填寫位置

| 位置 | 內容 |
|---|---|
| `contact/index.html` | 「聯絡管道」：信箱連結＋營運者「持衡理財團隊」 |
| `about/index.html` | 「網站營運者」：營運者、簡介、信箱（連到聯絡方式頁）；刪除專業背景、所在地 |
| `en/about/`、`zh-cn/about/`、`ja/about/` | 新增「Site operator／网站运营者／運営者」段落（`id="contact"`）：營運者、簡介譯文、信箱。這三個語言原本沒有聯絡頁或聯絡連結，所以不另建聯絡頁 |
| `privacy/`、`en/privacy/`、`zh-cn/privacy/`、`ja/privacy/` | 「你的權利與聯絡方式」段落加上信箱連結 |
| en／zh-cn／ja 全部頁面頁尾 | 新增「Contact／联系我们／お問い合わせ」連到該語言 about 頁的 `#contact`（繁中頁尾原本就有「聯絡方式」） |
| `articles/*/index.html` JSON-LD | `author`（Organization）改為「持衡理財團隊」、連到 /about/；`publisher` 加上 `contactPoint`（連到 /contact/）。JSON-LD 不放信箱明文，避免被爬蟲收集 |

## 信箱的寫法

HTML 不出現完整信箱，只寫：

```html
<a class="email-link" data-user="revok117" data-domain="hotmail.com"></a><noscript>revok117 [at] hotmail.com</noscript>
```

`assets/nav.js`（全站都有載入）在頁面載入後組成 `mailto:` 連結並填入文字；沒有 JS 時顯示 noscript 的「revok117 [at] hotmail.com」。`.email-link` 樣式在 `assets/style.css`，觸控區至少 48px。

## 檢查是否有遺漏

```
grep -rniE --exclude-dir=.git --exclude-dir=docs "待老闆提供|待提供|【[^】]*】" .
```

沒有輸出即代表全部完成。廣告的 `data-ad-slot=""` 是刻意留空的設定值（見 `docs/ADSENSE_SETUP.md`），廣告區塊預設 `hidden`，不會顯示任何文字。
