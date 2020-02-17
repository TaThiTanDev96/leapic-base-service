import * as Knex from 'knex';
declare type TOperatorMongo = "$eq" | "$gt" | "$gte" | "$in" | "$lt" | "$lte" | "$ne" | "$nin" | "$like" | "$nlike" | "$ilike" | "$nilike" | "$ilikeUnaccent" | "$nilikeUnaccent" | "$iStartWith" | "$iEndWith" | "$empty" | "$nempty" | "$regex" | "$nregex" | "$have" | "$date";
declare type TComparison<T> = {
    [key in TOperatorMongo]?: T;
};
declare type TypeValue = number | string | Date | boolean;
declare type TyepArrayValue = Array<TypeValue>;
export declare type IWhereRoot<Entity = any> = {
    [key in keyof Entity]?: TypeValue | TComparison<TypeValue | TyepArrayValue> | IWhereRoot<any>;
};
export declare type IWhere<Entity = any> = {
    data?: IWhereRoot<any>;
    metaData?: IWhereRoot<any>;
} & IWhereRoot<Entity>;
export declare function buildPostgreConditionalQuery<Entity>(wheres: IWhere<Entity>[], queryBuilder: Knex.QueryBuilder): Knex.QueryBuilder;
export declare function buildPostgreOrderQuery<Entity>(order: IOrder<Entity>, queryBuilder: Knex.QueryBuilder): Knex.QueryBuilder;
export declare function buildPostgreSelectQuery(queryBuilder: Knex.QueryBuilder, selects?: string[]): Knex.QueryBuilder;
export declare type ISelect<Entity = any> = {
    [k in keyof Entity]?: boolean | {
        [key: string]: boolean;
    };
};
export declare function mapSelectPostgre<Entity>(select: ISelect<Entity>): string;
export declare function mapUpdatePostgre<Entity extends any>(entity: Entity): any;
export declare type IOrder<Entity = any> = {
    [P in keyof Entity]?: "ASC" | "DESC" | 1 | -1 | {
        [key: string]: "ASC" | "DESC" | 1 | -1;
    };
};
export declare function mapOrder(order: IOrder, queryBuilder: Knex.QueryBuilder): Knex.QueryBuilder<any, any>;
export declare class FindOnePostgre<Entity = any> {
    select?: ISelect<Entity>;
    where?: IWhere<Entity>[];
    order?: IOrder<Entity>;
}
export declare class FindManyPostgre<Entity = any> extends FindOnePostgre<Entity> {
    pageIndex?: number;
    pageSize?: number;
}
export {};
