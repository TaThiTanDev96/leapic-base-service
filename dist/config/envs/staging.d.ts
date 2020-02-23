declare const DB: {
    DB_USER: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_DATABASE: string;
    DB_PATH_MIGRATIONS: string;
    DB_PATH_SEEDS: string;
};
declare const MAIL_SERVICE: {
    HOST: string;
    PORT: number;
    TLS_SSL: string;
    USERNAME: string;
    PASSWORD: string;
};
export { DB, MAIL_SERVICE };
