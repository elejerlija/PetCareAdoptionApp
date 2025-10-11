import React, { useState } from 'react'
import {
    View, Alert, Keyboard, Platform, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,

} from 'react-native';


import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { Link } from "expo-router";
import InputField from './components/InputField';
import PrimaryButton from "./components/PrimaryButton";
import { KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native-web';

export default function ProfileScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
    const onSave = () => Alert.alert("Profile Saved", "Your profile information has been updated.");

    const navItems = [
        { title: "Home", href: "/" },
        { title: "", href: "" },
        { title: "", href: "" },
        { title: "", href: "" },
        { title: "", href: "" },
        { title: "", href: "" }
    ];


    return (
        <SafeAreaView style={StyleSheet.safe}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView style={StyleSheet.flex}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView contentContainerStyle={StyleSheet.container} keyboardShouldPersistTaps="handled">
                        <View style={styles.header}>
                            <View style={StyleSheet.heroRow}>
                                <Image source={{
                                    uri: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400",
                                }} style={styles.avatar} />

                              
                            </View>
                        </View>

                        <View style = {StyleSheet.card}>
                            <Text style = {StyleSheet.cardTitle}>About the app</Text>
                            <Text style = {StyleSheet.cardBody}>
                                Pet Care & Adoption helps you discover, adopt and care for pets 
                                with a simple, friendly UI. This initial prototype.
                            </Text>
                        <View style = {styles.versionRow}>
                            <Text style = {styles.versionLabel}>Version</Text>
                            <Text style = {styles.versionValue}>v0.10</Text>
                        </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
