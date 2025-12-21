import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { usePets } from "../../context/PetsContext";
import PetCard from "../../components/PetCard";
import { useRouter } from "expo-router";

const MODAL_ANIMATION_DELAY = 300;

export default function MapScreen() {
  const { stores, getPetsForStore } = usePets();
  const router = useRouter();

  const [selectedStore, setSelectedStore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);
      setLoadingLocation(false);
    })();
  }, []);

  const centerOnUser = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);

      mapRef.current?.animateToRegion(
        {
          ...coords,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        700
      );
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  const handleStorePress = (store) => {
    setSelectedStore(store);
    setModalVisible(true);
  };

  const handlePetPress = (petId) => {
    setModalVisible(false);
    setTimeout(() => router.push(`/pets/${petId}`), MODAL_ANIMATION_DELAY);
  };

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#83BAC9" />
        <Text>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={false}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {/* STORE MARKERS */}
        {stores
          .filter((store) => store && store.logo)
          .map((store) => (
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
                  source={{ uri: store?.logo }}
                  style={styles.markerImage}
                />
                <View style={styles.markerArrow} />
              </View>
            </Marker>
          ))}
      </MapView>

      <Pressable style={styles.locateBtn} onPress={centerOnUser}>
        <Text style={styles.locateBtnText}>📍</Text>
      </Pressable>

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
                source={{ uri: selectedStore?.logo }}
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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

  locateBtn: {
    position: "absolute",
    bottom: 90,
    right: 15,
    backgroundColor: "#FFFFF0",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  locateBtnText: {
    fontSize: 24,
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
