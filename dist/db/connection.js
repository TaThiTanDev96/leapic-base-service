"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex = require("knex");
const config = require("../config/envs");
const constant_1 = require("../constant");
class Connection {
    constructor(type, userLogin = "", passwordLogin = "") {
        const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_PATH_MIGRATIONS, DB_PATH_SEEDS, } = config.DB;
        let user = DB_USER;
        let password = DB_PASSWORD;
        this.host = DB_HOST;
        this.user = DB_USER;
        this.port = DB_PORT;
        this.password = DB_PASSWORD;
        this.database = DB_NAME;
        this.db_path_migrations = DB_PATH_MIGRATIONS;
        this.db_path_seeds = DB_PATH_SEEDS;
        if (type === constant_1.DBTypeStore.USER) {
            this.user = userLogin;
            this.password = passwordLogin;
        }
    }
    query() {
        console.info("Create connection: ");
        console.info({
            client: "pg",
            connection: {
                host: this.host,
                port: this.port,
                user: this.user,
                password: this.password,
                database: this.database,
            },
            migrations: {
                directory: this.db_path_migrations,
            },
            seeds: {
                directory: this.db_path_seeds,
            },
        });
        return knex({
            client: "pg",
            connection: {
                host: this.host,
                port: this.port,
                user: this.user,
                password: this.password,
                database: this.database,
            },
            migrations: {
                directory: this.db_path_migrations,
            },
            seeds: {
                directory: this.db_path_seeds,
            },
        });
    }
}
exports.Connection = Connection;
