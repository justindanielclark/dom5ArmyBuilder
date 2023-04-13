import "./index.css";

//@ts-ignore//
import unitsTsv from "./gamedata/BaseU.tsv";
//@ts-ignore//
import itemsTsv from "./gamedata/BaseI.tsv";
//@ts-ignore//
import nationsTsv from "./gamedata/nations.tsv";

import { useReducer, useMemo } from "react";
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
      .map((unit) => unit)
      .sort((a, b) => a.name.localeCompare(b.name));
    return returnable;
  }, []);
  const items = useMemo<Array<Item>>(() => {
    const returnable = (itemsTsv as Array<Item>)
      .map((item) => item)
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
  function addCommanderToArmy(
    commander: Commander,
    nationIndex: NationIndex
  ): void {
    dispatch({
      payload: {
        data: commander,
        nationIndex,
      },
      type: "addCommander",
    });
  }

  return (
    <main className="flex flex-row h-full">
      <NationPicker
        handleCheckboxClick={addNation}
        parentState={state.nations}
        nations={nations}
      />
      <ResearchPicker
        handleResearchChange={changeResearch}
        nations={state.nations}
        research={state.research}
      />
      <div className="flex flex-col">
        <UnitPicker
          units={units}
          chosenUnit={state.chosenUnit}
          handleChooseUnit={chooseUnit}
        />
        <ItemPicker
          items={items}
          chosenItem={state.chosenItem}
          handleChooseItem={chooseItem}
        />
      </div>
      <ArmyBuilder
        armies={state.armies}
        chosenItem={state.chosenItem}
        chosenUnit={state.chosenUnit}
        nations={state.nations}
        handleAddCommander={addCommanderToArmy}
      />
    </main>
  );
}

export default App;
