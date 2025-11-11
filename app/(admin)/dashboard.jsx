import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

import PrimaryButton from "../../components/PrimaryButton";

const THEME = "#83BAC9";
const LIGHT = "#FFFFF0";

export default function AdminDashboard() {
   const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/pets/index");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <Text style={styles.title}>ADMIN DASHBOARD</Text>
        <Text style={styles.subtitle}>PetAdoption Care</Text>


        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Pets</Text>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statSub}>Currently in the system</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Pending Requests</Text>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statSub}>Awaiting your approval</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Users</Text>
            <Text style={styles.statValue}>56</Text>
            <Text style={styles.statSub}>Registered adopters</Text>
          </View>
        </View>


        <Text style={styles.sectionTitle}>Management</Text>

        <TouchableOpacity
          style={styles.manageItem}
          onPress={() => router.push("/admin/managePets")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="paw" size={22} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.manageTitle}>Manage Pets</Text>
            <Text style={styles.manageDesc}>
              Add, edit, delete pets or update adoption status.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manageItem}
          onPress={() => router.push("/admin/manageRequests")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="mail" size={22} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.manageTitle}>Adoption Requests</Text>
            <Text style={styles.manageDesc}>
              View and manage pending adoption requests.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manageItem}
          onPress={() => router.push("/admin/manageStores")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="storefront" size={22} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.manageTitle}>Manage Stores</Text>
            <Text style={styles.manageDesc}>
              Add or update pet supply store information.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>
        
       <PrimaryButton
  title="Log Out"
  onPress={handleLogout}
  style={{
    marginTop: 25,
    width: "100%",
    alignSelf: "center",
  }}
/>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#5ca777",
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#eef2f3",
  },
  statTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 4,
  },
  statSub: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  manageItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eef2f3",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  manageTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#111",
  },
  manageDesc: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
});
