import Unit from "../types/Unit";
import { magicMasks } from "../types/Magic";
import React from "react";

function calcLdr(unit: Unit): number {
  let ldr = 0;
  if (unit.leader !== "") {
    ldr += parseInt(unit.leader);
  }
  if (unit.F !== "") {
    ldr += parseInt(unit.F) * 5;
  }
  return ldr;
}

function calcUdLdr(unit: Unit): number {
  let ldr = 0;
  if (unit.undeadleader !== "") {
    ldr += parseInt(unit.undeadleader);
  }
  if (unit.D !== "") {
    ldr += parseInt(unit.D) * 30;
  }
  if (unit.B !== "") {
    ldr += parseInt(unit.B) * 5;
  }
  return ldr;
}

function calcMgcLdr(unit: Unit): number {
  let ldr = 0;
  if (unit.magicleader !== "") {
    ldr += parseInt(unit.magicleader);
  }
  if (unit.A !== "") {
    ldr += parseInt(unit.A) * 5;
  }
  if (unit.S !== "") {
    ldr += parseInt(unit.S) * 10;
  }
  if (unit.E !== "") {
    ldr += parseInt(unit.E) * 5;
  }
  if (unit.F !== "") {
    ldr += parseInt(unit.F) * 5;
  }
  if (unit.N !== "") {
    ldr += parseInt(unit.N) * 5;
  }
  if (unit.W !== "") {
    ldr += parseInt(unit.W) * 5;
  }
  if (unit.B !== "") {
    ldr += parseInt(unit.B) * 5;
  }
  return ldr;
}

function hasMagic(unit: Unit): boolean {
  const { A, B, D, E, F, H, N, S, W, rand1, nbr1, link1, mask1 } = unit;
  return (
    A !== "" ||
    B !== "" ||
    D !== "" ||
    E !== "" ||
    F !== "" ||
    H !== "" ||
    N !== "" ||
    S !== "" ||
    W !== "" ||
    rand1 !== "" ||
    nbr1 !== "" ||
    link1 !== "" ||
    mask1 !== ""
  );
}
function hasPaths(unit: Unit): boolean {
  const { A, B, D, E, F, H, N, S, W } = unit;
  return (
    A !== "" ||
    B !== "" ||
    D !== "" ||
    E !== "" ||
    F !== "" ||
    H !== "" ||
    N !== "" ||
    S !== "" ||
    W !== ""
  );
}

function hasRand(
  unit: Unit,
  randField: keyof Pick<
    Unit,
    "rand1" | "rand2" | "rand3" | "rand4" | "rand5" | "rand6"
  >
): boolean {
  return unit[randField] !== "";
}

export { calcLdr, calcMgcLdr, calcUdLdr, hasMagic, hasPaths, hasRand };
