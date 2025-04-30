import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const jobsPath = join(__dirname, "workers");
const jobFiles = readdirSync(jobsPath);

for (const file of jobFiles) {
  await import(join(jobsPath, file));
}
