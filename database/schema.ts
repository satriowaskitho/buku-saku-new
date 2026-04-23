import db from './db';

export function setupDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS kamus_kbli (
      id INTEGER,
      kode_gabungan TEXT,
      kategori TEXT,
      kode_kbli TEXT PRIMARY KEY,
      judul TEXT,
      deskripsi TEXT
    );

    CREATE TABLE IF NOT EXISTS kbli_mapping (
      id INTEGER PRIMARY KEY,
      nama_usaha TEXT,
      status_perusahaan TEXT,
      status_hasil_gc TEXT,
      kbli_2020 TEXT,
      kbli_2025 TEXT,
      korespondensi TEXT,
      created_at Timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at Timestamp DEFAULT CURRENT_TIMESTAMP
    );
  `);
}