import { Context } from "moleculer";
export declare const middleware: {
    localAction: (handler: any) => (ctx: Context<any, any>) => Promise<any>;
};
