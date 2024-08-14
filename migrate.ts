/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

if (!Bun.env["DB_HOST"]) {
  throw new Error("DB_HOST is not defined");
}

if (!Bun.env["DB_USER"]) {
  throw new Error("DB_USER is not defined");
}

if (!Bun.env["DB_PASSWORD"]) {
  throw new Error("DB_PASSWORD is not defined");
}

if (!Bun.env["DB_NAME"]) {
  throw new Error("DB_NAME is not defined");
}

// eslint-disable-next-line consistent-return
const main = async () => {
  try {
    const connection = await mysql.createConnection({
      host: Bun.env["DB_HOST"],
      user: Bun.env["DB_USER"],
      database: Bun.env["DB_NAME"],
      password: Bun.env["DB_PASSWORD"],
      connectionLimit: 1,
    });
    await migrate(drizzle(connection), {
      migrationsFolder: "src/database/migrations",
    });
    console.info("Database migration done.");
    await connection.end();
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
};

main();
