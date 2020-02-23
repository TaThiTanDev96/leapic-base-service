/// <reference types="node" />
import { IObject } from '../interfaces/common';
declare class JWTService {
    private privateKey;
    private publicKey;
    constructor(privateKey: any, publicKey: any);
    verify: (token: string, options?: IObject<any>) => Promise<any>;
    sign: (payload: string | object | Buffer, options?: IObject<any>) => Promise<string>;
    hash: (payload: string) => Promise<string>;
    compare: (payload: string, hash: string) => Promise<boolean>;
}
declare const _default: JWTService;
export default _default;
