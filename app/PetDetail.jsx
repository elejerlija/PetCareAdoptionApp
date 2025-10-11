import React from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import PrimaryButton from './components/PrimaryButton';

export default function PetDetails({ pet, onBack }) {
  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'gray' }}>No pet selected</Text>
      </View>
    );
  }

  const handleAdopt = () => {
    Alert.alert('Adopted 🐾', `${pet.name} u adoptua me sukses!`);
    if (onBack) onBack();
  };

  return (
    <View style={styles.container}>
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
      <Text style={styles.aboutText}>{pet.about}</Text>

      <View style={styles.buttonsContainer}>
        {/* BACK BUTTON */}
        <PrimaryButton
          label="Back"
          onPress={onBack}
          style={{ backgroundColor: '#ccc' }}
        />

        {/* ADOPT BUTTON */}
        <PrimaryButton
          label="Adopt"
          onPress={handleAdopt}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: '#fff',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    marginVertical: 4,
  },
  details: {
    fontSize: 16,
    color: 'gray',
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  aboutText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 8,
  },
  buttonsContainer: {
    width: '80%',
    marginTop: 40,
    gap: 16,
  },
});
