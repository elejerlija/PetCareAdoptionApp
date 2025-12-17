import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import { useLocalSearchParams } from 'expo-router';
import { usePets } from '../../context/PetsContext';

export default function PetDetailsRoute() {
  const params = useLocalSearchParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId;

  const { getPetById, adoptPet, getCityOfPet, getAdoptionStatus } = usePets();
  const pet = getPetById?.(id);
  const adoptionStatus = getAdoptionStatus?.(id);
  const aboutText = pet.description ?? pet.desc ?? "";
  const isAvailable = pet.available !== false;
  const isPending = adoptionStatus === "pending";
  const isApproved = adoptionStatus === "approved";
  const canAdopt = isAvailable && !isPending && !isApproved;
  const scaleAdopt = useRef(new Animated.Value(1)).current;

  const animateAdoptPress = () => {
    Animated.sequence([
      Animated.timing(scaleAdopt, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAdopt, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };


  if (!pet) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyWrap}>
          <Text style={{ color: 'gray' }}>Pet not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const imgSource =
    typeof pet.imageUrl === "string" && (pet.imageUrl.startsWith("http") || pet.imageUrl.startsWith("data:image"))
      ? { uri: pet.imageUrl }
      : require("../../assets/images/random.jpg");


  const handleAdopt = async () => {
    try {
      console.log("CALLING ADOPT WITH ID:", pet.id);

      await adoptPet?.(pet.id);

      console.log("ADOPT SUCCESS");

      if (Platform.OS === "web") {
        window.alert("Your adoption request has been sent and is pending approval.");
      } else {
        Alert.alert("Request Sent", "Your adoption request is now pending.");
      }

    } catch (err) {
      console.log("ADOPT ERROR:", err);
      Alert.alert("ERROR", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {imgSource && <Image source={imgSource} style={styles.image} />}

        <Text style={styles.name}>{pet.name}</Text>

        <Text
          style={[
            styles.status,
            adoptionStatus === "pending"
              ? { color: "#e6a100" }
              : adoptionStatus === "approved"
                ? { color: "green" }
                : isAvailable
                  ? { color: "green" }
                  : { color: "red" },
          ]}
        >
          {adoptionStatus === "pending"
            ? "Pending approval"
            : adoptionStatus === "approved"
              ? "Approved"
              : isAvailable
                ? "Available"
                : "Not Available"}
        </Text>

        <Text style={styles.details}>Age: {pet.age} yr</Text>
        <Text style={styles.details}>City: {getCityOfPet(pet.id)}</Text>

        <Text style={styles.aboutTitle}>About</Text>
        <Text style={styles.aboutText}>{aboutText}</Text>

        <View style={styles.buttonsContainer}>
          <Animated.View style={{ transform: [{ scale: scaleAdopt }] }}>
            <PrimaryButton
              title={
                isPending
                  ? "Pending..."
                  : isApproved
                    ? "Approved"
                    : isAvailable
                      ? "Adopt"
                      : "Not available"
              }
              onPress={() => {
                animateAdoptPress();
                handleAdopt();
              }}
              disabled={!canAdopt}
            />
          </Animated.View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold'
  },
  details: {
    fontSize: 16,
    color: 'gray'
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  aboutText: {
    fontSize: 16,
    textAlign: 'left',
    marginTop: 8,
    width: '100%',
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 28,
    paddingHorizontal: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 6,
  },
  pendingStatus: {
    color: "#e6a100",
  },
  approvedStatus: {
    color: "green",
  },
  notAvailableStatus: {
    color: "red",
  },

});
