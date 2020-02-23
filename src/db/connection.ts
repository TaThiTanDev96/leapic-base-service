import * as knex from "knex";
import * as config from "../config/envs";
import { DBTypeStore } from "../constant";

export class Connection {
  private host: string;
  private user: string;
  private port: number;
  private password: string;
  private database: string;
  private db_path_migrations: string;
  private db_path_seeds: string;

  constructor(type, userLogin = "", passwordLogin = "") {
    const {
      DB_HOST,
      DB_PORT,
      DB_USER,
      DB_PASSWORD,
      DB_NAME,
      DB_PATH_MIGRATIONS,
      DB_PATH_SEEDS,
    } = config.DB;
    let user = DB_USER;
    let password = DB_PASSWORD;
    this.host = DB_HOST;
    this.user = DB_USER;
    this.port = DB_PORT;
    this.password = DB_PASSWORD;
    this.database = DB_NAME;
    this.db_path_migrations = DB_PATH_MIGRATIONS;
    this.db_path_seeds = DB_PATH_SEEDS;
    if (type === DBTypeStore.USER) {
      this.user = userLogin;
      this.password = passwordLogin;
    }
  }

  public query(): knex {
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
