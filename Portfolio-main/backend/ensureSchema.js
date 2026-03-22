import pool, { databaseName } from "./config/db.js";

function isSchemaMutationEnabled() {
  const autoSchemaFlag = process.env.DB_AUTO_SCHEMA?.toLowerCase();

  if (autoSchemaFlag === "true") {
    return true;
  }

  if (autoSchemaFlag === "false") {
    return false;
  }

  return process.env.NODE_ENV !== "production";
}

async function columnExists(tableName, columnName) {
  const [rows] = await pool.execute(
    `
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [databaseName, tableName, columnName]
  );

  return rows.length > 0;
}

function isDuplicateColumnError(error) {
  return error?.code === "ER_DUP_FIELDNAME";
}

export async function ensureColumn({
  tableName,
  columnName,
  columnDefinition,
}) {
  if (!tableName || !columnName || !columnDefinition) {
    throw new Error(
      "[schema] tableName, columnName, and columnDefinition are required."
    );
  }

  const exists = await columnExists(tableName, columnName);

  if (exists) {
    console.log(`[schema] ${tableName}.${columnName} already exists. Skipping.`);
    return false;
  }

  if (!isSchemaMutationEnabled()) {
    console.log(
      `[schema] ${tableName}.${columnName} is missing, but schema changes are disabled.`
    );
    return false;
  }

  console.log(`[schema] Adding ${tableName}.${columnName}...`);

  try {
    await pool.query(`ALTER TABLE ?? ADD COLUMN ?? ${columnDefinition}`, [
      tableName,
      columnName,
    ]);
  } catch (error) {
    if (isDuplicateColumnError(error)) {
      console.log(
        `[schema] ${tableName}.${columnName} was added by another process. Skipping.`
      );
      return false;
    }

    throw error;
  }

  console.log(`[schema] Added ${tableName}.${columnName}.`);
  return true;
}

export async function ensureSchema() {
  console.log(`[schema] Checking schema for database "${databaseName}"...`);

  await ensureColumn({
    tableName: "users",
    columnName: "username",
    columnDefinition: "VARCHAR(255) NOT NULL",
  });

  console.log("[schema] Schema check complete.");
}

export default ensureSchema;
