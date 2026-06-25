import { expect, test } from "@playwright/test";

const attractions = [
  {
    id: "big-buddha",
    group: "Group 1",
    factIds: ["bb-location-1", "bb-feature-1", "bb-value-1", "bb-activity-1"],
    facts: [
      "The Tian Tan Buddha is in Ngong Ping on Lantau Island.",
      "It is a 34-metre seated bronze Buddha, including its base.",
      "It is an iconic Hong Kong landmark and a symbol of harmony and unity.",
      "Visitors can climb the steps, see the statue and enjoy mountain views.",
    ],
  },
  {
    id: "wong-tai-sin",
    group: "Group 2",
    factIds: ["wts-location-1", "wts-feature-1", "wts-value-1", "wts-activity-1"],
    facts: [
      "Wong Tai Sin Temple is in Wong Tai Sin, Kowloon.",
      "It is a spiritual landmark with colourful traditional Chinese architecture.",
      "It helps visitors learn about local beliefs, worship and Chinese folk traditions.",
      "Visitors can look at the temple buildings and observe local worship respectfully.",
    ],
  },
  {
    id: "sky100",
    group: "Group 3",
    factIds: ["sky-location-1", "sky-feature-1", "sky-value-1", "sky-activity-1"],
    facts: [
      "sky100 is on the 100th floor of the International Commerce Centre in West Kowloon.",
      "The observation deck is 393 metres above sea level.",
      "It gives people a different view of Hong Kong from high above the city.",
      "Visitors can look across the harbour and identify famous buildings.",
    ],
  },
  {
    id: "star-ferry",
    group: "Group 4",
    factIds: ["star-location-1", "star-feature-1", "star-value-1", "star-activity-1"],
    facts: [
      "Star Ferry Pier is on the Tsim Sha Tsui waterfront.",
      "The Star Ferry carries passengers across Victoria Harbour between Kowloon and Hong Kong Island.",
      "It is worth visiting because it shows Hong Kong's harbour life and transport history.",
      "Visitors can ride the ferry and enjoy views of Victoria Harbour.",
    ],
  },
  {
    id: "the-peak",
    group: "Group 5",
    factIds: ["peak-location-1", "peak-feature-1", "peak-value-1", "peak-activity-1"],
    facts: [
      "The Peak is on Victoria Peak on Hong Kong Island.",
      "It is famous for panoramic views of the city skyline.",
      "It is worth visiting because visitors can see Hong Kong from high above the city.",
      "Visitors can ride the tram, take photos and enjoy the skyline view.",
    ],
  },
  {
    id: "avenue-stars",
    group: "Group 6",
    factIds: ["aos-location-1", "aos-feature-1", "aos-value-1", "aos-activity-1"],
    facts: [
      "The Avenue of Stars is on the Tsim Sha Tsui waterfront.",
      "It is a 400-metre promenade beside Victoria Harbour.",
      "It is worth visiting because it combines harbour views with movie culture.",
      "Visitors can walk along the promenade, take photos and look at film displays.",
    ],
  },
  {
    id: "hk-palace-museum",
    group: "Group 1",
    factIds: ["hkpm-location-1", "hkpm-feature-1", "hkpm-value-1", "hkpm-activity-1"],
    facts: [
      "The Hong Kong Palace Museum is in the West Kowloon Cultural District.",
      "It displays Chinese art and cultural treasures from the Palace Museum and other institutions.",
      "It is worth visiting because visitors can learn about Chinese culture and history.",
      "Visitors can visit exhibitions and look closely at artefacts.",
    ],
  },
  {
    id: "m-plus",
    group: "Group 2",
    factIds: ["mplus-location-1", "mplus-feature-1", "mplus-value-1", "mplus-activity-1"],
    facts: [
      "M+ is in the West Kowloon Cultural District.",
      "It is a museum of contemporary visual culture.",
      "It is worth visiting because visitors can see modern creative works from Hong Kong and beyond.",
      "Visitors can explore exhibitions and enjoy the West Kowloon harbourfront.",
    ],
  },
  {
    id: "hong-kong-disneyland",
    group: "Group 3",
    factIds: ["disney-location-1", "disney-feature-1", "disney-value-1", "disney-activity-1"],
    facts: [
      "Hong Kong Disneyland is at Penny's Bay on Lantau Island.",
      "It is a theme park with eight themed lands.",
      "It is worth visiting because it gives families a magical theme park experience.",
      "Visitors can enjoy rides, watch shows and take photos with characters.",
    ],
  },
  {
    id: "ocean-park",
    group: "Group 4",
    factIds: ["ocean-location-1", "ocean-feature-1", "ocean-value-1", "ocean-activity-1"],
    facts: [
      "Ocean Park Hong Kong is at 180 Wong Chuk Hang Road in Aberdeen.",
      "It is a theme park with rides, animal exhibits and marine life experiences.",
      "It is worth visiting because visitors can enjoy entertainment and learn about nature.",
      "Visitors can go on rides, see animals and learn about marine life.",
    ],
  },
] as const;

const questions = [
  "Where is this attraction?",
  "What are its main features?",
  "Why is it worth visiting?",
  "What can visitors do there?",
] as const;

for (const attraction of attractions) {
  test(`student completes the ${attraction.id} reporting flow`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: attraction.group }).click();
    await page.getByTestId(`attraction-${attraction.id}`).click();
    await page.getByRole("button", { name: "Start the mission" }).click();
    await expect(page.getByRole("heading", { name: "Read · Research · Record · Report" })).toBeVisible();

    for (const [index, question] of questions.entries()) {
      await page.getByLabel("Ask your own question").fill(question);
      await page.getByRole("button", { name: "Send question" }).click();
      const fact = page.getByText(attraction.facts[index], { exact: true });
      await expect(fact).toBeVisible();
      await fact.locator("..").getByRole("button", { name: "Save fact" }).click();
      await expect(page.getByTestId(`saved-fact-${attraction.factIds[index]}`)).toBeVisible();
    }

    await page.locator("#draft-location").fill("It is located in Hong Kong.");
    await page.locator("#draft-features").fill("It is famous for its special local features.");
    await page.locator("#draft-value").fill("It is worth visiting because it shows an interesting side of Hong Kong.");
    await page.locator("#draft-activities").fill("Visitors can explore the place and learn about Hong Kong.");
    await page.getByRole("button", { name: "Open poster studio" }).click();
    await page.getByRole("button", { name: "Generate illustration" }).click();
    await expect(page.getByText("AI-generated illustration")).toBeVisible();

    const posterBox = await page.getByTestId("poster-canvas").boundingBox();
    expect(posterBox).not.toBeNull();
    expect(posterBox!.width / posterBox!.height).toBeCloseTo(210 / 297, 2);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download PNG" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(`${attraction.id}-${attraction.group}-poster.png`);

    await page.reload();
    await expect(page.getByRole("heading", { name: "Your report is ready for the front page." })).toBeVisible();
  });
}
