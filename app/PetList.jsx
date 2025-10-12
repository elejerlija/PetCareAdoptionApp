import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { usePets } from './context/PetsContext';
import PetDetails from './PetDetail';
import PetCard from './components/PetCard';
import { useRouter } from 'expo-router';
import PrimaryButton from './components/PrimaryButton';


export default function PetList() {

  const [selectedPet, setSelectedPet] = useState(null);
  const { pets } = usePets();
  const router = useRouter();
  const list = Array.isArray(pets) ? pets : [];
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(true);

  if (selectedPet) {
    return <PetDetails pet={selectedPet} onBack={() => setSelectedPet(null)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet List</Text>

      <PrimaryButton
        label="+ Add Pet"
        onPress={() => router.push('/AddPet')}
        isLoading={loading}
        disabled={!formValid}
        style={{
          marginHorizontal: 110,
          marginTop: 1,
          borderRadius: 20,
          paddingVertical: 16,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      />

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
    marginTop :20,
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
  }
});
