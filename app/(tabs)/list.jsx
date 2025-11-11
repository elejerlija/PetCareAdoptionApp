import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { usePets } from '../../context/PetsContext';
import PetCard from '../../components/PetCard';
import PrimaryButton from '../../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PetList() {
  const router = useRouter();
  const { pets, loadingPets } = usePets();
  const [showFavorites, setShowFavorites] = useState(false);


  const filteredList = Array.isArray(pets)
    ? pets
        .filter(p => p.available !== false)          
        .filter(p => (showFavorites ? p.favorite : true)) 
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pet List</Text>

      {/* Buton për me ndërru filtrin */}
      <PrimaryButton
        title={showFavorites ? "Show All" : "Show Favorites ❤️"}
        onPress={() => setShowFavorites(prev => !prev)}
        style={{ alignSelf: 'center', marginBottom: 12 }}
      />

      {loadingPets ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          data={filteredList}             
          keyExtractor={(item, i) => item?.id ?? `pet-${i}`}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              onPress={() => router.push(`/pets/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {showFavorites ? "No favorite pets yet." : "No pets yet."}
            </Text>
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
    marginBottom: 16,
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
