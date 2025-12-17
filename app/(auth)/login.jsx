import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import PrimaryButton from "../../components/PrimaryButton";
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

  /* ================= ANIMATIONS ================= */

  // Screen fade + slide
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Input focus scale
  const inputScale = useRef(new Animated.Value(1)).current;

  // Button pulse (loading)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Shake on error
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading]);

  const onFocus = () => {
    Animated.spring(inputScale, {
      toValue: 1.03,
      useNativeDriver: true,
    }).start();
  };

  const onBlur = () => {
    Animated.spring(inputScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  /* ================= LOGIC ================= */

  const handleLogin = async () => {
    if (!email || !password) {
      shakeInputs();
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("User profile not found.");
        setLoading(false);
        return;
      }

      const data = snap.data();

      if (data.status === "inactive") {
        alert("Your account has been deactivated.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Login successful 🎉",
          body: "Welcome back to PetCare Adoption!",
        },
        trigger: null,
      });

      await registerPushNotifications();

      if (data.role === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/(tabs)/");
      }

    } catch (error) {
      shakeInputs();
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
        alert("This user is not registered.");
        return;
      }

      if (snap.data().status === "inactive") {
        alert("Account deactivated.");
        await auth.signOut();
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Welcome 🎉",
          body: "Google login successful!",
        },
        trigger: null,
      });

      router.replace("/(tabs)/");

    } catch (error) {
      alert(error.message);
    }
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>Welcome back 🐾</Text>
        <Text style={styles.subtitle}>
          Login to continue adopting your favorite pets!
        </Text>

        <Animated.View
          style={{
            width: "100%",
            transform: [{ translateX: shakeAnim }],
          }}
        >
          <Animated.View style={{ transform: [{ scale: inputScale }] }}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#555"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: inputScale }] }}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#555"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Animated.View>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: pulseAnim }], width: "100%" }}>
          <PrimaryButton
            title="Login"
            onPress={handleLogin}
            isLoading={loading}
          />
        </Animated.View>

        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.switchText}>
            Don’t have an account? <Text style={styles.link}>Sign up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoogleLogin}
          activeOpacity={0.7}
          style={styles.googleButton}
        >
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#457b9d",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: 24,
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
  switchText: {
    marginTop: 16,
    color: "#555",
  },
  link: {
    color: "#457b9d",
    fontWeight: "bold",
  },
  googleButton: {
    marginTop: 28,
    width: "100%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#83BAC9",
    alignItems: "center",
  },
  googleText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
