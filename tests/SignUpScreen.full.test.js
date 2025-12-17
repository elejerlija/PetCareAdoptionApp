/* ====== MOCKS – DUHET TË JENË NË FILLIM ABSOLUT ====== */

// 🚫 Bllokon Expo winter runtime
jest.mock("expo/src/winter/runtime.native", () => ({}));
jest.mock("expo/src/winter/installGlobal", () => ({}));

// 🚫 Animated
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// 🚫 Router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// 🚫 Firebase
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("../firebase", () => ({
  auth: {},
  db: {},
}));

// 🚫 Notifications
jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
}));

/* ====== IMPORTS (VETËM PAS MOCKS) ====== */

import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignUpScreen from "../app/(auth)/signup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

/* ====== TESTS ====== */

describe("SignUpScreen – Inline Full Test", () => {

  it("matches snapshot", () => {
    const tree = renderer.create(<SignUpScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("creates user successfully", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "123" },
    });

    const { getByText, getByPlaceholderText } = render(<SignUpScreen />);

    fireEvent.changeText(getByPlaceholderText("Full Name"), "John Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "john@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "Test123!");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "Test123!");

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(auth)/login");
    });
  });

});
