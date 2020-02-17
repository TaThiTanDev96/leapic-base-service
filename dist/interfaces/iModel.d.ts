export interface IModel {
    tableName: string;
    [name: string]: any;
}
export declare class QueryCondition {
    columnName: string;
    operator: string;
    value: any;
    constructor($columnName: string, $operator: string, $value: any);
}
