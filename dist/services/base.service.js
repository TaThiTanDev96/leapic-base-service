"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const moleculer_decorators_1 = require("moleculer-decorators");
const base_validator_1 = require("../services/base.validator");
class BaseService {
    constructor(name, model) {
        this.name = name;
        this.model = model;
    }
    getList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = this['schema'].model;
            model.setContext(ctx);
            let params = ctx.params;
            return yield model.getAllByConditions(params.where, params.order, params.pageSize, params.pageIndex);
        });
    }
}
__decorate([
    moleculer_decorators_1.Action({
        params: base_validator_1.GetAllSchema,
        rest: "POST /list"
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moleculer_1.Context]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "getList", null);
exports.BaseService = BaseService;
