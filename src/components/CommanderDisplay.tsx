import { Item } from "../types/Item";
import { NationIndex } from "../types/Nation";
import {
  Unit,
  Commander,
  CommanderEquipment,
  unitHandsConst,
  unitHeadsConst,
  unitMiscConst,
  allPossibleSlotsConst,
  Squad,
} from "../types/Unit";
import swordSVG from "../images/sword.svg";
import flagSVG from "../images/flag.svg";
import copySVG from "../images/copy.svg";
import trashSVG from "../images/trash.svg";
import upSVG from "../images/up.svg";
import downSVG from "../images/down.svg";
import { isNumber } from "../utils/isNumber";

type Props = {
  chosenUnit: Unit | null;
  chosenItem: Item | null;
  cmdrIdx: number;
  nationIdx: NationIndex;
  cmdr: Commander;
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

function CommanderDisplay({
  cmdr,
  chosenItem,
  chosenUnit,
  handleRemoveCommander,
  handleCopyCommander,
  handleShiftCommanderPos,
  handleUpdateCommander,
  cmdrIdx,
  nationIdx,
}: Props) {
  function cmdrCanUseItem(item: Item, cmdr: Commander): boolean {
    switch (item.type) {
      case "1-h wpn": {
        return calculateFreeHands(cmdr) > 0;
      }
      case "2-h wpn": {
        return calculateFreeHands(cmdr) > 1;
      }
      case "armor": {
        return calculateFreeBody(cmdr) > 0;
      }
      case "boots": {
        return calculateFreeFeet(cmdr) > 0;
      }
      case "crown": {
        return calculateFreeHeads(cmdr) > 0;
      }
      case "helm": {
        return calculateFreeHeads(cmdr) > 0 && cmdr.crownonly !== "1";
      }
      case "misc": {
        return calculateFreeMisc(cmdr) > 0;
      }
      case "shield": {
        const freeHands = calculateFreeHands(cmdr);
        return (
          freeHands > 0 &&
          1 + calculateTotalShields(cmdr) <= Math.floor(parseInt(cmdr.hand) / 2)
        );
      }
    }
  }
  function displayAvailableSlots(
    cmdr: Commander,
    chosenItem: Item | null
  ): JSX.Element | undefined {
    const numOpenHands = calculateFreeHands(cmdr);
    const numOpenHeads = calculateFreeHeads(cmdr);
    const numOpenMisc = calculateFreeMisc(cmdr);
    const openBody = calculateFreeBody(cmdr);
    const openFeet = calculateFreeFeet(cmdr);
    const totalOpen =
      numOpenHands + numOpenHeads + numOpenMisc + openBody + openFeet;

    return totalOpen > 0 ? (
      <div className="flex flex-row gap-1 text-xs">
        <span className="font-bold">Open:</span>
        {numOpenHands > 0 ? (
          <span>{`${numOpenHands > 1 ? numOpenHands + " " : ""} Hand${
            numOpenHands > 1 ? "s" : ""
          }`}</span>
        ) : undefined}
        {numOpenHeads > 0 ? (
          <span>{`${numOpenHeads > 1 ? numOpenHeads + " " : ""} Head${
            numOpenHeads > 1 ? "s" : ""
          }`}</span>
        ) : undefined}
        {openBody > 0 ? <span>Body</span> : undefined}
        {openFeet > 0 ? <span>Feet</span> : undefined}
        {numOpenMisc > 0 ? (
          <span>{`${numOpenMisc > 1 ? numOpenMisc + " " : ""} Misc${
            numOpenMisc > 1 ? "s" : ""
          }`}</span>
        ) : undefined}
      </div>
    ) : undefined;
  }
  function calculateFreeHeads(cmdr: Commander): number {
    return unitHeadsConst.reduce((acc, cur) => {
      return acc + (cmdr.equipment[cur] === null ? 1 : 0);
    }, 0);
  }
  function calculateFreeHands(cmdr: Commander): number {
    return unitHandsConst.reduce((acc, cur) => {
      let cost = 0;
      if (cmdr.equipment[cur] === null) {
        return acc + 1;
      } else if (cmdr.equipment[cur] === undefined) {
        return acc;
      } else if (cmdr.equipment[cur]?.type === "2-h wpn") {
        return acc - 1;
      }
      return acc;
    }, 0);
  }
  function calculateFreeMisc(cmdr: Commander): number {
    return unitMiscConst.reduce((acc, cur) => {
      return acc + (cmdr.equipment[cur] === null ? 1 : 0);
    }, 0);
  }
  function calculateFreeBody(cmdr: Commander): number {
    return cmdr.equipment["body"] === null ? 1 : 0;
  }
  function calculateFreeFeet(cmdr: Commander): number {
    return cmdr.equipment["feet"] === null ? 1 : 0;
  }
  function calculateTotalShields(cmdr: Commander): number {
    return unitHandsConst.reduce((acc, cur) => {
      if (cmdr.equipment[cur] !== null && cmdr.equipment[cur] !== undefined) {
        const item = cmdr.equipment[cur] as Item;
        return acc + (item.type === "shield" ? 1 : 0);
      }
      return acc;
    }, 0);
  }
  function displayEquipment(cmdr: Commander): JSX.Element | undefined {
    const equipment: Array<{
      slot: typeof allPossibleSlotsConst[number];
      item: Item | null;
    }> = [];
    allPossibleSlotsConst.forEach((slot) => {
      if (cmdr.equipment[slot] !== undefined && cmdr.equipment[slot] !== null) {
        equipment.push({ slot, item: cmdr.equipment[slot] as Item | null });
      }
    });
    return equipment.length > 0 ? (
      <ul className="flex flex-col">
        {equipment.map((eq) => (
          <li key={eq.slot} className="text-xs flex flex-row ml-4 mb-0.5">
            <button
              className="w-4 h-4 cursor-pointer mr-2"
              style={{
                backgroundImage: `url(${trashSVG})`,
                backgroundSize: "contain",
              }}
              onClick={(e) => {
                const dupCmdr = createCommanderCopy(cmdr);
                removeItemFromCommander(dupCmdr, eq.item as Item, eq.slot);
                handleUpdateCommander(dupCmdr, cmdrIdx, nationIdx);
              }}
            ></button>
            <span className="w-14 inline-block">
              [
              {isNumber(eq.slot.charAt(eq.slot.length - 1))
                ? eq.slot.substring(0, eq.slot.length - 1)
                : eq.slot}
              ]:{" "}
            </span>
            <span className="inline-blox flex-1">{eq.item?.name}</span>
          </li>
        ))}
      </ul>
    ) : undefined;
  }
  function displaySquads(cmdr: Commander): JSX.Element | undefined {
    return cmdr.squads.length > 0 ? (
      <>
        <h3 className="font-bold text-sm">Squads</h3>
        <ul className="text-xs">
          {cmdr.squads.map((squad, i) => (
            <li key={i} className="flex flex-row w-full h-6 items-center">
              <input
                value={squad.quantity}
                min={1}
                max={1000}
                type="number"
                className="w-10 py-0.5 px-2 text-right bg-slate-700 focus:ring-0 focus:ring-offset-0 active:ring-0 active:ring-offset-0 border-none ring-0 outline-0 hover:bg-slate-600 active:bg-slate-600 focus:bg-slate-600"
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (newValue > 0) {
                    const newCmdr = createCommanderCopy(cmdr);
                    newCmdr.squads[i].quantity = newValue;
                    handleUpdateCommander(newCmdr, cmdrIdx, nationIdx);
                  }
                }}
              />
              <span className="ml-1 flex-1">{squad.unit.name}</span>
              <div className="">
                <button
                  className="w-4 h-4 mr-1 cursor-pointer"
                  style={{
                    backgroundImage: `url(${copySVG})`,
                    backgroundSize: "contain",
                  }}
                  onClick={(e) => {
                    const newCmdr = createCommanderCopy(cmdr);
                    const newSquad: Squad = {
                      quantity: newCmdr.squads[i].quantity,
                      unit: { ...newCmdr.squads[i].unit },
                    };
                    const newSquads: Array<Squad> = [
                      ...newCmdr.squads.slice(0, i),
                      newSquad,
                      ...newCmdr.squads.slice(i),
                    ];
                    newCmdr.squads = newSquads;
                    handleUpdateCommander(newCmdr, cmdrIdx, nationIdx);
                  }}
                ></button>
                <button
                  className="w-4 h-4 cursor-pointer"
                  style={{
                    backgroundImage: `url(${trashSVG})`,
                    backgroundSize: "contain",
                  }}
                  onClick={(e) => {
                    const newCmdr = createCommanderCopy(cmdr);
                    newCmdr.squads = cmdr.squads.filter(
                      (squad, idx) => i !== idx
                    );
                    handleUpdateCommander(newCmdr, cmdrIdx, nationIdx);
                  }}
                ></button>
              </div>
            </li>
          ))}
        </ul>
      </>
    ) : undefined;
  }
  function addItemToCommander(
    duplicate_cmdr: Commander,
    item_to_add: Item
  ): Commander {
    if (
      item_to_add.type === "1-h wpn" ||
      item_to_add.type === "2-h wpn" ||
      item_to_add.type === "shield"
    ) {
      //Create an Array of existing hand items
      const commandersHandEquipment = unitHandsConst.reduce((acc, cur) => {
        const item = duplicate_cmdr.equipment[cur];
        if (item !== undefined && item !== null) {
          acc.push(item);
        }
        return acc;
      }, [] as Array<Item>);
      //Add Our New Item
      commandersHandEquipment.push(item_to_add);
      //Sort them
      commandersHandEquipment.sort((a, b) => {
        const aValue = calcHandItemTypeValue(a);
        const bValue = calcHandItemTypeValue(b);
        const result = aValue - bValue;
        return result !== 0 ? result : a.name.localeCompare(b.name);
      });
      //Strip the current commander of hand items, careful to not turn undefined properties into defined ones
      unitHandsConst.forEach((key) => {
        const slot = duplicate_cmdr.equipment[key];
        if (slot !== undefined) {
          duplicate_cmdr.equipment[key] = null;
        }
      });
      //Reapply the now sorted hand items
      for (let i = 0; i < commandersHandEquipment.length; i++) {
        duplicate_cmdr.equipment[unitHandsConst[i]] =
          commandersHandEquipment[i];
      }
    } else if (item_to_add.type === "helm" || item_to_add.type === "crown") {
      //Create an Array of existing head items
      const commandersHeadEquipment = unitHeadsConst.reduce((acc, cur) => {
        const item = duplicate_cmdr.equipment[cur];
        if (item !== undefined && item !== null) {
          acc.push(item);
        }
        return acc;
      }, [] as Array<Item>);
      //Add Our New Item
      commandersHeadEquipment.push(item_to_add);
      //Sort them
      commandersHeadEquipment.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      //Strip the current commander of head items, careful to not turn undefined properties into defined ones
      unitHeadsConst.forEach((key) => {
        const slot = duplicate_cmdr.equipment[key];
        if (slot !== undefined) {
          duplicate_cmdr.equipment[key] = null;
        }
      });
      //Reapply the now sorted hand items
      for (let i = 0; i < commandersHeadEquipment.length; i++) {
        duplicate_cmdr.equipment[unitHeadsConst[i]] =
          commandersHeadEquipment[i];
      }
    } else if (item_to_add.type === "armor") {
      duplicate_cmdr.equipment["body"] = item_to_add;
    } else if (item_to_add.type === "boots") {
      duplicate_cmdr.equipment["feet"] = item_to_add;
    } else {
      //Create an Array of existing misc items
      const commandersMiscEquipment = unitMiscConst.reduce((acc, cur) => {
        const item = duplicate_cmdr.equipment[cur];
        if (item !== undefined && item !== null) {
          acc.push(item);
        }
        return acc;
      }, [] as Array<Item>);
      //Add Our New Item
      commandersMiscEquipment.push(item_to_add);
      //Sort them
      commandersMiscEquipment.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      //Strip the current commander of misc items, careful to not turn undefined properties into defined ones and to turn otherwise defined properities into null
      unitMiscConst.forEach((key) => {
        const slot = duplicate_cmdr.equipment[key];
        if (slot !== undefined) {
          duplicate_cmdr.equipment[key] = null;
        }
      });
      //Reapply the now sorted hand items
      for (let i = 0; i < commandersMiscEquipment.length; i++) {
        duplicate_cmdr.equipment[unitMiscConst[i]] = commandersMiscEquipment[i];
      }
    }
    return duplicate_cmdr;
    function calcHandItemTypeValue(item: Item) {
      let value = 0;
      switch (item.type) {
        case "1-h wpn": {
          value = 2;
        }
        case "2-h wpn": {
          value = 3;
        }
        case "shield": {
          value = 1;
        }
      }
      return value;
    }
  }
  function removeItemFromCommander(
    duplicate_cmdr: Commander,
    item_to_remove: Item,
    itemSlot: typeof allPossibleSlotsConst[number]
  ): Commander {
    if (
      item_to_remove.type === "1-h wpn" ||
      item_to_remove.type === "2-h wpn" ||
      item_to_remove.type === "shield"
    ) {
      //Set Our Item to Null At Its Slot
      duplicate_cmdr.equipment[itemSlot] = null;
      //Create an Array of remaining hand items
      const commandersHandEquipment = unitHandsConst.reduce((acc, cur) => {
        const item = duplicate_cmdr.equipment[cur];
        if (item !== undefined && item !== null) {
          acc.push(item);
        }
        return acc;
      }, [] as Array<Item>);
      //Sort them
      commandersHandEquipment.sort((a, b) => {
        const aValue = calcHandItemTypeValue(a);
        const bValue = calcHandItemTypeValue(b);
        const result = aValue - bValue;
        return result !== 0 ? result : a.name.localeCompare(b.name);
      });
      //Strip the current commander of hand items, careful to not turn undefined properties into defined ones
      unitHandsConst.forEach((key) => {
        const slot = duplicate_cmdr.equipment[key];
        if (slot !== undefined) {
          duplicate_cmdr.equipment[key] = null;
        }
      });
      //Reapply the now sorted hand items
      for (let i = 0; i < commandersHandEquipment.length; i++) {
        duplicate_cmdr.equipment[unitHandsConst[i]] =
          commandersHandEquipment[i];
      }
    } else if (
      item_to_remove.type === "helm" ||
      item_to_remove.type === "crown"
    ) {
      //Set Our Item to Null At Its Slot
      duplicate_cmdr.equipment[itemSlot] = null;
      //Create an Array of Remaining head items
      const commandersHeadEquipment = unitHeadsConst.reduce((acc, cur) => {
        const item = duplicate_cmdr.equipment[cur];
        if (item !== undefined && item !== null) {
          acc.push(item);
        }
        return acc;
      }, [] as Array<Item>);
      //Sort them
      commandersHeadEquipment.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      //Strip the current commander of head items, careful to not turn undefined properties into defined ones
      unitHeadsConst.forEach((key) => {
        const slot = duplicate_cmdr.equipment[key];
        if (slot !== undefined) {
          duplicate_cmdr.equipment[key] = null;
        }
      });
      //Reapply the now sorted head items
      for (let i = 0; i < commandersHeadEquipment.length; i++) {
        duplicate_cmdr.equipment[unitHeadsConst[i]] =
          commandersHeadEquipment[i];
      }
    } else if (item_to_remove.type === "armor") {
      duplicate_cmdr.equipment["body"] = null;
    } else if (item_to_remove.type === "boots") {
      duplicate_cmdr.equipment["feet"] = null;
    } else {
      //Set Our Item to Null At Its Slot
      duplicate_cmdr.equipment[itemSlot] = null;
      //Create an Array of existing misc items
      const commandersMiscEquipment = unitMiscConst.reduce((acc, cur) => {
        const item = duplicate_cmdr.equipment[cur];
        if (item !== undefined && item !== null) {
          acc.push(item);
        }
        return acc;
      }, [] as Array<Item>);
      //Sort them
      commandersMiscEquipment.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      //Strip the current commander of misc items, careful to not turn undefined properties into defined ones and to turn otherwise defined properities into null
      unitMiscConst.forEach((key) => {
        const slot = duplicate_cmdr.equipment[key];
        if (slot !== undefined) {
          duplicate_cmdr.equipment[key] = null;
        }
      });
      //Reapply the now sorted misc items
      for (let i = 0; i < commandersMiscEquipment.length; i++) {
        duplicate_cmdr.equipment[unitMiscConst[i]] = commandersMiscEquipment[i];
      }
    }
    return duplicate_cmdr;
    function calcHandItemTypeValue(item: Item) {
      let value = 0;
      switch (item.type) {
        case "1-h wpn": {
          value = 2;
        }
        case "2-h wpn": {
          value = 3;
        }
        case "shield": {
          value = 1;
        }
      }
      return value;
    }
  }
  return (
    <li className="flex flex-row w-full">
      <div className="flex flex-col mr-2">
        <button
          className="w-3 h-3"
          style={{
            backgroundImage: `url(${upSVG})`,
            backgroundSize: "contain",
          }}
          onClick={(e) => {
            handleShiftCommanderPos(cmdrIdx, nationIdx, "up");
          }}
        ></button>
        <button
          className="w-3 h-3"
          style={{
            backgroundImage: `url(${downSVG})`,
            backgroundSize: "contain",
          }}
          onClick={(e) => {
            handleShiftCommanderPos(cmdrIdx, nationIdx, "down");
          }}
        ></button>
      </div>
      <div className="flex-1">
        <div className="flex flex-row justify-end">
          {chosenItem !== null && cmdrCanUseItem(chosenItem, cmdr) ? (
            <button
              className="w-5 h-5 cursor-pointer"
              style={{
                backgroundImage: `url(${swordSVG})`,
                backgroundSize: "contain",
              }}
              onClick={(e) => {
                handleUpdateCommander(
                  addItemToCommander(createCommanderCopy(cmdr), chosenItem),
                  cmdrIdx,
                  nationIdx
                );
              }}
            ></button>
          ) : undefined}
          {chosenUnit !== null ? (
            <button
              className="w-5 h-5 cursor-pointer"
              style={{
                backgroundImage: `url(${flagSVG})`,
                backgroundSize: "contain",
              }}
              onClick={(e) => {
                const newCmdr = createCommanderCopy(cmdr);
                newCmdr.squads.push({ quantity: 1, unit: chosenUnit });
                handleUpdateCommander(newCmdr, cmdrIdx, nationIdx);
              }}
            ></button>
          ) : undefined}
          <button
            className="w-5 h-5 cursor-pointer"
            style={{
              backgroundImage: `url(${copySVG})`,
              backgroundSize: "contain",
            }}
            onClick={(e) => {
              handleCopyCommander(
                createCommanderCopy(cmdr),
                cmdrIdx,
                nationIdx
              );
            }}
          ></button>
          <button
            className="w-5 h-5 cursor-pointer"
            style={{
              backgroundImage: `url(${trashSVG})`,
              backgroundSize: "contain",
            }}
            onClick={(e) => {
              handleRemoveCommander(cmdrIdx, nationIdx);
            }}
          ></button>
        </div>
        <div className="even:bg-slate-700 odd:bg-neutral-700 px-2 rounded-lg">
          <h2 className="font-bold flex-1">{cmdr.name}</h2>
          {displayAvailableSlots(cmdr, chosenItem)}
          {displayEquipment(cmdr)}
          {displaySquads(cmdr)}
        </div>
      </div>
    </li>
  );
}

function createCommanderCopy(cmdr: Commander): Commander {
  const newCmdrEquipment: Partial<CommanderEquipment> = {};
  Object.keys(cmdr.equipment).forEach((validKey) => {
    const slotToCopy = cmdr.equipment[
      validKey as keyof CommanderEquipment
    ] as Item | null;
    slotToCopy === null
      ? (newCmdrEquipment[validKey as keyof CommanderEquipment] = null)
      : (newCmdrEquipment[validKey as keyof CommanderEquipment] = {
          ...slotToCopy,
        });
  });
  const newCmdrSquads: Array<Squad> = cmdr.squads.map((squad) => {
    return {
      quantity: squad.quantity,
      unit: {
        ...squad.unit,
      },
    };
  });
  const newCmdr: Commander = {
    ...cmdr,
    squads: newCmdrSquads,
    equipment: newCmdrEquipment,
  };

  return newCmdr;
}

export default CommanderDisplay;
