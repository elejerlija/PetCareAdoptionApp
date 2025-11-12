import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, multiline && styles.textarea]}
        placeholder={placeholder}
        placeholderTextColor="#9AA2AD"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="done"
        underlineColorAndroid="transparent"
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
