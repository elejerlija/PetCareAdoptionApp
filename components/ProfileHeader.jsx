import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ProfileHeader = ({ photoURL, name }) => {
  return (
    <View style={styles.container}>
      <Image
        source={
          photoURL
            ? { uri: photoURL }
            : require("../assets/images/pets.jpg")
        }
        style={styles.avatar}
      />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};


export default React.memo(ProfileHeader);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
  },
});
