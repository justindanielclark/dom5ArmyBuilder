import { Item } from "./Item";
import { Unit, Commander } from "./Unit";
import { Research } from "./Research";
import { Nation, NationIndex } from "./Nation";

interface WithPayload<Type> {
  payload: {
    data: Type;
  };
}

interface WithPayloadWithIndex<Type> {
  payload: {
    data: Type;
    nationIndex: NationIndex;
  };
}

interface NationAction extends WithPayloadWithIndex<Nation | null> {
  type: "submitNation";
}
interface ResearchAction extends WithPayloadWithIndex<Research> {
  type: "submitResearch";
}
interface UnitAction extends WithPayload<Unit | null> {
  type: "chooseUnit";
}
interface ItemAction extends WithPayload<Item | null> {
  type: "chooseItem";
}
interface AddCommanderToArmyAction extends WithPayloadWithIndex<Commander> {
  type: "addCommander";
}
type ReducerAction =
  | NationAction
  | ResearchAction
  | UnitAction
  | ItemAction
  | AddCommanderToArmyAction;

export default ReducerAction;
