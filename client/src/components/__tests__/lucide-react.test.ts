import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Search } from "lucide-react";

function extractClassNames(html: string): string[] {
  const match = html.match(/class="([^"]*)"/);
  return match ? match[1].split(/\s+/).filter(Boolean) : [];
}

describe("lucide-react icon className handling", () => {
  it("deduplicates repeated class tokens passed to an icon", () => {
    const html = renderToStaticMarkup(
      createElement(Search, { className: "search-btn search-btn search-icon" })
    );
    const classNames = extractClassNames(html);

    // The icon still receives its own classes plus the caller's classes.
    expect(classNames).toContain("lucide");
    expect(classNames).toContain("lucide-search");
    expect(classNames).toContain("search-icon");

    // Repeated tokens must be merged instead of being emitted twice.
    expect(classNames.filter(name => name === "search-btn")).toHaveLength(1);
  });
});
