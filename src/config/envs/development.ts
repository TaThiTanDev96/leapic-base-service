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

const MAIL_SERVICE = {
  HOST: "smtp.gmail.com",
  PORT: 587,
  SECURE: true,
  USER: "tuphamdev96@gmail.com",
  PASSWORD: "tkhdmykofxjcmunw",
};

export { DB, MAIL_SERVICE };
