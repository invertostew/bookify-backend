import request from "supertest";

import app from "../../app";

describe("rolesRouter", () => {
  describe("GET", () => {
    describe("/api/roles", () => {
      it("should return status 401", async () => {
        await request(app).get("/api/roles").expect(401);
      });
    });
  });
});
