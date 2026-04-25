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
  kode_gabungan: string;
  kategori: string;
  judul: string;
  deskripsi: string;
};

export default function KamusKbliDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState("User");
  const [detail, setDetail] = useState<KamusDetail | null>(null);

  const { kode_kbli, judul } = useLocalSearchParams<{
    kode_kbli: string;
    judul: string;
  }>();

  useEffect(() => {
    const fetchUsername = async () => {
      const stored = await SecureStore.getItemAsync("username");
      if (stored) setUserName(stored);
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    if (kode_kbli) {
      const data = getKamusKbliByKode(kode_kbli) as KamusDetail;
      setDetail(data ?? null);
    }
  }, [kode_kbli]);

  return (
    <View style={{ flex: 1, backgroundColor: "#eff6ff" }}>
      <AppHeader
        userName={userName}
        showBack={true}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>

        {/* Kode KBLI besar */}
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#2563eb", marginBottom: 4, flexShrink: 1 }}>
          {detail?.kode_kbli ?? kode_kbli}
        </Text>

        {/* Judul bold */}
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1e3a8a", marginBottom: 20 }}>
          {detail?.judul ?? judul}
        </Text>

        {/* Card info */}
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
            <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600", marginBottom: 2 }}>KATEGORI</Text>
            <Text style={{ fontSize: 14, color: "#374151" }}>{detail?.kategori ?? "-"}</Text>
          </View>

          <View style={{ height: 1, backgroundColor: "#e5e7eb" }} />

          <View>
            <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600", marginBottom: 2 }}>KODE GABUNGAN</Text>
            <Text style={{ fontSize: 14, color: "#374151" }}>{detail?.kode_gabungan ?? "-"}</Text>
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