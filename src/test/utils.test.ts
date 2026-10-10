import { describe, it, expect } from "vitest";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";

describe("Utility Functions", () => {
  it("should merge tailwind classnames correctly with cn", () => {
    const result = cn("p-4 text-forest", "text-emerald-500", false && "hidden");
    expect(result).toContain("p-4");
    expect(result).toContain("text-emerald-500");
    expect(result).not.toContain("text-forest");
  });

  it("should format dates in human readable format", () => {
    const formatted = formatDate("2026-05-15");
    expect(formatted).toBe("May 15, 2026");
  });

  it("should format relative time correctly", () => {
    const justNow = formatRelativeTime(Date.now() - 5000);
    expect(justNow).toBe("Just now");

    const minutesAgo = formatRelativeTime(Date.now() - 1000 * 60 * 5);
    expect(minutesAgo).toBe("5m ago");

    const hoursAgo = formatRelativeTime(Date.now() - 1000 * 60 * 60 * 3);
    expect(hoursAgo).toBe("3h ago");
  });
});
