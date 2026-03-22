const DEFAULT_DATABASE_NAME = "railway";

export function getConnectionOptions() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("[database] DATABASE_URL is required.");
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error("[database] DATABASE_URL must be a valid MySQL connection string.");
  }

  const databaseName =
    decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, "")) ||
    DEFAULT_DATABASE_NAME;

  return {
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port || 3306),
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: databaseName,
  };
}

export const connectionOptions = getConnectionOptions();
export const databaseName = connectionOptions.database;

export default connectionOptions;
