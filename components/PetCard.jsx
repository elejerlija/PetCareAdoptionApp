import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { usePets } from '../context/PetsContext';

export default function PetCard({ pet, onPress }) {
  const { getCityOfPet } = usePets();
  const city = getCityOfPet?.(pet.id);
  const imgSource =
    typeof pet.image === "string" && pet.image
      ? { uri: pet.image }
      : pet.image || null;
  return (

    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(pet)}
    >
      <Image source={pet.image} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{pet.name}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.details}>
            {pet.age} yr{pet.age === 1 ? '' : 's'} · {city}
          </Text>

        </View>
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
    width: '85%',
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  details: {
    color: 'gray'
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  details: {
    color: '#6B7280',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    minWidth: 80,
    alignItems: 'center'
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  }

});
