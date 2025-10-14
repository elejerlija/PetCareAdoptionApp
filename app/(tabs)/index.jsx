import { View, Text, StyleSheet, Image, FlatList, ScrollView, Linking, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const THEME = "#83BAC9";
const LIGHT = "#FFFFF0";

const FEATURED_PETS = [
  {
    id: 1,
    name: "Max",
    type: "Dog",
    age: 3,
    image: require("../../assets/images/dog1.jpg"),
  },
  {
    id: 2,
    name: "Luna",
    type: "Cat",
    age: 2,
    image: require("../../assets/images/cat2.jpg"),
  },
];

export default function HomeScreen() {

  const featured = FEATURED_PETS;

  return (
    <SafeAreaView style={styles.safe}>
      
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.appTitle}>PetCare Adoption</Text>
          <Text style={styles.subtitle}>Welcome to the world of four-pawed friends.🐾</Text>
        </View>

        <Image
          source={require("../../assets/images/pets.jpg")}
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
          style={{ marginBottom: 24 }}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: "/pets/[id]", params: { id: String(item.id) } }}
              asChild
            >
              <Pressable style={styles.card}>
                <Image source={item.image} style={styles.cardImg} />
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardMeta}>
                  {item.type} • {item.age} yrs
                </Text>
              </Pressable>
            </Link>
          )}

        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Need help or want to get in touch?</Text>
          <Text
            style={styles.footerEmail}
            onPress={() => Linking.openURL("mailto:contact@petcareapp.com")}
          >
            📧 contact@petcareapp.com
          </Text>
          <Text style={styles.footerCopyright}>© 2025 PetCare Adoption</Text>
        </View>


        <View style={styles.authButtons}>
          <Link href="/auth/login" asChild>
            <Pressable style={styles.authBtn}>
              <Text style={styles.authBtnText}>Login</Text>
            </Pressable>
          </Link>

          <Link href="/auth/signup" asChild>
            <Pressable style={styles.authBtn}>
              <Text style={styles.authBtnText}>Sign Up</Text>
            </Pressable>
          </Link>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16, paddingBottom: 50 },

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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardImg: { width: "100%", height: 100, borderRadius: 12, backgroundColor: "#eee" },
  cardName: { fontWeight: "800", marginTop: 8, color: "#222", textAlign: "center" },
  cardMeta: { color: "#667", marginTop: 2, textAlign: "center" },

  footer: {
    marginTop: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#eef2f3",
    alignItems: "center",
    backgroundColor: LIGHT,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  footerText: { color: "#444", fontSize: 13, marginBottom: 4 },
  footerEmail: { color: THEME, fontWeight: "700", fontSize: 14 },
  footerCopyright: { color: "#888", fontSize: 12, marginTop: 6 },


   authButtons: {
    flexDirection: "row",
    justifyContent: "center",
    //gap: 12,
    marginTop: 16,
    marginBottom: 40,
  },
  authBtn: {
    borderWidth: 1,
    borderColor: THEME,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  authBtnText: {
    color: THEME,
    fontWeight: "600",
  },
  signupBtn: {
    backgroundColor: THEME,
  }
  
});
