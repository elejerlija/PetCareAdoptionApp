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
      alert("Notification permission is required.");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const token = await Notifications.getExpoPushTokenAsync();
    console.log("Expo Push Token:", token.data);

  } catch (err) {
    console.log("Error registering notifications:", err);
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
    console.log("Error requesting location:", err);
  }
}


export default function GlobalSetup() {
  useEffect(() => {
  
    registerPushNotifications();
    requestLocationPermission();


    Notifications.scheduleNotificationAsync({
      content: {
        title: "Welcome to PetCare Adoption! 🐾",
        body: "Thanks for using our app!",
      },
      trigger: { seconds: 2 },
    });

  }, []);

  return null; 
}
