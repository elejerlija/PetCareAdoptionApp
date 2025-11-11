import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; 

const THEME = "#83BAC9";
const LIGHT = "#FFFFF0";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
        Alert.alert("Error", "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "users", id));
            setUsers(users.filter((u) => u.id !== id));
          } catch (error) {
            console.error(" Error deleting user:", error);
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
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
    } catch (error) {
      console.error("❌ Error updating status:", error);
      Alert.alert("Error", "Failed to update user status.");
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name || "Unnamed User"}</Text>
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
          style={styles.actionBtn}
        >
          <Ionicons
            name={item.status === "active" ? "pause-circle" : "play-circle"}
            size={22}
            color={THEME}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
          <Ionicons name="trash" size={22} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ textAlign: "center", marginTop: 30, color: "#555" }}>
          Loading users...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.header}>Manage Users</Text>

      {users.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#777", marginTop: 40 }}>
          No users found.
        </Text>
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
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
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
    gap: 8,
  },
  actionBtn: {
    marginHorizontal: 4,
  },
});
