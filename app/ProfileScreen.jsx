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
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import InputField from './components/InputField';
import PrimaryButton from './components/PrimaryButton';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const onSave = () =>
    Alert.alert('Profile Saved', 'Your profile information has been updated.');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Image
                source={{
                  //uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400',
                }}
                style={styles.avatar}
              />
              <Text style={styles.title}>My Profile</Text>
              <Text style={styles.subtitle}>
                Manage your personal information below
              </Text>
            </View>

            <View style={styles.card}>
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

            <View style={styles.card}>
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
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f9ff' },
  flex: { flex: 1 },
  container: { padding: 16, paddingBottom: 28, gap: 16 },

  header: { alignItems: 'center', marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#475569' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
