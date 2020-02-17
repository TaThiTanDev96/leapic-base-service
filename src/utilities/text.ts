export const removeAccents = str => {
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

export function removeSpecialChar(text: string): string {
    return text.replace(/[^0-9a-zA-Z ]/g, "");
}

export function normalizeStringToPascalCase(text: string = '') {
    const words = removeAccents(removeSpecialChar(text)).toLowerCase().split(' ').filter(item => !!item).map(item => upperCaseFirstLetter(item));
    return words.join('');

}

export const createInternalString = (text: string): string => {
    return removeAccents(text.trim().toLowerCase())
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .split(" ")
        .filter(item => !!item)
        .join("_");
}

export function isInternalString(text: string) {
    const internalStr = createInternalString(text);
    return text === internalStr;
}

export function camelCaseToSnakeCase(text: string): string {
    return removeAccents(text.trim()).split(/(?=[A-Z])/).join('_').toLowerCase()
}
export function snakeCaseToCamelCase(text: string): string {
    return removeAccents(text.trim()).replace(/_([a-z])/g, (ch) => { return ch[1].toUpperCase(); });
}
export function camelCaseToLineCase(text: string): string {
    return removeAccents(text.trim()).split(/(?=[A-Z])/).join('-').toLowerCase()
}
export const upperCaseFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}