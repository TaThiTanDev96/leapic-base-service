"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertApiResponse(status, data, message) {
    return {
        status: status ? true : false,
        data: data,
        message: message ? message : ""
    };
}
exports.convertApiResponse = convertApiResponse;
