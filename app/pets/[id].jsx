import React from 'react';
import { View, Text, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import { useLocalSearchParams } from 'expo-router';
import { usePets } from "../../context/PetsContext";

export default function PetDetailsRoute() {
  const { id } = useLocalSearchParams();    
  const { getPetById ,adoptPet} = usePets();
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
    typeof pet.image === "string" && pet.image
      ? { uri: pet.image }
      : pet.image || null;

const handleAdopt = () => {                      
    adoptPet?.(pet.id);
    Alert.alert('Adopted 🐾', `${pet.name} u adoptua me sukses!`);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Image source={pet.image} style={styles.image} />
        <Text style={styles.name}>{pet.name}</Text>

        <Text
          style={[
            styles.status,
            { color: pet.available ? 'green' : 'red' },
          ]}
        >
          {pet.available ? 'Available' : 'Not available'}
        </Text>

        <Text style={styles.details}>Age: {pet.age} yr</Text>
        <Text style={styles.details}>{pet.city}</Text>

        <Text style={styles.aboutTitle}>About</Text>
        <Text style={styles.aboutText}>{pet.desc}</Text>

        <View style={styles.buttonsContainer}>
      
          <PrimaryButton
            label="Adopt"
            onPress={handleAdopt}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 60, 
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    marginVertical: 6,
  },
  details: {
    fontSize: 16,
    color: 'gray',
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  aboutText: {
    fontSize: 16,
    textAlign: 'left',
    marginTop: 8,
    width: '100%',
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 28,
        gap: 12,
  },
});
