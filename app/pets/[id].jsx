import React from 'react';
import { View, Text, Image, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import { useLocalSearchParams } from 'expo-router';
import { usePets } from "../../context/PetsContext";

export default function PetDetailsRoute() {
  const params = useLocalSearchParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id; // ✅ normalizo id
  const id = rawId; // ose Number(rawId) nëse ids janë numra në data

  const { getPetById, adoptPet, getCityOfPet } = usePets();
  const pet = getPetById?.(id);

  if (!pet) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyWrap}>
          <Text style={{ color: "gray" }}>Pet not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const imgSource =
    typeof pet.image === "string" && pet.image ? { uri: pet.image } : pet.image || null;

  const handleAdopt = () => {
    if (Platform.OS === 'web') {
      window.alert(`${pet.name} was successfully adopted!`);
      adoptPet?.(pet.id); // ✅ ndrysho state
      return;
    }
    Alert.alert(
      "Adopted 🐾",
      `${pet.name} was successfully adopted!`,
      [{ text: "OK", onPress: () => adoptPet?.(pet.id) }],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Image source={imgSource} style={styles.image} /> {/* ✅ përdor imgSource */}
        <Text style={styles.name}>{pet.name}</Text>

        <Text style={[styles.status, { color: pet.available ? 'green' : 'red' }]}>
          {pet.available ? 'Available' : 'Not available'}
        </Text>

        <Text style={styles.details}>Age: {pet.age} yr</Text>
        <Text style={styles.details}>City: {getCityOfPet(pet.id)}</Text>

        <Text style={styles.aboutTitle}>About</Text>
        <Text style={styles.aboutText}>{pet.desc}</Text>

        <View style={styles.buttonsContainer}>
          <PrimaryButton
            label={pet.available ? "Adopt" : "Not available"}
            onPress={handleAdopt}
            disabled={!pet.available} // ✅ çaktivizo kur është adoptuar
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', paddingTop: 24, paddingHorizontal: 20, paddingBottom: 60 },
  image: { width: '100%', height: 260, borderRadius: 12, marginBottom: 20, resizeMode: 'cover' },
  name: { fontSize: 26, fontWeight: 'bold' },
  status: { fontSize: 16, marginVertical: 6 },
  details: { fontSize: 16, color: 'gray' },
  aboutTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, alignSelf: 'flex-start' },
  aboutText: { fontSize: 16, textAlign: 'left', marginTop: 8, width: '100%', lineHeight: 22 },
  buttonsContainer: { width: '100%', marginTop: 28, gap: 12 },
});
