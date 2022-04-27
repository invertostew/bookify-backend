import request from "supertest";

import app from "../../app";

describe("rolesRouter", () => {
  describe("get roles route", () => {
    it("should return a 200", async () => {
      await request(app).get("/api/roles").expect(200);
    });
  });
});
