import React, { useState } from 'react'
import {
    View, Alert, Keyboard, Platform, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,

} from 'react-native'; 
import { SafeAreaView } from 'react-native-web';

import {SafeAreaView} from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import {Link} from "expo-router"; 
import InputField from './components/InputField';
import PrimaryButton from "./components/PrimaryButton";

export default function ProfileScreen() {
 const[name, setName] = useState("");
 const onSave = () => Alert.alert("Saved");

 const navItems = [
    {title: "Home", href: "/"},
    {title: "", href:""},
    {title: "", href:""},
    {title: "", href:""},
    {title: "", href:""},
    {title: "", href:""}
 ]; 


 return(
 <SafeAreaView style = {StyleSheet.safe}>
    <StatusBar style = "dark" />
    

 </SafeAreaView>
 )
}
