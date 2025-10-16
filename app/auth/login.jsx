import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";

export default function LoginScreen() {
     const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
     
      <Text style={styles.title}>Welcome back 🐾</Text>
      <Text style={styles.subtitle}>Login to continue adopting your favorite pets!</Text>

      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />

      <PrimaryButton
      label="Login"
      onPress={() => router.replace("/")}   
    />
    <TouchableOpacity onPress={() => router.push("/auth/signup")} >
      <Text style={styles.switchText}>
        Don’t have an account? <Text style={styles.link}>Sign up</Text>
      </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: "center", backgroundColor: "#fff" },
  image: { width: 220, height: 120, resizeMode: "contain", marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", color: "#457b9d", marginTop: 10 },
  subtitle: { textAlign: "center", color: "gray", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 12 },
  switchText: { marginTop: 15, color: "#555" },
  link: { color: "#457b9d", fontWeight: "bold" },
});
