import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { PetsProvider } from "./context/PetsContext";
import { Ionicons } from "@expo/vector-icons";

const THEME_COLOR = "#83BAC9";
const ICON_ACTIVE = "#FFFFF0";
const ICON_INACTIVE = "#f4deb4ff";

export default function RootLayout() {
  return (
    <PetsProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <Tabs
            screenOptions={{
              headerShown: false, 
              tabBarActiveTintColor: ICON_ACTIVE,
              tabBarInactiveTintColor: ICON_INACTIVE,
              tabBarStyle: {
                backgroundColor: THEME_COLOR,
                height: 62,
                paddingBottom: 8,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                position: "absolute",
                overflow: "hidden",
              },
              tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
              sceneContainerStyle: { backgroundColor: "#fff" },
              tabBarHideOnKeyboard: true,
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="PetList"
              options={{
                title: "List",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="paw" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="ProfileScreen"
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="MapScreen"
              options={{
                title: "Map",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="map" size={size} color={color} />
                ),
              }}
            />

            <Tabs.Screen name="AddPet" options={{ href: null }} />
            <Tabs.Screen name="PetDetail" options={{ href: null }} />
            <Tabs.Screen name="components/PetCard" options={{ href: null }} />
            <Tabs.Screen name="components/InputField" options={{ href: null }} />
            <Tabs.Screen name="components/PrimaryButton" options={{ href: null }} />

          </Tabs>
        </View>
      </SafeAreaView>
    </PetsProvider>
  );
}
