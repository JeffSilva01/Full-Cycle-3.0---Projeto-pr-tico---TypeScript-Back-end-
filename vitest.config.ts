import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./src/shared/infra/testing/expect-helpers.ts"],
    include: ["**/*.{test,int-spec,spec}.?(c|m)[jt]s?(x)"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
