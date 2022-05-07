import request from "supertest";

import app from "../../app";

describe("servicesRouter", () => {
  describe("GET", () => {
    describe("/api/services", () => {
      it("should return status 200", async () => {
        await request(app).get("/api/services").expect(200);
      });
    });
  });
});
