import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import "../global.css";

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

  return (
    <Box className="flex-1 items-center justify-center bg-white px-8">
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
      >
        <Box className="items-center gap-1">
          <Text
            style={{ fontSize: 22 }}
            className="font-bold text-blue-500 text-center"
          >
            Selamat Datang di
          </Text>
          <Text
            style={{ fontSize: 28 }}
            className="font-bold text-blue-500 mt-2 text-center"
          >
            (...)
          </Text>
          <Text className="text-gray-400 mt-4 text-center">
            Aplikasi buku saku sensus ekonomi
          </Text>

          <Button
            className="bg-blue-500 rounded-xl px-10 py-3 mt-6"
            onPress={() => router.push("/(auth)/login")}
          >
            <HStack space="sm" className="items-center">
              <ButtonText className="text-white font-bold text-lg">
                Mulai
              </ButtonText>
              <Icon as={ArrowRightIcon} className="text-white" size="md" />
            </HStack>
          </Button>
        </Box>
      </Animated.View>
    </Box>
  );
}
