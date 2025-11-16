
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "adoptionRequests"), (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequests(list);
    });

    return unsub;
  }, []);

  const approve = async (req) => {
    await updateDoc(doc(db, "adoptionRequests", req.id), { status: "approved" });
  };

  const decline = async (req) => {
    await updateDoc(doc(db, "adoptionRequests", req.id), { status: "declined" });
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Adoption Requests</Text>

      {requests.map((req) => (
        <View key={req.id} style={styles.card}>
          <Text>Pet ID: {req.petId}</Text>
          <Text>User ID: {req.userId}</Text>
          <Text>Status: {req.status}</Text>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity style={styles.approveBtn} onPress={() => approve(req)}>
              <Text style={{ color: "#fff" }}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.declineBtn} onPress={() => decline(req)}>
              <Text style={{ color: "#fff" }}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 25,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  approveBtn: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  declineBtn: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
