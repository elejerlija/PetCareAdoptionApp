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
} from "react-native";
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
