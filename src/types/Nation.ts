const nationIndexes = [0, 1] as const;

type NationIndex = typeof nationIndexes[number];

export type Nation = {
  id: string;
  name: string;
  epithet: string;
  abbreviation: string;
  file_name_base: string;
  era: string;
  end: string;
};

type NationsByEra = {
  EarlyAge: Array<Nation>;
  MiddleAge: Array<Nation>;
  LateAge: Array<Nation>;
};

export type { NationsByEra, NationIndex };
