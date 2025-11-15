import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { usePets } from "../context/PetsContext";
import { Ionicons } from "@expo/vector-icons";

export default function PetCard({ pet, onPress }) {
  const { getCityOfPet, isFavorite, toggleFavorite } = usePets();
  const city = getCityOfPet?.(pet.id);

  const fav = isFavorite(pet.id);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(pet)}>
      <Image
        source={
          pet.imageUrl
            ? { uri: pet.imageUrl }
            : require("../assets/images/random.jpg")
        }
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{pet.name}</Text>

          <TouchableOpacity onPress={() => toggleFavorite(pet.id)}>
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={25}
              color={fav ? "red" : "#777"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.details}>
          {pet.age} yr{pet.age === 1 ? "" : "s"} · {city}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFE4EC",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    color: "#6B7280",
    fontSize: 14,
  },
});
