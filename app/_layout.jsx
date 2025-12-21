import React from "react";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PetsProvider } from "../context/PetsContext";
import GlobalSetup from "./GlobalSetup";

export default function RootLayout() {
  return (
    <PetsProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#83BAC9" }} edges={[]}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <GlobalSetup />

        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
              headerBackTitleVisible: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/signup" />
            <Stack.Screen
              name="pets/[id]"
              options={{
                headerShown: true,
                title: "Pet Details",
                headerBackButtonDisplayMode: "minimal",

                headerLeft: () => (
                  <Pressable
                    onPress={() => {
                      if (router.canGoBack()) {
                        router.back();
                      } else {
                        router.replace("/(tabs)");
                      }
                    }}
                    style={{ paddingHorizontal: 12 }}
                  >
                    <Ionicons name="chevron-back" size={26} color="#000" />
                  </Pressable>
                ),
              }}
            />

            <Stack.Screen name="AddPet" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </SafeAreaView>
    </PetsProvider>
  );
}
