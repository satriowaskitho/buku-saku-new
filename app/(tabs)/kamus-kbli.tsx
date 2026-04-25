import { View, FlatList, Pressable } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { SearchIcon } from "lucide-react-native";
import { searchKamusKbli } from "@/database/kamusKbliRepository";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type KamusResult = {
  kode_kbli: string;
  judul: string;
  deskripsi: string;
};

export default function KamusKbliPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KamusResult[]>([]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setQuery("");
        setResults([]);
      };
    }, [])
  );

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      const data = searchKamusKbli(query.trim()) as KamusResult[];
      setResults(data);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View style={{ flex: 1, padding: 16, paddingBottom: insets.bottom + 16 }}>
      <Input variant="outline" size="md" className="rounded-xl bg-blue-50 border-blue-200">
        <InputField
          placeholder="Cari kode, judul, atau deskripsi KBLI..."
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
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12, width: 80 }}>Kode KBLI</Text>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12, flex: 1 }}>Judul</Text>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12, flex: 1 }}>Deskripsi</Text>
          </View>

          {/* Rows */}
          <FlatList
            data={results}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => router.push({
                  pathname: "/kamus-kbli-detail",
                  params: {
                    kode_kbli: item.kode_kbli,
                    judul: item.judul,
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
                  <Text style={{ fontSize: 12, width: 80, color: "#374151" }}>{item.kode_kbli}</Text>
                  <Text style={{ fontSize: 12, flex: 1, color: "#374151", paddingRight: 8 }} numberOfLines={2}>{item.judul}</Text>
                  <Text style={{ fontSize: 12, flex: 1, color: "#374151" }} numberOfLines={2}>{item.deskripsi}</Text>
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