import * as development from "./development";
import * as production from "./production";
import * as staging from "./staging";
import * as testing from "./testing";

import * as dotenv from "dotenv";
// DO NOT COMMIT YOUR .env FILE
const env = process.env.NODE_ENV || "development";
if (env.includes("development") || env.includes("debug")) {
  this[env] = development;
} else if (env.includes("testing")) {
  this[env] = testing;
} else if (env.includes("staging")) {
  this[env] = staging;
} else if (env.includes("production")) {
  this[env] = production;
} else {
  throw `Environment ${env} not found`;
}

dotenv.config({ path: "envs/.env." + env });
const config = {
  serviceName: process.env.SERVICENAME || "node typescript postgres app",
  port: Number(process.env.PORT) || 3000,
  loggerLevel: "debug",
  DB: {
    DB_USER: process.env.DB_USER || this[env].DB.DB_USER,
    DB_NAME: process.env.DB_NAME || this[env].DB.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD || this[env].DB.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST || this[env].DB.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT) || this[env].DB.DB_PORT,
    DB_DATABASE: process.env.DB_DATABASE || this[env].DB.DB_DATABASE,
    DB_PATH_MIGRATIONS: process.env.DB_PATH_MIGRATIONS || this[env].DB.DB_PATH_MIGRATIONS,
    DB_PATH_SEEDS: process.env.DB_PATH_SEEDS || this[env].DB.DB_PATH_SEEDS,
    DB_MIGRATION_FILE_EXTENSION: process.env.DB_MIGRATION_FILE_EXTENSION || this[env].DB.DB_MIGRATION_FILE_EXTENSION,
  },
  MailService: {
    host: process.env.MAIL_SERVICE_HOST || this[env].MAIL_SERVICE.HOST,
    port: process.env.MAIL_SERVICE_PORT || this[env].MAIL_SERVICE.PORT,
    secure: process.env.MAIL_SERVICE_SECURE || this[env].MAIL_SERVICE.SECURE,
    user: process.env.MAIL_SERVICE_USER || this[env].MAIL_SERVICE.USER,
    password: process.env.MAIL_SERVICE_PASSWORD || this[env].MAIL_SERVICE.PASSWORD,
  },
  // MailService: {
  //     host: process.env.MAIL_SERVICE_HOST || 'email-smtp.us-east-1.amazonaws.com',
  //     port: process.env.MAIL_SERVICE__PORT || 465,
  //     secure: process.env.MAIL_SERVICE__SECURE || true,
  //     user: process.env.MAIL_SERVICE__USER || 'AKIAR4BJ6YR2JIB3FA7W',
  //     password: process.env.MAIL_SERVICE__PASSWORD || 'BHQENUHiky/9CRaFsfre4Mv+CaKuBu4idLcCQYWCLLQm'
  // }
};

export = config;
