import type { Attraction, Category } from "@/lib/types";

const accessed = "2026-06-24";

export const categoryLabels: Record<Category, { title: string; short: string; question: string }> = {
  location: { title: "Where is it?", short: "Where", question: "Where is this attraction?" },
  features: { title: "What is special?", short: "Features", question: "What are its main features?" },
  value: { title: "Why should people visit?", short: "Why Visit", question: "Why is it worth visiting?" },
  activities: { title: "What can visitors do?", short: "Activities", question: "What can visitors do there?" },
};

export const sentenceStarters: Record<Category, string> = {
  location: "It is located in ",
  features: "It is famous for ",
  value: "It is worth visiting because ",
  activities: "Visitors can ",
};

export const attractions: Attraction[] = [
  {
    id: "big-buddha",
    name: "Tian Tan Buddha",
    shortName: "Big Buddha",
    chineseName: "天壇大佛",
    district: "Ngong Ping · Lantau Island",
    locationLine: "Ngong Ping, Lantau Island",
    summary: "A seated bronze Buddha surrounded by the green mountains of Lantau Island.",
    accent: "#c87449",
    image: "/mock-images/big-buddha.jpg",
    mapTiles: [
      "/maps/big-buddha/0-0.png",
      "/maps/big-buddha/1-0.png",
      "/maps/big-buddha/0-1.png",
      "/maps/big-buddha/1-1.png",
    ],
    mapPin: { x: 44.3, y: 72.9 },
    coordinates: { lat: 22.2539595, lon: 113.905012 },
    transportTip: "Travel to Ngong Ping on Lantau Island, then follow the signs to the statue.",
    visualPrompt:
      "Editorial travel illustration of the Tian Tan Buddha in Ngong Ping, Hong Kong, a majestic seated bronze Buddha above green Lantau mountains, warm daylight, child-friendly vintage travel poster style, no text, no map, no logos.",
    facts: [
      {
        id: "bb-location-1",
        category: "location",
        text: "The Tian Tan Buddha is in Ngong Ping on Lantau Island.",
        keywords: ["Ngong Ping", "Lantau Island"],
        sourceId: "hktb-big-buddha",
      },
      {
        id: "bb-feature-1",
        category: "features",
        text: "It is a 34-metre seated bronze Buddha, including its base.",
        keywords: ["34-metre", "seated", "bronze"],
        sourceId: "hktb-big-buddha",
      },
      {
        id: "bb-feature-2",
        category: "features",
        text: "Visitors climb 268 steps to reach the statue.",
        keywords: ["268 steps", "climb"],
        sourceId: "hktb-big-buddha",
      },
      {
        id: "bb-value-1",
        category: "value",
        text: "It is an iconic Hong Kong landmark and a symbol of harmony and unity.",
        keywords: ["iconic landmark", "harmony", "unity"],
        sourceId: "hktb-big-buddha",
      },
      {
        id: "bb-value-2",
        category: "value",
        text: "The quiet mountain setting feels very different from Hong Kong city life.",
        keywords: ["quiet", "mountain", "city life"],
        sourceId: "hktb-big-buddha",
      },
      {
        id: "bb-activity-1",
        category: "activities",
        text: "Visitors can climb the steps, see the statue and enjoy mountain views.",
        keywords: ["climb", "mountain views"],
        sourceId: "hktb-big-buddha",
      },
    ],
    vocabulary: [
      { word: "bronze", meaning: "a brown metal used to make statues" },
      { word: "landmark", meaning: "a famous place that is easy to recognise" },
      { word: "harmony", meaning: "a peaceful feeling when things work well together" },
    ],
    sources: [
      {
        id: "hktb-big-buddha",
        label: "Hong Kong Tourism Board — The Big Buddha",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-the-big-buddha.html",
        accessed,
        verified: true,
      },
      {
        id: "plm-big-buddha",
        label: "Po Lin Monastery — The Big Buddha",
        url: "https://www.plm.org.hk/eng/buddha.php",
        accessed,
        verified: true,
      },
    ],
  },
  {
    id: "wong-tai-sin",
    name: "Wong Tai Sin Temple",
    shortName: "Wong Tai Sin",
    chineseName: "黃大仙祠",
    district: "Wong Tai Sin · Kowloon",
    locationLine: "Wong Tai Sin, Kowloon",
    summary: "A colourful spiritual landmark known for its architecture and traditions.",
    accent: "#b94d42",
    image: "/mock-images/wong-tai-sin.jpg",
    mapTiles: [
      "/maps/wong-tai-sin/0-0.png",
      "/maps/wong-tai-sin/1-0.png",
      "/maps/wong-tai-sin/0-1.png",
      "/maps/wong-tai-sin/1-1.png",
    ],
    mapPin: { x: 57.6, y: 35.7 },
    coordinates: { lat: 22.3428184, lon: 114.1935509 },
    transportTip: "The temple is in Wong Tai Sin, Kowloon, close to Wong Tai Sin MTR Station.",
    visualPrompt:
      "Editorial travel illustration of Wong Tai Sin Temple in Hong Kong, colourful traditional Chinese temple architecture, red pillars and golden details, respectful visitors, child-friendly vintage travel poster style, no text, no map, no logos.",
    facts: [
      {
        id: "wts-location-1",
        category: "location",
        text: "Wong Tai Sin Temple is in Wong Tai Sin, Kowloon.",
        keywords: ["Wong Tai Sin", "Kowloon"],
        sourceId: "hktb-wong-tai-sin",
      },
      {
        id: "wts-feature-1",
        category: "features",
        text: "It is a spiritual landmark with colourful traditional Chinese architecture.",
        keywords: ["spiritual", "traditional architecture"],
        sourceId: "hktb-wong-tai-sin",
      },
      {
        id: "wts-feature-2",
        category: "features",
        text: "The temple is well known for its fortune-telling traditions.",
        keywords: ["fortune-telling", "traditions"],
        sourceId: "hktb-wong-tai-sin",
      },
      {
        id: "wts-value-1",
        category: "value",
        text: "It helps visitors learn about local beliefs, worship and Chinese folk traditions.",
        keywords: ["local beliefs", "worship", "folk traditions"],
        sourceId: "hktb-wong-tai-sin",
      },
      {
        id: "wts-activity-1",
        category: "activities",
        text: "Visitors can look at the temple buildings and observe local worship respectfully.",
        keywords: ["temple buildings", "respectfully"],
        sourceId: "hktb-wong-tai-sin",
      },
      {
        id: "wts-activity-2",
        category: "activities",
        text: "Visitors can take photos in permitted areas and learn about the temple's traditions.",
        keywords: ["take photos", "learn"],
        sourceId: "hktb-wong-tai-sin",
      },
    ],
    vocabulary: [
      { word: "spiritual", meaning: "connected with beliefs and religion" },
      { word: "tradition", meaning: "a custom followed for a long time" },
      { word: "respectfully", meaning: "in a polite and careful way" },
    ],
    sources: [
      {
        id: "hktb-wong-tai-sin",
        label: "Hong Kong Tourism Board — Wong Tai Sin Temple",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-wong-tai-sin-temple.html",
        accessed,
        verified: true,
      },
    ],
  },
  {
    id: "sky100",
    name: "sky100 Hong Kong Observation Deck",
    shortName: "sky100",
    chineseName: "天際100",
    district: "West Kowloon · Tsim Sha Tsui",
    locationLine: "100/F, ICC, West Kowloon",
    summary: "A high observation deck with wide views of Hong Kong and Victoria Harbour.",
    accent: "#237b82",
    image: "/mock-images/sky100.jpg",
    mapTiles: [
      "/maps/sky100/0-0.png",
      "/maps/sky100/1-0.png",
      "/maps/sky100/0-1.png",
      "/maps/sky100/1-1.png",
    ],
    mapPin: { x: 56.6, y: 29.9 },
    coordinates: { lat: 22.3033403, lon: 114.1603807 },
    transportTip: "It is on the 100th floor of the ICC at 1 Austin Road West.",
    visualPrompt:
      "Editorial travel illustration from a high indoor Hong Kong observation deck, panoramic Victoria Harbour and city skyline, West Kowloon, families looking through windows, child-friendly vintage travel poster style, no text, no map, no logos.",
    statusNotice: "Official sources state that sky100 is undergoing major renovation. Check its status before classroom use.",
    facts: [
      {
        id: "sky-location-1",
        category: "location",
        text: "sky100 is on the 100th floor of the International Commerce Centre in West Kowloon.",
        keywords: ["100th floor", "ICC", "West Kowloon"],
        sourceId: "hktb-sky100",
      },
      {
        id: "sky-feature-1",
        category: "features",
        text: "The observation deck is 393 metres above sea level.",
        keywords: ["observation deck", "393 metres"],
        sourceId: "hktb-sky100",
      },
      {
        id: "sky-feature-2",
        category: "features",
        text: "It is known for wide views of the Hong Kong skyline and Victoria Harbour.",
        keywords: ["skyline", "Victoria Harbour", "wide views"],
        sourceId: "hktb-sky100",
      },
      {
        id: "sky-value-1",
        category: "value",
        text: "It gives people a different view of Hong Kong from high above the city.",
        keywords: ["high above", "different view"],
        sourceId: "hktb-sky100",
      },
      {
        id: "sky-activity-1",
        category: "activities",
        text: "Visitors can look across the harbour and identify famous buildings.",
        keywords: ["harbour", "buildings"],
        sourceId: "hktb-sky100",
      },
      {
        id: "sky-activity-2",
        category: "activities",
        text: "Visitors can take photos of the city view when the deck is open.",
        keywords: ["take photos", "city view"],
        sourceId: "hktb-sky100",
      },
    ],
    vocabulary: [
      { word: "observation deck", meaning: "a high place made for looking at a view" },
      { word: "skyline", meaning: "the outline of buildings against the sky" },
      { word: "panoramic", meaning: "showing a very wide view" },
    ],
    sources: [
      {
        id: "hktb-sky100",
        label: "Hong Kong Tourism Board — sky100",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-sky100-hong-kong-observation-deck.html",
        accessed,
        verified: true,
      },
      {
        id: "sky100-official",
        label: "sky100 — Renovation notice",
        url: "https://sky100.com.hk/en/",
        accessed,
        verified: true,
      },
    ],
  },
];

export function getAttraction(id: string) {
  return attractions.find((attraction) => attraction.id === id);
}
