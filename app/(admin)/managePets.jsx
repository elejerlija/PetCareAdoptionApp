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
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
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
  const showSuccess = () => {
    setSuccessVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSuccessVisible(false));
    }, 1500);
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
      showSuccess();
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
    const imageUri = item.image || item.imageUrl;

    return (
      <View style={styles.petCard}>
      <View style={styles.petRow}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.petImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.petImagePlaceholder}>
              <MaterialIcons name="pets" size={28} color="#aaa" />
            </View>
          )}
        <View style={styles.petInfo}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petMeta}>
              {item.type} • {item.age} yrs • {item.city}
            </Text>
            {item.desc ? (
              <Text numberOfLines={2} style={styles.petDesc}>
                {item.desc}
              </Text>
            ) : null}
          </View>
        </View>

        
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
        onPress={() => openModal(null)}>
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

              <Text style={styles.label}>Pet Name *</Text>
              <TextInput
                placeholder="e.g. Bella"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />

              <Text style={styles.label}>Type</Text>
              <TextInput
                placeholder="Dog, Cat, etc."
                placeholderTextColor="#999"
                value={type}
                onChangeText={setType}
                style={styles.input}
              />
              <Text style={styles.label}>Age (years)</Text>
              <TextInput
                placeholder="e.g. 2"
                placeholderTextColor="#999"
                value={age}
                keyboardType="number-pad"
                onChangeText={setAge}
                style={styles.input}
              />

              <Text style={styles.label}>City</Text>
              <TextInput
                placeholder="e.g. Prishtina"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
                style={styles.input}
              />

              <Text style={styles.label}>Price (€)</Text>
              <TextInput
                placeholder="0 for adoption"
                placeholderTextColor="#999"
                value={price}
                keyboardType="number-pad"
                onChangeText={setPrice}
                style={styles.input}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="Short description about the pet"
                placeholderTextColor="#999"
                value={desc}
                onChangeText={setDesc}
                multiline
                style={[styles.input, { height: 80 }]}
              />

              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Add Image", "Choose an option", [
                    { text: "Gallery", onPress: pickImage },
                    { text: "Camera", onPress: takePhoto },
                    { text: "Cancel", style: "cancel" },
                  ])
                }
                style={styles.imagePickerCard}
              >
                {image ? (
                  <Animated.Image
                    source={{ uri: image }}
                    style={[styles.imagePreview, { transform: [{ scale: imageScale }] }]}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <MaterialIcons name="image" size={36} color="#999" />
                    <Text style={styles.imagePlaceholderText}>Select Image</Text>
                  </View>
                )}

                {image && (
                  <View style={styles.changeOverlay}>
                    <MaterialIcons name="edit" size={16} color="#fff" />
                    <Text style={styles.changeOverlayText}>Change</Text>
                  </View>
                )}
              </TouchableOpacity>

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
       <Modal transparent visible={successVisible}>
        <View style={styles.successBg}>
          <Animated.View style={[styles.successBox, { opacity: fadeAnim }]}>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Pet uploaded successfully ✅
            </Text>
          </Animated.View>
        </View>
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
  successBg: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  successBox: { backgroundColor: "#fff", padding: 20, borderRadius: 12 },
  petRow: { flexDirection: "row", alignItems: "center" },
  petImage: { width: 70, height: 70, borderRadius: 10, marginRight: 12, backgroundColor: "#ddd" },
  petImagePlaceholder: { width: 70, height: 70, borderRadius: 10, marginRight: 12, backgroundColor: "#eee", justifyContent: "center", alignItems: "center" },
  petInfo: { flex: 1 }
});
