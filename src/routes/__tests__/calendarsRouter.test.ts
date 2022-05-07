import request from "supertest";

import app from "../../app";

describe("calendarsRouter", () => {
  describe("GET", () => {
    describe("/api/calendars", () => {
      it("should return status 200", async () => {
        await request(app).get("/api/calendars").expect(200);
      });
    });
  });
});
