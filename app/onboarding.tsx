import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function OnboardingScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ✅ Langsung ke login, tidak perlu cek token
  const handleMulai = useCallback(() => {
    router.push("/(auth)/login");
  }, [router]);

  return (
    <Box className="flex-1 items-center justify-center bg-white px-8">
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
      >
        <Box className="w-full px-8 mb-5">
          <Box className="mb-2">
            <Text className="text-xl font-bold text-black-700 mb-1">
              Selamat Datang 👋
            </Text>
            <Text className="text-3xl font-bold text-blue-700">
              KAKUKLI
            </Text>
          </Box>

          <Text className="text-gray-400">
            Masuk untuk memulai pencarian data usaha di Kabupaten Karimun
          </Text>

          <Button
            className="bg-blue-500 rounded-xl px-10 py-2 mt-2"
            onPress={handleMulai}
          >
            <HStack space="sm" className="items-center">
              <ButtonText className="text-white font-bold text-lg">
                Mulai
              </ButtonText>
              <Icon as={ChevronRight} className="text-white" size="md" />
            </HStack>
          </Button>
        </Box>
      </Animated.View>
    </Box>
  );
}
