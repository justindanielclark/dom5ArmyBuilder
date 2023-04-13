import { Nation, NationIndex, NationsByEra } from "../types/Nation";
import * as d3 from "d3";
import { useEffect, useMemo, useState } from "react";

type Props = {
  nations: NationsByEra;
  parentState: [Nation | null, Nation | null];
  handleCheckboxClick: (
    nation: Nation | null,
    nationIndex: NationIndex
  ) => void;
};

function NationPicker({ parentState, handleCheckboxClick, nations }: Props) {
  const [chosenAge, setChosenAge] = useState<keyof NationsByEra>("EarlyAge");
  return (
    <section className="py-3 px-5 border-r-2">
      <h1 className="text-2xl font-bold mb-2 underline underline-offset-2">
        Nations:
      </h1>
      <select
        className="bg-stone-100 text-black p-1 text-sm rounded-lg"
        value={chosenAge}
        onChange={(e) => {
          setChosenAge(e.target.value as keyof NationsByEra);
          handleCheckboxClick(null, 0);
          handleCheckboxClick(null, 1);
        }}
      >
        <option value="EarlyAge">Early Age</option>
        <option value="MiddleAge">Middle Age</option>
        <option value="LateAge">Late Age</option>
      </select>
      {renderNationsByAge(nations, chosenAge, parentState, handleCheckboxClick)}
    </section>
  );
}

function nationLiMap(
  nation: Nation,
  chosenNations: [Nation | null, Nation | null],
  handleCheckboxClick: (nation: Nation | null, nationIndex: NationIndex) => void
): JSX.Element {
  const checked =
    chosenNations[0] && chosenNations[0].id === nation.id ? true : false;
  return (
    <li
      key={nation.id}
      className="flex flex-row w-full justify-between max-w-sm px-4 text-xs"
    >
      <span className="inline-block">{nation.name}</span>
      <div>
        <input
          checked={checked}
          type="checkbox"
          className="mr-3 "
          onChange={(e) => {
            if (!e.target.value) {
              handleCheckboxClick(null, 0);
            } else if (
              e.target.value &&
              (chosenNations[1] === null || chosenNations[1].id !== nation.id)
            ) {
              handleCheckboxClick(nation, 0);
            }
          }}
        />
        <input
          checked={
            chosenNations[1] && chosenNations[1].id === nation.id ? true : false
          }
          className=""
          type="checkbox"
          onChange={(e) => {
            if (!e.target.value) {
              handleCheckboxClick(null, 1);
            } else if (
              e.target.value &&
              (chosenNations[0] === null || chosenNations[0].id !== nation.id)
            ) {
              handleCheckboxClick(nation, 1);
            }
          }}
        />
      </div>
    </li>
  );
}
function renderNationsByAge(
  nations: NationsByEra,
  chosenAge: keyof NationsByEra,
  chosenNations: [Nation | null, Nation | null],
  handleCheckboxClick: (nation: Nation | null, nationIndex: NationIndex) => void
): JSX.Element {
  switch (chosenAge) {
    case "EarlyAge": {
      return (
        <ul className="my-2 flex flex-col gap-1">
          {nations.EarlyAge.map((nation) =>
            nationLiMap(nation, chosenNations, handleCheckboxClick)
          )}
        </ul>
      );
    }
    case "MiddleAge": {
      return (
        <ul className="my-2 flex flex-col gap-1">
          {nations.MiddleAge.map((nation) =>
            nationLiMap(nation, chosenNations, handleCheckboxClick)
          )}
        </ul>
      );
    }
    case "LateAge": {
      return (
        <ul className="my-2 flex flex-col gap-1">
          {nations.LateAge.map((nation) =>
            nationLiMap(nation, chosenNations, handleCheckboxClick)
          )}
        </ul>
      );
    }
  }
}

export default NationPicker;
