import { View, Text, StyleSheet, Image, ScrollView, Linking, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useRef } from "react";

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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const imageScale = useRef(new Animated.Value(0.75)).current;
  const newsFade = useRef(new Animated.Value(0)).current;
  const newsSlide = useRef(new Animated.Value(40)).current;

  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const shuffled = [...NEWS_LIST].sort(() => 0.5 - Math.random());
    setRandomNews(shuffled.slice(0, 3));

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.parallel([
        Animated.timing(newsFade, {
          toValue: 1,
          duration: 900,
          delay: 450,
          useNativeDriver: true,
        }),
        Animated.timing(newsSlide, {
          toValue: 0,
          duration: 900,
          delay: 450,
          useNativeDriver: true,
        }),
      ]).start();
    }, 150);

    
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();

    setTimeout(() => {
      setLoadingNews(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>

          <View style={styles.header}>
            <Text style={styles.appTitle}>PetCare Adoption</Text>
            <Text style={styles.subtitle}>
              Welcome to the world of four-pawed friends. 🐾
            </Text>
          </View>

       
          <Animated.Image
            source={require("../../assets/images/pets.jpg")}
            style={[
              styles.heroImg,
              {
                transform: [{ scale: imageScale }],
              },
            ]}
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

      
          {loadingNews && (
            <View style={styles.skeletonBox}>
              {[1, 2, 3].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.skeletonItem,
                    {
                      opacity: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {!loadingNews && (
            <Animated.View
              style={[
                styles.newsBox,
                {
                  opacity: newsFade,
                  transform: [{ translateY: newsSlide }],
                },
              ]}
            >
              {randomNews.map((news, index) => (
                <Text key={index} style={styles.newsItem}>
                  • {news}
                </Text>
              ))}
            </Animated.View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Need help or want to get in touch?</Text>
            <Text
              style={styles.footerEmail}
              onPress={() => Linking.openURL("mailto:contact@petcareapp.com")}
            >
              📧 contact@petcareapp.com
            </Text>
            <Text style={styles.footerCopyright}>
              © 2025 PetCare Adoption
            </Text>
          </View>

        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16, paddingBottom: 50 },

  header: { alignItems: "center", marginTop: 8, marginBottom: 10 },
  appTitle: { fontSize: 26, fontWeight: "800", color: THEME },
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
  bannerTitle: { color: LIGHT, fontWeight: "800", fontSize: 16 },
  bannerSub: { color: LIGHT, opacity: 0.95, marginTop: 4, fontSize: 13 },

  newsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 6,
  },
  newsIcon: { fontSize: 22, marginRight: 8, color: THEME },
  newsTitle: { fontSize: 19, fontWeight: "700", color: "#2A3A3F" },


  skeletonBox: {
    backgroundColor: "#E8F5F7",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4EBEF",
    marginBottom: 22,
  },
  skeletonItem: {
    height: 18,
    backgroundColor: "#DDECEF",
    borderRadius: 8,
    marginBottom: 12,
  },


  newsBox: {
    backgroundColor: "#E8F5F7",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4EBEF",
    marginBottom: 22, 
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
  }, 
  footerText: { color: "#444", fontSize: 13, marginBottom: 4 },
  footerEmail: { color: THEME, fontWeight: "700", fontSize: 14 },
  footerCopyright: { color: "#888", fontSize: 12, marginTop: 6 },
});
