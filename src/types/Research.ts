const spellSchools = [
  "Conjuration",
  "Alteration",
  "Evocation",
  "Enchantment",
  "Construction",
  "Thaumaturgy",
  "Blood",
] as const;

const researchLevelsConst = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

type SpellSchool = typeof spellSchools[number];
type ResearchLevels = typeof researchLevelsConst[number];
type Research = {
  [key in SpellSchool]: ResearchLevels;
};

export { spellSchools, researchLevelsConst };
export type { SpellSchool, ResearchLevels, Research };
