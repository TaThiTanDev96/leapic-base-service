declare const config: {
    serviceName: string;
    port: number;
    loggerLevel: string;
    DB: {
        DB_USER: any;
        DB_NAME: any;
        DB_PASSWORD: any;
        DB_HOST: any;
        DB_PORT: any;
        DB_DATABASE: any;
        DB_PATH_MIGRATIONS: any;
        DB_PATH_SEEDS: any;
        DB_MIGRATION_FILE_EXTENSION: any;
    };
    MailService: {
        host: any;
        port: any;
        secure: any;
        user: any;
        password: any;
    };
};
export = config;
