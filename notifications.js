
import * as Notifications from 'expo-notifications';    
import { Alert } from 'react-native';
import {Platform} from 'react-native';

export async function registerPushNotifications() {
    const {status} = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
        Alert.alert("Permission required", "Push notifications permission is required to receive updates.");
        return;
    }

    if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default notifications go here",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return true;

}