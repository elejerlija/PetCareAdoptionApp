// app/GlobalSetup.jsx
import React, { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function GlobalSetup() {
  useEffect(() => {
    (async () => {
      // 1) Request notification permission (LOCAL notifications need this too)
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permission denied");
        return;
      }

      // 2) Android channel (needed on Android)
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      // 3) Location permission (vetëm nese e përdorni realisht)
      await Location.requestForegroundPermissionsAsync();
    })().catch((err) => console.log("GlobalSetup error:", err));
  }, []);

  return null;
}
