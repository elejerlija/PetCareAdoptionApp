import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
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
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
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
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  useEffect(() => {
    
    const q = query(collection(db, "pets"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const arr = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPets(arr);
        setLoading(false);
      },
      (err) => {
        console.error("Pets onSnapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleAdd = async (payload) => {
    await addDoc(collection(db, "pets"), {
      ...payload,
      adopted: false,
      createdAt: serverTimestamp(),
    });
  };

  const handleUpdate = async (payload) => {
    if (!editingPet) throw new Error("No pet selected for update");
    const ref = doc(db, "pets", editingPet.id);
    await updateDoc(ref, {
      ...payload,
    });
    setEditingPet(null);
  };

  const handleDelete = (pet) => {
    Alert.alert(
      "Delete pet",
      `Are you sure you want to delete "${pet.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "pets", pet.id));
            } catch (e) {
              Alert.alert("Error", "Couldn't delete pet: " + e.message);
            }
          },
        },
      ]
    );
  };

  const toggleAdopted = async (pet) => {
    try {
      await updateDoc(doc(db, "pets", pet.id), { adopted: !pet.adopted });
    } catch (e) {
      Alert.alert("Error", "Couldn't update status: " + e.message);
    }
  };

  const openAdd = () => {
    setEditingPet(null);
    setModalVisible(true);
  };
  const openEdit = (pet) => {
    setEditingPet(pet);
    setModalVisible(true);
  };
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name ? item.name.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petMeta}>
          {item.species ?? "Unknown"} • {item.age ?? "-"} yrs
        </Text>
        <Text style={styles.petDesc} numberOfLines={2}>
          {item.description ?? ""}
        </Text>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => toggleAdopted(item)}
          >
            <MaterialIcons
              name={item.adopted ? "check-circle" : "radio-button-unchecked"}
              size={18}
            />
            <Text style={styles.actionText}>
              {item.adopted ? "Adopted" : "Mark Adopted"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openEdit(item)}
          >
            <FontAwesome5 name="edit" size={14} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(item)}
          >
            <MaterialIcons name="delete" size={18} />
            <Text style={[styles.actionText, { color: "#d33" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
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
  
});

