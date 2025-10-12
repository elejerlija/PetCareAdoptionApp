import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { usePets } from "./context/PetsContext";

const THEME = "#83BAC9";
const LIGHT = "#FFFFF0";

const FEATURED_PETS = [
  {
    id: "max",
    name: "Max",
    type: "Dog",
    age: 3,
    image: require("../assets/images/dog1.jpg"),
  },
  {
    id: "luna",
    name: "Luna",
    type: "Cat",
    age: 2,
    image: require("../assets/images/cat2.jpg"),
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const featured = FEATURED_PETS;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.appTitle}>PetCare Adoption</Text>
          <Text style={styles.subtitle}>Welcome to the world of four-pawed friends.🐾</Text>
        </View>

        <Image
          source={require("../assets/images/pets.jpg")}
          style={styles.heroImg}
          resizeMode="cover"
        />

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Adoptathon this weekend!</Text>
          <Text style={styles.bannerSub}>
            Discounts on vaccinations for new adoptions. Visit your nearest center!
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Featured</Text>
        <FlatList
          data={featured}
          horizontal
          keyExtractor={(item) => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: "/PetDetail", params: { id: item.id } })}
            >
              <Image source={item.image} style={styles.cardImg} />
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardMeta}>
                {item.type} • {item.age} yrs
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={{ padding: 16 }}>
              <Text style={{ color: "#666" }}>No animals to show yet.</Text>
            </View>
          }
          style={{ marginBottom: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16, paddingBottom: 28 },
  header: { marginBottom: 12 },
  appTitle: { fontSize: 24, fontWeight: "800", color: THEME, textAlign: "center" },
  subtitle: { textAlign: "center", color: "#667", marginTop: 4, fontSize: 14 },

  heroImg: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginVertical: 10,
  },

  banner: {
    backgroundColor: THEME,
    borderRadius: 18,
    padding: 14,
    marginVertical: 12,
  },
  bannerTitle: { color: LIGHT, fontWeight: "800", fontSize: 16 },
  bannerSub: { color: LIGHT, opacity: 0.95, marginTop: 4, fontSize: 13 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 10,
    color: "#223",
  },

  card: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef2f3",
    padding: 10,
  },
  cardImg: { width: "100%", height: 100, borderRadius: 12, backgroundColor: "#eee" },
  cardName: { fontWeight: "800", marginTop: 8, color: "#222" },
  cardMeta: { color: "#667", marginTop: 2 },
});
