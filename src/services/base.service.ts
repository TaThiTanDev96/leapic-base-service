import { Context, ServiceSchema, Errors } from "moleculer";
import { Action } from "moleculer-decorators";
import { GetAllSchema, IGetAllInput } from "../services/base.validator"

export class BaseService implements ServiceSchema {
  constructor(public name: string, public model: any) {
  }
  @Action({
    params: GetAllSchema,
    rest: "POST /list"
  })
  public async getList(ctx: Context<IGetAllInput>) {
    let model = this['schema'].model;
    model.setContext(ctx);
    let params = ctx.params;
    return await model.getAllByConditions(params.where, params.order, params.pageSize, params.pageIndex);
  }
}
