import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Create the connection pool outside the function handler
let poolConnection: mysql.Pool | null = null;

const getPoolConnection = () => {
  if (!poolConnection) {
    poolConnection = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 50, // Adjust based on your database's capacity
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
