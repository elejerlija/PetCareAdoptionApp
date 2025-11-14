import { View, Text, StyleSheet, Image, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

const THEME = "#83BAC9";
const LIGHT = "#FFFFF0";
 
export default function HomeScreen() {
  const NEWS_LIST = [
    "Vaccination week is coming! 🩺",
    "Free grooming for adopted pets this month ✂️",
    "New shelter opening in Prishtina 🏥",
    "Donate a blanket — help keep pets warm this winter 🧣",
    "Low-cost microchipping available this Friday 🐾",
    "Adoption marathon coming next month 🐶",
    "Shelter volunteers needed this weekend 🤝",
  ];

  const [randomNews, setRandomNews] = useState([]);

  useEffect(() => {
    const shuffled = [...NEWS_LIST].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setRandomNews(selected);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>

      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.appTitle}>PetCare Adoption</Text>
          <Text style={styles.subtitle}>
            Welcome to the world of four-pawed friends. 🐾
          </Text>
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

        <View style={styles.newsRow}>
          <Text style={styles.newsIcon}>📰</Text>
          <Text style={styles.newsTitle}>PetCare News</Text>
        </View>

        <View style={styles.newsBox}>
          {randomNews.map((news, index) => (
            <Text key={index} style={styles.newsItem}>
              • {news}
            </Text>
          ))}
        </View>

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

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 16,
    paddingBottom: 50,
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: THEME,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#667",
    marginTop: 4,
    fontSize: 15,
    paddingHorizontal: 12,
  },

  heroImg: {
    width: "100%",
    height: 200,
    borderRadius: 24,
    marginVertical: 10,
  },

  banner: {
    backgroundColor: THEME,
    borderRadius: 20,
    padding: 14,
    marginVertical: 12,
  },
  bannerTitle: {
    color: LIGHT,
    fontWeight: "800",
    fontSize: 16,
  },
  bannerSub: {
    color: LIGHT,
    opacity: 0.95,
    marginTop: 4,
    fontSize: 13,
  },

  newsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 6,
  },
  newsIcon: {
    fontSize: 22,
    marginRight: 8,
    color: THEME,
  },
  newsTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2A3A3F",
    letterSpacing: 0.3,
  },

  newsBox: {
    backgroundColor: "#E8F5F7",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4EBEF",
    marginBottom: 22,
    shadowColor: "#83BAC9",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },

  newsItem: {
    fontSize: 16,
    color: "#2A3A3F",
    marginBottom: 8,
    lineHeight: 24,
    fontWeight: "500",
  },

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
  footerText: {
    color: "#444",
    fontSize: 13,
    marginBottom: 4,
  },
  footerEmail: {
    color: THEME,
    fontWeight: "700",
    fontSize: 14,
  },
  footerCopyright: {
    color: "#888",
    fontSize: 12,
    marginTop: 6,
  },
});
