const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../deploy-resources/WEB-INF");
const dest = path.join(__dirname, "../dist/WEB-INF");

fs.mkdirSync(dest, { recursive: true });
fs.cpSync(src, dest, { recursive: true });

console.log("✔ WEB-INF copied");