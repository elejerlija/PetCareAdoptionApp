import React from "react";
import { Text, Pressable, ActivityIndicator, Platform } from "react-native";

export default function PrimaryButton({
  label,
  onPress,
  style,
  disabled = false,
  isLoading = false,
}) {
  const isBlocked = disabled || isLoading;

  return (
    <Pressable
      onPress={!isBlocked ? onPress : undefined}
      style={({ pressed }) => [
        {
          backgroundColor: isBlocked
            ? "#9CA3AF" 
            : "#2563EB", 
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
      disabled={isBlocked}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: 16,
            letterSpacing: 0.3,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
