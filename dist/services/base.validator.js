"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSchema = {
    pageIndex: { type: "number", min: 1, positive: true, integer: true, optional: true },
    pageSize: { type: "number", min: 1, positive: true, integer: true, optional: true },
    where: { type: "array", optional: true },
    order: { type: "object", optional: true },
    $$strict: true
};
