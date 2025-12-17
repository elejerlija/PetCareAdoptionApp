import React from "react"
import { Stack} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";


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
            }}
          >
            <Stack.Screen name="(tabs)" />
             <Stack.Screen name="(admin)" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
               <Stack.Screen
              name="pets/[id]"
              options={{ headerShown: true, title: "Pet Details" }}
            />
            <Stack.Screen name="AddPet" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </SafeAreaView>
    </PetsProvider>
  );
}
