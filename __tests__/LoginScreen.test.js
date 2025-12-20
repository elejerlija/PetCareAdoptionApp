/* ======================================================
   SHARED MOCKS (DUHET NË KRYE)
====================================================== */

// Router mock i përbashkët (I NJËJTË për test + komponent)
const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

// Firebase Auth
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

// Firestore
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Firebase config
jest.mock("../firebase", () => ({
  auth: {
    signOut: jest.fn(),
  },
  db: {},
}));

// Notifications
jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock("../notifications", () => ({
  registerPushNotifications: jest.fn(),
}));

/* ======================================================
   IMPORTS
====================================================== */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../app/(auth)/login";

import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc } from "firebase/firestore";

/* ======================================================
   SNAPSHOT TEST
====================================================== */

describe("LoginScreen – Snapshot", () => {
  it("renders correctly", () => {
    const tree = render(<LoginScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

/* ======================================================
   INTERACTION TESTS
====================================================== */

describe("LoginScreen – Interactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows alert when fields are empty", async () => {
    global.alert = jest.fn();

    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Please fill all fields.");
    });
  });

  it("logs in user and redirects to tabs", async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: "uid-123" },
    });

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        role: "user",
        status: "active",
      }),
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "Test123!");

    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/");
    });
  });

  it("navigates to signup screen", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Sign up"));

    expect(mockPush).toHaveBeenCalledWith("/(auth)/signup");
  });
});

/* ======================================================
   EDGE CASE TESTS
====================================================== */

describe("LoginScreen – Edge cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("blocks inactive account", async () => {
    global.alert = jest.fn();

    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: "inactive-user" },
    });

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        status: "inactive",
        role: "user",
      }),
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "a@a.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "123");

    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Your account has been deactivated."
      );
    });
  });
});