import { Item } from "./Item";

const trackedUnitAttributes = [
  "id",
  "name",
  "leader",
  "holy",
  "crownonly",
  "undeadleader",
  "magicleader",
  "aquatic",
  "size",
  "hp",
  "prot",
  "mr",
  "mor",
  "str",
  "att",
  "def",
  "prec",
  "enc",
  "ap",
  "mapmove",
  "startage",
  "maxage",
  "F",
  "A",
  "W",
  "E",
  "S",
  "D",
  "N",
  "B",
  "H",
  "mask1",
  "mask2",
  "mask3",
  "mask4",
  "mask5",
  "mask6",
  "rand1",
  "rand2",
  "rand3",
  "rand4",
  "rand5",
  "rand6",
  "nbr1",
  "nbr2",
  "nbr3",
  "nbr4",
  "nbr5",
  "nbr6",
  "link1",
  "link2",
  "link3",
  "link4",
  "link5",
  "link6",
  "hand",
  "head",
  "body",
  "foot",
  "misc",
] as const;

type Unit = {
  [K in typeof trackedUnitAttributes[number]]: string;
};

interface Units extends Unit {
  quantity: number;
}

type CommanderEquipment = {
  [K in
    | (
        | typeof unitHandsConst[number]
        | typeof unitHeadsConst[number]
        | typeof unitMiscConst[number]
      )
    | "body"
    | "feet"]?: Item | null;
};

interface Squad {
  unit: Unit;
  quantity: number;
}

interface Commander extends Unit {
  squads: Array<Squad>;
  equipment: CommanderEquipment;
}

const unitHandsConst = ["hand1", "hand2", "hand3", "hand4"] as const;
const unitHeadsConst = ["head1", "head2", "head3"] as const;
const unitMiscConst = ["misc1", "misc2", "misc3", "misc4", "misc5"] as const;
const allPossibleSlotsConst = [
  ...unitHandsConst,
  ...unitHeadsConst,
  "body",
  "feet",
  ...unitMiscConst,
] as const;

export default Unit;
export { unitHandsConst, unitHeadsConst, unitMiscConst, allPossibleSlotsConst };
export type { Unit, Commander, CommanderEquipment, Squad };
