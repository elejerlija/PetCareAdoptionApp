import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePets } from './context/PetsContext';
import PetDetails from './PetDetail';
import PetCard from './components/PetCard';

export default function PetList() {
  const [selectedPet, setSelectedPet] = useState(null);
const { pets } = usePets();
const list = Array.isArray(pets) ? pets : []; 
  

if (selectedPet) {
  return <PetDetails pet={selectedPet} onBack={() => setSelectedPet(null)} />;
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet List</Text>

     {list.map((pet) => (
  <PetCard key={pet.id} pet={pet} onPress={setSelectedPet} />
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
});
