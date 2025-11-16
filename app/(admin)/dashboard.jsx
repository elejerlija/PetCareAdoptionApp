import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import PrimaryButton from "../../components/PrimaryButton";

const THEME = "#83BAC9";
const LIGHT = "#F9FCFD";

export default function AdminDashboard() {

  const [totalPets, setTotalPets] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total pets
        const petsSnap = await getDocs(collection(db, "pets"));
        setTotalPets(petsSnap.size);

        // Pending requests = pets where status == "pending"
        const pendingSnap = await getDocs(
          query(collection(db, "pets"), where("status", "==", "pending"))
        );
        setPendingRequests(pendingSnap.size);

        // Total users
        const usersSnap = await getDocs(collection(db, "users"));
        setTotalUsers(usersSnap.size);

      } catch (err) {
        console.log("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.title}>ADMIN DASHBOARD</Text>
          <Text style={styles.subtitle}>PetAdoption Care</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="paw" size={26} color={THEME} style={styles.iconTop} />
            <Text style={styles.statTitle}>Total Pets</Text>
            <Text style={styles.statValue}>{totalPets}</Text>
            <Text style={styles.statSub}>Currently in the system</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="hourglass-outline" size={26} color={THEME} style={styles.iconTop} />
            <Text style={styles.statTitle}>Pending Requests</Text>
            <Text style={styles.statValue}>{pendingRequests}</Text>
            <Text style={styles.statSub}>Awaiting your approval</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={26} color={THEME} style={styles.iconTop} />
            <Text style={styles.statTitle}>Users</Text>
            <Text style={styles.statValue}>{totalUsers}</Text>
            <Text style={styles.statSub}>Registered adopters</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Management</Text>

        <TouchableOpacity
          style={styles.manageItem}
          onPress={() => router.push("/(admin)/managePets")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="paw" size={22} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.manageTitle}>Manage Pets</Text>
            <Text style={styles.manageDesc}>Add, edit, delete pets or update adoption status.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manageItem}
          onPress={() => router.push("/(admin)/manageUsers")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="people" size={22} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.manageTitle}>Manage Users</Text>
            <Text style={styles.manageDesc}>View, deactivate or delete registered users.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manageItem}
          onPress={() => router.push("/(admin)/manageStoresMap")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="storefront" size={22} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.manageTitle}>Manage Stores</Text>
            <Text style={styles.manageDesc}>Add or update pet supply store information.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.logoutContainer}>
          <PrimaryButton title="Logout" onPress={handleLogout} style={styles.logoutBtn} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LIGHT },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1a1a1a", marginBottom: 4 },
  subtitle: { fontSize: 18, color: THEME, fontWeight: "600" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  statCard: {
     flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 18,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#e8eef0",
  },
  iconTop: { marginBottom: 6 },
  statTitle: { fontSize: 13, color: "#555", fontWeight: "600" },
  statValue: { fontSize: 22, fontWeight: "bold", color: THEME, marginVertical: 3 },
  statSub: { fontSize: 12, color: "#777", textAlign: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#222", marginBottom: 12, marginTop: 5 },
  manageItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e8eef0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: THEME, justifyContent: "center", alignItems: "center",
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  manageTitle: { fontWeight: "700", fontSize: 15, color: "#111" },
  manageDesc: { fontSize: 13, color: "#555", marginTop: 2 },
  logoutContainer: { marginTop: 25, alignItems: "center" },
  logoutBtn: { width: "60%", backgroundColor: THEME, borderRadius: 14 },
});
