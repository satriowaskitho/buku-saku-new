import db from './db';

export const createSyncMetaTable = async () => {
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS sync_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
};

export const getSyncStatus = async (key: string) => {
  const res = await db.getFirstAsync(
    "SELECT value FROM sync_meta WHERE key = ?",
    [key]
  ) as { value: string } | null;

  return res?.value === "true";
};

export const setSyncStatus = async (key: string, value: boolean) => {
  await db.runAsync(
    "INSERT OR REPLACE INTO sync_meta (key, value) VALUES (?, ?)",
    [key, value ? "true" : "false"]
  );
};