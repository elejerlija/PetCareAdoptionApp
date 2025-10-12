import React, { useState } from 'react';
import {
  View,
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import InputField from './components/InputField';
import PrimaryButton from './components/PrimaryButton';

const bgImage = require('../assets/images/bg.profile.webp');


export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const onSave = () =>
    Alert.alert('Profile Saved', 'Your profile information has been updated.');

  return (
    <ImageBackground source = {bgImage} style = {styles.bg} resizeMode='cover'>
      <View style = {styles.overlay} />
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={[styles.container, styles.centerContent]}
            keyboardShouldPersistTaps="handled">
            <View style={[styles.header, styles.blockWidth]}>
           <Image source = {{}} style = {styles.avatar}/>
              <Text style={styles.title}>My Profile</Text>
              <Text style={styles.subtitle}>
                Manage your personal information below
              </Text>
            </View>

            <View style={[styles.card, styles.blockWidth]}>
              <Text style={styles.cardTitle}>About the app</Text>
              <Text style={styles.cardBody}>
                Pet Care & Adoption helps you connect with pets for adoption and
                learn how to take better care of them.
              </Text>
              <View style={styles.versionRow}>
                <Text style={styles.versionLabel}>Version</Text>
                <Text style={styles.versionValue}>v0.1.0</Text>
              </View>
            </View>

            <View style={[styles.card, styles.blockWidth]}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <InputField
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
              <InputField
                label="Email"
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
              />
              <InputField
                label="City"
                placeholder="Enter your city"
                value={city}
                onChangeText={setCity}
              />
              <InputField
                label="Phone Number"
                placeholder="+383 xx xxx xxx"
                value={phone}
                onChangeText={setPhone}
              />
              <InputField
                label="Bio"
                placeholder="Write something about yourself"
                value={bio}
                onChangeText={setBio}
              />
              <PrimaryButton title="Save Changes" onPress={onSave} />
            </View>

            <View style={{ height: 50 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>

  </ImageBackground>
  );
}

const styles = StyleSheet.create({

  bg: {flex: 1,
    
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 23, 33, 0.35)'
  },
  safe: { flex: 1, },
  flex: { flex: 1 },
  container: { padding: 16,  gap: 16 },

  centerContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center', 
    paddingBottom: 28,
  },


  blockWidth: {
    width: "100%",
    maxWidth: 720,
    alignSelf: 'center',
  },

  header: { alignItems: 'center', marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', color: '#ffffff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },

  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.85)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 3 },
    }),
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },

  cardBody: { fontSize: 14, color: '#334155', lineHeight: 20, marginBottom: 12 },
  versionRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  versionLabel: { fontSize: 13, color: '#64748b' },
  versionValue: { fontSize: 13, color: '#0f172a', fontWeight: '700' },
});
