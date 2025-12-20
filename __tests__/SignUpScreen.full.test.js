jest.mock("expo/src/winter/runtime.native", () => ({}));
jest.mock("expo/src/winter/installGlobal", () => ({}));

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("../firebase", () => ({
  auth: {},
  db: {},
}));

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock("../notifications", () => ({
  registerPushNotifications: jest.fn(),
}));

jest.mock("../components/PrimaryButton", () => {
  const React = require("react");
  const { Text, TouchableOpacity } = require("react-native");

  return ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignUpScreen from "../app/(auth)/signup";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { registerPushNotifications } from "../notifications";

describe("SignUpScreen Full Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders signup screen", () => {
    const { getByText } = render(<SignUpScreen />);
    expect(getByText("Create Account 🐾")).toBeTruthy();
  });

  it("creates user successfully and redirects to login", async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "123" },
    });

    setDoc.mockResolvedValueOnce();
    Notifications.scheduleNotificationAsync.mockResolvedValueOnce();
    registerPushNotifications.mockResolvedValueOnce();

    const { getByText, getByPlaceholderText } = render(<SignUpScreen />);

    fireEvent.changeText(getByPlaceholderText("Full Name"), "John Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "john@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "Test123!");
    fireEvent.changeText(
      getByPlaceholderText("Confirm Password"),
      "Test123!"
    );

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/(auth)/login");
    });
  });
});