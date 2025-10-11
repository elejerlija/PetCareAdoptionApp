import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#333" }}>
          Welcome to PetCare 🐾
        </Text>
        <Text style={{ color: "#666", marginTop: 6 }}>
          This is Homepage!
        </Text>
      </View>
    </SafeAreaView>
  );
}
