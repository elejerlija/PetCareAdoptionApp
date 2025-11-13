import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";



import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Ju lutem plotësoni të gjitha fushat.");
      return;
    }

    setLoading(true);

    try {
      // 1. Login me Firebase Authentication
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // 2. Merr dokumentin e Firestore (profile + role)
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      //test/test

      if (!snap.exists()) {
        alert("Profili nuk u gjet në Firestore.");
        setLoading(false);
        return;
      }

      const data = snap.data();
      const role = data.role;

      // 3. Ndarja e rruagëve sipas rolit
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
    // 1. Hape Google popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 2. Kontrollo nëse ekziston në Firestore
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("❌ Ky përdorues NUK është i regjistruar. Bëni Sign Up më parë.");
      return; // STOP — mos e lejo login
    }

    // 3. Merr të dhënat dhe vazhdo login
    const data = snap.data();
    const role = data.role;

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
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
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

        <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: 12,
              backgroundColor: "#e8f0fe",
              borderRadius: 6,
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: 16,
              cursor: "pointer",
            }}
          ></button>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#457b9d", marginTop: 10 },
  subtitle: { textAlign: "center", color: "gray", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 12 },
  switchText: { marginTop: 15, color: "#555" },
  link: { color: "#457b9d", fontWeight: "bold" },
});
