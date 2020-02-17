export interface IModel {
  tableName: string;
  [name: string]: any;
}

export class QueryCondition {
  columnName: string;
  operator: string;
  value: any;

  constructor($columnName: string, $operator: string, $value: any) {
    this.columnName = $columnName;
    this.operator = $operator;
    this.value = $value;
  }
}
