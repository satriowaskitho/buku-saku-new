import { Box } from "@/components/ui/box";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ChevronRight } from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Image, Text, TouchableOpacity } from "react-native";

export default function OnboardingScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMulai = useCallback(async () => {
    await SecureStore.setItemAsync("hasSeenOnboarding", "true");
    router.replace("/(auth)/login" as any);
  }, [router]);

  return (
    <Box className="flex-1 bg-white px-6 justify-center items-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: "100%",
          alignItems: "center",
        }}
      >
        {/* 🔹 IMAGE */}
        <Image
          source={require("@/assets/images/onboarding-assets-new.png")}
          style={{ width: 260, height: 260, marginBottom: 3 }}
          resizeMode="contain"
        />

        {/* 🔹 TEXT */}
        <Box className="items-center mb-1">
          <Text className="text-3xl text-gray-600 text-center font-bold">
            Selamat Datang di{" "}
            <Text className="text-3xl text-blue-500 font-bold">KAKUKLI</Text>
          </Text>
        </Box>

        {/* 🔹 DESCRIPTION */}
        <Text className="text-lg text-center text-gray-400 mb-5 px-7 pt-4 pb-2">
          Temukan berbagai data usaha di Kabupaten Karimun dengan mudah dalam
          satu aplikasi.
        </Text>

        {/* 🔹 BUTTON */}
        <TouchableOpacity
          // onPress={handleMulai}
          activeOpacity={0.9}
          style={{
            backgroundColor: "#3b82f6",
            borderRadius: 12,
            paddingHorizontal: 27,
            paddingVertical: 9,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>
            Mulai
          </Text>
          <ChevronRight color="white" size={18} />
        </TouchableOpacity>
        
      </Animated.View>
    </Box>
  );
}