import Knex = require("knex");
import { IWhere, IOrder } from "../utilities/base.comparison";
export interface IObject<T> {
    [key: string]: T;
}
export interface IArrayObject<T> extends Array<IObject<T>> {
}
export interface IBaseServiceQuery {
    transaction: Knex.Transaction;
}
export interface IGenericQuery {
    where: IWhere[];
    order: IOrder;
}
