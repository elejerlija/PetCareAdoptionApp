import React, { useState } from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';

const ACCENT = '#83BAC9';

export default function ProfileScreen() {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const onSave = async () => {
    const data = { name, email, city, phone, bio };
    try {
      await AsyncStorage.setItem('profileData', JSON.stringify(data));
      Alert.alert('Profile Saved', 'Your information has been saved locally.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save your information.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
            <Text style={styles.subtitle}>Manage your personal information below</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Information</Text>

            <View style={styles.block}>
              <Text style={styles.label}>Full Name</Text>
              <InputField placeholder="Enter your name" value={name} onChangeText={setName} />
            </View>

            <View style={styles.block}>
              <Text style={styles.label}>Email</Text>
              <InputField
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.block, styles.col]}>
                <Text style={styles.label}>City</Text>
                <InputField placeholder="Enter your city" value={city} onChangeText={setCity} />
              </View>
              <View style={[styles.block, styles.col]}>
                <Text style={styles.label}>Phone Number</Text>
                <InputField
                  placeholder="+383 xx xxx xxx"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.block}>
              <Text style={styles.label}>Bio</Text>
              <InputField
                placeholder="Write something about yourself"
                value={bio}
                onChangeText={setBio}
                multiline
              />
            </View>

            <View style={styles.saveSection}>
              <Text style={styles.saveText}>Click below to save your information locally</Text>
              <PrimaryButton title="Save" onPress={onSave} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>About the app 🐾</Text>
            <Text style={styles.body}>
              Pet Care & Adoption is designed to help animal lovers connect with pets who need a home and provide useful resources for responsible pet care.
With this app, you can explore profiles of adoptable animals, learn about their stories, and find the perfect companion for your lifestyle.
            </Text>
           
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  header: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: ACCENT + '22',
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: ACCENT + '22',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  block: {
    marginBottom: 14,
    backgroundColor: '#FFFDF2',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    width: '48%',
  },
  saveSection: {
    alignItems: 'center',
    marginTop: 12,
  },
  saveText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 10,
  },

  bold: {
    fontWeight: '700',
  },
});
