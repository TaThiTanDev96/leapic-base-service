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
const { UnAuthorizedError, ERR_NO_TOKEN } = require("../services/errors");
class BaseModels {
    authentication(ctx, route, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify JWT token
            let token;
            console.log(req.headers.authorization);
            if (req.headers.authorization) {
                const type = req.headers.authorization.split(" ")[0];
                if (type === "Token") {
                    token = req.headers.authorization.split(" ")[1];
                }
            }
            if (!token) {
                return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
            }
            // Verify JWT token
            return ctx.call("auth.resolveToken", { token })
                .then((user) => {
                return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
            });
        });
    }
    ;
}
exports.BaseModels = BaseModels;
