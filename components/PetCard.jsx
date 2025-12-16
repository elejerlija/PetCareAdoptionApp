import React,{useEffect,useRef} from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity,Animated,Easing } from "react-native";
import { usePets } from "../context/PetsContext";
import { Ionicons } from "@expo/vector-icons";

const fallbackImg = require("../assets/images/random.jpg");

function resolveImageSource(pet) {
  const u = pet?.imageUrl;

  if (typeof u === "string" && (u.startsWith("http") || u.startsWith("data:image"))) {
    return { uri: u };
  }

  return fallbackImg;
}

function PetCard({ pet, onPress ,index}) {
  const { getCityOfPet, isFavorite, toggleFavorite } = usePets();
  const city = getCityOfPet?.(pet.id);
  const fav = isFavorite(pet.id);
  const imgSource=resolveImageSource(pet);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  
 useEffect(() => {
  fadeAnim.setValue(0);
  slideAnim.setValue(16);

  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      delay:index*25,
      useNativeDriver: true,
    }),
    Animated.timing(slideAnim, {
      toValue: 0,
      duration:  900,
      delay:index*25,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
  ]).start();
}, [pet.id]);


  return (
   <Animated.View
    style={[
      styles.card,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
        <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center" }}
      activeOpacity={0.8}
      onPress={() => onPress(pet.id)}
    >
      <Image
        source={imgSource}
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
    </Animated.View>
  );
}
export default React.memo(PetCard);

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
