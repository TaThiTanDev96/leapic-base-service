"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAccents = str => {
    const AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ",
        "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"
    ];
    for (let i = 0; i < AccentsMap.length; i++) {
        let re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
        let char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
};
function removeSpecialChar(text) {
    return text.replace(/[^0-9a-zA-Z ]/g, "");
}
exports.removeSpecialChar = removeSpecialChar;
function normalizeStringToPascalCase(text = '') {
    const words = exports.removeAccents(removeSpecialChar(text)).toLowerCase().split(' ').filter(item => !!item).map(item => exports.upperCaseFirstLetter(item));
    return words.join('');
}
exports.normalizeStringToPascalCase = normalizeStringToPascalCase;
exports.createInternalString = (text) => {
    return exports.removeAccents(text.trim().toLowerCase())
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .split(" ")
        .filter(item => !!item)
        .join("_");
};
function isInternalString(text) {
    const internalStr = exports.createInternalString(text);
    return text === internalStr;
}
exports.isInternalString = isInternalString;
function camelCaseToSnakeCase(text) {
    return exports.removeAccents(text.trim()).split(/(?=[A-Z])/).join('_').toLowerCase();
}
exports.camelCaseToSnakeCase = camelCaseToSnakeCase;
function snakeCaseToCamelCase(text) {
    return exports.removeAccents(text.trim()).replace(/_([a-z])/g, (ch) => { return ch[1].toUpperCase(); });
}
exports.snakeCaseToCamelCase = snakeCaseToCamelCase;
function camelCaseToLineCase(text) {
    return exports.removeAccents(text.trim()).split(/(?=[A-Z])/).join('-').toLowerCase();
}
exports.camelCaseToLineCase = camelCaseToLineCase;
exports.upperCaseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
