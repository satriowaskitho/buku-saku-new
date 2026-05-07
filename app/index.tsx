import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { verifyTokenWithServer } from "@/database/tokenRepository";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyTokenWithServer();

      if (isValid) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/onboarding"); // ✅ selalu ke onboarding kalau tidak valid
      }
    };
    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}