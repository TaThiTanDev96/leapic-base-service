import { IBaseServiceQuery, IGenericQuery } from "../interfaces/common";

export const GetAllSchema = {
  pageIndex: { type: "number", min: 1, positive: true, integer: true, optional: true },
  pageSize: { type: "number", min: 1, positive: true, integer: true, optional: true },
  where: { type: "array", optional: true },
  order: { type: "object", optional: true },
  $$strict: true
}

export interface IGetAllInput extends IBaseServiceQuery, IGenericQuery {
  pageIndex: number;
  pageSize: number;
}