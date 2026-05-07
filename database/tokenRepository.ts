import * as SecureStore from 'expo-secure-store';

const BASE_URL = "https://kakukli-backend-lac.vercel.app";

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync('token', token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('token');
};

export const removeToken = async (): Promise<void> => {
  try {
    const token = await getToken();
    
    // TAMBAH hit backend logout
    if (token) {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (e) {
    console.log('Logout backend error:', e);
  } finally {
    // hapus semua data lokal
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('isLoggedIn');
    await SecureStore.deleteItemAsync('username');
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null;
};

export const verifyTokenWithServer = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    if (!token) return false;

    const res = await fetch(`${BASE_URL}/api/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401) {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('isLoggedIn');
      await SecureStore.deleteItemAsync('username');
      return false;
    }

    return true;
  } catch {
    return false;
  }
};