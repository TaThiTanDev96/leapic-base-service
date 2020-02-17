"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("../utilities/text");
// import Knex = require("knex");
const NORMAL_OPERATOR_MAPPING = {
    "$eq": "=",
    "$gt": ">",
    "$gte": ">=",
    "$lt": "<",
    "$lte": "<=",
    "$ne": "<>",
};
function convertTypeQueryPostgre(value) {
    if (value instanceof Array) {
        return "'" + value.map(x => {
            if (x) {
                if (typeof x === 'number') {
                    return x.toString().trim();
                }
            }
            return x;
        }).join("','") + "'";
    }
    if (value != null) {
        return value.toString();
    }
    return value;
}
function buildPostgreWhereQuery(key, comparison, queryBuilder, bindings = []) {
    const comparisonKey = Object.keys(comparison)[0];
    let value = convertTypeQueryPostgre(comparison[comparisonKey]);
    let isRawQuery = bindings ? true : false;
    if (NORMAL_OPERATOR_MAPPING[comparisonKey]) {
        if (isRawQuery) {
            bindings.push(value.toString());
            return queryBuilder.whereRaw(`${key} ${NORMAL_OPERATOR_MAPPING[comparisonKey]} ?`, bindings);
        }
        else {
            return queryBuilder.where(key, NORMAL_OPERATOR_MAPPING[comparisonKey], value);
        }
    }
    let bindingValue = null;
    switch (comparisonKey) {
        case "$like": {
            bindingValue = `%${comparison[comparisonKey]}%`;
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} LIKE ?`, bindings) :
                queryBuilder.where(key, 'LIKE', bindingValue);
        }
        case "$nlike": {
            bindingValue = `%${comparison[comparisonKey]}%`;
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} IS NULL`, bindings[0]).orWhereRaw(`${key} NOT LIKE ?`, bindings) :
                queryBuilder.whereNull(key).orWhere(key, 'NOT LIKE', bindingValue);
        }
        case "$in": {
            bindingValue = comparison[comparisonKey];
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} = ANY(?)`, bindings) : queryBuilder.whereIn(key, bindingValue);
        }
        case "$nin": {
            bindingValue = comparison[comparisonKey];
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`NOT(${key} = ANY(?))`, bindings) : queryBuilder.whereNotIn(key, bindingValue);
        }
        case "$ilike": {
            bindingValue = `%${comparison[comparisonKey]}%`;
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} ILIKE ?`, bindings) :
                queryBuilder.where(key, 'ILIKE', bindingValue);
        }
        case "$nilike": {
            bindingValue = `%${comparison[comparisonKey]}%`;
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} IS NULL`, bindings[0]).orWhereRaw(`${key} NOT ILIKE ?`, bindings) :
                queryBuilder.whereNull(key).orWhere(key, 'NOT ILIKE', bindingValue);
        }
        case "$ilikeUnaccent": {
            bindingValue = `%${text_1.removeAccents(comparison[comparisonKey])}%`;
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`normalize_string(${key}) ILIKE ?`, bindings) :
                queryBuilder.whereRaw(`normalize_string(??) ILIKE ?`, [key, bindingValue]);
        }
        case "$nilikeUnaccent": {
            bindingValue = `%${text_1.removeAccents(comparison[comparisonKey])}%`;
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} ILIKE ?`, bindings) :
                queryBuilder.whereNull(key).orWhereRaw(`normalize_string(??) NOT ILIKE ?`, [key, bindingValue]);
        }
        case "$iStartWith": {
            bindingValue = `${comparison[comparisonKey]}%`;
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} ILIKE ?`, bindings) :
                queryBuilder.where(key, 'ILIKE', bindingValue);
        }
        case "$iEndWith": {
            bindingValue = `%${comparison[comparisonKey]}`;
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} ILIKE ?`, bindings) :
                queryBuilder.where(key, 'ILIKE', bindingValue);
        }
        case "$empty":
            return isRawQuery ? queryBuilder.whereRaw(`${key} IS NULL`, bindings) :
                queryBuilder.whereNull(key);
        case "$nempty":
            return isRawQuery ? queryBuilder.whereRaw(`${key} IS NOT NULL`) :
                queryBuilder.whereNotNull(key);
        case "$regex":
            bindingValue = comparison[comparisonKey];
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} ILIKE ?`, bindings) :
                queryBuilder.where(key, '~', bindingValue);
        case "$nregex":
            bindingValue = comparison[comparisonKey];
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`${key} ILIKE %?%`, bindings) :
                queryBuilder.where(key, '!~', bindingValue);
        case "$date":
            bindingValue = comparison[comparisonKey];
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`CAST(${key} as DATE) = ?`, bindings) :
                queryBuilder.whereRaw("CAST(?? as DATE) = ?", [key, bindingValue]);
        case "$have":
            if (comparison["itemObject"]) {
                bindingValue = `[${comparison[comparisonKey].map(item => JSON.stringify(item)).join(",")}]`;
                bindings.push(bindingValue);
                return isRawQuery ? queryBuilder.whereRaw(`${key} @> ?`, bindings) :
                    queryBuilder.where(key, '@>', bindingValue);
            }
            bindingValue = `{${comparison[comparisonKey].map(item => JSON.stringify(item))}}`;
            bindings.push(bindingValue);
            return queryBuilder.whereRaw(`${key} \\?| ?::text[]`, bindings);
        default:
            return;
    }
}
function convertKeyPostgre(key, prefix, isObject = false) {
    const newKey = text_1.camelCaseToSnakeCase(key);
    if (prefix) {
        const newPrefix = text_1.camelCaseToSnakeCase(prefix);
        let query = isObject ? `"${newPrefix}" -> ?` : `"${newPrefix}" ->> ?`;
        return { query: query, bindings: [newKey] };
    }
    return `${newKey}`;
}
function mapWhere(where, queryBuilder, columnsDates) {
    const fixWhere = Object.assign({}, where);
    if (fixWhere.data) {
        Object.keys(fixWhere.data).forEach(key => {
            const comparison = fixWhere.data[key];
            const queryWithBindings = convertKeyPostgre(key, "data", comparison != null && typeof comparison === "object" && Object.keys(comparison)[0] === "$have");
            buildPostgreWhereQuery(queryWithBindings['query'], comparison, queryBuilder, queryWithBindings['bindings']);
        });
    }
    if (fixWhere.metaData) {
        Object.keys(fixWhere.metaData).forEach(key => {
            const comparison = fixWhere.metaData[key];
            const queryWithBindings = convertKeyPostgre(key, "metaData", comparison != null && typeof comparison === "object" && Object.keys(comparison)[0] === "$have");
            buildPostgreWhereQuery(queryWithBindings['query'], comparison, queryBuilder, queryWithBindings['bindings']);
        });
    }
    delete fixWhere.data;
    delete fixWhere.metaData;
    queryBuilder.andWhere((andQueryBuilder) => {
        Object.keys(fixWhere).forEach(key => {
            buildPostgreWhereQuery(convertKeyPostgre(key), fixWhere[key], andQueryBuilder.or);
        });
    });
    return queryBuilder;
}
function buildPostgreConditionalQuery(wheres, queryBuilder) {
    wheres.forEach(where => {
        mapWhere(where, queryBuilder);
    });
    return queryBuilder;
}
exports.buildPostgreConditionalQuery = buildPostgreConditionalQuery;
function buildPostgreOrderQuery(order, queryBuilder) {
    mapOrder(order, queryBuilder);
    return queryBuilder;
}
exports.buildPostgreOrderQuery = buildPostgreOrderQuery;
function buildPostgreSelectQuery(queryBuilder, selects) {
    queryBuilder.select(selects ? selects : "*");
    return queryBuilder;
}
exports.buildPostgreSelectQuery = buildPostgreSelectQuery;
function mapSelectPostgre(select) {
    let listData = [];
    Object.keys(select).forEach(key => {
        if (typeof select[key] === "object") {
            let childArr = [];
            Object.keys(select[key]).forEach(keyChild => {
                const keyConvert = convertKeyPostgre(keyChild, key);
                if (select[key][keyChild]) {
                    childArr = childArr.concat([`'${keyChild}'`, keyConvert]);
                }
            });
            const query = `jsonb_build_object(${childArr.join(",")}) as "${key}"`;
            listData.push(query);
        }
        else {
            if (select[key]) {
                listData.push(`${convertKeyPostgre(key)} AS "${key}"`);
            }
        }
    });
    return listData.join(",");
}
exports.mapSelectPostgre = mapSelectPostgre;
function mapUpdatePostgre(entity) {
    let fixEntity = Object.assign({}, entity);
    Object.keys(entity).forEach(key => {
        if (typeof entity[key] === "object") {
            const newKey = text_1.camelCaseToSnakeCase(key);
            Object.assign(fixEntity, {
                [key]: () => {
                    return `"${newKey}" || '${JSON.stringify(entity[key])}'`;
                }
            });
        }
    });
    return Object.assign({}, fixEntity, {});
}
exports.mapUpdatePostgre = mapUpdatePostgre;
function mapOrder(order, queryBuilder) {
    let obj = {};
    Object.keys(order).forEach(key => {
        let sortType = 'asc';
        let keyConvert = '';
        if (typeof order[key] === "object") {
            Object.keys(order[key]).forEach(keyChild => {
                keyConvert = convertKeyPostgre(keyChild, key, true);
                if (order[key][keyChild]) {
                    if (typeof order[key][keyChild] === "number") {
                        if (order[key][keyChild] === 1) {
                            sortType = "ASC";
                        }
                        else {
                            sortType = "DESC";
                        }
                    }
                    else {
                        sortType = order[key][keyChild];
                    }
                }
                queryBuilder.orderByRaw(`${keyConvert['query']} ${sortType}`, keyConvert['bindings']);
            });
        }
        else {
            if (order[key]) {
                keyConvert = convertKeyPostgre(key);
                if (typeof order[key] === "number") {
                    if (order[key] === 1) {
                        sortType = 'ASC';
                    }
                    else {
                        sortType = 'DESC';
                    }
                }
                else {
                    sortType = order[key].toString();
                }
            }
            queryBuilder.orderBy(keyConvert, sortType);
        }
    });
    return queryBuilder;
}
exports.mapOrder = mapOrder;
class FindOnePostgre {
}
exports.FindOnePostgre = FindOnePostgre;
class FindManyPostgre extends FindOnePostgre {
}
exports.FindManyPostgre = FindManyPostgre;
