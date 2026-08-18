const config =
{
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "vitest",
  coverageAnalysis: "perTest",
  mutator: {
    excludedMutations: ["StringLiteral"],
  },
};

export default config;
