export const categories = ["location", "features", "value", "activities"] as const;

export type Category = (typeof categories)[number];
export type ChatCategory = Category | "off_topic";

export type Fact = {
  id: string;
  category: Category;
  text: string;
  keywords: string[];
  sourceId: string;
};

export type Source = {
  id: string;
  label: string;
  url: string;
  accessed: string;
  verified: boolean;
};

export type Attraction = {
  id: string;
  name: string;
  shortName: string;
  chineseName: string;
  district: string;
  locationLine: string;
  summary: string;
  accent: string;
  image: string;
  mapTiles: string[];
  mapPin: { x: number; y: number };
  coordinates: { lat: number; lon: number };
  transportTip: string;
  visualPrompt: string;
  statusNotice?: string;
  facts: Fact[];
  vocabulary: { word: string; meaning: string }[];
  sources: Source[];
};

export type ChatRequest = {
  sessionId: string;
  attractionId: string;
  message: string;
  shownFactIds: string[];
};

export type ChatResponse = {
  reply: string;
  category: ChatCategory;
  facts: Pick<Fact, "id" | "text" | "category">[];
};

export type ImageRequest = {
  sessionId: string;
  attractionId: string;
  selectedFactIds: string[];
};

export type ImageResponse = {
  imageUrl: string;
  generationId: string;
  remainingAttempts: number;
  provider: "mock" | "rodyssey";
};

export type ChatMessage = {
  id: string;
  role: "guide" | "student";
  text: string;
  facts?: ChatResponse["facts"];
};

export type Notes = Record<Category, Fact[]>;
export type Drafts = Record<Category, string>;

export type Stage = "welcome" | "interview" | "report" | "poster";

export type SessionState = {
  version: 1;
  sessionId: string;
  studentCode: string;
  attractionId: string;
  stage: Stage;
  messages: ChatMessage[];
  savedFacts: Fact[];
  notes: Notes;
  drafts: Drafts;
  speakingOrder: Category[];
  imageUrl: string;
  imageAttemptsUsed: number;
};
