import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getKamusKbliByKode } from "@/database/kamusKbliRepository";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "@/components/app-header";
import * as SecureStore from "expo-secure-store";

type KamusDetail = {
  kode_kbli: string;
  judul: string;
  deskripsi: string;
  kategori: string;
};

export default function KbliMappingDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState("User");
  const [detail, setDetail] = useState<KamusDetail | null>(null);

  const { kbli_2025, nama_usaha, judul } = useLocalSearchParams<{
    kbli_2025: string;
    nama_usaha: string;
    judul: string;
    kode_gabungan: string;
  }>();

  useEffect(() => {
    const fetchUsername = async () => {
      const stored = await SecureStore.getItemAsync("username");
      if (stored) setUserName(stored);
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    if (kbli_2025) {
      const data = getKamusKbliByKode(kbli_2025);
      setDetail(data ?? null);
    }
  }, [kbli_2025]);

  return (
    <View style={{ flex: 1, backgroundColor: "#eff6ff" }}>
      <AppHeader
        userName={userName}
        showBack={true}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#1e3a8a", marginBottom: 16 }}>
          {nama_usaha}
        </Text>

        <View style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
          gap: 12,
        }}>
          <View>
            <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600", marginBottom: 2 }}>KODE KBLI 2025</Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#2563eb" }}>{kbli_2025}</Text>
          </View>

          <View style={{ height: 1, backgroundColor: "#e5e7eb" }} />

          <View>
            <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600", marginBottom: 2 }}>JUDUL KBLI</Text>
            <Text style={{ fontSize: 14, color: "#374151" }}>{detail?.judul ?? judul}</Text>
          </View>

          <View style={{ height: 1, backgroundColor: "#e5e7eb" }} />

          <View>
            <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600", marginBottom: 2 }}>KATEGORI</Text>
            <Text style={{ fontSize: 14, color: "#374151" }}>{detail?.kategori ?? "-"}</Text>
          </View>

          <View style={{ height: 1, backgroundColor: "#e5e7eb" }} />

          <View>
            <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600", marginBottom: 2 }}>DESKRIPSI</Text>
            <Text style={{ fontSize: 14, color: "#374151", lineHeight: 22 }}>
              {detail?.deskripsi ?? "-"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}