import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";

import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { registerPushNotifications } from "../../notifications";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      // 1. Firebase Authentication
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // 2. Get user profile from Firestore
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);


      if (!snap.exists()) {
        alert("User profile not found in Firestore.");
        setLoading(false);
        return;
      }

      const data = snap.data();

      if (data.status === "inactive") {
        alert("Your account has been deactivated by the admin.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      const role = data.role;


      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Login successful! 🎉",
          body: "Welcome back to PetCare Adoption!",
        },
        trigger: null, // instantly
      });

      // 3. Redirect based on role
      if (role === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/(tabs)/");
      }

    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };
 
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("This user is NOT registered. Please sign up first.");
        return;
      }

      const data = snap.data();

      if (data.status === "inactive") {
        alert("Your account has been deactivated by the admin.");
        await auth.signOut();
        return;
      }

      const role = data.role;
 
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Welcome! 🎉",
          body: "Google login successful!",
        },
        trigger: null,
      });
         await registerPushNotifications();

      if (role === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/(tabs)/");
      }

    } catch (error) {
      console.log("GOOGLE LOGIN ERROR:", error);
      alert("Error: " + error.message);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.title}>Welcome back 🐾</Text>
      <Text style={styles.subtitle}>Login to continue adopting your favorite pets!</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#555"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#555"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <PrimaryButton
        title="Login"
        onPress={handleLogin}
        isLoading={loading}
      />

      <TouchableOpacity onPress={() => router.push("/auth/signup")}>
        <Text style={styles.switchText}>
          Don’t have an account? <Text style={styles.link}>Sign up</Text>
        </Text>
      </TouchableOpacity>

      {/* GOOGLE LOGIN BUTTON */}
      <TouchableOpacity
        onPress={handleGoogleLogin}
        style={styles.googleButton}
      >
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    alignItems: "center", 
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#457b9d", 
    marginTop: 10 
  },
  subtitle: { 
    textAlign: "center", 
    color: "gray", 
    marginBottom: 20 
  },
  input: { 
    width: "100%", 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 12, 
    backgroundColor: "#f9f9f9" 
  },
  switchText: { 
    marginTop: 15, 
    color: "#555" 
  },
  link: { 
    color: "#457b9d", 
    fontWeight: "bold" 
  },
  googleButton: {
    marginTop: 30,
    width: "100%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#83BAC9",
    alignItems: "center",
    justifyContent: "center",
  },
  googleText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});