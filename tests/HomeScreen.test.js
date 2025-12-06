import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../app/(tabs)/index";
import { Linking } from "react-native";

// -----------------------------------------------------------
// MOCK ANIMATED (Zgjidh errorin që shfaqej më parë te Jest)
// -----------------------------------------------------------
jest.mock("react-native/Libraries/Animated/Animated", () => {
  const ActualAnimated = jest.requireActual("react-native/Libraries/Animated/Animated");

  return {
    ...ActualAnimated,
    timing: () => ({
      start: (cb) => cb && cb(),   // mbaron menjëherë
    }),
    parallel: () => ({
      start: (cb) => cb && cb(),   // mos priti animacion
    }),
  };
});

// -----------------------------------------------------------
// MOCK LINKING (për testim të klikimit të emailit)
// -----------------------------------------------------------
jest.spyOn(Linking, "openURL").mockImplementation(() => Promise.resolve());

describe("HomeScreen Tests", () => {

  test("matches snapshot", () => {
    const tree = render(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders the title and subtitle", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("PetCare Adoption")).toBeTruthy();
    expect(getByText("Welcome to the world of four-pawed friends. 🐾")).toBeTruthy();
  });

  test("email click triggers Linking.openURL", () => {
    const { getByText } = render(<HomeScreen />);
    const email = getByText("📧 contact@petcareapp.com");

    fireEvent.press(email);

    expect(Linking.openURL).toHaveBeenCalledWith("mailto:contact@petcareapp.com");
  });

  test("shows skeleton loading before news", () => {
    const { queryByText } = render(<HomeScreen />);
    const bullet = queryByText("•");
    expect(bullet).toBeNull();  // skeleton, not actual news yet
  });
});
