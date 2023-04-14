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
import CommanderDisplay from "./CommanderDisplay";
import addSVG from "../images/add.svg";

type Props = {
  nations: [Nation | null, Nation | null];
  chosenUnit: Unit | null;
  chosenItem: Item | null;
  armies: Array<Array<Commander>>;
  handleAddCommander: (commander: Commander, nationIndex: NationIndex) => void;
  handleRemoveCommander: (cmdrIndex: number, nationIndex: NationIndex) => void;
  handleCopyCommander: (
    cmdr: Commander,
    cmdrIndex: number,
    nationIndex: NationIndex
  ) => void;
  handleShiftCommanderPos: (
    cmdrIdx: number,
    nationIndex: NationIndex,
    direction: "up" | "down"
  ) => void;
  handleUpdateCommander: (
    cmdr: Commander,
    cmdrIndex: number,
    nationIndex: NationIndex
  ) => void;
};

function ArmyBuilder({
  nations,
  armies,
  chosenUnit,
  chosenItem,
  handleAddCommander,
  handleRemoveCommander,
  handleShiftCommanderPos,
  handleCopyCommander,
  handleUpdateCommander,
}: Props) {
  return (
    <section className="p-3 border-l-2 border-white flex-1 max-w-3xl">
      <h1 className="text-2xl font-bold">Army Builder: </h1>
      <div className="flex flex-row gap-2">
        {nations.map((nation, idx) => (
          <div key={idx} className="flex-1">
            <div className="flex flex-row justify-between">
              <h2 className="text-xl underline underline-offset-2">
                {nation ? nation.name : `Nation ${idx + 1}`}
              </h2>
              {chosenUnit ? (
                <button
                  className="h-5 w-5 mr-2"
                  style={{
                    backgroundImage: `url(${addSVG})`,
                    backgroundSize: "contain",
                  }}
                  onClick={(e) => {
                    handleAddCommander(
                      convertUnitToCommander(chosenUnit),
                      idx as NationIndex
                    );
                  }}
                ></button>
              ) : undefined}
            </div>
            {armies[idx as NationIndex].length > 0 ? (
              <ul className="pl-1 flex flex-col gap-2">
                {armies[idx].map((cmdr, i) => (
                  <CommanderDisplay
                    key={i}
                    cmdr={cmdr}
                    cmdrIdx={i}
                    nationIdx={idx as NationIndex}
                    handleRemoveCommander={handleRemoveCommander}
                    handleShiftCommanderPos={handleShiftCommanderPos}
                    handleCopyCommander={handleCopyCommander}
                    chosenItem={chosenItem}
                    chosenUnit={chosenUnit}
                    handleUpdateCommander={handleUpdateCommander}
                  />
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
    equipment[unitHandsConst[i]] = null;
  }
  for (let i = 0; i < numHeads; i++) {
    equipment[unitHeadsConst[i]] = null;
  }
  for (let i = 0; i < numMisc; i++) {
    equipment[unitMiscConst[i]] = null;
  }
  if (numBody > 0) {
    equipment.body = null;
  }
  if (numFeet > 0) {
    equipment.feet = null;
  }
  return {
    ...unit,
    squads: [],
    equipment,
  };
}

export default ArmyBuilder;
