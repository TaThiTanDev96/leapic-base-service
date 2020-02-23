"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_comparison_1 = require("../utilities/base.comparison");
class Model {
    constructor(ctx, transaction, isMaster) {
        this.PRIMARY_KEY = "id";
        this.CREATED_AT = "created_at";
        this.UPDATED_AT = "updated_at";
        this.isMaster = isMaster;
        if (ctx) {
            this.setContext(ctx);
        }
        this.transaction = transaction;
    }
    setContext(ctx) {
        this.ctx = ctx;
        this.DB = this.isMaster !== undefined ? ctx.meta.DBAdmin : ctx.meta.DB;
        this.DBAdmin = ctx.meta.DBAdmin;
    }
    query() {
        return this.addToTransaction(this.DB.from(this.tableName));
    }
    queryByConditions(wheres = [], order = {}, pageSize = 20, pageIndex = 1, queryBuilder, selects) {
        queryBuilder = queryBuilder || this.query();
        queryBuilder = base_comparison_1.buildPostgreConditionalQuery(wheres, queryBuilder);
        queryBuilder = base_comparison_1.buildPostgreOrderQuery(order, queryBuilder);
        queryBuilder = base_comparison_1.buildPostgreSelectQuery(queryBuilder, selects);
        queryBuilder.limit(pageSize);
        let offset = (pageIndex - 1) * pageSize;
        queryBuilder.offset(offset);
        return queryBuilder;
    }
    getAllByConditions(wheres = [], order = {}, pageSize = 20, pageIndex = 1, selects) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryBuilder = this.query();
            let query = this.queryByConditions(wheres, order, pageSize, pageIndex, queryBuilder, selects);
            let results = yield query;
            let countQuery = base_comparison_1.buildPostgreConditionalQuery(wheres, this.query());
            let counts = yield countQuery.count();
            let totalRow = parseInt(counts[0].count);
            results = {
                list: results,
                totalRows: totalRow,
                extendsData: {},
            };
            return results;
        });
    }
    set(key, value) {
        this.Attribute[key] = value;
    }
    get(key) {
        return this.Attribute[key];
    }
    find(PRIMARY_KEY, columnName = "*") {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.DB.from(this.tableName)
                .select(columnName)
                .where(this.PRIMARY_KEY, "=", PRIMARY_KEY)
                .first();
            this.Attribute = item;
            return item;
        });
    }
    findOne(whereCondition, columnName = "*") {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.DB.from(this.tableName)
                .select(columnName)
                .where(whereCondition)
                .first();
            this.Attribute = item;
            return item;
        });
    }
    findByQuery(conditions, resultColumns = ["*"]) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryBuilder = this.DB.from(this.tableName).select(resultColumns);
            conditions.forEach((condition) => {
                queryBuilder.where(condition.columnName, condition.operator, condition.value);
            });
            let result = yield queryBuilder.first();
            return result;
        });
    }
    select(columnName = "*") {
        return this.DB.from(this.tableName).select(columnName);
    }
    getAll(limit = 20, offset = 0, columnName = ["*"]) {
        return this.DB.from(this.tableName)
            .select(columnName)
            .limit(limit)
            .offset(offset);
    }
    insert(data = null, returnData = ["*"]) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateNow = new Date();
            if (data == null) {
                if (this.CREATED_AT !== "") {
                    this.Attribute[this.CREATED_AT] = dateNow;
                    this.Attribute[this.UPDATED_AT] = dateNow;
                }
                return yield this.addToTransaction(this.DB.from(this.tableName).insert(this.Attribute));
            }
            data[this.CREATED_AT] = dateNow;
            data[this.UPDATED_AT] = dateNow;
            return yield this.addToTransaction(this.DB.from(this.tableName).insert(data, returnData));
        });
    }
    saveOne(data = null, returnData = ["*"]) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateNow = new Date();
            let existData;
            if (data[this.PRIMARY_KEY]) {
                existData = yield this.DB.from(this.tableName)
                    .where({
                    id: data[this.PRIMARY_KEY],
                })
                    .first();
            }
            if (existData) {
                data[this.UPDATED_AT] = dateNow;
                data = yield this.addToTransaction(this.DB.from(this.tableName)
                    .where({ id: data[this.PRIMARY_KEY] })
                    .update(data)
                    .returning(returnData));
                return data[0];
            }
            data[this.CREATED_AT] = dateNow;
            data[this.UPDATED_AT] = dateNow;
            data = yield this.addToTransaction(this.DB.from(this.tableName).insert(data, returnData));
            return data[0];
        });
    }
    insertMany(data = null, returnData = ["*"]) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateNow = new Date();
            if (!data) {
                return null;
            }
            for (const item of data) {
                item[this.CREATED_AT] = dateNow;
                item[this.UPDATED_AT] = dateNow;
            }
            return yield this.addToTransaction(this.DB.from(this.tableName).insert(data, returnData));
        });
    }
    insertReturnId(data = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateNow = new Date();
            if (data == null) {
                if (this.CREATED_AT !== "") {
                    this.Attribute[this.CREATED_AT] = dateNow;
                    this.Attribute[this.UPDATED_AT] = dateNow;
                }
                return yield this.addToTransaction(this.DB.from(this.tableName)
                    .insert(this.Attribute)
                    .returning(this.PRIMARY_KEY));
            }
            data[this.CREATED_AT] = dateNow;
            data[this.UPDATED_AT] = dateNow;
            return yield this.addToTransaction(this.DB.from(this.tableName)
                .insert(data)
                .returning(this.PRIMARY_KEY));
        });
    }
    update(data, conditions, returnData = ["*"]) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateNow = new Date();
            if (data == null) {
                if (this.CREATED_AT !== "") {
                    this.Attribute[this.UPDATED_AT] = dateNow;
                }
                return yield this.addToTransaction(this.DB.from(this.tableName).update(this.Attribute));
            }
            let queryBuilder = this.DB.from(this.tableName);
            conditions.forEach((condition) => {
                queryBuilder.where(condition.columnName, condition.operator, condition.value);
            });
            data[this.UPDATED_AT] = dateNow;
            return yield this.addToTransaction(queryBuilder.update(data, returnData));
        });
    }
    updateByCondition(whereCondition, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateNow = new Date();
            data[this.UPDATED_AT] = dateNow;
            const returnData = Object.keys(data);
            const item = yield this.DB.from(this.tableName)
                .where(whereCondition)
                .update(data, returnData);
            return item;
        });
    }
    findAndUpdate(primaryKey, data, returnData = ["*"]) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateNow = new Date();
            data[this.UPDATED_AT] = dateNow;
            return yield this.addToTransaction(this.DB.from(this.tableName)
                .where(this.PRIMARY_KEY, "=", primaryKey)
                .update(data, returnData));
        });
    }
    deleteManySoftly(ids, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateNow = new Date();
            data[this.UPDATED_AT] = dateNow;
            let results = yield this.addToTransaction(this.DB.from(this.tableName)
                .whereIn(this.PRIMARY_KEY, ids)
                .update(data)
                .returning("id"));
            return {
                deletedIds: results,
            };
        });
    }
    delete(conditions, returnData = ["*"]) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryBuilder = this.DB.from(this.tableName);
            conditions.forEach((condition) => {
                queryBuilder.where(condition.columnName, condition.operator, condition.value);
            });
            return yield this.addToTransaction(queryBuilder.delete(returnData));
        });
    }
    deleteByPrimaryKey(primaryKey, returnData = ["*"]) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addToTransaction(this.DB.from(this.tableName)
                .where(this.PRIMARY_KEY, "=", primaryKey)
                .delete(returnData));
        });
    }
    openTransaction(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.DB.transaction((trx) => {
                return callback(trx);
            });
        });
    }
    addToTransaction(queryBuilder) {
        if (this.transaction === undefined || this.transaction === null) {
            return queryBuilder;
        }
        return queryBuilder.transacting(this.transaction);
    }
    countByQuery(conditions, resultColumns = ["*"]) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryBuilder = this.DB.from(this.tableName).select(resultColumns);
            conditions.forEach((condition) => {
                queryBuilder.where(condition.columnName, condition.operator, condition.value);
            });
            return yield queryBuilder.count();
        });
    }
}
exports.Model = Model;
