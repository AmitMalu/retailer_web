const fs = require("fs");
const archiver = require("archiver");

const output = fs.createWriteStream("app.zip");
const archive = archiver("zip");

output.on("close", () => {
  fs.renameSync("app.zip", "app.war");
  console.log("✔ WAR created");
});

archive.pipe(output);
archive.directory("dist/", false);
archive.finalize();