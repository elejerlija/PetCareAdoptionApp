import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PetDetails from './PetDetail';

export default function PetList() {
  const [selectedPet, setSelectedPet] = useState(null);

  const pets = [
    {
      name: 'Luna',
      age: 2,
      city: 'Cityville',
      image: 'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg',
      about: 'Luna is a friendly and playful cat looking for a loving home.',
      available: true,
    },
    {
      name: 'Bella',
      age: 4,
      city: 'Petburg',
      image: 'https://cdn.pixabay.com/photo/2018/01/03/09/09/dog-3050363_1280.jpg',
      about: 'Bella is full of energy and loves going for walks.',
      available: false,
    },
  ];

  if (selectedPet) {
    return <PetDetails pet={selectedPet} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet List</Text>

      {pets.map((pet, index) => (
        <TouchableOpacity key={index} style={styles.card} onPress={() => setSelectedPet(pet)}>
          <Image source={{ uri: pet.image }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{pet.name}</Text>
            <Text style={styles.details}>{pet.age} yr · {pet.city}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 12,
    width: '85%',
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    color: 'gray',
  },
});
