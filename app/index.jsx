import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const THEME = "#83BAC9";
const LIGHT = "#FFFFF0";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.appTitle}>PetCare Adoption</Text>
        <Text style={styles.subtitle}>Find your perfect four-pawed friend 🐾</Text>

        <Image
          source={require("../assets/images/pets.jpg")}
          style={styles.heroImg}
          resizeMode="contain"
        />

        <View style={styles.btnContainer}>
          <Pressable
            style={[styles.btn, styles.loginBtn, { marginRight: 12 }]}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.btnText}>Login</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, styles.signupBtn]}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={[styles.btnText, styles.signupText]}>Sign Up</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>© 2025 PetCare Adoption</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: LIGHT,
  },
  title: { fontSize: 22, color: "#444", fontWeight: "500", marginBottom: 4 },
  appTitle: { fontSize: 28, fontWeight: "800", color: THEME },
  subtitle: {
    color: "#555",
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
  },
  heroImg: {
    width: 260,
    height: 200,
    borderRadius: 20,
    marginBottom: 30,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 50,
  },
  btn: {
    borderWidth: 1.5,
    borderColor: THEME,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  loginBtn: {
    backgroundColor: LIGHT,
  },
  signupBtn: {
    backgroundColor: THEME,
  },
  btnText: {
    fontWeight: "700",
    fontSize: 16,
  },
  signupText: {
    color: "#fff",
  },
  footerText: {
    fontSize: 12,
    color: "#777",
    position: "absolute",
    bottom: 25,
  },
});
