import request from "supertest";

import app from "../../app";

describe("bookingsRouter", () => {
  describe("GET", () => {
    describe("/api/bookings", () => {
      it("should return status 200", async () => {
        await request(app).get("/api/bookings").expect(200);
      });
    });
  });
});
