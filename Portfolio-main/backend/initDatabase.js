import { verifyDatabaseConnection } from "./config/db.js";
import ensureSchema from "./ensureSchema.js";

export async function initDatabase() {
  await verifyDatabaseConnection();
  await ensureSchema();
}

export default initDatabase;
