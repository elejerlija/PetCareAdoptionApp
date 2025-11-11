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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const THEME = "#83BAC9";
const LIGHT = "#FFFFF0";

export default function ManageUsers() {
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


  const handleDelete = async (id) => {
    if (!id) {
      Alert.alert("Error", "User ID is missing!");
      return;
    }

    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "users", id));

            if (Platform.OS === "android") {
              ToastAndroid.show("✅ User deleted successfully", ToastAndroid.SHORT);
            } else {
              Alert.alert("Success", "User deleted successfully ✅");
            }

            console.log("✅ User deleted:", id);
          } catch (error) {
            console.error("❌ Error deleting user:", error);
            Alert.alert("Error", "Failed to delete user.");
          }
        },
      },
    ]);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateDoc(doc(db, "users", id), { status: newStatus });
      if (Platform.OS === "android") {
        ToastAndroid.show(
          `Status updated to ${newStatus}`,
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
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

      <View style={styles.actions}>
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

        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

   
  return (
    <SafeAreaView style={styles.safe}>
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
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: THEME,
    textAlign: "center",
    marginVertical: 16,
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 8,
    marginLeft: 6,
  },
});
