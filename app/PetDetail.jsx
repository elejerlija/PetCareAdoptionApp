import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function PetDetails({ pet,onBack  }) {
  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'gray' }}>No pet selected</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
<Image source={pet.image} style={styles.image} />
      <Text style={styles.status}>
        {pet.available ? 'Available' : 'Not available'}
      </Text>
      <Text style={styles.details}>Age: {pet.age} yr</Text>
      <Text style={styles.details}>{pet.city}</Text>

      <Text style={styles.aboutTitle}>About</Text>
      <Text style={styles.aboutText}>{pet.about}</Text>
  <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc', marginTop: 40 }]} onPress={onBack}>
        <Text style={[styles.buttonText, { color: 'black' }]}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Adopt</Text>
      </TouchableOpacity>
     
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
    color: 'green',
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
  button: {
    backgroundColor: '#70b4f8',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginTop: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
