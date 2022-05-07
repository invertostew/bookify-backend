import { ServiceStore } from "../ServiceStore";

describe("ServiceStore", () => {
  let store: ServiceStore;

  beforeEach(() => {
    store = new ServiceStore();
  });

  describe("has CRUD methods", () => {
    it("has an index method", () => {
      expect(store).toHaveProperty("index");
    });

    it("has an show method", () => {
      expect(store).toHaveProperty("show");
    });

    it("has an create method", () => {
      expect(store).toHaveProperty("create");
    });

    it("has an update method", () => {
      expect(store).toHaveProperty("update");
    });

    it("has an destroy method", () => {
      expect(store).toHaveProperty("destroy");
    });
  });
});
