"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const lib_1 = require("../lib");
const { UnAuthorizedError, ERR_INVALID_TOKEN, NOT_SIGN_TOKEN } = require("./errors");
const secretOrPrivateKey = fs.readFileSync(path.join(__dirname, '../config/key/private.key'));
const secretOrPublicKey = fs.readFileSync(path.join(__dirname, '../config/key/public.key'));
const saltRounds = 10;
class JWTService {
    constructor(privateKey, publicKey) {
        this.verify = (token, options = {}) => {
            return new Promise((resolve, reject) => {
                lib_1.jwt.verify(token, this.privateKey, {
                    algorithms: ['HS256']
                }, (err, decoded) => {
                    if (err) {
                        reject(new UnAuthorizedError(ERR_INVALID_TOKEN));
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });
        };
        this.sign = (payload, options = {}) => {
            return new Promise((resolve, reject) => {
                lib_1.jwt.sign({ payload }, this.privateKey, options || {
                    algorithm: 'HS256',
                    expiresIn: '10h'
                }, (err, decoded) => {
                    if (err) {
                        reject(new UnAuthorizedError(NOT_SIGN_TOKEN));
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });
        };
        this.hash = (payload) => {
            return lib_1.bcrypt.hash(payload, saltRounds);
        };
        this.compare = (payload, hash) => {
            return lib_1.bcrypt.compare(payload, hash);
        };
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
}
exports.default = new JWTService(secretOrPrivateKey, secretOrPublicKey);
