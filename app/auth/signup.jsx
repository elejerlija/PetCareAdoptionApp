import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";

import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpScreen() {
  const router = useRouter();

  // States për inputet
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");

  const [loading, setLoading]   = useState(false);

  // Funksioni kryesor Sign Up
  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirm) {
      alert("Ju lutem plotësoni të gjitha fushat.");
      return;
    }

    if (password !== confirm) {
      alert("Password-at nuk përputhen.");
      return;
    }

    setLoading(true);

    try {
      // 1. Krijo user në Firebase Authentication
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // 2. Shto dokument në Firestore me role = user
      await setDoc(doc(db, "users", uid), {
        fullName: fullName,
        email: email,
        role: "user"
      });

      alert("Llogaria u krijua me sukses!");
      router.replace("/auth/login"); // ose /home nese e ke ashtu

    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.title}>Create Account 🐾</Text>
        <Text style={styles.subtitle}>Join PetCare Adoption and find your new best friend!</Text>

        <TextInput 
          placeholder="Full Name" 
          style={styles.input} 
          placeholderTextColor="#777"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput 
          placeholder="Email" 
          style={styles.input} 
          placeholderTextColor="#777"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput 
          placeholder="Password" 
          style={styles.input} 
          placeholderTextColor="#777" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />

        <TextInput 
          placeholder="Confirm Password" 
          style={styles.input} 
          placeholderTextColor="#777" 
          secureTextEntry 
          value={confirm}
          onChangeText={setConfirm}
        />

        <PrimaryButton
          title="Sign Up"
          onPress={handleSignup}
          isLoading={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.link}>Log in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#457b9d",
    marginTop: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#555",
  },
  link: {
    color: "#457b9d",
    fontWeight: "bold",
  },
});
