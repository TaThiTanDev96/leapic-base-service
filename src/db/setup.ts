const { Pool } = require("pg");
import * as knex from "knex";
import * as config from "../config/envs";
import { DBTypeStore } from "../constant";
import { Connection } from "./connection";

export class setup {
  private connector: knex;

  constructor() {
    this.connector = new Connection(DBTypeStore.ADMIN).query();
  }

  public async initDB(): Promise<any> {
    // await this.createDB();
    let migrateConfig = {
      disableMigrationsListValidation: true,
    };
    if (config.DB.DB_PATH_MIGRATIONS.includes("./dist")) {
      migrateConfig["loadExtensions"] = [".js"];
    }
    await this.connector.migrate.latest(migrateConfig);
    await this.connector.raw(
      "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO PUBLIC;",
    );
  }

  public async dropDB(): Promise<any> {
    try {
      const {
        DB_HOST,
        DB_PORT,
        DB_DATABASE,
        DB_USER,
        DB_PASSWORD,
        DB_NAME,
      } = config.DB;
      const client = new Pool({
        host: DB_HOST,
        database: DB_DATABASE,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
      });
      const con = await client.connect();
      let flagCheckExist = await con.query(`
            SELECT 1 AS result FROM pg_database WHERE datname='${DB_NAME}';
        `);
      if (flagCheckExist.rows.length !== 1) {
        const result = await con.query(` DROP DATABASE ${DB_NAME}`);
        console.log(`DROP DATABASE ${DB_NAME}`);
        client.end();
        return result;
      } else {
        client.end();
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  public async createDB(): Promise<any> {
    try {
      const {
        DB_HOST,
        DB_PORT,
        DB_DATABASE,
        DB_USER,
        DB_PASSWORD,
        DB_NAME,
      } = config.DB;
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
          con = await client.connect();
        } catch (error) {
          tryTimeNumber++;
          let maximumTryTime = 10;
          if (tryTimeNumber > maximumTryTime) {
            throw error;
          }
          let waitingRetryTimeSeconds = 3;
          setTimeout(null, waitingRetryTimeSeconds);
        }
      }
      let flagCheckExist = await con.query(`
            SELECT 1 AS result FROM pg_database WHERE datname='${DB_NAME}';
        `);
      if (flagCheckExist.rows.length !== 1) {
        const result = await con.query(`
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
      } else {
        client.end();
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
}
