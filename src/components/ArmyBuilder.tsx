import { Item } from "../types/Item";
import {
  Unit,
  Commander,
  Units,
  CommanderEquipment,
  unitHandsConst,
  unitHeadsConst,
  unitMiscConst,
} from "../types/Unit";
import { Nation, NationIndex } from "../types/Nation";

type Props = {
  nations: [Nation | null, Nation | null];
  chosenUnit: Unit | null;
  chosenItem: Item | null;
  armies: Array<Array<Commander>>;
  handleAddCommander: (commander: Commander, nationIndex: NationIndex) => void;
};

function ArmyBuilder({
  nations,
  armies,
  chosenUnit,
  chosenItem,
  handleAddCommander,
}: Props) {
  return (
    <section className="p-3 border-l-2 border-white flex-1 max-w-3xl">
      <h1 className="text-2xl font-bold">Army Builder: </h1>
      <div className="flex flex-row gap-2">
        {nations.map((nation, idx) => (
          <div className="flex-1">
            <div className="flex flex-row justify-between">
              <h2 className="text-xl underline underline-offset-2">
                {nation ? nation.name : `Nation ${idx + 1}`}
              </h2>
              {chosenUnit ? (
                <button
                  className="bg-green-900 p-1 rounded-lg mr-2"
                  onClick={(e) => {
                    handleAddCommander(
                      convertUnitToCommander(chosenUnit),
                      idx as NationIndex
                    );
                  }}
                >
                  + Cmdr
                </button>
              ) : undefined}
            </div>
            {armies[idx as NationIndex].length > 0 ? (
              <ul className="pl-1 flex flex-col gap-2">
                {armies[idx].map((cmdr) => (
                  <li className="even:bg-slate-700 odd:bg-neutral-700 p-1 rounded-lg">
                    <h2 className="font-bold">{cmdr.name}</h2>
                    <ul className="pl-1 text-xs flex flex-col gap-1">
                      {Object.keys(cmdr.equipment).map((equipmentKey) => (
                        <li className="flex flex-row">
                          <button className="w-full bg-green-900 flex flex-row justify-between">
                            <span className="inline-blockflex-1 ml-2">
                              {equipmentKey}
                            </span>
                            <span className="mr-2">
                              {cmdr.equipment[
                                equipmentKey as keyof CommanderEquipment
                              ] === ""
                                ? "-"
                                : cmdr.equipment[
                                    equipmentKey as keyof CommanderEquipment
                                  ]}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No Units</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function convertUnitToCommander(unit: Unit): Commander {
  const equipment: CommanderEquipment = {};
  const numHands = unit.hand !== "" ? parseInt(unit.hand) : 0;
  const numHeads = unit.head !== "" ? parseInt(unit.head) : 0;
  const numBody = unit.body !== "" ? parseInt(unit.body) : 0;
  const numFeet = unit.foot !== "" ? parseInt(unit.foot) : 0;
  const numMisc = unit.misc !== "" ? parseInt(unit.misc) : 0;
  for (let i = 0; i < numHands; i++) {
    equipment[unitHandsConst[i]] = "";
  }
  for (let i = 0; i < numHeads; i++) {
    equipment[unitHeadsConst[i]] = "";
  }
  for (let i = 0; i < numMisc; i++) {
    equipment[unitMiscConst[i]] = "";
  }
  if (numBody > 0) {
    equipment.body = "";
  }
  if (numFeet > 0) {
    equipment.feet = "";
  }
  return {
    ...unit,
    squads: [],
    equipment,
  };
}
function itemMatchesEquipmentSlot(
  item: Item,
  equipmentSlot: keyof CommanderEquipment
): boolean {
  switch (item.type) {
    case "1-h wpn": {
      return (
        equipmentSlot === "hand1" ||
        equipmentSlot === "hand2" ||
        equipmentSlot === "hand3" ||
        equipmentSlot === "hand4"
      );
    }
    case "2-h wpn": {
      return (
        equipmentSlot === "hand1" ||
        equipmentSlot === "hand2" ||
        equipmentSlot === "hand3" ||
        equipmentSlot === "hand4"
      );
    }
    case "armor": {
      return equipmentSlot === "body";
    }
    case "boots": {
      return equipmentSlot === "feet";
    }
    case "crown": {
      return (
        equipmentSlot === "head1" ||
        equipmentSlot === "head2" ||
        equipmentSlot === "head3"
      );
    }
    case "helm": {
      return (
        equipmentSlot === "head1" ||
        equipmentSlot === "head2" ||
        equipmentSlot === "head3"
      );
    }
    case "misc": {
      return (
        equipmentSlot === "misc1" ||
        equipmentSlot === "misc2" ||
        equipmentSlot === "misc3" ||
        equipmentSlot === "misc4" ||
        equipmentSlot === "misc5"
      );
    }
    case "shield": {
      return (
        equipmentSlot === "hand1" ||
        equipmentSlot === "hand2" ||
        equipmentSlot === "hand3" ||
        equipmentSlot === "hand4"
      );
    }
  }
}
export default ArmyBuilder;
