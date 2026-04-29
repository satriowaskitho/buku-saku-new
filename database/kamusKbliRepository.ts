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

  console.log("FUNCTION KE PANGGIL"); // 👈 ini
  console.log("START INSERT KAMUS:", data.length);

  const stmt = db.prepareSync(`
    INSERT OR REPLACE INTO kamus_kbli
    (id, kode_kbli, kode_gabungan, kategori, judul, deskripsi)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  let i = 0;

  try {
    db.execSync("BEGIN TRANSACTION"); // 🔥 penting banget

    for (const item of data) {
      stmt.executeSync([
        item.id, item.kode_kbli, item.kode_gabungan,
        item.kategori, item.judul, item.deskripsi
      ]);

      i++;

      if (i % 1000 === 0) {
        console.log("KAMUS Inserted:", i);
      }
    }

    db.execSync("COMMIT"); 

    console.log("DONE INSERT KAMUS");

  } catch (error) {
    db.execSync("ROLLBACK"); 
    throw error;
  } finally {
    stmt.finalizeSync();
  }
};

export const getKamusKbliByKode = (kode: string) => {
  return db.getFirstSync<{
    kode_kbli: string;
    kode_gabungan: string;  // ← tambah ini
    judul: string;
    deskripsi: string;
    kategori: string;
  }>(
    `SELECT kode_kbli, kode_gabungan, judul, deskripsi, kategori FROM kamus_kbli WHERE kode_kbli = ?`,
    [kode]
  );
};

export const searchKamusKbli = (query: string) => {
  const words = query.trim().split(/\s+/);
  
  const conditions = words.map(() => 
    `(kode_kbli LIKE ? OR kategori LIKE ? OR judul LIKE ? OR deskripsi LIKE ?)`
  ).join(' AND ');

  const params = words.flatMap(word => 
    [`%${word}%`, `%${word}%`, `%${word}%`, `%${word}%`]
  );

  return db.getAllSync(
    `SELECT kode_kbli, kode_gabungan, kategori, judul, deskripsi 
     FROM kamus_kbli 
     WHERE ${conditions}
     LIMIT 100`,
    params
  );
};

export const deleteKamusByKodes = (kodes: string[]) => {
  if (kodes.length === 0) return;
  
  try {
    db.execSync("BEGIN TRANSACTION");
    // pakai string interpolation langsung dengan quoted strings
    const quotedKodes = kodes.map(k => `'${k}'`).join(',');
    db.execSync(`DELETE FROM kamus_kbli WHERE kode_kbli IN (${quotedKodes})`);
    db.execSync("COMMIT");
    console.log("DELETED KAMUS:", kodes.length);
  } catch (error) {
    db.execSync("ROLLBACK");
    throw error;
  }
};