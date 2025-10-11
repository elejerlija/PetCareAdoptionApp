import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { usePets } from './context/PetsContext';
import PetDetails from './PetDetail';
import PetCard from './components/PetCard';
import { useRouter } from 'expo-router';

export default function PetList() {
  const [selectedPet, setSelectedPet] = useState(null);
  const { pets } = usePets();
  const router = useRouter();
  const list = Array.isArray(pets) ? pets : [];

  if (selectedPet) {
    return <PetDetails pet={selectedPet} onBack={() => setSelectedPet(null)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet List</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/AddPet')}
      >
        <Text style={styles.addButtonText}>+ Add Pet</Text>
      </TouchableOpacity>

      {/* 🔹 ScrollView me layout vertikal normal */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {list.map((pet) => (
          <PetCard key={pet.id} pet={pet} onPress={setSelectedPet} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center', 
    paddingBottom: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    alignSelf: 'center',
    backgroundColor: '#70b4f8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
