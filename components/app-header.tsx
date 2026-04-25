import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { ChevronLeft, LogOut } from "lucide-react-native";
import { useState, useCallback } from "react";
import { removeToken } from "@/database/tokenRepository";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal, TouchableWithoutFeedback, View } from "react-native";

type AppHeaderProps = {
  showBack?: boolean;
  userName?: string;
  onBack?: () => void;
};

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function AppHeader({ showBack = false, userName = "User", onBack }: AppHeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const initials = getInitials(userName);
  const insets = useSafeAreaInsets();

  const handleLogout = useCallback(async () => {
    setShowDropdown(false);
    await removeToken();
    router.replace("/");
  }, [router]);

  return (
    <>
      <Box
        className="bg-white border-b border-gray-100 px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <HStack className="items-center justify-between">

          <Box className="w-10">
            {showBack && (
              <Pressable onPress={onBack ?? (() => router.back())}>
                <Icon as={ChevronLeft} size="lg" className="text-gray-700" />
              </Pressable>
            )}
          </Box>

          <Pressable onPress={() => setShowDropdown(true)} className="p-2">
            <HStack space="sm" className="items-center">
              <Text className="text-sm font-medium text-gray-700">{userName}</Text>
              <Avatar size="sm" className="bg-blue-500">
                <AvatarFallbackText className="text-white font-bold">
                  {initials}
                </AvatarFallbackText>
              </Avatar>
            </HStack>
          </Pressable>

        </HStack>
      </Box>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={{
                position: "absolute",
                right: 16,
                top: insets.top + 56,
                backgroundColor: "white",
                borderRadius: 16,
                padding: 16,
                width: 200,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}>
                <VStack space="md" className="items-center">
                  <Avatar size="lg" className="bg-blue-500">
                    <AvatarFallbackText className="text-white font-bold text-xl">
                      {initials}
                    </AvatarFallbackText>
                  </Avatar>

                  <Text className="text-sm font-semibold text-gray-800">
                    {userName}
                  </Text>

                  <Box className="w-full h-px bg-gray-100" />

                  <Button
                    className="bg-red-500 w-full rounded-xl"
                    onPress={handleLogout}
                  >
                    <HStack space="sm" className="items-center">
                      <Icon as={LogOut} size="sm" className="text-white" />
                      <ButtonText className="text-white font-bold">
                        Logout
                      </ButtonText>
                    </HStack>
                  </Button>
                </VStack>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}