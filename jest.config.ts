import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.ts": "ts-jest"
  },
  testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.[jt]s",
  moduleFileExtensions: ["ts", "js"],
  verbose: true
};

export default config;
