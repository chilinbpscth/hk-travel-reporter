# Hong Kong Travel Reporter 使用指引

## 1. 給教師

### 1.1 試用網址

打開部署網址後，學生可直接使用 mock mode。mock mode 不需要登入，也不需要 API key。

### 1.2 課前準備

1. 決定每組使用哪一個 Group number：Group 1–6。
2. 決定每組研究哪一個景點。
3. 先示範一次四個句式：
   - It is located in ...
   - It is famous for ...
   - It is worth visiting because ...
   - Visitors can ...
4. 提醒學生要自己打英文問題，不是讓 chatbot 直接代寫。

### 1.3 課堂操作

1. 學生選擇 Group number。
2. 學生選擇景點。
3. 學生閱讀 4R mini lesson。
4. 學生向 local guide 輸入英文問題。
5. 學生按 Save fact，把有用資料儲存成 fact card。
6. 學生把 fact card 拖入 Where / Features / Why Visit / Activities。
7. 四格完成後，按 Write my report。
8. 小組每人負責一格，寫一句英文。
9. 每格完成後按 Save。
10. 進入 Poster Studio，生成插圖及下載/展示海報。

### 1.4 教師引導句

可用以下提示幫學生發問：

- Where is this place?
- What is special about it?
- Why should people visit it?
- What can visitors do there?
- What useful words can I use?

如果學生問離題問題，chatbot 會引導學生回到景點資料。

### 1.5 注意事項

目前版本的進度只保存在同一部裝置。若同組學生用不同裝置，資料不會自動同步。建議第一輪試課可讓每組使用一部裝置，或由組長負責輸入。

## 2. 給學生

### Step 1：Choose your group

選擇你的組別，例如 Group 1。

### Step 2：Choose an attraction

選擇你的小組景點。

### Step 3：Read the 4R mini lesson

記住四個部分：

- Where：Where is it?
- Features：What is special?
- Why Visit：Why should people visit?
- Activities：What can visitors do?

### Step 4：Ask the local guide

在問題框輸入英文問題，例如：

- Where is this attraction?
- What is special?
- Why is it worth visiting?
- What can visitors do?

### Step 5：Save useful facts

如果 local guide 的回答有用，按 Save fact。

### Step 6：Drag your notes

把 saved fact cards 拖到正確位置：

- Where
- Features
- Why Visit
- Activities

### Step 7：Write your report

用自己的英文完成四句：

- It is located in ...
- It is famous for ...
- It is worth visiting because ...
- Visitors can ...

### Step 8：Make your poster

按 Generate illustration 生成插圖。檢查海報文字後，可以下載 PNG 或用全螢幕展示。

## 3. 本機開發

```bash
npm install
cp .env.example .env.local
npm run dev
```

打開 `http://localhost:3000`。

## 4. 測試

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

## 5. 部署

此專案可部署到支援 Next.js server routes 的平台。現有設定包含 Netlify：

```bash
netlify deploy --build
netlify deploy --build --prod
```

mock mode 不需要設定環境變數。正式接入 R’Odyssey 時，請在部署平台後台設定 `.env.example` 內列出的 backend-only variables，不要把 API key 放入前端。
