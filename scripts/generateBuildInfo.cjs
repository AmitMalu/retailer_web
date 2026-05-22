const fs = require("fs");
const path = require("path");

const now = new Date();
const formatted = now.toLocaleString("en-IN", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const content =
  `export const BUILD_INFO = {
  version: "v1.0.0",
  builtAt: "${formatted}"
};\n`;

fs.writeFileSync(path.join(__dirname, "../src/buildInfo.ts"), content);
console.log("✔ Build info generated:", formatted);
