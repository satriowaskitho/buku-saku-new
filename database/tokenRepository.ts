import * as SecureStore from 'expo-secure-store';

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync('token', token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('token');
};

export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('isLoggedIn');
  await SecureStore.deleteItemAsync("username");
};

export const isLoggedIn = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null;
};