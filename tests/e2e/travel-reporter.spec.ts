import { expect, test } from "@playwright/test";

const attractions = [
  {
    buttonName: /Big Buddha/,
    id: "big-buddha",
    studentCode: "4A-12",
    facts: [
      "The Tian Tan Buddha is in Ngong Ping on Lantau Island.",
      "It is a 34-metre seated bronze Buddha, including its base.",
      "It is an iconic Hong Kong landmark and a symbol of harmony and unity.",
      "Visitors can climb the steps, see the statue and enjoy mountain views.",
    ],
  },
  {
    buttonName: /Wong Tai Sin/,
    id: "wong-tai-sin",
    studentCode: "4A-13",
    facts: [
      "Wong Tai Sin Temple is in Wong Tai Sin, Kowloon.",
      "It is a spiritual landmark with colourful traditional Chinese architecture.",
      "It helps visitors learn about local beliefs, worship and Chinese folk traditions.",
      "Visitors can look at the temple buildings and observe local worship respectfully.",
    ],
  },
  {
    buttonName: /sky100/,
    id: "sky100",
    studentCode: "4A-14",
    facts: [
      "sky100 is on the 100th floor of the International Commerce Centre in West Kowloon.",
      "The observation deck is 393 metres above sea level.",
      "It gives people a different view of Hong Kong from high above the city.",
      "Visitors can look across the harbour and identify famous buildings.",
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
    await page.getByLabel("Your student code").fill(attraction.studentCode);
    await page.getByRole("button", { name: attraction.buttonName }).click();
    await page.getByRole("button", { name: "Start the mission" }).click();
    await expect(page.getByRole("heading", { name: "How do reporters introduce a place?" })).toBeVisible();
    await page.getByRole("button", { name: "Meet the local guide" }).click();

    for (const [index, question] of questions.entries()) {
      await page.getByRole("button", { name: question }).click();
      const fact = page.getByText(attraction.facts[index], { exact: true });
      await expect(fact).toBeVisible();
      await fact.locator("..").getByRole("button", { name: "Save fact" }).click();
    }

    await page.getByRole("button", { name: "Review my notes" }).click();
    await page.getByRole("button", { name: "Write my report" }).click();
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
    expect(download.suggestedFilename()).toBe(`${attraction.id}-${attraction.studentCode}-poster.png`);

    await page.reload();
    await expect(page.getByRole("heading", { name: "Your report is ready for the front page." })).toBeVisible();
  });
}
