// GlobalSetup.jsx
import React, { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerPushNotifications() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      alert("Permission for notifications is required.");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const token = await Notifications.getExpoPushTokenAsync();
    console.log("PUSH TOKEN:", token.data);

  } catch (err) {
    console.log("Error in registerPushNotifications:", err);
  }
}

async function requestLocationPermission() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Location permission is required for map features.");
      return;
    }

  } catch (err) {
    console.log("Error in requestLocationPermission:", err);
  }
}


export default function GlobalSetup() {
  useEffect(() => {
    registerPushNotifications();
    requestLocationPermission();
  }, []);

  return null; 
}
