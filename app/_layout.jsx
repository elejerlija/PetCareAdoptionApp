import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { PetsProvider } from "../context/PetsContext"; 

export default function RootLayout() {
  return (
    <PetsProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="pets/[id]" options={{ title: "Pet Details" }} />
            <Stack.Screen name="AddPet" options={{ title: "Add Pet" }} />
          </Stack>
        </View>
      </SafeAreaView>
    </PetsProvider>
  );
}
