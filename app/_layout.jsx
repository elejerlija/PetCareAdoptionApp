import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { PetsProvider } from "../context/PetsContext";

export default function RootLayout() {
  return (
    <PetsProvider>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ title: "Login", headerBackButtonDisplayMode: "minimal" }} />
            <Stack.Screen name="auth/signup" options={{ title: "Sign Up", headerBackButtonDisplayMode: "minimal" }} />
            <Stack.Screen name="pets/[id]" options={{ title: "Pet Details", headerBackButtonDisplayMode: "minimal", }} />
            <Stack.Screen name="AddPet" options={{ title: "Add Pet", headerBackButtonDisplayMode: "minimal" }} />
          </Stack>
        </View>
      </SafeAreaView>
    </PetsProvider>
  );
}
