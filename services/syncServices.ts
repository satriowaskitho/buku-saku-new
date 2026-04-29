import * as SecureStore from 'expo-secure-store';
import { insertKbliData, isKbliEmpty, setupKbliTable } from '@/database/kbliMappingRepository';
import { insertKamusKbliData, isKamusKbliEmpty, setupKamusKbliTable } from '@/database/kamusKbliRepository';

const BASE_URL = "https://kakukli-backend-lac.vercel.app";
const LIMIT = 1000;

const fetchAll = async (token: string, endpoint: string, updatedAfter?: string) => {
  let offset = 0;
  let allData: any[] = [];
  let hasMore = true;

  while (hasMore) {
    const url = updatedAfter
      ? `${BASE_URL}${endpoint}?limit=${LIMIT}&offset=${offset}&updated_after=${updatedAfter}`
      : `${BASE_URL}${endpoint}?limit=${LIMIT}&offset=${offset}`;

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    });
    const json = await res.json();
    const data = json.data ?? [];
    allData.push(...data);
    offset += LIMIT;
    hasMore = data.length === LIMIT;
  }

  return allData;
};

export const initialSync = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await SecureStore.getItemAsync('token');
    console.log("Token availability checking?", !!token);
    if (!token) return { success: false, message: 'Tidak ada token' };

    await setupKbliTable();
    await setupKamusKbliTable();

    if (await isKbliEmpty()) {
      const data = await fetchAll(token, '/api/kbli-mapping');
      insertKbliData(data);
    }

    if (await isKamusKbliEmpty()) {
      const data = await fetchAll(token, '/api/kamus-kbli');
      insertKamusKbliData(data);
    }

    await SecureStore.setItemAsync('lastSync', new Date().toISOString());
    return { success: true, message: 'Sync berhasil' };
  } catch (err: any) {
    return { success: false, message: err.message ?? 'Sync gagal' };
  }
};

export const updateSync = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (!token) return { success: false, message: 'Tidak ada token' };

    const lastSync = await SecureStore.getItemAsync('lastSync');
    if (!lastSync) return { success: false, message: 'Belum ada initial sync' };

    console.log("updateSync dari:", lastSync);

    // kbli_mapping
    const kbliData = await fetchAll(token, '/api/kbli-mapping', lastSync);
    console.log("kbli_mapping baru/berubah:", kbliData.length);
    if (kbliData.length > 0) insertKbliData(kbliData);

    // kamus_kbli
    const kamusData = await fetchAll(token, '/api/kamus-kbli', lastSync);
    console.log("kamus_kbli baru/berubah:", kamusData.length);
    if (kamusData.length > 0) insertKamusKbliData(kamusData);

    await SecureStore.setItemAsync('lastSync', new Date().toISOString());
    return { success: true, message: 'Update sync berhasil' };
  } catch (err: any) {
    return { success: false, message: err.message ?? 'Update sync gagal' };
  }
};

export const checkForUpdates = async (): Promise<number> => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (!token) return 0;

    const lastSync = await SecureStore.getItemAsync('lastSync');
    if (!lastSync) return 0;

    const [kbliRes, kamusRes] = await Promise.all([
      fetch(`${BASE_URL}/api/kbli-mapping/count?updated_after=${lastSync}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'accept': 'application/json' }
      }),
      fetch(`${BASE_URL}/api/kamus-kbli/count?updated_after=${lastSync}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'accept': 'application/json' }
      })
    ]);

    const kbliJson = await kbliRes.json();
    const kamusJson = await kamusRes.json();

    const total = (kbliJson.count ?? 0) + (kamusJson.count ?? 0);
    console.log("Total data baru:", total);
    return total;
  } catch (err) {
    return 0;
  }
};
