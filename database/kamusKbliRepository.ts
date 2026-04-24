import db from './db';

export type KamusKbli = {
  id: number;
  kode_kbli: string;
  kode_gabungan: string;
  kategori: string;
  judul: string;
  deskripsi: string;
};

export const setupKamusKbliTable = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS kamus_kbli (
      id INTEGER PRIMARY KEY,
      kode_kbli TEXT,
      kode_gabungan TEXT,
      kategori TEXT,
      judul TEXT,
      deskripsi TEXT
    );
  `);
};

export const isKamusKbliEmpty = (): boolean => {
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM kamus_kbli'
  );
  return (result?.count ?? 0) === 0;
};

export const insertKamusKbliData = (data: KamusKbli[]) => {
  const stmt = db.prepareSync(`
    INSERT OR REPLACE INTO kamus_kbli
    (id, kode_kbli, kode_gabungan, kategori, judul, deskripsi)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  try {
    for (const item of data) {
      stmt.executeSync([
        item.id, item.kode_kbli, item.kode_gabungan,
        item.kategori, item.judul, item.deskripsi
      ]);
    }
  } finally {
    stmt.finalizeSync();
  }
};