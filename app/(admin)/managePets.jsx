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
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

function AddEditPetModal({ visible, onClose, onSubmit, initial }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [species, setSpecies] = useState(initial?.species ?? "");
  const [age, setAge] = useState(initial?.age ? String(initial.age) : "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    if (visible) {
      setName(initial?.name ?? "");
      setSpecies(initial?.species ?? "");
      setAge(initial?.age ? String(initial.age) : "");
      setImageUrl(initial?.imageUrl ?? "");
      setDescription(initial?.description ?? "");
    }
  }, [visible, initial]);

  const submit = async () => {
    if (!name.trim()) return Alert.alert("Validation", "Please enter a name.");
    setLoading(true);
    const payload = {
      name: name.trim(),
      species: species.trim() || "Unknown",
      age: age ? Number(age) : null,
      imageUrl: imageUrl.trim() || null,
      description: description.trim() || "",
    };
    try {
      await onSubmit(payload);
      onClose();
    } catch (e) {
      Alert.alert("Error", e.message || "Could not save pet.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {initial ? "Edit Pet" : "Add New Pet"}
          </Text>
          <ScrollView style={{ width: "100%" }}>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Species (e.g. Dog, Cat)"
              value={species}
              onChangeText={setSpecies}
              style={styles.input}
            />
            <TextInput
              placeholder="Age (years)"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChangeText={setImageUrl}
              style={styles.input}
            />
            <TextInput
              placeholder="Short description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { height: 80 }]}
              multiline
            />
          </ScrollView>
           <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.btnGhost} onPress={onClose}>
              <Text style={styles.btnGhostText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={submit}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>
                  {initial ? "Save" : "Add"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export default function ManagePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pets"), (snapshot) => {
      const petList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPets(petList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const resetForm = () => {
    setName("");
    setType("");
    setAge("");
    setCity("");
    setPrice("");
    setDesc("");
    setImage("");
  };
  const openModal = (pet = null) => {
    if (pet) {
      setEditingPet(pet);
      setName(pet.name);
      setType(pet.type);
      setAge(pet.age?.toString() || "");
      setCity(pet.city || "");
      setPrice(pet.price?.toString() || "");
      setDesc(pet.desc || "");
      setImage(pet.image || "");
    } else {
      setEditingPet(null);
      resetForm();
    }

    setModalVisible(true);
  };
  const savePet = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Pet name is required.");
      return;
    }

    const data = {
      name,
      type,
      age: age ? Number(age) : null,
      city,
      price: price ? Number(price) : 0,
      desc,
      image,
      available: editingPet?.available ?? true,
      favorite: editingPet?.favorite ?? false,
    };

    try {
      if (editingPet) {
        await updateDoc(doc(db, "pets", editingPet.id), data);
      } else {
        await addDoc(collection(db, "pets"), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }

      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  const toggleAvailable = async (pet) => {
    await updateDoc(doc(db, "pets", pet.id), {
      available: !pet.available,
    });
  };
const renderPet = ({ item }) => (
    <View style={styles.petCard}>
      <Text style={styles.petName}>{item.name}</Text>
      <Text style={styles.petMeta}>{item.type} • {item.age} yrs</Text>
      <Text style={styles.petDesc}>{item.desc}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => toggleAvailable(item)}
          style={styles.actionBtn}
        >
          <MaterialIcons
            name={item.available ? "check-circle" : "radio-button-unchecked"}
            size={20}
            color={item.available ? "green" : "gray"}
          />
          <Text style={styles.actionText}>
            {item.available ? "Available" : "Unavailable"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openModal(item)} style={styles.actionBtn}>
          <MaterialIcons name="edit" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Manage Pets</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add Pet</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} />
      ) : pets.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No pets yet. Add one!</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 12 }}
        />
      )}

      <AddEditPetModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingPet(null);
        }}
        onSubmit={editingPet ? handleUpdate : handleAdd}
        initial={editingPet}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e6e6e6",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  addBtn: {
    backgroundColor: "#2b9aa0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "600" },

  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#777", fontSize: 16 },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center",
  },
  cardLeft: { width: 60, alignItems: "center", justifyContent: "center" },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e6f3f4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 24, fontWeight: "700", color: "#2b9aa0" },

  cardBody: { flex: 1, paddingLeft: 12 },
  petName: { fontSize: 16, fontWeight: "700" },
  petMeta: { color: "#666", marginTop: 2, marginBottom: 6 },
  petDesc: { color: "#444", opacity: 0.8 },

  cardActions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    gap: 6,
  },
  actionText: { marginLeft: 6 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.36)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "85%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  btnGhost: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnGhostText: { color: "#555" },
  btnPrimary: {
    backgroundColor: "#2b9aa0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
});

