import { camelCaseToSnakeCase, removeAccents } from "../utilities/text";
import * as Knex from 'knex';
// import Knex = require("knex");
const NORMAL_OPERATOR_MAPPING = {
    "$eq": "=",
    "$gt": ">",
    "$gte": ">=",
    "$lt": "<",
    "$lte": "<=",
    "$ne": "<>",
}
type TOperatorMongo =
    | "$eq"
    | "$gt"
    | "$gte"
    | "$in"
    | "$lt"
    | "$lte"
    | "$ne"
    | "$nin"
    | "$like"
    | "$nlike"
    | "$ilike"
    | "$nilike"
    | "$ilikeUnaccent"
    | "$nilikeUnaccent"
    | "$iStartWith"
    | "$iEndWith"
    | "$empty"
    | "$nempty"
    | "$regex"
    | "$nregex"
    | "$have"
    | "$date";
type TComparison<T> = {
    [key in TOperatorMongo]?: T;
};
type TypeValue = number | string | Date | boolean;
type TyepArrayValue = Array<TypeValue>;
export type IWhereRoot<Entity = any> = {
    [key in keyof Entity]?: TypeValue | TComparison<TypeValue | TyepArrayValue> | IWhereRoot<any>;
};
export type IWhere<Entity = any> = {
    data?: IWhereRoot<any>;
    metaData?: IWhereRoot<any>;
} & IWhereRoot<Entity>;

function convertTypeQueryPostgre(value: TypeValue | TyepArrayValue) {
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

function buildPostgreWhereQuery(key: string, comparison: TypeValue | TComparison<TypeValue | TyepArrayValue>, queryBuilder: Knex.QueryBuilder, bindings: string[] = []): Knex.QueryBuilder {
    const comparisonKey = Object.keys(comparison)[0] as TOperatorMongo;
    let value = convertTypeQueryPostgre(comparison[comparisonKey]);
    let isRawQuery = bindings ? true : false;
    if (NORMAL_OPERATOR_MAPPING[comparisonKey]) {
        if (isRawQuery) {
            bindings.push(value.toString());
            return queryBuilder.whereRaw(`${key} ${NORMAL_OPERATOR_MAPPING[comparisonKey]} ?`, bindings);
        } else {
            return queryBuilder.where(key, NORMAL_OPERATOR_MAPPING[comparisonKey], value);
        }
    }
    let bindingValue: any = null;
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
            bindingValue = `%${removeAccents(comparison[comparisonKey])}%`;
            bindings.push(bindingValue);
            return isRawQuery ? queryBuilder.whereRaw(`normalize_string(${key}) ILIKE ?`, bindings) :
                queryBuilder.whereRaw(`normalize_string(??) ILIKE ?`, [key, bindingValue]);
        }
        case "$nilikeUnaccent": {
            bindingValue = `%${removeAccents(comparison[comparisonKey])}%`;
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
                queryBuilder.whereRaw("CAST(?? as DATE) = ?", [key, bindingValue])
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
function convertKeyPostgre(key: string, prefix?: string, isObject: boolean = false): any {
    const newKey = camelCaseToSnakeCase(key);
    if (prefix) {
        const newPrefix = camelCaseToSnakeCase(prefix);
        let query = isObject ? `"${newPrefix}" -> ?` : `"${newPrefix}" ->> ?`;
        return { query: query, bindings: [newKey] };
    }
    return `${newKey}`;
}

function mapWhere<Entity>(where: IWhere<Entity>, queryBuilder: Knex.QueryBuilder, columnsDates?: string[]): Knex.QueryBuilder {
    const fixWhere = { ...where };

    if (fixWhere.data) {
        Object.keys(fixWhere.data).forEach(key => {
            const comparison = fixWhere.data[key];
            const queryWithBindings = convertKeyPostgre(
                key,
                "data",
                comparison != null && typeof comparison === "object" && Object.keys(comparison)[0] === "$have"
            );

            buildPostgreWhereQuery(queryWithBindings['query'], comparison, queryBuilder, queryWithBindings['bindings']);
        });
    }
    if (fixWhere.metaData) {
        Object.keys(fixWhere.metaData).forEach(key => {
            const comparison = fixWhere.metaData[key];
            const queryWithBindings = convertKeyPostgre(
                key,
                "metaData",
                comparison != null && typeof comparison === "object" && Object.keys(comparison)[0] === "$have"
            );
            buildPostgreWhereQuery(queryWithBindings['query'], comparison, queryBuilder, queryWithBindings['bindings']);
        });
    }
    delete fixWhere.data;
    delete fixWhere.metaData;
    queryBuilder.andWhere((andQueryBuilder) => {
        Object.keys(fixWhere).forEach(key => {
            buildPostgreWhereQuery(convertKeyPostgre(key), fixWhere[key], andQueryBuilder.or);
        });
    })

    return queryBuilder;
}
export function buildPostgreConditionalQuery<Entity>(wheres: IWhere<Entity>[], queryBuilder: Knex.QueryBuilder): Knex.QueryBuilder {
    wheres.forEach(where => {
        mapWhere(where, queryBuilder);
    });
    return queryBuilder;
}

export function buildPostgreOrderQuery<Entity>(order: IOrder<Entity>, queryBuilder: Knex.QueryBuilder): Knex.QueryBuilder {
    mapOrder(order, queryBuilder);
    return queryBuilder;
}

export function buildPostgreSelectQuery(queryBuilder: Knex.QueryBuilder, selects?: string[]): Knex.QueryBuilder {
    queryBuilder.select(selects ? selects : "*");
    return queryBuilder;
}

export type ISelect<Entity = any> = {
    [k in keyof Entity]?: boolean | { [key: string]: boolean };
};
export function mapSelectPostgre<Entity>(select: ISelect<Entity>) {
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
        } else {
            if (select[key]) {
                listData.push(`${convertKeyPostgre(key)} AS "${key}"`);
            }
        }
    });
    return listData.join(",");
}
export function mapUpdatePostgre<Entity extends any>(entity: Entity) {
    let fixEntity = { ...entity };
    Object.keys(entity).forEach(key => {
        if (typeof entity[key] === "object") {
            const newKey = camelCaseToSnakeCase(key);
            Object.assign(fixEntity, {
                [key]: () => {
                    return `"${newKey}" || '${JSON.stringify(entity[key])}'`;
                }
            });
        }
    });
    return Object.assign({}, fixEntity, {}) as any;
}
export type IOrder<Entity = any> = {
    [P in keyof Entity]?:
    | "ASC"
    | "DESC"
    | 1
    | -1
    | {
        [key: string]: "ASC" | "DESC" | 1 | -1;
    };
};

export function mapOrder(order: IOrder, queryBuilder: Knex.QueryBuilder) {
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
                        } else {
                            sortType = "DESC";
                        }
                    } else {
                        sortType = order[key][keyChild];
                    }
                }
                queryBuilder.orderByRaw(`${keyConvert['query']} ${sortType}`, keyConvert['bindings'])
            });
        } else {
            if (order[key]) {
                keyConvert = convertKeyPostgre(key);
                if (typeof order[key] === "number") {
                    if (order[key] === 1) {
                        sortType = 'ASC';
                    } else {
                        sortType = 'DESC';
                    }
                } else {
                    sortType = order[key].toString();
                }
            }
            queryBuilder.orderBy(keyConvert, sortType);
        }
    });
    return queryBuilder;
}
export class FindOnePostgre<Entity = any> {
    select?: ISelect<Entity>;
    where?: IWhere<Entity>[];
    order?: IOrder<Entity>;
}
export class FindManyPostgre<Entity = any> extends FindOnePostgre<Entity> {
    pageIndex?: number;
    pageSize?: number;
}
