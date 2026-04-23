import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
  <GluestackUIProvider mode="light">
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      
      <Stack screenOptions={{ headerShown: false }} />

      <StatusBar style="auto" />
    </ThemeProvider>
  </GluestackUIProvider>
);
}