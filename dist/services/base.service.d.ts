import { Context, ServiceSchema } from "moleculer";
import { IGetAllInput } from "../services/base.validator";
export declare class BaseService implements ServiceSchema {
    name: string;
    model: any;
    constructor(name: string, model: any);
    getList(ctx: Context<IGetAllInput>): Promise<any>;
}
