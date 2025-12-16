import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import PrimaryButton from "../../components/PrimaryButton";
import { registerPushNotifications } from "../../notifications";
import * as Notifications from "expo-notifications";

import { auth, db } from "../../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function SignUpScreen() {
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);

  /* ================= ANIMATIONS ================= */

  // Screen entrance
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Input focus
  const inputScale = useRef(new Animated.Value(1)).current;

  // Loading pulse
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

  const handleSignup = async () => {
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!nameRegex.test(fullName)) {
      shakeInputs();
      alert("Emri duhet të ketë min 3 shkronja.");
      return;
    }

    if (!emailRegex.test(email)) {
      shakeInputs();
      alert("Ju lutem vendosni një email valid.");
      return;
    }

    if (!passwordRegex.test(password)) {
      shakeInputs();
      alert(
        "Password-i duhet të ketë min 8 karaktere, shkronjë të madhe, të vogël, numër dhe simbol."
      );
      return;
    }

    if (password !== confirm) {
      shakeInputs();
      alert("Password-at nuk përputhen.");
      return;
    }

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        fullName,
        email,
        role: "user",
        status: "active",
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Account Created 🎉",
          body: "Your PetCare account was successfully created!",
        },
        trigger: null,
      });

      await registerPushNotifications();

      router.replace("/auth/login");

    } catch (error) {
      shakeInputs();
      alert(error.message);
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          fullName: user.displayName || "Unknown",
          email: user.email,
          role: "user",
          status: "active",
        });
      }

      router.replace("/auth/login");

    } catch (error) {
      alert(error.message);
    }
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>Create Account 🐾</Text>
          <Text style={styles.subtitle}>
            Join PetCare Adoption and find your new best friend!
          </Text>

          <Animated.View style={{ width: "100%", transform: [{ translateX: shakeAnim }] }}>
            {[
              { placeholder: "Full Name", value: fullName, setter: setFullName },
              { placeholder: "Email", value: email, setter: setEmail },
            ].map((field, i) => (
              <Animated.View key={i} style={{ transform: [{ scale: inputScale }] }}>
                <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor="#777"
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.setter}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </Animated.View>
            ))}

            <Animated.View style={{ transform: [{ scale: inputScale }] }}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#777"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: inputScale }] }}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#777"
                secureTextEntry
                style={styles.input}
                value={confirm}
                onChangeText={setConfirm}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Animated.View>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: pulseAnim }], width: "100%" }}>
            <PrimaryButton
              title="Sign Up"
              onPress={handleSignup}
              isLoading={loading}
            />
          </Animated.View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={styles.link}>Log in</Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton
            onPress={handleGoogleSignup}
            style={{ marginTop: 30, width: "100%" }}
            title="Sign up with Google"
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

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
