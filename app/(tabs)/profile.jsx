import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import ProfileHeader from "../../components/ProfileHeader";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";

import { auth, db, storage } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";

import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

const ACCENT = "#83BAC9";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ProfileScreen() {
  const router = useRouter();

  const [photoURL, setPhotoURL] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [currentPasswordPassword, setCurrentPasswordPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
          const data = snap.data();
          setName(data.fullName || "");
          setEmail(data.email || "");
          setCity(data.city || "");
          setPhone(data.phone || "");
          setBio(data.bio || "");
          setPhotoURL(data.photoURL || "");
        }
      } catch (e) {}
      setLoadingProfile(false);
    };
    loadProfile();
  }, []);

  useEffect(() => {
    if (!loadingProfile) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loadingProfile]);

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const uid = auth.currentUser.uid;
      const storageRef = ref(storage, `profileImages/${uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      await setDoc(doc(db, "users", uid), { photoURL: url }, { merge: true });
      setPhotoURL(url);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const uid = auth.currentUser.uid;
      await setDoc(
        doc(db, "users", uid),
        {
          fullName: name,
          email,
          city,
          phone,
          bio,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      await sendNotification(
        "Profile Updated",
        "Your profile was saved successfully."
      );
    } catch (e) {}
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (!currentPasswordPassword || !newPassword || newPassword.length < 6)
      return;

    try {
      setSavingPass(true);
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPasswordPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setNewPassword("");
      setCurrentPasswordPassword("");
      await sendNotification(
        "Password Changed",
        "Your password was updated successfully."
      );
    } catch (e) {}
    setSavingPass(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/(auth)/login");
  };

  if (loadingProfile) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity onPress={pickImage}>
            <ProfileHeader photoURL={photoURL} name={name} />
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <InputField placeholder="Full name" value={name} onChangeText={setName} />
            <InputField placeholder="Email" value={email} editable={false} />
            <InputField placeholder="City" value={city} onChangeText={setCity} />
            <InputField placeholder="Phone" value={phone} onChangeText={setPhone} />
            <InputField placeholder="Bio" value={bio} onChangeText={setBio} multiline />
            <PrimaryButton
              title={saving ? "Saving..." : "Save Changes"}
              onPress={handleSaveProfile}
              isLoading={saving}
            />
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <Text style={styles.cardTitle}>Change Password</Text>
            <InputField
              placeholder="Current password"
              secureTextEntry
              value={currentPasswordPassword}
              onChangeText={setCurrentPasswordPassword}
            />
            <InputField
              placeholder="New password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <PrimaryButton
              title={savingPass ? "Updating..." : "Update Password"}
              onPress={handlePasswordChange}
              isLoading={savingPass}
            />
          </Animated.View>

          <View style={styles.logoutContainer}>
            <PrimaryButton title="Logout" onPress={handleLogout} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { padding: 18, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  changePhoto: { marginTop: 6, color: ACCENT, fontWeight: "600", textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
    paddingLeft: 10,
  },
  logoutContainer: { alignItems: "center", marginBottom: 20 },
});
