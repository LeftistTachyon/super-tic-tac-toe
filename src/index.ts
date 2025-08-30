import { firstAlphabeta } from "./analyze";

for (let depth = 0; ; depth++) {
  const { value, best } = firstAlphabeta(depth);
  console.log(
    `Depth ${depth}: ${value} [Best: ${best?.outer}, ${best?.inner}]`
  );
}
