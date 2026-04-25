import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as SecureStore from "expo-secure-store";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUsername = async () => {
      const stored = await SecureStore.getItemAsync("username");
      if (stored) setUserName(stored);
    };
    fetchUsername();
  }, []);

  return (
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
        options={{ title: "Home" }}
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
  );
}