import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

export async function registerLocalNotifications() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Notification permission is required to receive updates."
      );
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return true;
  } catch (e) {
    console.log("Notification permission error:", e);
    return false;
  }
}
