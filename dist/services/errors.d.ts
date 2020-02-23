declare const MoleculerError: any, MoleculerClientError: any;
declare const ERR_NO_TOKEN = "NO_TOKEN";
declare const ERR_INVALID_TOKEN = "INVALID_TOKEN";
declare const ERR_UNABLE_DECODE_PARAM = "UNABLE_DECODE_PARAM";
declare const ERR_ORIGIN_NOT_FOUND = "ORIGIN_NOT_FOUND";
declare const ERR_ORIGIN_NOT_ALLOWED = "ORIGIN_NOT_ALLOWED";
declare const NOT_SIGN_TOKEN = "NOT SIGN TOKEN";
/**
 * Invalid request body
 *
 * @class InvalidRequestBodyError
 * @extends {Error}
 */
declare class InvalidRequestBodyError extends MoleculerError {
    /**
     * Creates an instance of InvalidRequestBodyError.
     *
     * @param {any} body
     * @param {any} error
     *
     * @memberOf InvalidRequestBodyError
     */
    constructor(body: any, error: any);
}
/**
 * Invalid response type
 *
 * @class InvalidResponseTypeError
 * @extends {Error}
 */
declare class InvalidResponseTypeError extends MoleculerError {
    /**
     * Creates an instance of InvalidResponseTypeError.
     *
     * @param {String} dataType
     *
     * @memberOf InvalidResponseTypeError
     */
    constructor(dataType: any);
}
/**
 * Unauthorized HTTP error
 *
 * @class UnAuthorizedError
 * @extends {Error}
 */
declare class UnAuthorizedError extends MoleculerError {
    /**
     * Creates an instance of UnAuthorizedError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf UnAuthorizedError
     */
    constructor(type: any, data: any);
}
/**
 * Forbidden HTTP error
 *
 * @class ForbiddenError
 * @extends {Error}
 */
declare class ForbiddenError extends MoleculerError {
    /**
     * Creates an instance of ForbiddenError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf ForbiddenError
     */
    constructor(type: any, data: any);
}
/**
 * Bad request HTTP error
 *
 * @class BadRequestError
 * @extends {Error}
 */
declare class BadRequestError extends MoleculerError {
    /**
     * Creates an instance of BadRequestError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf BadRequestError
     */
    constructor(type: any, data: any);
}
/**
 * Not found HTTP error
 *
 * @class NotFoundError
 * @extends {Error}
 */
declare class NotFoundError extends MoleculerError {
    /**
     * Creates an instance of NotFoundError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf NotFoundError
     */
    constructor(type: any, data: any);
}
/**
 * Rate limit exceeded HTTP error
 *
 * @class RateLimitExceeded
 * @extends {Error}
 */
declare class RateLimitExceeded extends MoleculerClientError {
    /**
     * Creates an instance of RateLimitExceeded.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf RateLimitExceeded
     */
    constructor(type: any, data: any);
}
/**
 * Service unavailable HTTP error
 *
 * @class ForbiddenError
 * @extends {Error}
 */
declare class ServiceUnavailableError extends MoleculerError {
    /**
     * Creates an instance of ForbiddenError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf ForbiddenError
     */
    constructor(type: any, data: any);
}
