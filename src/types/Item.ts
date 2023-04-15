import { isNumber } from "../utils/isNumber";

type Item = {
  type: ItemType;
  name: string;
  id: string;
};

const ItemTypeConst = [
  "1-h wpn",
  "2-h wpn",
  "shield",
  "helm",
  "crown",
  "armor",
  "boots",
  "misc",
] as const;

type ItemType = typeof ItemTypeConst[number];

export { ItemTypeConst };
export type { Item, ItemType };
