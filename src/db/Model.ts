import * as knex from "knex";
import { IObject } from "../interfaces/common";
import { IModel, QueryCondition } from "../interfaces/iModel";
import {
  buildPostgreConditionalQuery,
  buildPostgreOrderQuery,
  buildPostgreSelectQuery,
  IOrder,
  IWhere,
} from "../utilities/base.comparison";

export class Model<T> implements IModel {
  public DB: knex;
  public DBAdmin: knex;
  public typeConnect: string;
  public ctx: any;
  public tableName: string;
  public PRIMARY_KEY: string = "id";
  public CREATED_AT: string = "created_at";
  public UPDATED_AT: string = "updated_at";
  public Attribute: object;
  public transaction: knex.Transaction;
  public isMaster?: boolean;
  constructor(ctx?: any, transaction?: any, isMaster?: boolean) {
    this.isMaster = isMaster;
    if (ctx) {
      this.setContext(ctx);
    }
    this.transaction = transaction;
  }

  public setContext(ctx: any) {
    this.ctx = ctx;
    this.DB = this.isMaster !== undefined ? ctx.meta.DBAdmin : ctx.meta.DB;
    this.DBAdmin = ctx.meta.DBAdmin;
  }

  public query(): knex.QueryBuilder {
    return this.addToTransaction(this.DB.from(this.tableName));
  }

  public queryByConditions(
    wheres: IWhere[] = [],
    order: IOrder = {},
    pageSize: number = 20,
    pageIndex: number = 1,
    queryBuilder?: knex.QueryBuilder,
    selects?: string[],
  ): knex.QueryBuilder {
    queryBuilder = queryBuilder || this.query();
    queryBuilder = buildPostgreConditionalQuery(wheres, queryBuilder);
    queryBuilder = buildPostgreOrderQuery(order, queryBuilder);
    queryBuilder = buildPostgreSelectQuery(queryBuilder, selects);
    queryBuilder.limit(pageSize);
    let offset = (pageIndex - 1) * pageSize;
    queryBuilder.offset(offset);
    return queryBuilder;
  }

  public async getAllByConditions(
    wheres: IWhere[] = [],
    order: IOrder = {},
    pageSize: number = 20,
    pageIndex: number = 1,
    selects?: string[],
  ) {
    let queryBuilder = this.query();
    let query = this.queryByConditions(
      wheres,
      order,
      pageSize,
      pageIndex,
      queryBuilder,
      selects,
    );
    let results = await query;
    let countQuery = buildPostgreConditionalQuery(wheres, this.query());
    let counts = await countQuery.count();
    let totalRow = parseInt(counts[0].count);
    results = {
      list: results,
      totalRows: totalRow,
      extendsData: {},
    };
    return results;
  }

  public set(key, value) {
    this.Attribute[key] = value;
  }

  public get(key) {
    return this.Attribute[key];
  }

  public async find(PRIMARY_KEY: string, columnName: any = "*") {
    const item = await this.DB.from(this.tableName)
      .select(columnName)
      .where(this.PRIMARY_KEY, "=", PRIMARY_KEY)
      .first();
    this.Attribute = item;
    return item;
  }

  public async findOne(whereCondition: IObject<any>, columnName: any = "*") {
    const item = await this.DB.from(this.tableName)
      .select(columnName)
      .where(whereCondition)
      .first();
    this.Attribute = item;
    return item;
  }

  public async findByQuery(
    conditions: QueryCondition[],
    resultColumns: string[] = ["*"],
  ) {
    let queryBuilder = this.DB.from(this.tableName).select(resultColumns);
    conditions.forEach((condition: QueryCondition) => {
      queryBuilder.where(
        condition.columnName,
        condition.operator,
        condition.value,
      );
    });
    let result: T = await queryBuilder.first();
    return result;
  }

  public select(columnName: any = "*"): any {
    return this.DB.from(this.tableName).select(columnName);
  }

  public getAll(
    limit: number = 20,
    offset: number = 0,
    columnName: string[] = ["*"],
  ): knex.QueryBuilder {
    return this.DB.from(this.tableName)
      .select(columnName)
      .limit(limit)
      .offset(offset);
  }

  public async insert(
    data: T = null,
    returnData: string[] = ["*"],
  ): Promise<T[]> {
    const dateNow = new Date();
    if (data == null) {
      if (this.CREATED_AT !== "") {
        this.Attribute[this.CREATED_AT] = dateNow;
        this.Attribute[this.UPDATED_AT] = dateNow;
      }
      return await this.addToTransaction(
        this.DB.from(this.tableName).insert(this.Attribute),
      );
    }

    data[this.CREATED_AT] = dateNow;
    data[this.UPDATED_AT] = dateNow;
    return await this.addToTransaction(
      this.DB.from(this.tableName).insert(data, returnData),
    );
  }

  public async saveOne(
    data: T = null,
    returnData: string[] = ["*"],
  ): Promise<T> {
    const dateNow = new Date();
    let existData: T;
    if (data[this.PRIMARY_KEY]) {
      existData = await this.DB.from(this.tableName)
        .where({
          id: data[this.PRIMARY_KEY],
        })
        .first();
    }
    if (existData) {
      data[this.UPDATED_AT] = dateNow;
      data = await this.addToTransaction(
        this.DB.from(this.tableName)
          .where({ id: data[this.PRIMARY_KEY] })
          .update(data)
          .returning(returnData),
      );
      return data[0];
    }
    data[this.CREATED_AT] = dateNow;
    data[this.UPDATED_AT] = dateNow;
    data = await this.addToTransaction(
      this.DB.from(this.tableName).insert(data, returnData),
    );
    return data[0];
  }

  public async insertMany(
    data: T[] = null,
    returnData: string[] = ["*"],
  ): Promise<T[]> {
    const dateNow = new Date();
    if (!data) {
      return null;
    }
    for (const item of data) {
      item[this.CREATED_AT] = dateNow;
      item[this.UPDATED_AT] = dateNow;
    }
    return await this.addToTransaction(
      this.DB.from(this.tableName).insert(data, returnData),
    );
  }

  public async insertReturnId(data: Object = null) {
    const dateNow = new Date();
    if (data == null) {
      if (this.CREATED_AT !== "") {
        this.Attribute[this.CREATED_AT] = dateNow;
        this.Attribute[this.UPDATED_AT] = dateNow;
      }
      return await this.addToTransaction(
        this.DB.from(this.tableName)
          .insert(this.Attribute)
          .returning(this.PRIMARY_KEY),
      );
    }
    data[this.CREATED_AT] = dateNow;
    data[this.UPDATED_AT] = dateNow;
    return await this.addToTransaction(
      this.DB.from(this.tableName)
        .insert(data)
        .returning(this.PRIMARY_KEY),
    );
  }

  public async update(
    data: Object,
    conditions: QueryCondition[],
    returnData: string[] = ["*"],
  ): Promise<T[]> {
    const dateNow = new Date();
    if (data == null) {
      if (this.CREATED_AT !== "") {
        this.Attribute[this.UPDATED_AT] = dateNow;
      }
      return await this.addToTransaction(
        this.DB.from(this.tableName).update(this.Attribute),
      );
    }
    let queryBuilder = this.DB.from(this.tableName);
    conditions.forEach((condition: QueryCondition) => {
      queryBuilder.where(
        condition.columnName,
        condition.operator,
        condition.value,
      );
    });
    data[this.UPDATED_AT] = dateNow;
    return await this.addToTransaction(queryBuilder.update(data, returnData));
  }

  public async updateByCondition(whereCondition: Object, data: IObject<any>) {
    const dateNow = new Date();
    data[this.UPDATED_AT] = dateNow;
    const returnData = Object.keys(data);
    const item = await this.DB.from(this.tableName)
      .where(whereCondition)
      .update(data, returnData);
    return item;
  }

  public async findAndUpdate(
    primaryKey: string,
    data: T,
    returnData: string[] = ["*"],
  ): Promise<T[]> {
    const dateNow = new Date();
    data[this.UPDATED_AT] = dateNow;
    return await this.addToTransaction(
      this.DB.from(this.tableName)
        .where(this.PRIMARY_KEY, "=", primaryKey)
        .update(data, returnData),
    );
  }

  public async deleteManySoftly(ids: string[], data: any): Promise<any> {
    const dateNow = new Date();
    data[this.UPDATED_AT] = dateNow;
    let results = await this.addToTransaction(
      this.DB.from(this.tableName)
        .whereIn(this.PRIMARY_KEY, ids)
        .update(data)
        .returning("id"),
    );
    return {
      deletedIds: results,
    };
  }

  public async delete(
    conditions: QueryCondition[],
    returnData: string[] = ["*"],
  ): Promise<T[]> {
    let queryBuilder = this.DB.from(this.tableName);
    conditions.forEach((condition: QueryCondition) => {
      queryBuilder.where(
        condition.columnName,
        condition.operator,
        condition.value,
      );
    });
    return await this.addToTransaction(queryBuilder.delete(returnData));
  }

  public async deleteByPrimaryKey(
    primaryKey: string,
    returnData: string[] = ["*"],
  ): Promise<T[]> {
    return await this.addToTransaction(
      this.DB.from(this.tableName)
        .where(this.PRIMARY_KEY, "=", primaryKey)
        .delete(returnData),
    );
  }

  public async openTransaction(callback: (trx: any) => Promise<any>) {
    return this.DB.transaction((trx: knex.Transaction) => {
      return callback(trx);
    });
  }

  protected addToTransaction(
    queryBuilder: knex.QueryBuilder,
  ): knex.QueryBuilder {
    if (this.transaction === undefined || this.transaction === null) {
      return queryBuilder;
    }
    return queryBuilder.transacting(this.transaction);
  }

  public async countByQuery(
    conditions: QueryCondition[],
    resultColumns: string[] = ["*"],
  ): Promise<number> {
    let queryBuilder = this.DB.from(this.tableName).select(resultColumns);
    conditions.forEach((condition: QueryCondition) => {
      queryBuilder.where(
        condition.columnName,
        condition.operator,
        condition.value,
      );
    });
    return await queryBuilder.count();
  }
}
