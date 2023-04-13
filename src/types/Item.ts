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
type Item = {
  type: ItemType;
  name: string;
  id: string;
};

export { ItemTypeConst };
export type { Item, ItemType };
