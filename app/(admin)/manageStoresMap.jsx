import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function ManageStores() {
  const router = useRouter();

  // store fields
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  // fetch stores realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "stores"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStores(list);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const resetForm = () => {
    setName("");
    setCity("");
    setAddress("");
    setPhone("");
    setEmail("");
    setImage("");
  };

  const openModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setName(store.name);
      setCity(store.city);
      setAddress(store.address);
      setPhone(store.phone);
      setEmail(store.email);
      setImage(store.image);
    } else {
      setEditingStore(null);
      resetForm();
    }

    setModalVisible(true);
  };

  const saveStore = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Store name is required.");
      return;
    }

    const data = {
      name,
      city,
      address,
      phone,
      email,
      image,
    };

    try {
      if (editingStore) {
        await updateDoc(doc(db, "stores", editingStore.id), data);
      } else {
        await addDoc(collection(db, "stores"), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }

      setModalVisible(false);
      resetForm();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const toggleActive = async (store) => {
    await updateDoc(doc(db, "stores", store.id), {
      active: !store.active,
    });
  };

  const deleteStore = async (storeId) => {
    Alert.alert("Delete", "Are you sure you want to delete this store?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => await deleteDoc(doc(db, "stores", storeId)),
        style: "destructive",
      },
    ]);
  };

  const renderStore = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.storeName}>{item.name}</Text>
      <Text style={styles.storeMeta}>{item.city}</Text>
      <Text style={styles.storeMeta}>{item.address}</Text>
      <Text style={styles.storeDesc}>📞 {item.phone}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => openModal(item)}
          style={styles.actionBtn}
        >
          <MaterialIcons name="edit" size={20} color="#83BAC9" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteStore(item.id)}
          style={styles.actionBtn}
        >
          <MaterialIcons name="delete" size={20} color="#d9534f" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.push("/(admin)")}
          style={styles.backBtn}
        >
          <MaterialIcons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text style={styles.title}>Manage Stores</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          renderItem={renderStore}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <TouchableOpacity style={styles.addBtn} onPress={() => openModal(null)}>
        <Text style={styles.addBtnText}>+ Add New Store</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editingStore ? "Edit Store" : "Add Store"}
              </Text>

              <TextInput
                placeholder="Store Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                required
              />
              <TextInput
                placeholder="City"
                value={city}
                onChangeText={setCity}
                style={styles.input}
                required
              />
              <TextInput
                placeholder="Address (Google Maps URL)"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
                required
              />
              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                optional
              />
              <TextInput
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
                style={styles.input}
                optional
              />

              <PrimaryButton
                title={editingStore ? "Save Changes" : "Add Store"}
                onPress={saveStore}
                style={styles.saveBtn}
              />

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 10 },
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
  },
  storeName: { fontSize: 20, fontWeight: "bold" },
  storeMeta: { fontSize: 15, color: "#555" },
  storeDesc: { marginTop: 4, color: "#444" },

  actions: { flexDirection: "row", marginTop: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionText: { marginLeft: 4 },

  addBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#2b9aa0",
    padding: 15,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", textAlign: "center", fontSize: 18 },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "#2b9aa0",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  saveBtnText: { color: "#fff", textAlign: "center", fontSize: 18 },
  cancelBtn: {
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "#ddd",
  },
  cancelBtnText: { textAlign: "center", fontSize: 16 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backBtn: {
    marginRight: 10,
    padding: 6,
    borderRadius: 6,
  },
});
