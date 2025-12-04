import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reporter: ["html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/old-*.{ts,tsx}"],
      reportOnFailure: true,
      provider: "v8", // or 'istanbul'
    },
  },
});
