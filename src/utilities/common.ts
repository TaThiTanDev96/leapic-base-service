import { IObject } from "../interfaces/common";

export function isEmptyObject(obj: IObject<any>) {
  return !Object.keys(obj).length;
}

export function removeArrItem(array: any[], value: any) {
  const result = array.filter((ele) => {
    return ele.toString() !== value.toString();
  });
  return result;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
