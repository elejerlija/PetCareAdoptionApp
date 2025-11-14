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
export default function ManagePets() {
  const router = useRouter();
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
      <Text style={styles.petMeta}>{item.type} • {item.age} yrs • {item.city}</Text>
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
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.push("/(admin)")}
          style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} />
        </TouchableOpacity>
      <Text style={styles.title}>Manage Pets</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={renderPet}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => openModal(null)}
      >
        <Text style={styles.addBtnText}>+ Add New Pet</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editingPet ? "Edit Pet" : "Add Pet"}
              </Text>

              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />

              <TextInput
                placeholder="Type (dog, cat...)"
                value={type}
                onChangeText={setType}
                style={styles.input}
              />

              <TextInput
                placeholder="Age (years)"
                value={age}
                keyboardType="number-pad"
                onChangeText={setAge}
                style={styles.input}
              />

              <TextInput
                placeholder="City"
                value={city}
                onChangeText={setCity}
                style={styles.input}
              />

              <TextInput
                placeholder="Price"
                value={price}
                keyboardType="number-pad"
                onChangeText={setPrice}
                style={styles.input}
              />

              <TextInput
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
                style={styles.input}
              />

              <TextInput
                placeholder="Description"
                value={desc}
                onChangeText={setDesc}
                multiline
                style={[styles.input, { height: 80 }]}
              />

              <TouchableOpacity onPress={savePet} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>
                  {editingPet ? "Save Changes" : "Add Pet"}
                </Text>
              </TouchableOpacity>

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
  container: { flex: 1,padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 10 },
  petCard: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
  },
  petName: { fontSize: 20, fontWeight: "bold" },
  petMeta: { fontSize: 14, color: "#666" },
  petDesc: { marginTop: 5, color: "#444" },
  actions: { flexDirection: "row", marginTop: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionText: { marginLeft: 4 },
  addBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007AFF",
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
    backgroundColor: "#007AFF",
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
});
