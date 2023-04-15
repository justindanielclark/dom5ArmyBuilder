import "./index.css";

//@ts-ignore//
import unitsTsv from "./gamedata/BaseU.tsv";
//@ts-ignore//
import itemsTsv from "./gamedata/BaseI.tsv";
//@ts-ignore//
import nationsTsv from "./gamedata/nations.tsv";

import { useReducer, useMemo, useState } from "react";
import { Nation, NationIndex, NationsByEra } from "./types/Nation";
import { Commander, Unit } from "./types/Unit";
import { Item, ItemTypeConst } from "./types/Item";
import { Research } from "./types/Research";

import NationPicker from "./components/NationPicker";
import ResearchPicker from "./components/ResearchPicker";
import UnitPicker from "./components/UnitPicker";
import ItemPicker from "./components/ItemPicker";

import AppState from "./types/AppState";
import ReducerAction from "./types/ReducerAction";
import ArmyBuilder from "./components/ArmyBuilder";

function appStateReducer(state: AppState, action: ReducerAction): AppState {
  switch (action.type) {
    case "submitNation": {
      const newNations = [...state.nations] as [Nation | null, Nation | null];
      const { data, nationIndex } = action.payload;
      newNations[nationIndex] = data;
      return {
        ...state,
        nations: newNations,
      };
    }
    case "submitResearch": {
      const newResearch = [...state.research] as [Research, Research];
      const { data, nationIndex } = action.payload;
      newResearch[nationIndex] = data;
      return {
        ...state,
        research: newResearch,
      };
    }
    case "chooseUnit": {
      return {
        ...state,
        chosenUnit: action.payload.data,
      };
    }
    case "chooseItem": {
      return {
        ...state,
        chosenItem: action.payload.data,
      };
    }
    case "addCommander": {
      const { data, nationIndex } = action.payload;
      const newArmies = [[...state.armies[0]], [...state.armies[1]]];
      newArmies[nationIndex].push(data);
      return {
        ...state,
        armies: newArmies,
      };
    }
    case "removeCommander": {
      const { data, nationIndex } = action.payload;
      const newArmies = [[...state.armies[0]], [...state.armies[1]]];
      newArmies[nationIndex] = [
        ...newArmies[nationIndex].slice(0, data),
        ...newArmies[nationIndex].slice(data + 1),
      ];
      return {
        ...state,
        armies: newArmies,
      };
    }
    case "adjustCommanderPositionDown": {
      //Check for overflow done in handler
      const { data, nationIndex } = action.payload;
      const newArmies = [[...state.armies[0]], [...state.armies[1]]];
      const temp = newArmies[nationIndex][data];
      newArmies[nationIndex][data] = newArmies[nationIndex][data + 1];
      newArmies[nationIndex][data + 1] = temp;
      return {
        ...state,
        armies: newArmies,
      };
    }
    case "adjustCommanderPositionUp": {
      //Check for overflow done in handler
      const { data, nationIndex } = action.payload;
      const newArmies = [[...state.armies[0]], [...state.armies[1]]];
      const temp = newArmies[nationIndex][data];
      newArmies[nationIndex][data] = newArmies[nationIndex][data - 1];
      newArmies[nationIndex][data - 1] = temp;
      return {
        ...state,
        armies: newArmies,
      };
    }
    case "copyCommander": {
      const { data, nationIndex } = action.payload;
      const { cmdr, cmdrIndex } = data;
      const newArmies = [[...state.armies[0]], [...state.armies[1]]];
      newArmies[nationIndex] = [
        ...newArmies[nationIndex].slice(0, cmdrIndex),
        cmdr,
        ...newArmies[nationIndex].slice(cmdrIndex),
      ];
      return {
        ...state,
        armies: newArmies,
      };
    }
    case "updateCommander": {
      const { data, nationIndex } = action.payload;
      const { cmdr, cmdrIndex } = data;
      const newArmies = [[...state.armies[0]], [...state.armies[1]]];
      newArmies[nationIndex][cmdrIndex] = cmdr;
      return {
        ...state,
        armies: newArmies,
      };
    }
    default: {
      throw new Error("Error in AppStateReducer with invalid action type call");
    }
  }
}
function createInitialState(): AppState {
  return {
    chosenItem: null,
    chosenUnit: null,
    nations: [null, null],
    armies: [[], []],
    research: [
      {
        Conjuration: 0,
        Alteration: 0,
        Enchantment: 0,
        Construction: 0,
        Blood: 0,
        Evocation: 0,
        Thaumaturgy: 0,
      },
      {
        Conjuration: 0,
        Alteration: 0,
        Enchantment: 0,
        Construction: 0,
        Blood: 0,
        Evocation: 0,
        Thaumaturgy: 0,
      },
    ],
  };
}

type Displaying = {
  Nations: boolean;
  Research: boolean;
  UnitSearch: boolean;
  ItemSearch: boolean;
};

function App() {
  const nations = useMemo<NationsByEra>(() => {
    const returnable = (nationsTsv as Array<Nation>).reduce(
      (acc, cur) => {
        switch (cur.era) {
          case "1": {
            acc.EarlyAge.push(cur);
            break;
          }
          case "2": {
            acc.MiddleAge.push(cur);
            break;
          }
          case "3": {
            acc.LateAge.push(cur);
            break;
          }
        }
        return acc;
      },
      {
        EarlyAge: [],
        MiddleAge: [],
        LateAge: [],
      } as NationsByEra
    );
    Object.keys(returnable).forEach((key) => {
      returnable[key as keyof NationsByEra] = returnable[
        key as keyof NationsByEra
      ].sort((a, b) => a.name.localeCompare(b.name));
    });
    return returnable;
  }, []);
  const units = useMemo<Array<Unit>>(() => {
    const returnable = (unitsTsv as Array<Unit>)
      .map((unit) => {
        return {
          id: unit.id,
          aquatic: unit.aquatic,
          name: unit.name,
          leader: unit.leader,
          holy: unit.holy,
          crownonly: unit.crownonly,
          undeadleader: unit.undeadleader,
          magicleader: unit.magicleader,
          size: unit.size,
          hp: unit.hp,
          prot: unit.prot,
          mr: unit.mr,
          mor: unit.mor,
          str: unit.str,
          att: unit.att,
          def: unit.def,
          prec: unit.prec,
          enc: unit.enc,
          ap: unit.ap,
          mapmove: unit.mapmove,
          startage: unit.startage,
          maxage: unit.maxage,
          F: unit.F,
          A: unit.A,
          W: unit.W,
          E: unit.E,
          S: unit.S,
          D: unit.D,
          N: unit.N,
          B: unit.B,
          H: unit.H,
          mask1: unit.mask1,
          mask2: unit.mask2,
          mask3: unit.mask3,
          mask4: unit.mask4,
          mask5: unit.mask5,
          mask6: unit.mask6,
          rand1: unit.rand1,
          rand2: unit.rand2,
          rand3: unit.rand3,
          rand4: unit.rand4,
          rand5: unit.rand5,
          rand6: unit.rand6,
          nbr1: unit.nbr1,
          nbr2: unit.nbr2,
          nbr3: unit.nbr3,
          nbr4: unit.nbr4,
          nbr5: unit.nbr5,
          nbr6: unit.nbr6,
          link1: unit.link1,
          link2: unit.link2,
          link3: unit.link3,
          link4: unit.link4,
          link5: unit.link5,
          link6: unit.link6,
          hand: unit.hand,
          head: unit.head,
          body: unit.body,
          foot: unit.foot,
          misc: unit.misc,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    return returnable;
  }, []);
  const items = useMemo<Array<Item>>(() => {
    const returnable = (itemsTsv as Array<Item>)
      .map((item) => {
        return {
          id: item.id,
          name: item.name,
          type: item.type,
        };
      })
      .sort((a, b) => {
        const aTypeIndex = ItemTypeConst.indexOf(a.type);
        const bTypeIndex = ItemTypeConst.indexOf(b.type);
        if (aTypeIndex === bTypeIndex) {
          return a.name.localeCompare(b.name);
        }
        return aTypeIndex - bTypeIndex;
      });
    return returnable;
  }, []);
  const [state, dispatch] = useReducer(appStateReducer, createInitialState());
  const [displaying, setDisplaying] = useState<Displaying>({
    Nations: false,
    Research: false,
    UnitSearch: false,
    ItemSearch: false,
  });

  function toggleDisplay(displayKey: keyof Displaying): void {
    setDisplaying((x) => {
      const newDisplaying: Displaying = {
        ...x,
        [displayKey]: !x[displayKey],
      };
      return newDisplaying;
    });
  }

  function addNation(nation: Nation | null, nationIndex: NationIndex): void {
    dispatch({
      payload: {
        data: nation,
        nationIndex,
      },
      type: "submitNation",
    });
  }
  function changeResearch(research: Research, nationIndex: NationIndex): void {
    dispatch({
      payload: {
        data: research,
        nationIndex,
      },
      type: "submitResearch",
    });
  }
  function chooseUnit(unit: Unit | null): void {
    dispatch({
      payload: {
        data: unit,
      },
      type: "chooseUnit",
    });
  }
  function chooseItem(item: Item | null): void {
    dispatch({
      payload: {
        data: item,
      },
      type: "chooseItem",
    });
  }
  function addCommanderToArmy(cmdr: Commander, nationIndex: NationIndex): void {
    dispatch({
      payload: {
        data: cmdr,
        nationIndex,
      },
      type: "addCommander",
    });
  }
  function removeCommanderFromArmy(
    cmdrIndex: number,
    nationIndex: NationIndex
  ): void {
    dispatch({
      payload: {
        data: cmdrIndex,
        nationIndex,
      },
      type: "removeCommander",
    });
  }
  function shiftCommanderPosition(
    cmdrIdx: number,
    nationIndex: NationIndex,
    direction: "up" | "down"
  ): void {
    if (direction === "up" && cmdrIdx !== 0) {
      dispatch({
        payload: {
          data: cmdrIdx,
          nationIndex,
        },
        type: "adjustCommanderPositionUp",
      });
    } else if (
      direction === "down" &&
      cmdrIdx !== state.armies[nationIndex].length - 1
    ) {
      dispatch({
        payload: {
          data: cmdrIdx,
          nationIndex,
        },
        type: "adjustCommanderPositionDown",
      });
    }
  }
  function copyCommander(
    cmdr: Commander,
    cmdrIndex: number,
    nationIndex: NationIndex
  ): void {
    dispatch({
      type: "copyCommander",
      payload: {
        data: {
          cmdr,
          cmdrIndex,
        },
        nationIndex: nationIndex,
      },
    });
  }
  function updateCommander(
    cmdr: Commander,
    cmdrIndex: number,
    nationIndex: NationIndex
  ): void {
    dispatch({
      type: "updateCommander",
      payload: {
        data: {
          cmdr,
          cmdrIndex,
        },
        nationIndex,
      },
    });
  }

  return (
    <main className="flex flex-row min-h-screen">
      <div className="flex flex-col w-96 bg-neutral-800 border-r-2 border-neutral-900 min-h-full overflow-y-auto">
        <NationPicker
          handleCheckboxClick={addNation}
          parentState={state.nations}
          nations={nations}
          displaying={displaying.Nations}
          toggleDisplay={toggleDisplay}
        />
        <ResearchPicker
          handleResearchChange={changeResearch}
          nations={state.nations}
          research={state.research}
          displaying={displaying.Research}
          toggleDisplay={toggleDisplay}
        />

        <UnitPicker
          units={units}
          chosenUnit={state.chosenUnit}
          handleChooseUnit={chooseUnit}
          displaying={displaying.UnitSearch}
          toggleDisplay={toggleDisplay}
        />
        <ItemPicker
          items={items}
          chosenItem={state.chosenItem}
          handleChooseItem={chooseItem}
          displaying={displaying.ItemSearch}
          toggleDisplay={toggleDisplay}
        />
      </div>

      <ArmyBuilder
        armies={state.armies}
        chosenItem={state.chosenItem}
        chosenUnit={state.chosenUnit}
        nations={state.nations}
        handleAddCommander={addCommanderToArmy}
        handleRemoveCommander={removeCommanderFromArmy}
        handleShiftCommanderPos={shiftCommanderPosition}
        handleCopyCommander={copyCommander}
        handleUpdateCommander={updateCommander}
      />
    </main>
  );
}

export default App;
export type { Displaying };
