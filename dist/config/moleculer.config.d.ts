import { Errors } from "moleculer";
/**
 * Moleculer ServiceBroker configuration file
 *
 * More info about options: https://moleculer.services/docs/0.13/broker.html#Broker-options
 *
 * Overwrite options in production:
 * ================================
 * 	You can overwrite any option with environment variables.
 * 	For example to overwrite the "logLevel", use `LOGLEVEL=warn` env var.
 * 	To overwrite a nested parameter, e.g. retryPolicy.retries, use `RETRYPOLICY_RETRIES=10` env var.
 *
 * 	To overwrite broker’s deeply nested default options, which are not presented in "moleculer.config.ts",
 * 	via environment variables, use the `MOL_` prefix and double underscore `__` for nested properties in .env file.
 * 	For example, to set the cacher prefix to `MYCACHE`, you should declare an env var as `MOL_CACHER__OPTIONS__PREFIX=MYCACHE`.
 */
declare const brokerConfig: {
    namespace: string;
    nodeID: string;
    logger: ({
        type: string;
        options: {
            level: string;
            folder?: undefined;
            filename?: undefined;
            formatter?: undefined;
        };
    } | {
        type: string;
        options: {
            level: string;
            folder: string;
            filename: string;
            formatter: string;
        };
    })[];
    transporter: string;
    cacher: string;
    serializer: string;
    requestTimeout: number;
    retryPolicy: {
        enabled: boolean;
        retries: number;
        delay: number;
        maxDelay: number;
        factor: number;
        check: (err: Errors.MoleculerRetryableError) => boolean;
    };
    maxCallLevel: number;
    heartbeatInterval: number;
    heartbeatTimeout: number;
    tracking: {
        enabled: boolean;
        shutdownTimeout: number;
    };
    disableBalancer: boolean;
    registry: {
        strategy: string;
        preferLocal: boolean;
    };
    circuitBreaker: {
        enabled: boolean;
        threshold: number;
        minRequestCount: number;
        windowTime: number;
        halfOpenTime: number;
        check: (err: Errors.MoleculerRetryableError) => boolean;
    };
    bulkhead: {
        enabled: boolean;
        concurrency: number;
        maxQueueSize: number;
    };
    validation: boolean;
    validator: boolean;
    metrics: boolean;
    metricsRate: number;
    internalServices: boolean;
    internalMiddlewares: boolean;
    hotReload: boolean;
    middlewares: {
        localAction: (handler: any) => (ctx: import("moleculer").Context<any, any>) => Promise<any>;
    }[];
    created(broker: any): Promise<void>;
    started(broker: any): void;
    stopped(broker: any): void;
    replCommands: any;
};
export = brokerConfig;
