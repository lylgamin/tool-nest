import { describe, it, expect } from "vitest";
import { CATEGORIES, TOOLS } from "./tools";

describe("tools data", () => {
  it("各カテゴリの count が TOOLS 実データと一致する", () => {
    for (const cat of CATEGORIES) {
      const actual = TOOLS.filter((t) => t.category === cat.id && t.ready).length;
      expect(actual, `category "${cat.id}" の count が不一致`).toBe(cat.count);
    }
  });

  it("全ツールのカテゴリが CATEGORIES に存在する", () => {
    const validIds = new Set(CATEGORIES.map((c) => c.id));
    for (const tool of TOOLS) {
      expect(validIds.has(tool.category), `tool "${tool.id}" の category "${tool.category}" が未定義`).toBe(true);
    }
  });

  it("ツール ID に重複がない", () => {
    const ids = TOOLS.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("ready なツールはすべて href を持つ", () => {
    for (const tool of TOOLS.filter((t) => t.ready)) {
      expect(tool.href.startsWith("/"), `tool "${tool.id}" の href が不正`).toBe(true);
    }
  });
});
