import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchEvents, createEvent, fetchReport, deleteAttendee } from "./api";

/*
    I found that vite and vitest are much easier to set up and work with for testing React applications compared to Jest.

*/

describe("Test api service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchEvents should return parsed data", async () => {
    const payload = [{ _id: "1", name: "Yule Ball" }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => payload }),
    );

    const data = await fetchEvents();

    expect(data).toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("/api/events");
  });

  it("createEvent should throw backend error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Duplicate event" }),
      }),
    );

    await expect(
      createEvent({ name: "Yule Ball", date: "2026-12-24", capacity: 120 }),
    ).rejects.toThrow("Duplicate event");
  });

  it("fetchReport should return blob for csv format", async () => {
    const blob = new Blob(["csv"]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, blob: async () => blob }),
    );

    const data = await fetchReport("event-1", "csv");

    expect(data).toBe(blob);
    expect(fetch).toHaveBeenCalledWith("/api/events/event-1/report?format=csv");
  });

  it("deleteAttendee should throw fallback error when body has no message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
    );

    await expect(deleteAttendee("event-1", "attendee-1")).rejects.toThrow(
      "Failed to remove attendee",
    );
  });
});
