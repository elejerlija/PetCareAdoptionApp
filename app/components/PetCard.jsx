import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function PetCard({ pet, onPress }) {

  return (

    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(pet)}
    >
      <Image source={pet.image} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.details}>
          {pet.age} yr{pet.age === 1 ? '' : 's'} · {pet.city}
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
    width: '85%',
    marginBottom: 12
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  infoContainer: {
    marginLeft: 12
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  details: {
    color: 'gray'
  },
});
