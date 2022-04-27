import request from "supertest";

import app from "../../app";

describe("usersRouter", () => {
  describe("get users route", () => {
    it("should return a 200", async () => {
      await request(app).get("/api/users").expect(200);
    });
  });
});
