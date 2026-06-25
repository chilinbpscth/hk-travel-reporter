# Hong Kong Travel Reporter 規劃指引

## 1. 教學定位

Hong Kong Travel Reporter 是一個小四至小五英文學習試作版。學生以小組身份訪問一位「香港本地嚮導」chatbot，從核准資料中抽取景點資料，整理成四個 4R notes，再寫成四句英文介紹，最後生成 A4 景點海報。

核心目的不是讓 chatbot 代寫，而是讓學生練習：

1. 用英文發問。
2. 從回答中找出有用資料。
3. 把資料分類。
4. 用句式把資料重寫成自己的介紹句。
5. 用 First, Second, Next, Finally 作口頭匯報。

## 2. 建議課堂流程

建議應用部分安排 15–20 分鐘，另加教師引入及小組分享。

| 時間 | 活動 | 教師重點 |
| --- | --- | --- |
| 3–5 分鐘 | 課堂引入 | 示範介紹景點要回答 Where / Features / Why Visit / Activities。 |
| 2–3 分鐘 | 4R mini lesson | Read, Research, Record, Report；講解四個 sentence frames。 |
| 5–7 分鐘 | Interview local guide | 學生自己輸入英文問題，不按預設問題。 |
| 3–5 分鐘 | Drag notes | 把 saved fact cards 拖入四個分類。 |
| 5 分鐘 | Newsroom writing | 小組每人負責一格，寫一句英文。 |
| 3–5 分鐘 | Poster studio | 生成景點插圖，檢查文字及下載/展示海報。 |
| 5–10 分鐘 | Group sharing | 用 First / Second / Next / Finally 匯報。 |

## 3. 學習設計

### 3.1 4R 框架

- Read：閱讀 mini lesson 的句式。
- Research：向 local guide 發問。
- Record：save fact cards，再拖入正確分類。
- Report：用自己的英文句子完成海報。

### 3.2 目標句式

- It is located in ...
- It is famous for ...
- It is worth visiting because ...
- Visitors can ...

### 3.3 Chatbot 邊界

Chatbot 只應根據教師核准資料回答，不應補充資料庫外內容。現在的 mock adapter 只做問題分類，實際 fact sentence 由後端根據 `src/data/attractions.ts` 組合。

正式接入 R’Odyssey 時，模型只負責判斷問題屬於哪一類：

- `location`
- `features`
- `value`
- `activities`
- `off_topic`

模型不應自行生成新景點事實。

## 4. 內容資料規格

每個景點資料應包括：

- 英文名稱、中文名稱、地區、簡介。
- Where / Features / Why Visit / Activities 四類 facts。
- 小四程度 useful words 及簡短解釋。
- source URL、查閱日期、教師核實狀態。
- 核准座標、地區及交通提示。
- image generation visual prompt。

新增景點時，先更新 `src/data/attractions.ts`，再跑完整測試。

## 5. 圖像生成規格

圖片生成只負責「無文字、無地圖、無 logo」的景點主插圖。海報文字、標題、地圖及交通資訊全部由 HTML/CSS 準確排版，避免 AI 圖像生成錯字或錯地圖。

正式 image API prompt 應由後端根據核准景點資料產生，不直接使用學生自由文字。

## 6. 協作及同步限制

目前試作版使用 `localStorage` 儲存進度。這代表：

- 同一部裝置 refresh 後可恢復。
- 不需要登入。
- 不會跨裝置同步。

如果課堂要做到「Group 1 不同學生在不同裝置 refresh 都看到同一份內容」，下一版需要加入 shared backend store，例如：

- group session table
- notes API
- drafts API
- optimistic update / refresh sync
- 教師 reset group session 功能

## 7. 下一版建議

優先次序建議如下：

1. 加 shared group session，支援同組多裝置同步。
2. 加 teacher dashboard，讓教師預設景點、清除 session、查看完成情況。
3. 加更多香港景點資料，但每個景點先做教師核實。
4. 接入正式 R’Odyssey Chat API。
5. 接入正式 image generation API。
6. 加 classroom mode：一鍵開新課堂、產生 group join link。

## 8. 驗收準則

試課前應確認：

- 學生不能未完成四類 notes 就進入 report。
- Chatbot 不會提供資料庫外 facts。
- 最終海報文字來自學生在 Newsroom 的輸入。
- AI 圖只作插圖，不含英文文字或地圖。
- 1024×768 及 1280×720 裝置可正常操作。
- 一般小四至小五學生可於 15–20 分鐘完成應用部分。
