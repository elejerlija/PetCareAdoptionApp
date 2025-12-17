import React from "react";
import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";


function ProfileScreen() {
  return (
    <View>
      <Text>Personal Information</Text>
      <Text>Save Changes</Text>
    </View>
  );
}

describe("ProfileScreen UI behavior (Unit Test)", () => {
  it("renders personal information and save button", () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText("Personal Information")).toBeTruthy();
    expect(getByText("Save Changes")).toBeTruthy();
  });
});
