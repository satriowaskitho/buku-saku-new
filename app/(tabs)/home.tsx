import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "expo-router";
import { ActivityIndicator, Image, Modal, View } from "react-native";
import { useEffect, useState } from "react";
import { isKbliEmpty, setupKbliTable } from "@/database/kbliMappingRepository";
import { isKamusKbliEmpty, setupKamusKbliTable } from "@/database/kamusKbliRepository";
import { syncKbliData } from "@/services/syncServices";


export default function HomeScreen() {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const checkAndSync = async () => {
      setupKbliTable();
      setupKamusKbliTable();
      if (isKbliEmpty() || isKamusKbliEmpty()) {

        // If row pertama tabel kosong -> Sync dan retrieve data kbli_mapping dan kamus_kbli
        setIsSyncing(true);

        const res = await syncKbliData();

        console.log("SYNC RESULT:", res); 
        console.log("KBLI EMPTY?", isKbliEmpty()); 
        console.log("KAMUS KBLI EMPTY?", isKamusKbliEmpty());

        setIsSyncing(false);
      }
    };
    checkAndSync();
  }, []);

  return (
    <Box className="flex-1 items-center justify-center bg-white px-8"
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

      {/* Overlay Sync */}
      <Modal visible={isSyncing} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", borderRadius: 16, padding: 24, alignItems: "center", gap: 12 }}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-700 font-semibold">Sync Data...</Text>
          </View>
        </View>
      </Modal>

      <VStack className="items-center w-full" style={{ gap: 16 }}>
        <Image
          source={require("@/assets/images/ic-book-directory.png")}
          style={{ width: 180, height: 180, resizeMode: "contain" }}
        />

        <Heading className="font-bold text-center mb-4" size="sm">
          Temukan data usaha di Kabupaten Karimun
        </Heading>

        <VStack space="lg" className="w-full">
          <Button className="bg-blue-500 rounded-xl w-full" style={{ height: 40, justifyContent: "center" }}>
            <ButtonText className="text-white font-bold text-base">Search by Nama Usaha</ButtonText>
          </Button>
          <Button className="bg-blue-300 rounded-xl w-full" style={{ height: 40, justifyContent: "center" }}>
            <ButtonText className="text-white font-bold text-base">Search by Deskripsi Usaha</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}