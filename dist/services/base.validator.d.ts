import { IBaseServiceQuery, IGenericQuery } from "../interfaces/common";
export declare const GetAllSchema: {
    pageIndex: {
        type: string;
        min: number;
        positive: boolean;
        integer: boolean;
        optional: boolean;
    };
    pageSize: {
        type: string;
        min: number;
        positive: boolean;
        integer: boolean;
        optional: boolean;
    };
    where: {
        type: string;
        optional: boolean;
    };
    order: {
        type: string;
        optional: boolean;
    };
    $$strict: boolean;
};
export interface IGetAllInput extends IBaseServiceQuery, IGenericQuery {
    pageIndex: number;
    pageSize: number;
}
