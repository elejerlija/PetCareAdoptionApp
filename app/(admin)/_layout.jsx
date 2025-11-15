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
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>🐾 Admin Panel</Text>
      </View>

      {/* VALID ROUTES ONLY */}
      <Stack>
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="managePets" options={{ headerShown: false }} />
        <Stack.Screen name="manageUsers" options={{ headerShown: false }} />
        <Stack.Screen name="manageStoresMap" options={{ headerShown: false }} />
      </Stack>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: LIGHT,
  },
  header: {
    backgroundColor: THEME,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#dbe7ea",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
