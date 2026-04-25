import { View, FlatList, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { SearchIcon } from "lucide-react-native";
import { searchKbliByNamaUsaha } from "@/database/kbliMappingRepository";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type KbliResult = {
  kbli_2025: string;
  nama_usaha: string;
  judul: string | null;
};

export default function KbliMappingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KbliResult[]>([]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      const data = searchKbliByNamaUsaha(query.trim()) as KbliResult[];
      setResults(data);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: insets.bottom + 16 }}>
      <Input variant="outline" size="md" className="rounded-xl bg-blue-50 border-blue-200">
        <InputField
          placeholder="Cari nama usaha..."
          value={query}
          onChangeText={setQuery}
        />
        <InputSlot className="pr-3">
          <InputIcon as={SearchIcon} className="text-blue-400" />
        </InputSlot>
      </Input>

      {results.length > 0 && (
        <View style={{ marginTop: 16, flex: 1 }}>
          {/* Header */}
          <View style={{ flexDirection: "row", backgroundColor: "#2563eb", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 4 }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12, width: 80 }}>KBLI 2025</Text>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12, flex: 1 }}>Nama Usaha</Text>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12, flex: 1 }}>Judul</Text>
          </View>

          {/* Rows */}
          <FlatList
            data={results}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => router.push({
                  pathname: "/kbli-mapping-detail",
                  params: {
                    kbli_2025: item.kbli_2025,
                    nama_usaha: item.nama_usaha,
                    judul: item.judul ?? "-",
                  }
                })}
              >
                <View style={{
                  flexDirection: "row",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  backgroundColor: index % 2 === 0 ? "#fff" : "#dbeafe",
                  marginBottom: 2,
                }}>
                  <Text style={{ fontSize: 12, width: 80, color: "#374151" }}>{item.kbli_2025}</Text>
                  <Text style={{ fontSize: 12, flex: 1, color: "#374151" }} numberOfLines={2}>{item.nama_usaha}</Text>
                  <Text style={{ fontSize: 12, flex: 1, color: "#374151" }} numberOfLines={2}>{item.judul ?? "-"}</Text>
                </View>
              </Pressable>
            )}
            ListFooterComponent={
              <Text style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", paddingVertical: 12 }}>
                {results.length} hasil ditemukan · perjelas pencarian untuk hasil lebih spesifik
              </Text>
            }
          />
        </View>
      )}
    </View>
  );
}