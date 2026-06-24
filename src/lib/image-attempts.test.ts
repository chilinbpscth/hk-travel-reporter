import { beforeEach, describe, expect, it } from "vitest";
import { consumeImageAttempt, resetImageAttemptsForTests } from "@/lib/image-attempts";

describe("image attempt guard", () => {
  beforeEach(resetImageAttemptsForTests);

  it("allows three attempts and blocks the fourth", () => {
    expect(consumeImageAttempt("student").remainingAttempts).toBe(2);
    expect(consumeImageAttempt("student").remainingAttempts).toBe(1);
    expect(consumeImageAttempt("student").remainingAttempts).toBe(0);
    expect(consumeImageAttempt("student").allowed).toBe(false);
  });
});
