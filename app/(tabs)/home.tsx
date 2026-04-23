import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "expo-router";
import { Image } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Box className="flex-1 items-center justify-center bg-white px-8"
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <VStack className="items-center w-full" style={{ gap: 16 }}>

        {/* Ilustrasi */}
        <Image
          source={require("@/assets/images/ic-book-directory.png")}
          style={{ width: 180, height: 180, resizeMode: "contain" }}
        />

        <Heading className="font-bold text-center mb-4" size="sm">
          Temukan data usaha di Kabupaten Karimun
        </Heading>

        {/* Buttons */}
        <VStack space="lg" className="w-full">
          <Button
            className="bg-blue-500 rounded-xl w-full"
            style={{ height: 40, justifyContent: "center" }}
          >
            <ButtonText className="text-white font-bold text-base">
              Search by Nama Usaha
            </ButtonText>
          </Button>

          <Button
            className="bg-blue-300 rounded-xl w-full"
            style={{ height: 40, justifyContent: "center" }}
          >
            <ButtonText className="text-white font-bold text-base">
              Search by Deskripsi Usaha
            </ButtonText>
          </Button>
        </VStack>

      </VStack>
    </Box>
  );
}