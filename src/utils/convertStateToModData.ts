// @ts-ignore //
import spellsTSV from "../gamedata/spells.tsv";
import Spell from "../types/Spell";
import AppState from "../types/AppState";

// #selectspell 528
// #researchlevel 0
// #notfornation 17
// #end

export default function convertStateToModData(appState: AppState): string {
  const { nations, research } = appState;
  const arr: Array<string> = [];
  const pretext = [
    '#modname "BattleTester_Research_Adjustment"',
    '#description "Required For Research Adjustments With Battle Tester Map File"',
    '#icon "BattleTester/Banner.tga"',
    "#version 1",
    "",
  ];
  const nation0ID = nations[0] ? nations[0].id : "-1";
  const nation1ID = nations[1] ? nations[1].id : "-1";

  (spellsTSV as Array<Spell>).forEach((spell) => {
    const researchlevel = parseInt(spell.researchlevel);
    if (
      spell.researchlevel === "0" ||
      spell.school === "-1" ||
      spell.school === "7" ||
      spell.path1 === "-1"
    ) {
      return;
    }
    switch (spell.school) {
      //Conjuration
      case "0": {
        const nation0Req = researchlevel <= research[0].Conjuration;
        const nation1Req = researchlevel <= research[1].Conjuration;
        if (nation0Req && nation1Req) {
          createSharedSpell(spell.id);
        } else if (nation0Req) {
          createExclusiveSpell(spell.id, nation1ID);
        } else if (nation1Req) {
          createExclusiveSpell(spell.id, nation0ID);
        }
        break;
      }
      //Alteration
      case "1": {
        const nation0Req = researchlevel <= research[0].Alteration;
        const nation1Req = researchlevel <= research[1].Alteration;
        if (nation0Req && nation1Req) {
          createSharedSpell(spell.id);
        } else if (nation0Req) {
          createExclusiveSpell(spell.id, nation1ID);
        } else if (nation1Req) {
          createExclusiveSpell(spell.id, nation0ID);
        }
        break;
      }
      //Evocation
      case "2": {
        const nation0Req = researchlevel <= research[0].Evocation;
        const nation1Req = researchlevel <= research[1].Evocation;
        if (nation0Req && nation1Req) {
          createSharedSpell(spell.id);
        } else if (nation0Req) {
          createExclusiveSpell(spell.id, nation1ID);
        } else if (nation1Req) {
          createExclusiveSpell(spell.id, nation0ID);
        }
        break;
      }
      //Enchantment
      case "3": {
        const nation0Req = researchlevel <= research[0].Enchantment;
        const nation1Req = researchlevel <= research[1].Enchantment;
        if (nation0Req && nation1Req) {
          createSharedSpell(spell.id);
        } else if (nation0Req) {
          createExclusiveSpell(spell.id, nation1ID);
        } else if (nation1Req) {
          createExclusiveSpell(spell.id, nation0ID);
        }
        break;
      }
      //Construction
      case "4": {
        const nation0Req = researchlevel <= research[0].Construction;
        const nation1Req = researchlevel <= research[1].Construction;
        if (nation0Req && nation1Req) {
          createSharedSpell(spell.id);
        } else if (nation0Req) {
          createExclusiveSpell(spell.id, nation1ID);
        } else if (nation1Req) {
          createExclusiveSpell(spell.id, nation0ID);
        }
        break;
      }
      //Thaum
      case "5": {
        const nation0Req = researchlevel <= research[0].Thaumaturgy;
        const nation1Req = researchlevel <= research[1].Thaumaturgy;
        if (nation0Req && nation1Req) {
          createSharedSpell(spell.id);
        } else if (nation0Req) {
          createExclusiveSpell(spell.id, nation1ID);
        } else if (nation1Req) {
          createExclusiveSpell(spell.id, nation0ID);
        }
        break;
      }
      //Blood
      case "6": {
        const nation0Req = researchlevel <= research[0].Blood;
        const nation1Req = researchlevel <= research[1].Blood;
        if (nation0Req && nation1Req) {
          createSharedSpell(spell.id);
        } else if (nation0Req) {
          createExclusiveSpell(spell.id, nation1ID);
        } else if (nation1Req) {
          createExclusiveSpell(spell.id, nation0ID);
        }
        break;
      }
    }
  });

  return [...pretext, ...arr].join("\n");

  function createSharedSpell(splNumber: string): void {
    arr.push(`#selectspell ${splNumber}`);
    arr.push("#researchlevel 0");
    arr.push("#end");
  }
  function createExclusiveSpell(splNumber: string, excludes: string): void {
    arr.push(`#selectspell ${splNumber}`);
    arr.push("#researchlevel 0");
    arr.push(`#notfornation ${excludes}`);
    arr.push("#end");
  }
}
