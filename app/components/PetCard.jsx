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

  <View style={styles.metaRow}>
    <Text style={styles.details}>
      {pet.age} yr{pet.age === 1 ? '' : 's'} · {pet.city}
    </Text>

    <View
      style={[
        styles.badge,
        { backgroundColor: pet.available ? '#DCFCE7' : '#FEE2E2' },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: pet.available ? '#16A34A' : '#DC2626' },
        ]}
      >
        {pet.available ? 'Available' : 'Not available'}
      </Text>
    </View>
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
  alignItems: 'center'},
badgeText: {
  fontSize: 12,
  fontWeight: '600',
}

});
