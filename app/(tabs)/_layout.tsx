import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as SecureStore from "expo-secure-store";
import { updateSync, checkForUpdates } from '@/services/syncServices';
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [userName, setUserName] = useState("User");
  const [updateCount, setUpdateCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      const stored = await SecureStore.getItemAsync("username");
      if (stored) setUserName(stored);
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const check = async () => {
      const count = await checkForUpdates();
      if (count > 0) {
        setUpdateCount(count);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 20000);
      }
    };
    
    check(); // jalanin pertama kali
    
    const interval = setInterval(check, 3 * 60 * 1000); // cek tiap 5 menit
    
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <>
      {/* Toast */}
      {showToast && (
        <View style={{
          position: "absolute",
          top: 100,
          left: 16,
          right: 16,
          backgroundColor: "#1e3a8a",
          borderRadius: 12,
          padding: 12,
          zIndex: 999,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}>
          <Text style={{ color: "#fff", fontSize: 13, flex: 1 }}>
            🔄 Ada {updateCount} data baru! Tap "Sync Data" untuk memperbarui.
          </Text>
          <Pressable onPress={() => setShowToast(false)}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>✕</Text>
          </Pressable>
        </View>
      )}

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarButton: HapticTab,
          tabBarStyle: { display: "none" },
          header: () => <AppHeader userName={userName} />,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            header: () => (
              <AppHeader
                userName={userName}
                showSync={true}
                updateCount={updateCount}
                isSyncing={isSyncing}
                onSync={async () => {
                  setIsSyncing(true);
                  try {
                    await updateSync();
                    setUpdateCount(0);
                    setShowToast(false); // ← toast langsung tutup!
                  } finally {
                    setIsSyncing(false);
                  }
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="kbli-mapping"
          options={{
            header: () => (
              <AppHeader
                userName={userName}
                showBack={true}
                onBack={() => router.replace("/home")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="kamus-kbli"
          options={{
            header: () => (
              <AppHeader
                userName={userName}
                showBack={true}
                onBack={() => router.replace("/home")}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}