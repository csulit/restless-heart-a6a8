import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Create the connection pool outside the function handler
let poolConnection: mysql.Pool | null = null;

export const getPoolConnection = () => {
  if (!poolConnection) {
    poolConnection = mysql.createPool({
      host: Bun.env["DB_HOST"],
      user: Bun.env["DB_USER"],
      database: Bun.env["DB_NAME"],
      password: Bun.env["DB_PASSWORD"],
      waitForConnections: true,
      connectionLimit: 10, // Adjust based on your database's capacity
      queueLimit: 0,
    });
  }
  return poolConnection;
};

const db = drizzle(getPoolConnection(), {
  schema,
  mode: "default",
  logger: true,
});

export default db;
