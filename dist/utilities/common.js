"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
exports.isEmptyObject = isEmptyObject;
function removeArrItem(array, value) {
    const result = array.filter((ele) => {
        return ele.toString() !== value.toString();
    });
    return result;
}
exports.removeArrItem = removeArrItem;
