import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./src/shared/infra/testing/expect-helpers.ts"],
    include: ["**/*.{test,int-spec,spec}.?(c|m)[jt]s?(x)"],
  },
});
