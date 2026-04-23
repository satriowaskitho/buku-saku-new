import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function HomeScreen() {
  return (
    <Box className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
      <VStack space="sm" className="items-center">
        <Heading className="text-gray-900 dark:text-white text-3xl font-bold">
          Welcome to Home 👋
        </Heading>
        <Text className="text-gray-500 dark:text-gray-400 text-base">
          Kamu berhasil login!
        </Text>
      </VStack>
    </Box>
  );
}