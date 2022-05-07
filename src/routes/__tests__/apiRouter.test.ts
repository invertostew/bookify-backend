import request from "supertest";

import app from "../../app";

describe("apiRouter", () => {
  describe("GET", () => {
    describe("/api", () => {
      it("should return a 200", async () => {
        await request(app).get("/api").expect(200);
      });
    });
  });
});
