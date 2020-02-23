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
const moleculer_1 = require("moleculer");
const constant_1 = require("../constant");
const db_1 = require("../db");
const customizedMiddleware = {
    localAction: function (handler) {
        function closeConnection(ctx) {
            if (ctx.meta.DB && !ctx.meta.isKeptDBConnection) {
                ctx.meta.DB.destroy();
            }
            if (ctx.meta.DBAdmin) {
                ctx.meta.DBAdmin.destroy();
            }
        }
        function initDBConnection(ctx) {
            ctx.meta.isKeptDBConnection = false;
            if (ctx.meta === undefined ||
                ctx.meta === null ||
                ctx.meta.userInfo === undefined ||
                ctx.meta.userInfo === null) {
                ctx.meta.typeConnect = constant_1.DBTypeStore.ADMIN;
                ctx.meta.DB = new db_1.Connection(constant_1.DBTypeStore.ADMIN).query();
            }
            else {
                const { id, password } = ctx.meta.userInfo;
                ctx.meta.typeConnect = constant_1.DBTypeStore.USER;
                ctx.meta.DB = new db_1.Connection(constant_1.DBTypeStore.USER, id, password).query();
            }
            ctx.meta.DBAdmin = new db_1.Connection(constant_1.DBTypeStore.ADMIN).query();
        }
        function grantTablePermission(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const dbAdmin = new db_1.Connection(constant_1.DBTypeStore.ADMIN).query();
                try {
                    const { id, password } = ctx.meta.userInfo;
                    yield dbAdmin.raw(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${id}";`);
                    dbAdmin.destroy();
                    ctx.meta.typeConnect = constant_1.DBTypeStore.USER;
                    ctx.meta.DB = new db_1.Connection(constant_1.DBTypeStore.USER, id, password).query();
                    const res = yield handler(ctx);
                    closeConnection(ctx);
                    return res;
                }
                catch (error) {
                    closeConnection(ctx);
                    console.log(error);
                    return Promise.reject(new moleculer_1.Errors.MoleculerError(error.toString()));
                }
            });
        }
        return (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                initDBConnection(ctx);
                return yield handler(ctx);
            }
            catch (error) {
                if (error.code === "42501") {
                    yield grantTablePermission(ctx);
                }
                else if (error.type === "VALIDATION_ERROR") {
                    return Promise.reject(new moleculer_1.Errors.MoleculerError(error.data));
                }
                else {
                    return Promise.reject(new moleculer_1.Errors.MoleculerError(error.toString()));
                }
            }
            finally {
                closeConnection(ctx);
            }
        });
    },
};
exports.middleware = customizedMiddleware;
