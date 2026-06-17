const fs = require("fs");
const path = require("path");
const packageJson = require("../package.json");

const now = new Date();

const formatted = now.toLocaleString("en-IN", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const content = `export const BUILD_INFO = {
  version: "v${packageJson.version}",
  builtAt: "${formatted}"
};\n`;

fs.writeFileSync(path.join(__dirname, "../src/buildInfo.ts"), content);
console.log("✔ Build info generated:", formatted);
