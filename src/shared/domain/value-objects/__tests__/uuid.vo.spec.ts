import { InvalidUuidError, Uuid } from "../uuid.vo";

let validateSpy: ReturnType<typeof vi.spyOn>;

describe("Uuid Unit Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks(); // ou vi.clearAllMocks()
    validateSpy = vi.spyOn(Uuid.prototype as any, "validate");
  });

  it("shoud throw error when uuid is invalid", () => {
    expect(() => {
      new Uuid("invalid");
    }).toThrow(InvalidUuidError);

    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should be valid", () => {
    const uuid = new Uuid();

    expect(uuid.id).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should accept a valid uuid", () => {
    const uuid = new Uuid("123e4567-e89b-12d3-a456-426655440000");

    expect(uuid.id).toBe("123e4567-e89b-12d3-a456-426655440000");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
