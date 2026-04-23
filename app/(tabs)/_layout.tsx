import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as SecureStore from "expo-secure-store";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [userName, setUserName] = useState("User");

  // ✅ Ambil username dari SecureStore
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
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}