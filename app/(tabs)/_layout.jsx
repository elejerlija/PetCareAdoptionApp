import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";


const THEME_COLOR = "#83BAC9";
const ICON_ACTIVE = "#FFFFF0";
const ICON_INACTIVE = "#f4deb4ff";

export default function RootLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#83BAC9" }}
      edges={["bottom"]}
    >
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: ICON_ACTIVE,
            tabBarInactiveTintColor: ICON_INACTIVE,
            tabBarStyle: {
              backgroundColor: THEME_COLOR,
              height: 64,
              paddingTop: 6,
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
            name="list"
            options={{
              title: "List",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="paw" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="map"
            options={{
              title: "Map",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
