import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
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
    
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

     
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
     

      if (!snap.exists()) {
        alert("Profili nuk u gjet në Firestore.");
        setLoading(false);
        return;
      }

      const data = snap.data();
         if (data.status === "inactive") {
      alert("❌ Your account has been deactivated by the admin.");
      await auth.signOut();
      setLoading(false);
      return;
    }
      const role = data.role;


     
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
      alert("❌ Ky përdorues NUK është i regjistruar. Bëni Sign Up më parë.");
      return; 
    }

  
    const data = snap.data();
    const role = data.role;

 
    if (data.status === "inactive") {
      alert("❌ Your account has been deactivated by the admin.");
      await auth.signOut();
      return;
    }
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
  onClick={handleGoogleLogin}
  style={{
    marginTop: 30,
    width: "100%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#83BAC9",
    color: "white",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer"
  }}
>
  Continue with Google
</button>


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
