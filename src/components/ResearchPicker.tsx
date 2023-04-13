import React, { useState } from "react";
import { Nation, NationIndex } from "../types/Nation";
import {
  Research,
  spellSchools,
  researchLevelsConst,
  ResearchLevels,
} from "../types/Research";

type Props = {
  research: [Research, Research];
  nations: [Nation | null, Nation | null];
  handleResearchChange: (research: Research, nationIndex: NationIndex) => void;
};

function ResearchPicker({ nations, research, handleResearchChange }: Props) {
  return (
    <section className="py-3 px-5 border-r-2 flex flex-col gap-4">
      <h1 className="text-2xl font-bold underline underline-offset-2">
        Research:
      </h1>
      {nations.map((nation, idx) => {
        const i = idx as NationIndex;
        return (
          <div key={idx}>
            <h1 className="text-xl font-bold mb-2">
              {nation !== null ? `${nation.name}:` : `Nation ${i + 1}:`}
            </h1>
            <ul className="px-3">
              {Object.keys(research[idx]).map((researchKey) => (
                <li key={researchKey}>
                  <span className="w-32 inline-block">{researchKey}:</span>
                  <select
                    className="text-black"
                    value={research[i][researchKey as keyof Research]}
                    onChange={(e) => {
                      const newResearch = { ...research[i] };
                      newResearch[researchKey as keyof Research] = parseInt(
                        e.target.value
                      ) as ResearchLevels;
                      handleResearchChange(newResearch, i);
                    }}
                  >
                    {researchLevelsConst.map((level) => (
                      <option
                        className="text-black"
                        value={level}
                        key={`${researchKey}_${level}`}
                      >
                        {level}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

export default ResearchPicker;
