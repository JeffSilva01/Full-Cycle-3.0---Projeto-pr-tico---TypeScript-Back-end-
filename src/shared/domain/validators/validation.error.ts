import { FieldsErrors } from "./validator-fields-interface";

export class EntityValidationError extends Error {
  constructor(
    public error: FieldsErrors,
    message = "Valiation Error",
  ) {
    super(message);
  }

  count() {
    return Object.keys(this.error).length;
  }
}
