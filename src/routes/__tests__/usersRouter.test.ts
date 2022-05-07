import request from "supertest";

import app from "../../app";

describe("usersRouter", () => {
  describe("GET", () => {
    describe("/api/users", () => {
      it("should return status 401", async () => {
        await request(app).get("/api/users").expect(401);
      });
    });
  });
});
