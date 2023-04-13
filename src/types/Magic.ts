const magicPaths = [
  "fire",
  "air",
  "water",
  "earth",
  "astral",
  "death",
  "nature",
  "blood",
  "priest",
] as const;

const magicMasks = [
  128, // Fire
  256, // Air
  512, // Water
  1024, // Earth
  2048, // Astral
  4096, // Death
  8192, // Nature
  16384, // Blood
  32768, // Priest
];

type MagicTypes = typeof magicPaths[number];

export default magicPaths;
export { magicPaths, magicMasks };
export type { MagicTypes };
