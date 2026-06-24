# Hong Kong Travel Reporter

A source-grounded English learning prototype for Primary 4–5 students.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Mock mode works without API keys.

## Student flow

1. Learn four attraction-report sentence frames.
2. Interview a local guide and save approved facts.
3. Review and categorise notes.
4. Write four original sentences and set a speaking order.
5. Generate an illustration and export an accurate A4 poster.

Progress is stored in `localStorage` under `hk-travel-reporter-session-v1`.

## R'Odyssey adapters

Set `CHAT_PROVIDER=rodyssey` and/or `IMAGE_PROVIDER=rodyssey` in `.env.local`.

The chat adapter expects a JSON response containing one category:

```json
{ "category": "location" }
```

Allowed categories are `location`, `features`, `value`, `activities`, and `off_topic`. R'Odyssey classifies the question only; approved facts are composed locally.

The image adapter sends the server-authored attraction prompt and expects:

```json
{ "imageUrl": "https://..." }
```

The returned URL must allow browser CORS for PNG export. A data URL also works. Update `src/lib/adapters/` if the production payload differs.

## Verification

```bash
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Review `src/data/attractions.ts` before classroom deployment. sky100 is currently marked with a renovation status note from its official source.
