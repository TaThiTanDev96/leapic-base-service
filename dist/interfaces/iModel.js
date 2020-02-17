"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryCondition {
    constructor($columnName, $operator, $value) {
        this.columnName = $columnName;
        this.operator = $operator;
        this.value = $value;
    }
}
exports.QueryCondition = QueryCondition;
