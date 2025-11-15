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

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

import { usePets } from "../../context/PetsContext";
import PetCard from "../../components/PetCard";
import { useRouter } from "expo-router";

const MODAL_ANIMATION_DELAY = 300;

export default function MapScreen() {
  const { stores, pets, getPetsForStore } = usePets();
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

  // CSS FIX
  const leafletCSS = `
    html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
    }
    .leaflet-map {
      width: 100% !important;
      height: 100% !important;
      position: absolute;
      top: 0; 
      left: 0;
      right: 0;
      bottom: 0;
    }
  `;

  return (
    <View style={styles.container}>
      {/* Insert CSS */}
      <style>{leafletCSS}</style>

      {/* MAP */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 0,
        }}
      >
        <MapContainer
          center={[42.6629, 21.1655]}
          zoom={8}
          className="leaflet-map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {stores.map((store) => (
            <Marker
              key={store.id}
              position={[store.coordinate.latitude, store.coordinate.longitude]}
              icon={L.divIcon({
                className: "",
                html: `
                  <div style="display:flex;flex-direction:column;align-items:center;">
                    ${
                      store.logoUrl
                        ? `<img
                             src="${store.logoUrl}"
                             style="
                               width:50px;
                               height:50px;
                               border-radius:25px;
                               border:2px solid white;
                               box-shadow:0px 2px 4px rgba(0,0,0,0.3);
                             "
                           />`
                        : `<div
                             style="
                               width:50px;
                               height:50px;
                               border-radius:25px;
                               background:#ccc;
                               border:2px solid white;
                             "
                           ></div>`
                    }
                    <div style="
                      width:0;
                      height:0;
                      border-left:6px solid transparent;
                      border-right:6px solid transparent;
                      border-top:10px solid #fffff0;
                      margin-top:-2px;
                    "></div>
                  </div>
                `,
                iconSize: [50, 60],
                iconAnchor: [25, 60],
              })}
              eventHandlers={{
                click: () => handleStorePress(store),
              }}
            />
          ))}
        </MapContainer>
      </div>

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
              {selectedStore?.logoUrl && (
                <Image
                  source={{ uri: selectedStore.logoUrl }}
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
              contentContainerStyle={{ paddingBottom: 20 }}
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
    width: "90%", // ← ADD THIS
    alignSelf: "center", // ← CENTER IT
  },
  cardWrapper: {
    width: "100%",
    alignItems: "stretch",
  },
  modalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  modalStoreLogo: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
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
