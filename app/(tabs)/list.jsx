import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { usePets } from '../../context/PetsContext';
import PetCard from '../../components/PetCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PetList() {
  const router = useRouter();
  const { pets, loadingPets } = usePets();
 
const list = Array.isArray(pets)
  ? pets.filter(p => p.available !== false) 
  : [];

  return (
    
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.title}>Pet List</Text>
      

      {loadingPets ? (
        <ActivityIndicator style={{ marginTop: 20 }} />

      ) 
      : (
        
        <FlatList
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          data={list}
          keyExtractor={(item, i) => (item?.id ? String(item.id) : `pet-${i}`)}
          renderItem={({ item }) => (
            <PetCard pet={item} onPress={() => router.push(`/pets/${item.id}`)} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No pets yet.</Text>
          }
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,  
    paddingBottom: 14,
  },
  title: {
    marginTop: 30,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 24,
    fontSize: 16,
  },
  separator: {
    height: 16,
  },
});
