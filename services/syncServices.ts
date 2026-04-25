import * as SecureStore from 'expo-secure-store';
import { insertKbliData, isKbliEmpty, setupKbliTable } from '@/database/kbliMappingRepository';
import { insertKamusKbliData, isKamusKbliEmpty, setupKamusKbliTable } from '@/database/kamusKbliRepository';

const BASE_URL = "https://kakukli-backend-lac.vercel.app";
const LIMIT = 1000;

const fetchAll = async (token: string, endpoint: string) => {
  let offset = 0;
  let allData: any[] = [];
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${BASE_URL}${endpoint}?limit=${LIMIT}&offset=${offset}`, {
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

export const syncKbliData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await SecureStore.getItemAsync('token');
    console.log("Token availability checking?", !!token);
    if (!token) return { success: false, message: 'Tidak ada token' };

    setupKbliTable();
    setupKamusKbliTable();

    if (isKbliEmpty()) {
      const data = await fetchAll(token, '/api/kbli-mapping');
      insertKbliData(data);
    }

    if (isKamusKbliEmpty()) {
      const data = await fetchAll(token, '/api/kamus-kbli');
      insertKamusKbliData(data);
    }

    await SecureStore.setItemAsync('lastSync', new Date().toISOString());
    return { success: true, message: 'Sync berhasil' };
  } catch (err: any) {
    return { success: false, message: err.message ?? 'Sync gagal' };
  }
};