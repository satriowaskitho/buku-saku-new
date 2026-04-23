import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Heading } from "@/components/ui/heading";
import { CheckIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { loginAPI } from "@/services/authServices";
import { saveToken } from "@/database/tokenRepository";
import * as SecureStore from "expo-secure-store";
import "../../global.css";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username dan password harus diisi!");
      return;
    }

    try {
      setLoading(true);
      const data = await loginAPI(username, password);
      await saveToken(data.token);
      await SecureStore.setItemAsync("username", data.username ?? username);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      Alert.alert("Login Gagal", err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex-1 items-center justify-center bg-white dark:bg-gray-950 px-6 shadow-md">
      <Box className="w-full max-w-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-sm">
        <VStack space="md">
          <Heading className="text-gray-900 dark:text-white text-2xl font-bold">
            Log in
          </Heading>

          <VStack space="xs">
            <Text className="text-gray-700 dark:text-gray-300 font-semibold">
              Username
            </Text>
            <Input className="border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800">
              <InputField
                placeholder="Enter your username"
                className="text-gray-900 dark:text-white placeholder:text-gray-400"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-gray-700 dark:text-gray-300 font-semibold">
              Password
            </Text>
            <Input className="border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800">
              <InputField
                placeholder="Enter your password"
                className="text-gray-900 dark:text-white placeholder:text-gray-400"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <InputSlot
                onPress={() => setShowPassword(!showPassword)}
                className="pr-3"
              >
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  className="text-gray-400 dark:text-gray-500"
                />
              </InputSlot>
            </Input>
          </VStack>

          <Checkbox
            value="remember"
            onChange={() => setRememberMe(!rememberMe)}
          >
            <CheckboxIndicator className="border-2 border-gray-400 rounded bg-white data-[state=checked]:bg-white data-[state=checked]:border-blue-500">
              <CheckboxIcon as={CheckIcon} className="text-blue-500" />
            </CheckboxIndicator>
            <CheckboxLabel className="ml-2 text-gray-700 dark:text-gray-300">
              Remember me
            </CheckboxLabel>
          </Checkbox>

          <Button
            className="bg-blue-500 active:bg-blue-600 rounded-xl py-3"
            onPress={handleLogin}
            disabled={loading}
          >
            <ButtonText className="text-white font-bold">
              {loading ? "Loading..." : "Log in"}
            </ButtonText>
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}