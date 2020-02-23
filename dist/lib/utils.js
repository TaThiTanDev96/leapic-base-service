"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pluck(source, target) {
    let result = target;
    for (const key in result) {
        if (source.hasOwnProperty(key)) {
            const element = source[key];
            result[key] = element;
        }
    }
    return result;
}
exports.pluck = pluck;
;
