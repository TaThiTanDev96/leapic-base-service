import * as knex from "knex";
import { IObject } from "../interfaces/common";
import { IModel, QueryCondition } from "../interfaces/iModel";
import { IOrder, IWhere } from "../utilities/base.comparison";
export declare class Model<T> implements IModel {
    DB: knex;
    DBAdmin: knex;
    typeConnect: string;
    ctx: any;
    tableName: string;
    PRIMARY_KEY: string;
    CREATED_AT: string;
    UPDATED_AT: string;
    Attribute: object;
    transaction: knex.Transaction;
    isMaster?: boolean;
    constructor(ctx?: any, transaction?: any, isMaster?: boolean);
    setContext(ctx: any): void;
    query(): knex.QueryBuilder;
    queryByConditions(wheres?: IWhere[], order?: IOrder, pageSize?: number, pageIndex?: number, queryBuilder?: knex.QueryBuilder, selects?: string[]): knex.QueryBuilder;
    getAllByConditions(wheres?: IWhere[], order?: IOrder, pageSize?: number, pageIndex?: number, selects?: string[]): Promise<any>;
    set(key: any, value: any): void;
    get(key: any): any;
    find(PRIMARY_KEY: string, columnName?: any): Promise<any>;
    findOne(whereCondition: IObject<any>, columnName?: any): Promise<any>;
    findByQuery(conditions: QueryCondition[], resultColumns?: string[]): Promise<T>;
    select(columnName?: any): any;
    getAll(limit?: number, offset?: number, columnName?: string[]): knex.QueryBuilder;
    insert(data?: T, returnData?: string[]): Promise<T[]>;
    saveOne(data?: T, returnData?: string[]): Promise<T>;
    insertMany(data?: T[], returnData?: string[]): Promise<T[]>;
    insertReturnId(data?: Object): Promise<any>;
    update(data: Object, conditions: QueryCondition[], returnData?: string[]): Promise<T[]>;
    updateByCondition(whereCondition: Object, data: IObject<any>): Promise<any[]>;
    findAndUpdate(primaryKey: string, data: T, returnData?: string[]): Promise<T[]>;
    deleteManySoftly(ids: string[], data: any): Promise<any>;
    delete(conditions: QueryCondition[], returnData?: string[]): Promise<T[]>;
    deleteByPrimaryKey(primaryKey: string, returnData?: string[]): Promise<T[]>;
    openTransaction(callback: (trx: any) => Promise<any>): Promise<any>;
    protected addToTransaction(queryBuilder: knex.QueryBuilder): knex.QueryBuilder;
    countByQuery(conditions: QueryCondition[], resultColumns?: string[]): Promise<number>;
}