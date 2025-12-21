import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";

const THEME = "#83BAC9";
const LIGHT = "#F9FCFD";

export const unstable_settings = {
  showRouteInfo: false,
};

export default function AdminLayout() {
  return (
    <View style={{ flex: 1 }}>
      {/* TOP SAFE AREA*/}
      <SafeAreaView style={{ backgroundColor: THEME }} edges={["top"]} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>🐾 Admin Panel</Text>
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1, backgroundColor: LIGHT }}>
        <Stack>
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="managePets" options={{ headerShown: false }} />
          <Stack.Screen name="manageUsers" options={{ headerShown: false }} />
          <Stack.Screen
            name="manageStoresMap"
            options={{ headerShown: false }}
          />
        </Stack>
      </View>

      {/* BOTTOM SAFE AREA*/}
      <SafeAreaView style={{ backgroundColor: LIGHT }} edges={["bottom"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME,
  },
  header: {
    backgroundColor: THEME,
    paddingBottom: 14,
    paddingTop: 4,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#dbe7ea",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
