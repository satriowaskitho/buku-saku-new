import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('buku-saku.db');

export default db;