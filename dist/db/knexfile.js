"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../config/envs");
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_PATH_MIGRATIONS, DB_PATH_SEEDS } = config.DB;
const knexfile = {
    testing: {
        client: 'pg',
        connection: {
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        },
        migrations: {
            directory: DB_PATH_MIGRATIONS,
            disableMigrationsListValidation: true
        },
        seeds: {
            directory: DB_PATH_SEEDS,
        },
    },
    development: {
        client: 'pg',
        connection: {
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        },
        migrations: {
            directory: DB_PATH_MIGRATIONS,
            disableMigrationsListValidation: true
        },
        seeds: {
            directory: DB_PATH_SEEDS,
        },
    },
    production: {
        client: 'pg',
        connection: {
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        },
        migrations: {
            directory: DB_PATH_MIGRATIONS,
            disableMigrationsListValidation: true
        },
        seeds: {
            directory: DB_PATH_SEEDS,
        },
    },
};
exports.default = knexfile;
