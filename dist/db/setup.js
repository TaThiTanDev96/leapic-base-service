"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Pool } = require("pg");
const config = require("../config/envs");
const constant_1 = require("../constant");
const connection_1 = require("./connection");
class setup {
    constructor() {
        this.connector = new connection_1.Connection(constant_1.DBTypeStore.ADMIN).query();
    }
    initDB() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.createDB();
            let migrateConfig = {
                disableMigrationsListValidation: true,
            };
            if (config.DB.DB_PATH_MIGRATIONS.includes("./dist")) {
                migrateConfig["loadExtensions"] = [".js"];
            }
            yield this.connector.migrate.latest(migrateConfig);
            yield this.connector.raw("GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO PUBLIC;");
        });
    }
    dropDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD, DB_NAME, } = config.DB;
                const client = new Pool({
                    host: DB_HOST,
                    database: DB_DATABASE,
                    port: DB_PORT,
                    user: DB_USER,
                    password: DB_PASSWORD,
                });
                const con = yield client.connect();
                let flagCheckExist = yield con.query(`
            SELECT 1 AS result FROM pg_database WHERE datname='${DB_NAME}';
        `);
                if (flagCheckExist.rows.length !== 1) {
                    const result = yield con.query(` DROP DATABASE ${DB_NAME}`);
                    console.log(`DROP DATABASE ${DB_NAME}`);
                    client.end();
                    return result;
                }
                else {
                    client.end();
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    createDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD, DB_NAME, } = config.DB;
                const client = new Pool({
                    host: DB_HOST,
                    database: DB_DATABASE,
                    port: DB_PORT,
                    user: DB_USER,
                    password: DB_PASSWORD,
                });
                let con = null;
                let tryTimeNumber = 0;
                while (!con) {
                    try {
                        con = yield client.connect();
                    }
                    catch (error) {
                        tryTimeNumber++;
                        let maximumTryTime = 10;
                        if (tryTimeNumber > maximumTryTime) {
                            throw error;
                        }
                        let waitingRetryTimeSeconds = 3;
                        setTimeout(null, waitingRetryTimeSeconds);
                    }
                }
                let flagCheckExist = yield con.query(`
            SELECT 1 AS result FROM pg_database WHERE datname='${DB_NAME}';
        `);
                if (flagCheckExist.rows.length !== 1) {
                    const result = yield con.query(`
                CREATE DATABASE
                    ${DB_NAME}
                WITH
                ENCODING = 'UTF8'
                CONNECTION LIMIT = -1
            `);
                    console.log(`CREATE DATABASE
                    ${DB_NAME}
                WITH
                ENCODING = 'UTF8'
                CONNECTION LIMIT = -1`);
                    client.end();
                    return result;
                }
                else {
                    client.end();
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.setup = setup;
