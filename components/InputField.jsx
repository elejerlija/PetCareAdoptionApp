import React from 'react'; 
import {View, Text, TextInput, StyleSheet} from 'react-native'; 

export default function InputField({label, placeholder, value, onChangeText}){
    return (
        <View style = {styles.container}>
            {label ? <Text style = {styles.label}>{label}</Text> : null}
            <TextInput 
            style = {styles.input}
            placeholder={placeholder}
            placeholderTextColor="#9aa2ad"
            value = {value}
            onChangeText={onChangeText}
            returnKeyType='done'
            autoCapitalize='words'
            underlineColorAndroid="transparent"
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        marginBottom: 16
    }, 
    label: {
        fontSize: 14,
        color: "#4b5563",
        marginBottom: 6, 
        fontWeight: "600"
    }, 

    input: {
        height: 48, 
        borderWidth: 1, 
        borderColor: "#e5e7eb",
        borderRadius: 12, 
        paddingHorizontal: 14, 
        fontSize: 16, 
        backgroundColor: "#fff"
    },
});