import mysql from "mysql2/promise";
import connectionOptions, {
  databaseName,
  getConnectionOptions,
} from "./databaseConfig.js";

const pool = mysql.createPool({
  ...connectionOptions,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

export { databaseName, getConnectionOptions, connectionOptions };

export async function getDbConnection() {
  return pool.getConnection();
}

export async function verifyDatabaseConnection() {
  const connection = await getDbConnection();

  try {
    await connection.ping();
    console.log(
      `[database] Connected to "${databaseName}" at ${connectionOptions.host}:${connectionOptions.port}.`
    );
  } finally {
    connection.release();
  }
}

export default pool;
