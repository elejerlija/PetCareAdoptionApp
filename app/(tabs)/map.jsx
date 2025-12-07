import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
} from "react-native";

import MapView, { Marker } from "react-native-maps";

import { usePets } from "../../context/PetsContext";
import PetCard from "../../components/PetCard";
import { useRouter } from "expo-router";

const placeholderLogo = require("../../public/storeImages/placeholder.jpg");
const MODAL_ANIMATION_DELAY = 300;

export default function MapScreen() {
  const { stores, getPetsForStore } = usePets();
  const router = useRouter();

  const [selectedStore, setSelectedStore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStorePress = (store) => {
    setSelectedStore(store);
    setModalVisible(true);
  };

  const handlePetPress = (petId) => {
    setModalVisible(false);
    setTimeout(() => router.push(`/pets/${petId}`), MODAL_ANIMATION_DELAY);
  };

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.6629,
          longitude: 21.1655,
          latitudeDelta: 0.4,
          longitudeDelta: 0.4,
        }}
      >
        {stores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{
              latitude: store.coordinate.latitude,
              longitude: store.coordinate.longitude,
            }}
            onPress={() => handleStorePress(store)}
          >
            <View style={styles.markerContainer}>
              <Image
                source={
                  store.logo
                    ? { uri: store.logo } // Firestore GitHub URL
                    : placeholderLogo // Local fallback
                }
                style={styles.markerImage}
              />
              <View style={styles.markerArrow} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Image
                source={
                  selectedStore?.logo
                    ? { uri: selectedStore.logo }
                    : placeholderLogo
                }
                style={styles.modalStoreLogo}
              />

              <Text style={styles.modalTitle}>{selectedStore?.name} Pets</Text>
            </View>

            <FlatList
              data={selectedStore ? getPetsForStore(selectedStore.id) : []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PetCard pet={item} onPress={() => handlePetPress(item.id)} />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  markerContainer: { alignItems: "center" },

  markerImage: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },

  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
    marginTop: -2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },

  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  modalStoreLogo: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  closeButton: {
    backgroundColor: "#83BAC9",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 15,
  },

  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
