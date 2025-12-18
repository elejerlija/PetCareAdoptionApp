import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../app/(tabs)/index";
import { Linking } from "react-native";


jest.mock("react-native/Libraries/Animated/Animated", () => {
  const ActualAnimated = jest.requireActual(
    "react-native/Libraries/Animated/Animated"
  );

  return {
    ...ActualAnimated,
    timing: () => ({
      start: (cb) => cb && cb(),
    }),
    parallel: () => ({
      start: (cb) => cb && cb(),
    }),
    loop: () => ({
      start: (cb) => cb && cb(),
    }),
  };
});

jest.spyOn(Linking, "openURL").mockImplementation(() => Promise.resolve());

describe("HomeScreen Tests", () => {

  test("matches snapshot", () => {
    const tree = render(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders title and subtitle", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("PetCare Adoption")).toBeTruthy();
    expect(
      getByText("Welcome to the world of four-pawed friends. 🐾")
    ).toBeTruthy();
  });

  test("renders banner content", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("Adoptathon this weekend!")).toBeTruthy();
    expect(
      getByText(
        "Discounts on vaccinations for new adoptions. Visit your nearest center!"
      )
    ).toBeTruthy();
  });

  test("pressing email triggers Linking.openURL", () => {
    const { getByText } = render(<HomeScreen />);
    const email = getByText("📧 contact@petcareapp.com");

    fireEvent.press(email);

    expect(Linking.openURL).toHaveBeenCalledWith(
      "mailto:contact@petcareapp.com"
    );
  });

  test("shows loading skeleton initially", () => {
    const { queryByText } = render(<HomeScreen />);

    expect(queryByText(/•/)).toBeNull();
  });

  test("footer content is rendered", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("Need help or want to get in touch?")).toBeTruthy();
    expect(getByText("© 2025 PetCare Adoption")).toBeTruthy();
  });
});

