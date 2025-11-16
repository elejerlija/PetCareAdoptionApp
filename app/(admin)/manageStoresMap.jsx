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
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";

import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  GeoPoint,
} from "firebase/firestore";

export default function ManageStores() {
  const router = useRouter();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  // DELETE MODAL STATES
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState("");

  const [errors, setErrors] = useState({});

  // LISTEN TO STORES
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "stores"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStores(list);
      setLoading(false);
    });
    return unsub;
  }, []);

  const resetForm = () => {
    setName("");
    setCity("");
    setAddress("");
    setPhone("");
    setEmail("");
    setLogo("");
    setErrors({});
  };

  // AUTO INCREMENT ID: s1, s2, s3…
  const getNextStoreId = () => {
    if (stores.length === 0) return "s1";

    const numbers = stores
      .map((s) => parseInt(s.id.replace("s", "")))
      .filter((n) => !isNaN(n));

    const max = Math.max(...numbers);
    return "s" + (max + 1);
  };

  const extractCoordinates = (url) => {
    try {
      if (!url) return null;
      const at = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (at) return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };

      const d = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (d) return { lat: parseFloat(d[1]), lng: parseFloat(d[2]) };

      const q = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (q) return { lat: parseFloat(q[1]), lng: parseFloat(q[2]) };

      const generic = url.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (generic)
        return { lat: parseFloat(generic[1]), lng: parseFloat(generic[2]) };

      return null;
    } catch {
      return null;
    }
  };

  const validateFields = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Store name is required";
    if (!city.trim()) newErrors.city = "City is required";

    if (!address.trim()) newErrors.address = "Google Maps URL is required";
    else {
      const isGoogle = /^https?:\/\/(www\.)?google\.com\/maps/.test(address);
      if (!isGoogle) newErrors.address = "Invalid Google Maps link";
      else if (!extractCoordinates(address))
        newErrors.address = "Link must contain valid coordinates";
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email format";

    if (phone && !/^[0-9+\-()\s]{5,20}$/.test(phone))
      newErrors.phone = "Invalid phone number";

    if (
      logo &&
      !logo.trim().endsWith(".jpg") &&
      !logo.trim().endsWith(".png")
    ) {
      newErrors.logo = "Logo must be .jpg or .png";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setName(store.name);
      setCity(store.city);
      setAddress(store.address);
      setPhone(store.phone || "");
      setEmail(store.email || "");
      setLogo(store.logo || "");
    } else {
      resetForm();
      setEditingStore(null);
    }
    setModalVisible(true);
  };

  const saveStore = async () => {
    if (!validateFields()) return;

    const coords = extractCoordinates(address);

    const data = {
      name,
      city,
      address,
      phone,
      email,
      logo,
      coordinate: coords ? new GeoPoint(coords.lat, coords.lng) : null,
    };

    try {
      if (editingStore) {
        await updateDoc(doc(db, "stores", editingStore.id), data);
      } else {
        const newId = getNextStoreId();

        await setDoc(doc(db, "stores", newId), {
          ...data,
          createdAt: serverTimestamp(),
        });

        console.log("CREATED STORE WITH ID:", newId);
      }

      setModalVisible(false);
      resetForm();
    } catch (err) {
      console.log("SAVE ERROR:", err);
    }
  };

  const deleteStore = (id) => {
    setStoreToDelete(id);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "stores", storeToDelete));
      console.log("DELETE SUCCESS:", storeToDelete);
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }

    setConfirmVisible(false);
    setStoreToDelete(null);
  };

  const renderStore = ({ item }) => (
    <View style={styles.cardRow}>
      <Image
        source={{
          uri: item.logo
            ? `/storeImages/${item.logo}`
            : `/storeImages/placeholder.jpg`,
        }}
        style={styles.storeImage}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.storeName}>{item.name}</Text>
        <Text style={styles.storeMeta}>{item.city}</Text>

        {item.phone ? (
          <Text style={styles.storeDesc}>📞 {item.phone}</Text>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => openModal(item)}
            style={[styles.actionBtn, styles.editBtn]}
          >
            <MaterialIcons name="edit" size={20} color="#83BAC9" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteStore(item.id)}
            style={[styles.actionBtn, styles.deleteBtn]}
          >
            <MaterialIcons name="delete-outline" size={20} color="#d9534f" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
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
          contentContainerStyle={{ paddingBottom: 140 }}
        />
      )}

      <TouchableOpacity style={styles.addBtn} onPress={() => openModal(null)}>
        <Text style={styles.addBtnText}>+ Add New Store</Text>
      </TouchableOpacity>

      {/* ADD / EDIT MODAL */}
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

              <InputField
                label="Store Name"
                value={name}
                setValue={setName}
                error={errors.name}
              />
              <InputField
                label="City"
                value={city}
                setValue={setCity}
                error={errors.city}
              />
              <InputField
                label="Address (Google Maps URL)"
                value={address}
                setValue={setAddress}
                error={errors.address}
              />
              <InputField
                label="Phone"
                value={phone}
                setValue={setPhone}
                error={errors.phone}
              />
              <InputField
                label="Email (optional)"
                value={email}
                setValue={setEmail}
                error={errors.email}
              />
              <InputField
                label="Logo File Name (.jpg/.png)"
                value={logo}
                setValue={setLogo}
                error={errors.logo}
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

      {/* DELETE CONFIRM MODAL */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.confirmBg}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Delete Store</Text>
            <Text style={styles.confirmSubtitle}>
              Are you sure you want to delete this store?
            </Text>

            <View style={styles.confirmActions}>
              <TouchableOpacity
                onPress={() => setConfirmVisible(false)}
                style={[styles.confirmBtn, { backgroundColor: "#ccc" }]}
              >
                <Text style={styles.confirmText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDelete}
                style={[styles.confirmBtn, { backgroundColor: "#d9534f" }]}
              >
                <Text style={[styles.confirmText, { color: "#fff" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InputField({ label, value, setValue, error }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <TextInput
        placeholder={label}
        value={value}
        onChangeText={(t) => setValue(t)}
        style={[styles.input, error && styles.inputError]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 10 },

  cardRow: {
    flexDirection: "row",
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
  },

  storeImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#ccc",
    resizeMode: "cover",
  },

  storeName: { fontSize: 20, fontWeight: "bold" },
  storeMeta: { fontSize: 15, color: "#555" },
  storeDesc: { marginTop: 4, color: "#444" },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 14,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },

  actionText: { marginLeft: 6, fontSize: 15 },

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
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 13,
  },

  saveBtn: { marginTop: 15 },
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
  },

  // DELETE MODAL STYLES
  confirmBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  confirmBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  confirmSubtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
