import { firstAlphabeta } from "./analyze";
import { stdout } from "node:process";

for (let depth = 0; ; depth++) {
  const { value, best } = firstAlphabeta(depth);
  console.log(`Depth ${depth}: ${value}`);
  stdout.write("  Best variation: ");
  for (const move of best) {
    const outer = move.outer + 10;
    stdout.write(outer.toString(36) + move.inner + ", ");
  }
  console.log();
}
