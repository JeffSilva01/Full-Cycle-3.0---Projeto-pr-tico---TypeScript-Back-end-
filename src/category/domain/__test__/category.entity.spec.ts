import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Without Validator Unit Tests", () => {
  let validateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    validateSpy = vi.spyOn(Category as any, "validate");
  });

  it("constructor of category", () => {
    let category = new Category({ name: "Movie" });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);

    let createdAt = new Date();
    category = new Category({
      name: "Movie",
      description: "some description",
      isActive: false,
      createdAt,
    });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("some description");
    expect(category.isActive).toBe(false);
    expect(category.createdAt).toBe(createdAt);

    category = new Category({
      name: "Movie",
      description: "other description",
    });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("other description");
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      isActive: true,
    });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);

    createdAt = new Date();
    category = new Category({
      name: "Movie",
      createdAt,
    });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBe(createdAt);
  });

  describe("create command", () => {
    it("should create a category", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toBeCalledTimes(1);
    });

    it("should create a category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "some description",
      });
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("some description");
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toBeCalledTimes(1);
    });

    it("should create a category with isActive", () => {
      const category = Category.create({
        name: "Movie",
        isActive: false,
      });
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(false);
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toBeCalledTimes(1);
    });
  });

  describe("categoryId field", () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new Uuid() }];

    it.each(arrange)("id = %j", ({ id }) => {
      const category = new Category({
        name: "Movie",
        categoryId: id as any,
      });

      expect(category.categoryId).toBeInstanceOf(Uuid);
    });
  });

  it("should change name", () => {
    const category = Category.create({
      name: "Movie",
    });
    category.changeName("other name");
    expect(category.name).toBe("other name");
    expect(validateSpy).toBeCalledTimes(2);
  });

  it("should change description", () => {
    const category = Category.create({
      name: "Movie",
    });
    category.changeDescription("some description");
    expect(category.description).toBe("some description");
    expect(validateSpy).toBeCalledTimes(2);
  });

  it("should active a category", () => {
    const category = new Category({
      name: "Filmes",
      isActive: false,
    });
    category.activate();
    expect(category.isActive).toBe(true);
  });

  it("should disable a category", () => {
    const category = new Category({
      name: "Filmes",
      isActive: true,
    });
    category.deactivate();
    expect(category.isActive).toBe(false);
  });
});

describe("Category Validator", () => {
  it("should an invalid category with name property", () => {
    expect(() => Category.create({ name: null as any })).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect(() => Category.create({ name: "" })).containsErrorMessages({
      name: ["name should not be empty"],
    });

    expect(() => Category.create({ name: 123 as any })).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect(() =>
      Category.create({ name: "t".repeat(256) }),
    ).containsErrorMessages({
      name: ["name must be shorter than or equal to 255 characters"],
    });
  });

  it("should a invalid category using description property", () => {
    expect(() =>
      Category.create({ description: 5 } as any),
    ).containsErrorMessages({
      description: ["description must be a string"],
    });
  });

  it("should a invalid category using is_active property", () => {
    expect(() => Category.create({ isActive: 5 } as any)).containsErrorMessages(
      {
        isActive: ["isActive must be a boolean value"],
      },
    );
  });
});
