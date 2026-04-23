import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/login");
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

// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import { View, ActivityIndicator } from "react-native";
// import * as SecureStore from "expo-secure-store";

// export default function Index() {
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await SecureStore.getItemAsync("token");
//       if (token) {
//         router.replace("/(tabs)/home");
//         return;
//       }

//       const hasSeenOnboarding = await SecureStore.getItemAsync("hasSeenOnboarding");
//       if (hasSeenOnboarding) {
//         router.replace("/(auth)/login");
//       } else {
//         router.replace("/onboarding");
//       }
//     };
//     checkAuth();
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ActivityIndicator size="large" />
//     </View>
//   );
// }