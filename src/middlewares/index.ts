import { Context, Errors } from "moleculer";
import { DBTypeStore } from "../constant";
import { Connection } from "../db";

const customizedMiddleware = {
  localAction: function(handler: any) {
    function closeConnection(ctx: any) {
      if (ctx.meta.DB && !ctx.meta.isKeptDBConnection) {
        ctx.meta.DB.destroy();
      }
      if (ctx.meta.DBAdmin) {
        ctx.meta.DBAdmin.destroy();
      }
    }
    function initDBConnection(ctx: any) {
      ctx.meta.isKeptDBConnection = false;
      if (
        ctx.meta === undefined ||
        ctx.meta === null ||
        ctx.meta.userInfo === undefined ||
        ctx.meta.userInfo === null
      ) {
        ctx.meta.typeConnect = DBTypeStore.ADMIN;
        ctx.meta.DB = new Connection(DBTypeStore.ADMIN).query();
      } else {
        const { id, password } = ctx.meta.userInfo;
        ctx.meta.typeConnect = DBTypeStore.USER;
        ctx.meta.DB = new Connection(DBTypeStore.USER, id, password).query();
      }
      ctx.meta.DBAdmin = new Connection(DBTypeStore.ADMIN).query();
    }
    async function grantTablePermission(ctx: any) {
      const dbAdmin = new Connection(DBTypeStore.ADMIN).query();
      try {
        const { id, password } = ctx.meta.userInfo;
        await dbAdmin.raw(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${id}";`);
        dbAdmin.destroy();
        ctx.meta.typeConnect = DBTypeStore.USER;
        ctx.meta.DB = new Connection(DBTypeStore.USER, id, password).query();
        const res = await handler(ctx);
        closeConnection(ctx);
        return res;
      } catch (error) {
        closeConnection(ctx);
        console.log(error);
        return Promise.reject(new Errors.MoleculerError(error.toString()));
      }
    }
    return async (ctx: Context<any, any>) => {
      try {
        initDBConnection(ctx);

        return await handler(ctx);
      } catch (error) {
        if (error.code === "42501") {
          await grantTablePermission(ctx);
        } else if (error.type === "VALIDATION_ERROR") {
          return Promise.reject(new Errors.MoleculerError(error.data));
        } else {
          return Promise.reject(new Errors.MoleculerError(error.toString()));
        }
      } finally {
        closeConnection(ctx);
      }
    };
  },
};

export const middleware = customizedMiddleware;
