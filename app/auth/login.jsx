import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";

import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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

      if (!snap.exists()) {
        alert("Profili nuk u gjet në Firestore.");
        setLoading(false);
        return;
      }

      const data = snap.data();
      const role = data.role;

      // 3. Ndarja e rruagëve sipas rolit
      if (role === "admin") {
        router.replace("/admin/home");
      } else {
        router.replace("/home");
      }

    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
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
