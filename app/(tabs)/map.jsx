import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
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
        <Marker coordinate={{ latitude: 42.3122, longitude: 21.3964 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', marginBottom: -10 }}>
              <Image
                source={require('../../assets/images/dog1.jpg')}
                style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: 'white' }}
              />
              <Image
                source={require('../../assets/images/cat1.jpg')}
                style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: 'white', marginLeft: -10 }}
              />
              <Image
                source={require('../../assets/images/dog2.jpg')}
                style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: 'white', marginLeft: -10 }}
              />
            </View>
            <View style={{
              backgroundColor: '#83BAC9',
              padding: 5,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#fffff0',
            }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Kaçanik</Text>
            </View>
          </View>
        </Marker>

        <Marker
          coordinate={{ latitude: 42.4122, longitude: 20.9512 }}
          title="Pet Store Malishevë"
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
