import { useState } from "react";
import { Commander, Unit } from "../types/Unit";
import eye from "../images/eye.svg";
import magicPathIcons from "../images/magicicons/magicPathIcons";
import { magicMasks } from "../types/Magic";
import {
  calcLdr,
  calcMgcLdr,
  calcUdLdr,
  hasMagic,
  hasPaths,
  hasRand,
} from "../utils/UnitUtil";
import upSVG from "../images/up.svg";
import downSVG from "../images/down.svg";
import { Displaying } from "../App";

const unitMagicKeys = ["F", "A", "W", "E", "S", "D", "N", "B", "H"] as const;

type Props = {
  handleChooseUnit: (unit: Unit | null) => void;
  chosenUnit: Unit | null;
  units: Array<Unit>;
  displaying: boolean;
  toggleDisplay: (displayKey: keyof Displaying) => void;
};

function UnitPicker({
  units,
  chosenUnit,
  handleChooseUnit,
  displaying,
  toggleDisplay,
}: Props) {
  const [search, setSearch] = useState("");
  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <section className="py-3 px-5 w-full">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-2 underline underline-offset-2">
          Unit Search:
        </h1>
        <button
          className="w-8 h-8"
          style={{
            backgroundImage: `url(${displaying ? downSVG : upSVG})`,
            backgroundSize: "cover",
          }}
          onClick={(e) => {
            setSearch("");
            handleChooseUnit(null);
            toggleDisplay("UnitSearch");
          }}
        ></button>
      </div>
      {displaying ? (
        <>
          <div>
            <input
              value={search}
              type="text"
              placeholder="Hyena Clan Witch Doctor"
              className="px-2 h-8 bg-white text-black"
              onChange={(e) => {
                setSearch(e.target.value);
                handleChooseUnit(null);
              }}
            />
            <button
              className="px-2 bg-neutral-500 text-neutral-50 border h-8"
              onClick={(e) => {
                if (chosenUnit !== null) {
                  handleChooseUnit(null);
                }
                if (search !== "") {
                  setSearch("");
                }
              }}
            >
              Clear
            </button>
          </div>
          {search !== "" ? (
            <div className="pt-2">
              {filteredUnits.length > 0 ? (
                <ol className="px-3 flex flex-col">
                  {filteredUnits
                    .slice(
                      0,
                      filteredUnits.length > 50 ? 50 : filteredUnits.length
                    )
                    .map((unit) => {
                      return (
                        <li key={unit.id} className="flex flex-row w-full">
                          <label htmlFor={unit.id} className="flex-1">
                            <input
                              checked={
                                chosenUnit && chosenUnit.id === unit.id
                                  ? true
                                  : false
                              }
                              id={unit.id}
                              name={unit.id}
                              className="mr-2"
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleChooseUnit(unit);
                                } else {
                                  handleChooseUnit(null);
                                }
                              }}
                            />
                            <span>{unit.name}</span>
                          </label>

                          <div className="relative">
                            <img className="h-6 w-6 peer" src={eye} />
                            <div className="hidden hover:flex absolute z-50 rounded-lg peer-hover:flex flex-col bg-slate-800 border-white border-2 text-xs gap-2 -translate-x-full left-5 -translate-y-full -top-1">
                              <div className="flex flex-row justify-between items-center">
                                <h1 className="p-1 font-bold text-md underline underline-offset-4">
                                  {unit.name}
                                </h1>
                                {unit.holy === "1" ? (
                                  <img
                                    src={magicPathIcons.H}
                                    className="h-3 w-3 mr-2"
                                  />
                                ) : undefined}
                              </div>
                              <div className="flex flex-row">
                                <div className="flex flex-col gap-1 border-slate-600 border-r-2 p-2 justify-start">
                                  <p className="flex flex-row flex-1 justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Hit Points:{" "}
                                    </span>
                                    {unit.hp}
                                  </p>
                                  <p className="flex flex-row flex-1 justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Size:
                                    </span>
                                    {unit.size}
                                  </p>
                                  <p className="flex flex-row flex-1 justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Nat Prot:
                                    </span>
                                    {unit.prot}
                                  </p>
                                  <p className="flex flex-row flex-1 justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Magic Res:
                                    </span>
                                    {unit.mr}
                                  </p>
                                  <p className="flex flex-row flex-1 justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Morale:
                                    </span>
                                    {unit.mor}
                                  </p>
                                  <p className="flex flex-row flex-1 justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Ldr:
                                    </span>
                                    {calcLdr(unit)}
                                  </p>
                                  {calcUdLdr(unit) > 0 ? (
                                    <p className="flex flex-row flex-1 justify-between">
                                      <span className="font-bold mr-2 whitespace-nowrap">
                                        UD Ldr:
                                      </span>
                                      {calcUdLdr(unit)}
                                    </p>
                                  ) : undefined}
                                  {calcMgcLdr(unit) > 0 ? (
                                    <p className="flex flex-row flex-1 justify-between">
                                      <span className="font-bold mr-2 whitespace-nowrap">
                                        Mgc Ldr:
                                      </span>
                                      {calcMgcLdr(unit)}
                                    </p>
                                  ) : undefined}
                                </div>
                                <div
                                  className={`flex flex-col gap-1 p-2${
                                    hasMagic(unit)
                                      ? " border-slate-600 border-r-2"
                                      : ""
                                  }`}
                                >
                                  <p className="flex flex-row justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Str:
                                    </span>
                                    {unit.str}
                                  </p>
                                  <p className="flex flex-row justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Att:
                                    </span>
                                    {unit.att}
                                  </p>
                                  <p className="flex flex-row justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Def:
                                    </span>
                                    {unit.def}
                                  </p>
                                  <p className="flex flex-row justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Prec:
                                    </span>
                                    {unit.prec}
                                  </p>
                                  <p className="flex flex-row justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      Spd:
                                    </span>
                                    {unit.ap}
                                  </p>
                                  <p className="flex flex-row justify-between">
                                    <span className="font-bold mr-2 whitespace-nowrap">
                                      MapMove:
                                    </span>
                                    {unit.mapmove}
                                  </p>
                                </div>
                                {hasMagic(unit) ? (
                                  <div className="flex flex-col gap-1 p-2 flex-1">
                                    {hasPaths(unit) ? (
                                      <div className="flex flex-row gap-1">
                                        {unitMagicKeys
                                          .reduce((acc, cur) => {
                                            if (unit[cur] !== "") {
                                              acc.push({
                                                path: cur,
                                                value: unit[cur],
                                              });
                                            }
                                            return acc;
                                          }, [] as Array<{ path: typeof unitMagicKeys[number]; value: string }>)
                                          .map((validPath) => (
                                            <div
                                              key={validPath.path}
                                              className="flex flex-col items-center w-4 gap-1"
                                            >
                                              <img
                                                className="h-4"
                                                src={
                                                  magicPathIcons[validPath.path]
                                                }
                                              />
                                              <p>{validPath.value}</p>
                                            </div>
                                          ))}
                                      </div>
                                    ) : undefined}
                                    {hasRand(unit, "rand1") ? (
                                      <div className="flex flex-row">
                                        <div className="flex flex-row h-4">
                                          {convertMagicMaskToImages(
                                            parseInt(unit.mask1)
                                          ).map((img) => img)}
                                        </div>
                                        <span className="inline-block flex-0 mr-2">
                                          +{unit.link1}
                                        </span>
                                        <span className="inline-block flex-0 mr-2">
                                          {unit.rand1}%
                                        </span>
                                        {parseInt(unit.nbr1) > 1 ? (
                                          <span className="inline-block flex-0">
                                            {parseInt(unit.nbr1) > 1
                                              ? `x${unit.nbr1}`
                                              : ``}
                                          </span>
                                        ) : undefined}
                                      </div>
                                    ) : undefined}
                                    {hasRand(unit, "rand2") ? (
                                      <div className="flex flex-row">
                                        <div className="flex flex-row h-4">
                                          {convertMagicMaskToImages(
                                            parseInt(unit.mask1)
                                          ).map((img) => img)}
                                        </div>
                                        <span className="inline-block flex-0 mr-2">
                                          +{unit.link1}
                                        </span>
                                        <span className="inline-block flex-0 mr-2">
                                          {unit.rand1}%
                                        </span>
                                        {parseInt(unit.nbr1) > 1 ? (
                                          <span className="inline-block flex-0">
                                            {parseInt(unit.nbr1) > 1
                                              ? `x${unit.nbr1}`
                                              : ``}
                                          </span>
                                        ) : undefined}
                                      </div>
                                    ) : undefined}
                                    {hasRand(unit, "rand3") ? (
                                      <div className="flex flex-row">
                                        <div className="flex flex-row h-4">
                                          {convertMagicMaskToImages(
                                            parseInt(unit.mask1)
                                          ).map((img) => img)}
                                        </div>
                                        <span className="inline-block flex-0 mr-2">
                                          +{unit.link1}
                                        </span>
                                        <span className="inline-block flex-0 mr-2">
                                          {unit.rand1}%
                                        </span>
                                        {parseInt(unit.nbr1) > 1 ? (
                                          <span className="inline-block flex-0">
                                            {parseInt(unit.nbr1) > 1
                                              ? `x${unit.nbr1}`
                                              : ``}
                                          </span>
                                        ) : undefined}
                                      </div>
                                    ) : undefined}
                                    {hasRand(unit, "rand4") ? (
                                      <div className="flex flex-row">
                                        <div className="flex flex-row h-4">
                                          {convertMagicMaskToImages(
                                            parseInt(unit.mask1)
                                          ).map((img) => img)}
                                        </div>
                                        <span className="inline-block flex-0 mr-2">
                                          +{unit.link1}
                                        </span>
                                        <span className="inline-block flex-0 mr-2">
                                          {unit.rand1}%
                                        </span>
                                        {parseInt(unit.nbr1) > 1 ? (
                                          <span className="inline-block flex-0">
                                            {parseInt(unit.nbr1) > 1
                                              ? `x${unit.nbr1}`
                                              : ``}
                                          </span>
                                        ) : undefined}
                                      </div>
                                    ) : undefined}
                                    {hasRand(unit, "rand5") ? (
                                      <div className="flex flex-row">
                                        <div className="flex flex-row h-4">
                                          {convertMagicMaskToImages(
                                            parseInt(unit.mask1)
                                          ).map((img) => img)}
                                        </div>
                                        <span className="inline-block flex-0 mr-2">
                                          +{unit.link1}
                                        </span>
                                        <span className="inline-block flex-0 mr-2">
                                          {unit.rand1}%
                                        </span>
                                        {parseInt(unit.nbr1) > 1 ? (
                                          <span className="inline-block flex-0">
                                            {parseInt(unit.nbr1) > 1
                                              ? `x${unit.nbr1}`
                                              : ``}
                                          </span>
                                        ) : undefined}
                                      </div>
                                    ) : undefined}
                                    {hasRand(unit, "rand6") ? (
                                      <div className="flex flex-row">
                                        <div className="flex flex-row h-4">
                                          {convertMagicMaskToImages(
                                            parseInt(unit.mask1)
                                          ).map((img) => img)}
                                        </div>
                                        <span className="inline-block flex-0 mr-2">
                                          +{unit.link1}
                                        </span>
                                        <span className="inline-block flex-0 mr-2">
                                          {unit.rand1}%
                                        </span>
                                        {parseInt(unit.nbr1) > 1 ? (
                                          <span className="inline-block flex-0">
                                            {parseInt(unit.nbr1) > 1
                                              ? `x${unit.nbr1}`
                                              : ``}
                                          </span>
                                        ) : undefined}
                                      </div>
                                    ) : undefined}
                                  </div>
                                ) : undefined}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ol>
              ) : (
                <p>Unable To Find Any Units With That Name</p>
              )}
            </div>
          ) : undefined}
        </>
      ) : undefined}
    </section>
  );
}

function convertMagicMaskToImages(mask: number): Array<JSX.Element> {
  const returnable: Array<JSX.Element> = [];
  let m = mask;
  for (let i = magicMasks.length - 1; i >= 0; i--) {
    if (m >= magicMasks[i]) {
      m -= magicMasks[i];
      returnable.unshift(
        <div className="w-4 h-4 relative" key={i}>
          <img
            src={magicPathIcons[unitMagicKeys[i]]}
            className="h-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/8 "
          />
        </div>
      );
    }
  }
  return returnable;
}

export default UnitPicker;
