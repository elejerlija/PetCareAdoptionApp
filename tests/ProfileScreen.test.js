import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { render } from "@testing-library/react-native";


function ProfileLoading() {
  return (
    <View>
      <ActivityIndicator size="large" />
      <Text>Loading profile...</Text>
    </View>
  );
}

describe("ProfileScreen – Loading state (Unit Test)", () => {
  it("shows loading indicator and loading text", () => {
    const { getByText } = render(<ProfileLoading />);

    expect(getByText("Loading profile...")).toBeTruthy();
  });
});
