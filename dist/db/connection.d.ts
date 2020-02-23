import * as knex from "knex";
export declare class Connection {
    private host;
    private user;
    private port;
    private password;
    private database;
    private db_path_migrations;
    private db_path_seeds;
    constructor(type: any, userLogin?: string, passwordLogin?: string);
    query(): knex;
}
