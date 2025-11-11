import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { usePets } from '../../context/PetsContext';
import PetCard from '../../components/PetCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'

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
   
<View
  style={{
    marginTop :50,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  }}
>
  
  <TouchableOpacity
    style={{
      backgroundColor: '#E5E7EB',
      paddingVertical: 6,
      paddingHorizontal: 18,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    }}
    onPress={() => setShowFavorites(false)} 
  >
    <Ionicons name="paw-outline" size={18} color="#6B7280" />
    <Text style={{ color: '#374151', fontWeight: '600' }}>All Pets</Text>
  </TouchableOpacity>


  <TouchableOpacity
    style={{
      backgroundColor: '#FFE4EC',
      paddingVertical: 6,
      paddingHorizontal: 18,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    }}
    onPress={() => setShowFavorites(true)} 
  >
    <Ionicons name="heart" size={18} color="#E11D48" />
    <Text style={{ color: '#E11D48', fontWeight: '600' }}>Favorites </Text>
  </TouchableOpacity>
</View>


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
    backgroundColor: '#F4F6FA',
    paddingHorizontal: 20,
    paddingBottom: 14,
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

