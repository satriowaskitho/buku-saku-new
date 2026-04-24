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

// Insert banyak data
export const insertKbliData = (data: KbliMapping[]) => {
  const stmt = db.prepareSync(`
    INSERT OR REPLACE INTO kbli_mapping 
    (id, nama_usaha, status_perusahaan, status_hasil_gc, kbli_2020, kbli_2025, korespondensi, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  try {
    for (const item of data) {
      stmt.executeSync([
        item.id, item.nama_usaha, item.status_perusahaan,
        item.status_hasil_gc, item.kbli_2020, item.kbli_2025,
        item.korespondensi, item.created_at, item.updated_at
      ]);
    }
  } finally {
    stmt.finalizeSync();
  }
};