const config =
{
  packageManager: "npm",
  testRunner: "vitest",
  reporters: ["html", "clear-text", "progress"],
  coverageAnalysis: "perTest",
  timeoutFactor: 2.0,
  mutator: {
    excludedMutations: ["StringLiteral"],
  },
};

export default config;
