import db from './db';

export type KbliMapping = {
  id: number;
  nama_usaha: string;
  status_perusahaan: string;
  status_hasil_gc: string;
  kbli_2020: string;
  kbli_2025: string;
  korespondensi: string;
  created_at: string;
  updated_at: string;
};

// Buat tabel
export const setupKbliTable = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS kbli_mapping (
      id INTEGER PRIMARY KEY,
      nama_usaha TEXT,
      status_perusahaan TEXT,
      status_hasil_gc TEXT,
      kbli_2020 TEXT,
      kbli_2025 TEXT,
      korespondensi TEXT,
      created_at TEXT,
      updated_at TEXT
    );
  `);
};

// Cek apakah kosong
export const isKbliEmpty = (): boolean => {
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM kbli_mapping'
  );
  return (result?.count ?? 0) === 0;
};

//  insert KBLI data ke database
export const insertKbliData = (data: KbliMapping[]) => {
  console.log("MASUK INSERT KBLI:", data.length);

  const stmt = db.prepareSync(`
    INSERT OR REPLACE INTO kbli_mapping 
    (id, nama_usaha, status_perusahaan, status_hasil_gc, kbli_2020, kbli_2025, korespondensi, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let i = 0;

  try {
    console.log("BEGIN TRANSACTION");
    db.execSync("BEGIN TRANSACTION");

    for (const item of data) {
      stmt.executeSync([
        item.id, item.nama_usaha, item.status_perusahaan,
        item.status_hasil_gc, item.kbli_2020, item.kbli_2025,
        item.korespondensi, item.created_at, item.updated_at
      ]);

      i++;

      if (i % 1000 === 0) {
        console.log("Inserted:", i);
      }
    }

    db.execSync("COMMIT");
    console.log("DONE INSERT KBLI");

  } catch (error) {
    db.execSync("ROLLBACK");
    console.error("ERROR INSERT:", error);
    throw error;
  } finally {
    stmt.finalizeSync();
  }
};

export const searchKbliByNamaUsaha = (query: string) => {
  const words = query.trim().split(/\s+/);

  const conditions = words.map(() => `km.nama_usaha LIKE ?`).join(' AND ');

  const params = words.map(word => `%${word}%`);

  return db.getAllSync(
    `SELECT 
      km.kbli_2025,
      km.nama_usaha,
      kk.judul
    FROM kbli_mapping km
    LEFT JOIN kamus_kbli kk ON km.kbli_2025 = kk.kode_kbli
    WHERE ${conditions}
    LIMIT 100`,
    params
  );
};