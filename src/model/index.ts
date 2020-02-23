const { UnAuthorizedError, ERR_NO_TOKEN } = require("../services/errors");
export class BaseModels {
    public async authentication(ctx: any, route: any, req: any, res: any): Promise<any>  {
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
            .then((user: any) => {
                return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
            });
    };
}
