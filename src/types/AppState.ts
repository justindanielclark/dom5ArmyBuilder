import Unit, { Commander } from "./Unit";
import { Nation } from "./Nation";
import { Research } from "./Research";
import { Item } from "./Item";
type AppState = {
  chosenUnit: null | Unit;
  chosenItem: null | Item;
  nations: [Nation | null, Nation | null];
  armies: Array<Array<Commander>>;
  research: [Research, Research];
};

export default AppState;
