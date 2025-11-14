import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";

import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";

const ACCENT = "#83BAC9";

export default function ProfileScreen() {
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
        }
      } catch (err) {}
      setLoadingProfile(false);
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const uid = auth.currentUser.uid;

      await setDoc(
        doc(db, "users", uid),
        {
          fullName: name,
          email: email,
          city: city,
          phone: phone,
          bio: bio,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {}
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (!currentPasswordPassword || !newPassword || newPassword.length < 6) return;

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
    } catch (err) {}
    setSavingPass(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {}
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
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
          </View>

          <View style={styles.card}>
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
          </View>

          <View style={styles.card}>
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
          </View>

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
  header: { alignItems: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700" },
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
  logoutContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});
