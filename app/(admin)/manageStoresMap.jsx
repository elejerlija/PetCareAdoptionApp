import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";
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
import { db } from "../../firebase";
import InputField from "../../components/InputField";

/* ===================== HELPERS ===================== */

const extractCoordinates = (url) => {
  const match = url?.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!match) return null;
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
};

const getNextStoreId = (stores) => {
  const numbers = stores
    .map((s) => parseInt(s.id?.replace("s", ""), 10))
    .filter((n) => !isNaN(n));

  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `s${next}`;
};

/* ===================== MAIN ===================== */

export default function ManageStores() {
  const router = useRouter();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState("");

  const [errors, setErrors] = useState({});

  /* ===================== FIRESTORE ===================== */

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "stores"), (snap) => {
      setStores(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  /* ===================== FORM ===================== */

  const resetForm = () => {
    setName("");
    setCity("");
    setAddress("");
    setPhone("");
    setEmail("");
    setLogo("");
    setErrors({});
  };

  const validateFields = () => {
    let e = {};

    if (!name.trim()) e.name = "Store name is required";
    if (!city.trim()) e.city = "City is required";
    if (!editingStore && !address.trim())
      e.address = "Google Maps link is required";

    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";

    if (phone && !/^[0-9+\-()\s]{5,20}$/.test(phone))
      e.phone = "Enter a valid phone number";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setName(store.name);
      setCity(store.city);
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

    if (editingStore) {
      await updateDoc(doc(db, "stores", editingStore.id), {
        name,
        city,
        phone,
        email,
        logo,
        coordinate: editingStore.coordinate,
      });
    } else {
      const coords = extractCoordinates(address);
      const newId = getNextStoreId(stores);

      await setDoc(doc(db, "stores", newId), {
        name,
        city,
        phone,
        email,
        logo,
        address,
        coordinate: coords ? new GeoPoint(coords.lat, coords.lng) : null,
        createdAt: serverTimestamp(),
      });
    }

    setModalVisible(false);
    resetForm();
  };

  /* ===================== IMAGE PICKER ===================== */

  const handleImagePicker = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") return;

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });

    if (!res.canceled && res.assets?.length) {
      setLogo(`data:image/jpeg;base64,${res.assets[0].base64}`);
    }
  };

  /* ===================== DELETE ===================== */

  const deleteStore = (id) => {
    setStoreToDelete(id);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "stores", storeToDelete));
    setConfirmVisible(false);
    setStoreToDelete(null);
  };

  /* ===================== RENDER ===================== */

  const renderStore = useCallback(
    ({ item }) => (
      <View style={styles.cardRow}>
        <Image source={{ uri: item?.logo }} style={styles.storeImage} />

        <View style={{ flex: 1 }}>
          <Text style={styles.storeName}>{item.name}</Text>
          <Text style={styles.storeMeta}>{item.city}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => openModal(item)}
            >
              <MaterialIcons name="edit" size={30} color="#83BAC9" />
              <Text>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => deleteStore(item.id)}
            >
              <MaterialIcons name="delete" size={30} color="#d9534f" />
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    []
  );

  /* ===================== UI ===================== */

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Stores</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(i) => i.id}
          renderItem={renderStore}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <PrimaryButton
        title="+ Add Store"
        onPress={() => openModal()}
        style={styles.addStoreButton}
      />

      {/* ===================== MODAL ===================== */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBg}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {/* NAME */}
              <View style={errors.name && styles.errorWrapper}>
                <InputField
                  label="Store Name"
                  placeholder="Enter store name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              {/* CITY */}
              <View style={errors.city && styles.errorWrapper}>
                <InputField
                  label="City"
                  placeholder="Enter city"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}

              {/* MAP */}
              {!editingStore && (
                <>
                  <View style={errors.address && styles.errorWrapper}>
                    <InputField
                      label="Google Maps URL"
                      placeholder="Paste Google Maps link"
                      value={address}
                      onChangeText={setAddress}
                    />
                  </View>
                  {errors.address && (
                    <Text style={styles.errorText}>{errors.address}</Text>
                  )}
                </>
              )}

              {/* PHONE */}
              <View style={errors.phone && styles.errorWrapper}>
                <InputField
                  label="Phone"
                  placeholder="+383 44 123 456"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              {/* EMAIL */}
              <View style={errors.email && styles.errorWrapper}>
                <InputField
                  label="Email"
                  placeholder="example@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handleImagePicker}
              >
                {logo ? (
                  <Image source={{ uri: logo }} style={styles.previewImage} />
                ) : (
                  <Text style={{ color: "#666" }}>Select Store Logo</Text>
                )}
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <PrimaryButton
                  title={editingStore ? "Save" : "Add"}
                  onPress={saveStore}
                />
                <PrimaryButton
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ===================== DELETE ===================== */}
      {/* ===================== DELETE MODAL ===================== */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteModal}>
            <MaterialIcons
              name="warning-amber"
              size={42}
              color="#DC2626"
              style={{ marginBottom: 12 }}
            />

            <Text style={styles.deleteTitle}>Delete Store</Text>

            <Text style={styles.deleteMessage}>
              Are you sure you want to delete this store?
              {"\n"}This action cannot be undone.
            </Text>

            <View style={styles.deleteActions}>
              <Pressable
                style={styles.deleteCancel}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.deleteConfirm} onPress={confirmDelete}>
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", marginVertical: 10 },

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
  },

  storeName: { fontSize: 20, fontWeight: "bold" },
  storeMeta: { fontSize: 15, color: "#555" },

  actions: {
    flexDirection: "row",
    marginTop: 30,
    gap: 14,
  },

  actionBtn: { flexDirection: "row", alignItems: "center" },

  addStoreButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
  },

  modalBg: {
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

  imagePicker: {
    height: 140,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: "contain",
  },

  modalButtons: { marginTop: 24, gap: 14 },

  cancelButton: {
    backgroundColor: "#b2b2b2ff",
    borderColor: "#b2b2b2ff",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginLeft: 6,
    marginBottom: 8,
  },

  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteModal: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  deleteTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  deleteMessage: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 22,
  },

  deleteActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },

  deleteCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },

  deleteCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },

  deleteConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#DC2626",
    alignItems: "center",
  },

  deleteConfirmText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
