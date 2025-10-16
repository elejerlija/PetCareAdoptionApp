import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { usePets } from '../../context/PetsContext';
import PetCard from '../../components/PetCard';
import PrimaryButton from '../../components/PrimaryButton';



export default function PetList() {
const router = useRouter();
  const { pets } = usePets();
  const list = Array.isArray(pets) ? pets : [];

  

  return (
   
    <View style={styles.container}>
      <Text style={styles.title}>Pet List</Text>

      <PrimaryButton
        title="+ Add Pet"
        onPress={() => router.push('/AddPet')}
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

     <FlatList
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        data={list}
        keyExtractor={(item, i) => (item?.id ? String(item.id) : `pet-${i}`)}
        renderItem={({ item }) => (
          <PetCard pet={item} onPress={() => router.push(`/pets/${item.id}`)} />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "gray", marginTop: 24 }}>
            No pets yet. Tap “+ Add Pet”.
          </Text>
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
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
    marginTop:30,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  }
});
