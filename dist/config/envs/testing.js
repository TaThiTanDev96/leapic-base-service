"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB = {
    DB_USER: "postgres",
    DB_NAME: "leapic",
    DB_PASSWORD: "",
    DB_HOST: "localhost",
    DB_PORT: 5432,
    DB_DATABASE: "postgres",
    DB_PATH_MIGRATIONS: "./src/db/migrations",
    DB_PATH_SEEDS: "./src/db/seeds",
};
exports.DB = DB;
const MAIL_SERVICE = {
    HOST: "smtp.gmail.com",
    PORT: 587,
    TLS_SSL: "required",
    USERNAME: "tuphamdev96@gmail.com",
    PASSWORD: "jidcuvaqtngyqmza",
};
exports.MAIL_SERVICE = MAIL_SERVICE;
