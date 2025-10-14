import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.6629,
          longitude: 21.1655,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        <Marker
          coordinate={{ latitude: 42.66113710667629, longitude: 21.164697424961172 }}
          title="Pet Store Prishtina"
          description="Pet supplies and adoption center"
        />
        <Marker
          coordinate={{ latitude: 42.4689406630234, longitude: 21.475182515134378 }}
          title="Pet Store Gjilan"
          description="Pet supplies and adoption center"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
