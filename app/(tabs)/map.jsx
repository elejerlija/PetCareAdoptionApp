import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { usePets } from "../../context/PetsContext";
import PetCard from "../../components/PetCard";
import { useRouter } from "expo-router";

export default function MapScreen() {
  const { stores, getPetsForStore } = usePets();
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: 42.6629,
    longitude: 21.1655,
    latitudeDelta: 0.8,
    longitudeDelta: 0.8,
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const showText = region.latitudeDelta < 0.5;

  const handleStorePress = (store) => {
    setSelectedStore(store);
    setModalVisible(true);
  };

  const handlePetPress = (petId) => {
    setModalVisible(false);
    setTimeout(() => {
      router.push(`/pets/${petId}`);
    }, 300); // wait for modal animation to finish
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {stores.map((store) => (
          <Marker key={store.id} coordinate={store.coordinate}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleStorePress(store)}
              style={styles.markerWrapper}
            >
              <View style={styles.pin}>
                <Image source={store.logo} style={styles.storeLogo} />
                <View style={styles.pinPoint} />
              </View>
              {showText && (
                <View style={styles.storeLabel}>
                  <Text style={styles.storeLabelText}>{store.name}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Marker>
        ))}
      </MapView>

      {/* Modal for pets */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header with store logo and name */}
            <View style={styles.modalHeader}>
              {selectedStore?.logo && (
                <Image
                  source={selectedStore.logo}
                  style={styles.modalStoreLogo}
                />
              )}
              <Text style={styles.modalTitle}>{selectedStore?.name} Pets</Text>
            </View>

            <FlatList
              data={selectedStore ? getPetsForStore(selectedStore.id) : []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.cardWrapper}>
                  <PetCard pet={item} onPress={() => handlePetPress(item.id)} />
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              contentContainerStyle={{ alignItems: "center" }}
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
  markerWrapper: { alignItems: "center", justifyContent: "center" },
  pin: { alignItems: "center", justifyContent: "center" },
  storeLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
  pinPoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fffff0",
    transform: [{ rotate: "180deg" }],
    marginTop: -2,
  },
  storeLabel: {
    backgroundColor: "#83BAC9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fffff0",
    marginTop: 4,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
      },
    }),
  },
  storeLabelText: { color: "white", fontWeight: "bold", textAlign: "center" },

  // Modal styles
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  cardWrapper: {
    width: "85%", // same width as PetCard
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#83BAC9",
    borderRadius: 10,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
