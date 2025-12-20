import { db } from "../../firebase";
import React, { useEffect, useState, useRef } from "react";
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
  Image,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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

  const [successVisible, setSuccessVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(1)).current;

  
  const [requests, setRequests] = useState([]);

  
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

  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "adoptionRequests"), (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequests(list);
    });

    return unsub;
  }, []);

 
  const getRequestForPet = (petId) => {
    return requests.find((r) => r.petId === petId) || null;
  };

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
   const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
      setImage(base64Img);

      Animated.spring(imageScale, {
        toValue: 1.05,
        friction: 3,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(imageScale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      });
    }
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

  
  const handleApprove = async (req) => {
    try {
      await updateDoc(doc(db, "pets", req.petId), {
        available: false,
        status: "approved",
      });

      await deleteDoc(doc(db, "adoptionRequests", req.id));
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const handleDecline = async (req) => {
    try {
      await updateDoc(doc(db, "pets", req.petId), {
        available: true,
        status: "available",
      });

      await deleteDoc(doc(db, "adoptionRequests", req.id));
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

 
  const renderPet = ({ item }) => {
    const request = getRequestForPet(item.id);

    return (
      <View style={styles.petCard}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petMeta}>
          {item.type} • {item.age} yrs • {item.city}
        </Text>
        <Text style={styles.petDesc}>{item.desc}</Text>

        
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() =>
              updateDoc(doc(db, "pets", item.id), {
                available: !item.available,
              })
            }
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

          <TouchableOpacity
            onPress={() => openModal(item)}
            style={styles.actionBtn}
          >
            <MaterialIcons name="edit" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
        </View>

        
        {request && request.status === "pending" && (
          <View style={styles.requestRow}>
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApprove(request)}
            >
              <MaterialIcons name="check" size={18} color="#fff" />
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.declineBtn}
              onPress={() => handleDecline(request)}
            >
              <MaterialIcons name="close" size={18} color="#fff" />
              <Text style={styles.btnText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push("/(admin)")}>
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
          contentContainerStyle={{ paddingBottom: 100 }}
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  title: { fontSize: 26, fontWeight: "700" },
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
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: { marginLeft: 4 },
  requestRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  approveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2b9aa0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  declineBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
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
