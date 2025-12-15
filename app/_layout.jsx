import { Stack, router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

import { PetsProvider } from "../context/PetsContext";
import GlobalSetup from "./GlobalSetup";

export default function RootLayout() {
  const segments = useSegments();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  // 1. Wait for Firebase to tell the truth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  // 2. Route guard (THIS is what you were missing)
  useEffect(() => {
    if (!ready) return;

    const first = segments[0]; // "(tabs)" or "auth" or undefined
    const inAuth = first === "auth";

    if (!user && !inAuth) {
      router.replace("/auth/login");
    }

    if (user && inAuth) {
      router.replace("/(tabs)");
    }
  }, [ready, user, segments]);

  if (!ready) return null;

  return (
    <PetsProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" />
        <GlobalSetup />

        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="pets/[id]" />
            <Stack.Screen name="AddPet" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </SafeAreaView>
    </PetsProvider>
  );
}
