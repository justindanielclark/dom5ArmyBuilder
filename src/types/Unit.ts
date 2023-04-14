import { Item } from "./Item";

interface Unit {
  id: string;
  name: string;
  leader: string;
  holy: string;
  crownonly: string;
  undeadleader: string;
  magicleader: string;

  //Base Stats
  size: string;
  hp: string;
  prot: string;
  mr: string;
  mor: string;
  str: string;
  att: string;
  def: string;
  prec: string;
  enc: string;
  ap: string;
  mapmove: string;
  startage: string;
  maxage: string;

  //Magic
  F: string;
  A: string;
  W: string;
  E: string;
  S: string;
  D: string;
  N: string;
  B: string;
  H: string;

  mask1: string;
  mask2: string;
  mask3: string;
  mask4: string;
  mask5: string;
  mask6: string;

  rand1: string;
  rand2: string;
  rand3: string;
  rand4: string;
  rand5: string;
  rand6: string;

  nbr1: string;
  nbr2: string;
  nbr3: string;
  nbr4: string;
  nbr5: string;
  nbr6: string;

  link1: string;
  link2: string;
  link3: string;
  link4: string;
  link5: string;
  link6: string;

  //Parts
  hand: string;
  head: string;
  body: string;
  foot: string;
  misc: string;
}

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
export type { Unit, Units, Commander, CommanderEquipment, Squad };
