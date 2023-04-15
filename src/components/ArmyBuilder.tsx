import { Item } from "../types/Item";
import {
  Unit,
  Commander,
  CommanderEquipment,
  unitHandsConst,
  unitHeadsConst,
  unitMiscConst,
} from "../types/Unit";
import { Nation, NationIndex } from "../types/Nation";
import CommanderDisplay from "./CommanderDisplay";
import addSVG from "../images/add.svg";
import listSVG from "../images/list.svg";

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
    <section className="p-3 flex-1 max-w-5xl">
      <h1 className="text-2xl font-bold">Army Builder: </h1>
      <div className="flex flex-row gap-6">
        {nations.map((nation, idx) => (
          <div key={idx} className="flex-1">
            <div className="flex flex-row justify-between items-center mb-2">
              <div className="flex flex-row gap-2">
                <h2 className="text-xl underline underline-offset-2">
                  {nation ? nation.name : `Nation ${idx + 1}`}
                </h2>
                {armies[idx].length > 0 ? (
                  <div className="relative">
                    <img className="w-6 h-6 peer" src={listSVG} />
                    <div className="absolute peer-hover:block hidden z-50 bg-slate-800 p-2 border-2 border-white rounded-lg text-sm w-48">
                      {createArmySummary(armies[idx])}
                    </div>
                  </div>
                ) : undefined}
              </div>

              {chosenUnit ? (
                <button
                  className="h-5 w-5 mr-2 bg-green-900 rounded-full"
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

function createArmySummary(army: Array<Commander>): JSX.Element {
  const Commanders = new Map<string, number>();
  const Units = new Map<string, number>();
  army.forEach((cmdr) => {
    const CmdrString = `${cmdr.name}-|-${cmdr.id}`;
    const CmdrGet = Commanders.get(CmdrString);
    CmdrGet === undefined
      ? Commanders.set(CmdrString, 1)
      : Commanders.set(CmdrString, CmdrGet + 1);
    cmdr.squads.forEach((squad) => {
      const UnitString = `${squad.unit.name}-|-${squad.unit.id}`;
      const UnitGet = Units.get(UnitString);
      UnitGet === undefined
        ? Units.set(UnitString, squad.quantity)
        : Units.set(UnitString, UnitGet + squad.quantity);
    });
  });
  const CommanderData: Array<{ name: string; quantity: number }> = Array.from(
    Commanders.entries()
  ).map((set) => {
    return {
      name: set[0].split("-|-")[0],
      quantity: set[1],
    };
  });
  const UnitData: Array<{ name: string; quantity: number }> = Array.from(
    Units.entries()
  ).map((set) => {
    return {
      name: set[0].split("-|-")[0],
      quantity: set[1],
    };
  });
  return (
    <>
      <h1 className="font-bold underline">Commanders:</h1>
      <ul>
        {CommanderData.map((data, idx) => (
          <li key={idx} className="ml-2">
            <span className="inline-block mr-2 font-bold">{data.name}:</span>
            {data.quantity}
          </li>
        ))}
      </ul>
      {UnitData.length > 0 ? (
        <>
          <h1 className="font-bold underline">Units:</h1>
          <ul>
            {UnitData.map((data, idx) => (
              <li key={idx} className="ml-2">
                <span className="inline-block mr-2 font-bold">
                  {data.name}:
                </span>
                {data.quantity}
              </li>
            ))}
          </ul>
        </>
      ) : undefined}
    </>
  );
}

export default ArmyBuilder;
