import { access, copyFile } from "node:fs/promises";
import path from "node:path";

const distDirectory = path.resolve(process.cwd(), "dist");
const indexFile = path.join(distDirectory, "index.html");
const fallbackFile = path.join(distDirectory, "404.html");

try {
  await access(indexFile);
  await copyFile(indexFile, fallbackFile);
  console.log("Created dist/404.html from dist/index.html");
} catch (error) {
  console.error("Unable to create dist/404.html:", error);
  process.exitCode = 1;
}
