import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { usePets } from '../context/PetsContext';
import { Ionicons } from '@expo/vector-icons'

export default function PetCard({ pet, onPress }) {
  const { getCityOfPet, toggleFavorite } = usePets();
  const city = getCityOfPet?.(pet.id);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(pet)}>
      <Image
        source={
          pet.image
            ? { uri: pet.image }
            : require('../assets/images/random.jpg')
        }
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{pet.name}</Text>

          {/* Butoni për favorite */}
          <TouchableOpacity onPress={() => toggleFavorite(pet.id, pet.favorite)}>
            <Ionicons
              name={pet.favorite ? "heart" : "heart-outline"}
              size={22}
              color={pet.favorite ? "red" : "#777"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.details}>
          {pet.age} yr{pet.age === 1 ? "" : "s"} · {city}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 12,
    width: '100%',
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    color: '#6B7280',
    fontSize: 14,
  },
});
