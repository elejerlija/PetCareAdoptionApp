import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";  
import {
  collection,
  onSnapshot,
  updateDoc,
  
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const THEME = "#83BAC9";
const LIGHT = "#FFFFF0";

export default function ManageUsers() {
  const router = useRouter(); 

 
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        status: d.data().status || "active",
      }));
      setUsers(usersData);
    });

    return () => unsubscribe();

  }, []);



  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await updateDoc(doc(db, "users", id), { status: newStatus });
      if (Platform.OS === "android") {
        ToastAndroid.show(
          `Status updated to ${newStatus}`,
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert("Success", `Status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update user status.");
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.fullName || "Unnamed User"}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.status}>
          Status:{" "}
          <Text style={{ color: item.status === "active" ? "green" : "red" }}>
            {item.status}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => toggleStatus(item.id, item.status)}
        style={[
          styles.statusBtn,
          {
            backgroundColor:
              item.status === "active" ? "#4CAF50" : "#E53935",
          },
        ]}
      >
        <Text style={styles.statusBtnText}>
          {item.status === "active" ? "A" : "UA"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>


      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(admin)/dashboard")}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.header}>Manage Users</Text>

      {users.length === 0 ? (
        <Text style={styles.empty}>No users found.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },


  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: THEME,
    padding: 8,
    borderRadius: 50,
    elevation: 4,
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    color: THEME,
    textAlign: "center",
    marginTop: 60,
    marginBottom: 16,
  },

  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  email: {
    color: "#666",
    fontSize: 14,
  },

  status: {
    color: "#333",
    fontSize: 13,
    marginTop: 4,
  },

  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  statusBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
 
  },
});
