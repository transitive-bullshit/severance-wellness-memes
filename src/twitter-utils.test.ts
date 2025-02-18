import { describe, it, expect } from "vitest";
import {
  isTwitterUrl,
  normalizeTwitterProfileUri,
  getTwitterUsername,
  maxTwitterId,
  minTwitterId,
  tweetIdComparator,
  tweetComparator,
} from "./twitter-utils";

describe("Twitter Utilities", () => {
  describe("isTwitterUrl", () => {
    it("should return true for valid Twitter URLs", () => {
      expect(isTwitterUrl("https://twitter.com/someuser")).toBe(true);
      expect(isTwitterUrl("http://twitter.com/someuser")).toBe(true);
      expect(isTwitterUrl("https://www.twitter.com/someuser")).toBe(true);
      expect(isTwitterUrl("https://twitter.com/someuser/")).toBe(true);
    });

    it("should return false for invalid Twitter URLs", () => {
      expect(isTwitterUrl("https://notwitter.com/someuser")).toBe(false);
      expect(isTwitterUrl("https://twitter.fake/someuser")).toBe(false);
      expect(isTwitterUrl("https://twitter.com")).toBe(false);
      expect(isTwitterUrl("")).toBe(false);
    });
  });

  describe("normalizeTwitterProfileUri", () => {
    it("should normalize various Twitter profile URI formats", () => {
      expect(normalizeTwitterProfileUri("twitter.com/someuser")).toBe("https://twitter.com/someuser");
      expect(normalizeTwitterProfileUri("http://www.twitter.com/someuser")).toBe("https://twitter.com/someuser");
      expect(normalizeTwitterProfileUri("https://twitter.com/someuser/")).toBe("https://twitter.com/someuser");
      expect(normalizeTwitterProfileUri("https://twitter.com/someuser")).toBe("https://twitter.com/someuser");
    });

    it("should handle invalid inputs gracefully", () => {
      // Assuming that invalid inputs return the same string or an empty string.
      expect(normalizeTwitterProfileUri("")).toBe("");
      expect(normalizeTwitterProfileUri("not a url")).toBe("not a url");
    });
  });

  describe("getTwitterUsername", () => {
    it("should extract the username from a valid Twitter profile URL", () => {
      expect(getTwitterUsername("https://twitter.com/someuser")).toBe("someuser");
      expect(getTwitterUsername("http://twitter.com/anotherUser/")).toBe("anotherUser");
      expect(getTwitterUsername("twitter.com/yetanotheruser")).toBe("yetanotheruser");
    });

    it("should return empty string if username is missing or URL is invalid", () => {
      expect(getTwitterUsername("https://twitter.com/")).toBe("");
      expect(getTwitterUsername("not a valid url")).toBe("");
    });
  });

  describe("maxTwitterId and minTwitterId", () => {
    it("should return the correct maximum Twitter ID", () => {
      expect(maxTwitterId("123", "456")).toBe("456");
      expect(maxTwitterId("789", "456")).toBe("789");
    });

    it("should return the correct minimum Twitter ID", () => {
      expect(minTwitterId("123", "456")).toBe("123");
      expect(minTwitterId("789", "456")).toBe("456");
    });

    it("should handle equal IDs correctly", () => {
      expect(maxTwitterId("555", "555")).toBe("555");
      expect(minTwitterId("555", "555")).toBe("555");
    });
  });

  describe("tweetIdComparator", () => {
    it("should compare tweet IDs correctly", () => {
      const cmp1 = tweetIdComparator("123", "456");
      expect(cmp1).toBeLessThan(0);

      const cmp2 = tweetIdComparator("789", "456");
      expect(cmp2).toBeGreaterThan(0);

      const cmp3 = tweetIdComparator("123", "123");
      expect(cmp3).toBe(0);
    });
  });

  describe("tweetComparator", () => {
    it("should compare tweet objects correctly based on their IDs", () => {
      const tweet1 = { id: "123", text: "Hello" };
      const tweet2 = { id: "456", text: "World" };
      const tweet3 = { id: "123", text: "Another tweet" };

      const cmp1 = tweetComparator(tweet1, tweet2);
      expect(cmp1).toBeLessThan(0);

      const cmp2 = tweetComparator(tweet2, tweet1);
      expect(cmp2).toBeGreaterThan(0);

      const cmp3 = tweetComparator(tweet1, tweet3);
      expect(cmp3).toBe(0);
    });

    it("should handle tweet objects with missing properties gracefully", () => {
      const tweet1 = { id: "123", text: "Hello" };
      const tweet2 = { text: "Missing id" } as any;

      // Expecting the comparator to not throw an error even if one tweet is missing an id.
      expect(() => tweetComparator(tweet1, tweet2)).not.toThrow();
    });
  });
});