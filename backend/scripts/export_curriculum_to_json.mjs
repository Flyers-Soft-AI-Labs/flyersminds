import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const backendDir = path.resolve(path.dirname(__filename), "..");
const repoDir = path.resolve(backendDir, "..");
const dataDir = path.join(repoDir, "frontend", "src", "data");

const curriculum = [];

for (let month = 1; month <= 6; month += 1) {
  const filePath = path.join(dataDir, `month${month}.js`);
  let source = fs.readFileSync(filePath, "utf8");
  source = source.replace(
    new RegExp(`export\\s+const\\s+month${month}\\s*=`),
    `const month${month} =`
  );

  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source}\nresult = month${month};`, context, {
    filename: filePath,
  });

  curriculum.push(...context.result);
}

process.stdout.write(JSON.stringify(curriculum));
