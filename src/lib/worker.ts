import { readdirSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const jobsPath = join(__dirname, "workers");
const jobFiles = readdirSync(jobsPath);

jobFiles.forEach((file) => {
  import(join(jobsPath, file));
});
