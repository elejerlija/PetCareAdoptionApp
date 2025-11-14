import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
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
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  linkWithCredential,
  signOut,
} from "firebase/auth";

const ACCENT = "#83BAC9";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [currentPasswordEmail, setCurrentPasswordEmail] = useState("");
  const [currentPasswordPassword, setCurrentPasswordPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // NEW — first password for linking provider
  const [firstPassword, setFirstPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Load profile from Firestore
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
      } catch (err) {
        Alert.alert("Error", "Failed to load profile.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // ---- ENABLE EMAIL/PASSWORD FOR GOOGLE USERS ----
  const enablePasswordProvider = async () => {
    try {
      if (!firstPassword || firstPassword.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters.");
        return;
      }

      const email = auth.currentUser.email;
      const credential = EmailAuthProvider.credential(email, firstPassword);

      await linkWithCredential(auth.currentUser, credential);

      Alert.alert("Success", "Email & password login is now enabled!");
      setFirstPassword("");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // ---- SAVE PROFILE INFO ----
  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const user = auth.currentUser;
      if (!user) return;

      const uid = user.uid;
      const oldEmail = user.email;

      // If email changed
      if (email !== oldEmail) {
        if (!currentPasswordEmail) {
          Alert.alert("Security", "Enter current password to change email.");
          setSaving(false);
          return;
        }

        const credential = EmailAuthProvider.credential(
          oldEmail,
          currentPasswordEmail
        );

        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, email);
        await sendEmailVerification(user);
        await signOut(auth);

        Alert.alert(
          "Verify Email",
          "We sent a verification link. Login again after verifying."
        );
        return;
      }

      // Save profile data in Firestore
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

      Alert.alert("Success", "Profile updated!");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---- CHANGE PASSWORD ----
  const handlePasswordChange = async () => {
    if (!currentPasswordPassword) {
      Alert.alert("Error", "Enter current password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters.");
      return;
    }

    try {
      setSavingPass(true);

      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPasswordPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Alert.alert("Success", "Password updated!");
      setNewPassword("");
      setCurrentPasswordPassword("");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setSavingPass(false);
    }
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
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
          </View>

          {/* PERSONAL INFO */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Information</Text>

            <InputField placeholder="Full name" value={name} onChangeText={setName} />
            <InputField placeholder="Email" value={email} onChangeText={setEmail} />

            <InputField
              placeholder="Current password (required only for email change)"
              secureTextEntry
              value={currentPasswordEmail}
              onChangeText={setCurrentPasswordEmail}
            />

            <InputField placeholder="City" value={city} onChangeText={setCity} />
            <InputField placeholder="Phone" value={phone} onChangeText={setPhone} />
            <InputField placeholder="Bio" value={bio} onChangeText={setBio} multiline />

            <PrimaryButton
              title={saving ? "Saving..." : "Save Changes"}
              onPress={handleSaveProfile}
              isLoading={saving}
            />
          </View>

          {/* CHANGE PASSWORD */}
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

          {/* ENABLE EMAIL/PASSWORD LOGIN */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enable Email Login</Text>
            <Text style={styles.body}>
              If your account was created with Google, set a password to enable email &
              password login. This is required to change your email.
            </Text>

            <InputField
              placeholder="Set a password (min 6 characters)"
              secureTextEntry
              value={firstPassword}
              onChangeText={setFirstPassword}
            />

            <PrimaryButton
              title="Enable Email Login"
              onPress={enablePasswordProvider}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { padding: 18, paddingBottom: 40 },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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
  body: { fontSize: 13, color: "#555", marginBottom: 12 },
});
