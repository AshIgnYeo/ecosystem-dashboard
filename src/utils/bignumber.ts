import BigNumber from "bignumber.js";

export type MoneyFormatterOptions = {
  compression?: number;
  decPlaces?: number;
  maxFractionDigits?: number;
  showCurrency?: boolean;
  toHumanNumber?: boolean;
}

export const toBigNumber = (inputNumber: BigNumber | number | string = 0, opts: MoneyFormatterOptions = {}): BigNumber => {
  if (typeof inputNumber === "string") inputNumber = Number(inputNumber);
  if (typeof inputNumber === "number") {
    if (isNaN(inputNumber) || !isFinite(inputNumber))
      return new BigNumber(0)
  }
  let number = new BigNumber(inputNumber);
  if (isNaN(number.toNumber())) number = new BigNumber(0);
  let { compression = 0, decPlaces, maxFractionDigits = 2 } = opts;

  if (decPlaces === undefined)
    decPlaces = maxFractionDigits || 0;

  number = number.shiftedBy(-compression);
  return number
}