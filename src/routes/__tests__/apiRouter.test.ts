import request from "supertest";

import app from "../../app";

describe("apiRouter", () => {
  describe("get API route", () => {
    it("should return a 200", async () => {
      await request(app).get("/api").expect(200);
    });
  });
});
