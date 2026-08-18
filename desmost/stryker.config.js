const config =
{
  packageManager: "npm",
  testRunner: "vitest",
  reporters: ["html", "clear-text", "progress"],
  coverageAnalysis: "perTest",
  timeout_factor: 2.0,
  mutator: {
    excludedMutations: ["StringLiteral"],
  },
};

export default config;
