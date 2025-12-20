import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePets } from '../../context/PetsContext';
import PetCard from '../../components/PetCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';



export default function PetList() {
  const router = useRouter();
  const { pets, loadingPets, isFavorite, loadingFavorites } = usePets();
  const [showFavorites, setShowFavorites] = useState(false);
  const scaleAll = useSharedValue(1);
  const scaleFav = useSharedValue(1);

  const allStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAll.value }],
  }));

  const favStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleFav.value }],
  }));

  const press = (scale) => {
    scale.value = withSpring(0.92, {
      stiffness: 300,
      damping: 18,
    });

    scale.value = withSpring(1, {
      stiffness: 300,
      damping: 18,
    });
  };

  const handlePress = useCallback(
    (id) => {
      router.push(`/pets/${id}`);
    },
    [router]
  );

  const filteredList = useMemo(() => {
    if (!Array.isArray(pets)) return [];

    return pets
      .filter(p => p.available !== false)
      .filter(p => (showFavorites ? isFavorite(p.id) : true));
  }, [pets, showFavorites, isFavorite]);


  const isLoading = loadingPets || loadingFavorites;

  return (
    <SafeAreaView style={styles.container}>

      <View
        style={{
          marginTop: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 30,
        }}
      >
        <Animated.View style={allStyle}>
          <TouchableOpacity
            style={{
              backgroundColor: showFavorites ? '#E5E7EB' : '#D1D5DB',
              paddingVertical: 6,
              paddingHorizontal: 18,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
            onPress={() => {
              press(scaleAll);
              setShowFavorites(false);
            }}
          >
            <Ionicons name="paw-outline" size={18} color="#6B7280" />
            <Text style={{ color: '#374151', fontWeight: '600' }}>All Pets</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={favStyle}>
          <TouchableOpacity
            style={{
              backgroundColor: showFavorites ? '#FFE4EC' : '#F9DDE7',
              paddingVertical: 6,
              paddingHorizontal: 18,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
            onPress={() => {
              press(scaleFav);
              setShowFavorites(true);
            }}
          >
            <Ionicons name="heart" size={18} color="#E11D48" />
            <Text style={{ color: '#E11D48', fontWeight: '600' }}>Favorites</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          data={filteredList}
          keyExtractor={(item, i) => item?.id ?? `pet-${i}`}
          renderItem={({ item, index }) => (
            <PetCard
              pet={item}
              index={index}
              onPress={handlePress}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {showFavorites ? 'No favorite pets yet.' : 'No pets yet.'}
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
