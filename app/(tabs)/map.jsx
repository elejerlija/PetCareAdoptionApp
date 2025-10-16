import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { usePets } from "../../context/PetsContext";
import { useRouter } from "expo-router";

export default function MapScreen() {
  const { stores, getPetsForStore } = usePets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.6629,
          longitude: 21.1655,
          latitudeDelta: 0.8,
          longitudeDelta: 0.8,
        }}
      >
        {stores.map((store) => {
          const petsInStore = getPetsForStore(store.id);

          return (
            <Marker key={store.id} coordinate={store.coordinate}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(`/storePets/${store.id}`)}
                style={styles.markerWrapper}
              >
                <View
                  style={[
                    styles.imagesRow,
                    { width: 40 + (petsInStore.length - 1) * 15 },
                  ]}
                >
                  {petsInStore.map((pet, index) => (
                    <Image
                      key={pet.id}
                      source={pet.image}
                      style={[styles.petImage, { left: index * 15 }]}
                    />
                  ))}
                </View>

                <View style={styles.storeLabel}>
                  <Text style={styles.storeLabelText}>{store.city}</Text>
                </View>
              </TouchableOpacity>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },

  map: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  imagesRow: {
    flexDirection: "row",
    position: "relative",
    width: 70,
    height: 40,
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "white",
    position: "absolute",
  },
  storeLabel: {
    backgroundColor: "#83BAC9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fffff0",
  },
  storeLabelText: {
    color: "white",
    fontWeight: "bold",
  },
});
