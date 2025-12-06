import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useRouter } from "expo-router";
import { registerPushNotifications } from "../../notifications";
import * as Notifications from "expo-notifications";



import { auth, db } from "../../firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

import { 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";


export default function SignUpScreen() {
  const router = useRouter();
   
  const googleProvider = new GoogleAuthProvider();

 
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");

  const [loading, setLoading]   = useState(false);


  const handleSignup = async () => {
    const nameRegex = /^[A-Za-z\s]{3,}$/; 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!nameRegex.test(fullName)) {
    alert("Emri duhet të përmbajë vetëm shkronja dhe të jetë minimalisht 3 karaktere.");
    return;
  }

  if (!emailRegex.test(email)) {
    alert("Ju lutem vendosni një email valid.");
    return;
  }

  if (!passwordRegex.test(password)) {
    alert(
      "Password-i duhet të ketë min 8 karaktere, 1 shkronjë të madhe, 1 të vogël, 1 numër dhe 1 simbol."
    );
    return;
  }
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
      
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

     
      await setDoc(doc(db, "users", uid), {
        fullName: fullName,
        email: email,
        role: "user"
      });

     await Notifications.scheduleNotificationAsync({
      content: {
        title: "Account Created 🎉",
        body: "Your PetCare account was successfully created!",
      },
      trigger: null,
    });

      router.replace("/auth/login"); // ose /home nese e ke ashtu

    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };


const HandleGoogleSignUp = async () => {
 

  try {
    

    const result = await signInWithPopup(auth, googleProvider);

   

    console.log("GOOGLE USER:", result.user);
    alert("User: " + JSON.stringify(result.user));

    const user = result.user;

    alert("4. Duke kontrolluar Firestore...");

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("5. User nuk ekziston — po e krijoj!");

      await setDoc(ref, {
        fullName: user.displayName || "Unknown",
        email: user.email,
        role: "user",
        status: "active",
      });

      alert("6. User u ruajt në Firestore!");
    } else {
      alert("User ekziston në databazë!");
    }

    router.replace("/auth/login");

  } catch (error) {
    console.error("❌ GOOGLE LOGIN ERROR:", error);
    alert("❌ ERROR: " + error.message);
  }
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
        
 <PrimaryButton
  onPress={HandleGoogleSignUp}
  style={{
    marginTop: 30,        
    width: "100%",        
  }}
  title={
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      
      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
        SignUp with Google
      </Text>
    </View>
  }
/>



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
