import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
} from "firebase/auth";

const ACCENT = "#83BAC9";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.fullName || "");
          setEmail(data.email || "");
          setCity(data.city || "");
          setPhone(data.phone || "");
          setBio(data.bio || "");
        }
      } catch {
        Alert.alert("Error", "Failed to load profile data.");
      } finally {
        setInitializing(false);
      }
    };
    fetchProfile();
  }, []);

  <PrimaryButton
  title="Save Test"
  onPress={() => {
    console.log("Button pressed!");
    Alert.alert("Clicked!", "Button is working fine.");
  }}
/>


 const handleSaveProfile = async () => {
  console.log(" Save button pressed!");
  const user = auth.currentUser;

  if (!user) {
    Alert.alert("Error", "No user logged in.");
    return;
  }

  const uid = user.uid;
  const oldEmail = user.email;

  if (!name || !email) {
    Alert.alert("Validation Error", "Please fill in your name and email.");
    return;
  }

  try {
    setLoading(true);


    console.log("Updating profile...");


    if (oldEmail !== email) {
      console.log("Email change detected:", oldEmail, "→", email);

      if (!currentPasswordForEmail) {
        Alert.alert("Security Check", "Please enter your current password to change email.");
        setLoading(false);
        return;
      }

      const credential = EmailAuthProvider.credential(oldEmail, currentPasswordForEmail);

      
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, email);

      console.log(" Email updated successfully!");
      Alert.alert(" Email Updated", `Email changed from ${oldEmail} to ${email}`);
    }


    await setDoc(doc(db, "users", uid), {
      fullName: name,
      email: email,
      city: city,
      phone: phone,
      bio: bio,
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Firestore document updated!");
    Alert.alert(
      "✅ Profile Updated",
      `Name: ${name}\nEmail: ${email}\nCity: ${city}\nPhone: ${phone}`
    );
  } catch (error) {
    console.log(" Error:", error);
    if (error.code === "auth/requires-recent-login") {
      Alert.alert(
        "Security Notice",
        "Please log in again before changing your email."
      );
    } else {
      Alert.alert("Error", error.message || "Failed to update profile.");
    }
  } finally {
    setLoading(false);
  }
};

  const handlePasswordChange = async () => {
    if (!currentPasswordForPassword) {
      Alert.alert("Error", "Please enter your current password first.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return;
    }
    try {
      setLoadingPassword(true);
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPasswordForPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setNewPassword("");
      setCurrentPasswordForPassword("");
      Alert.alert("Success", "Password changed successfully!");
    } catch {
      Alert.alert("Error", "Failed to change password.");
    } finally {
      setLoadingPassword(false);
    }
  };

  if (initializing) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: "center", alignItems: "center" }]}>
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
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
            <Text style={styles.subtitle}>Manage your personal information below</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <View style={styles.block}>
              <Text style={styles.label}>Full Name</Text>
              <InputField placeholder="Enter your name" value={name} onChangeText={setName} />
            </View>
            <View style={styles.block}>
              <Text style={styles.label}>Email</Text>
              <InputField
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.block, styles.col]}>
                <Text style={styles.label}>City</Text>
                <InputField placeholder="Enter your city" value={city} onChangeText={setCity} />
              </View>
              <View style={[styles.block, styles.col]}>
                <Text style={styles.label}>Phone Number</Text>
                <InputField
                  placeholder="+383 xx xxx xxx"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={styles.block}>
              <Text style={styles.label}>Bio</Text>
              <InputField
                placeholder="Write something about yourself"
                value={bio}
                onChangeText={setBio}
                multiline
              />
            </View>
            <PrimaryButton
              title={loading ? "Saving..." : "Save Changes"}
              onPress={handleSaveProfile}
              isLoading={loading}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Change Password</Text>
            <InputField
              placeholder="Enter current password"
              secureTextEntry={true}
              value={currentPasswordForPassword}
              onChangeText={setCurrentPasswordForPassword}
            />
            <InputField
              placeholder="Enter new password"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <PrimaryButton
              title={loadingPassword ? "Updating..." : "Update Password"}
              onPress={handlePasswordChange}
              isLoading={loadingPassword}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>About the app</Text>
            <Text style={styles.body}>
              Pet Care and Adoption helps connect pet lovers with animals in need of a home
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 32 },
  
  header: {
    paddingVertical: 24,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: "85%",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
    borderLeftWidth: 4,
    borderColor: ACCENT,
    paddingLeft: 10,
  },

  block: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginLeft: 2,
  },

  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  col: { flex: 1 },

  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    marginBottom: 10,
  },
});
