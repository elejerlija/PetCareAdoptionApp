import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { usePets } from '../../context/PetsContext';
import PetCard from '../../components/PetCard';
import PrimaryButton from '../../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PetList() {
  const router = useRouter();
  const { pets } = usePets();
  const list = Array.isArray(pets) ? pets : [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pet List</Text>

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
            No pets yet.
          </Text>
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'center',
    paddingLeft: 55,
    paddingBottom: 14,
  },
  title: {
    paddingRight :55,
    marginTop: 30,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  scrollArea: {
    flex: 1,
    marginTop: 10,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 100,     
  },
  });

