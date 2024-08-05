/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

if (!process.env.DB_HOST) {
  throw new Error("DB_HOST is not defined");
}

if (!process.env.DB_USER) {
  throw new Error("DB_USER is not defined");
}

if (!process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD is not defined");
}

if (!process.env.DB_NAME) {
  throw new Error("DB_NAME is not defined");
}

// eslint-disable-next-line consistent-return
const main = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      connectionLimit: 1,
    });
    await migrate(drizzle(connection), {
      migrationsFolder: "drizzle/migrations",
    });
    console.info("Database migration done.");
    await connection.end();
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
};

main();
