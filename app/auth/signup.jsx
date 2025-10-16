import React from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
       

        <Text style={styles.title}>Create Account 🐾</Text>
        <Text style={styles.subtitle}>
          Join PetCare Adoption and find your new best friend!
        </Text>

        <TextInput placeholder="Full Name" style={styles.input} placeholderTextColor="#777" />
        <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#777" keyboardType="email-address" />
        <TextInput placeholder="Password" style={styles.input} placeholderTextColor="#777" secureTextEntry />
        <TextInput placeholder="Confirm Password" style={styles.input} placeholderTextColor="#777" secureTextEntry />

        <PrimaryButton
          label="Sign Up"
          onPress={() => {
            
            router.replace("/");
          }}
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
  image: {
    width: 230,
    height: 130,
    resizeMode: "contain",
    marginBottom: 10,
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
