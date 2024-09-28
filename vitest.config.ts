import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./src/shared/infra/testing/expect-helpers.ts"],
  },
});
