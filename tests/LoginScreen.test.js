/* =======================
   MOCKS (DUHET NË KRYE)
======================= */

// Çaktivizon kontrollin e versionit të testing-library
jest.mock(
  "@testing-library/react-native/src/helpers/ensure-peer-deps",
  () => ({ ensurePeerDeps: () => {} })
);

// Çaktivizon Animated native driver
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Router
const replaceMock = jest.fn();
const pushMock = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: pushMock,
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

/* =======================
   IMPORTS
======================= */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../app/(auth)/login";

import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc } from "firebase/firestore";

/* =======================
   SNAPSHOT TESTS
======================= */

describe("LoginScreen – Snapshot tests", () => {
  it("renders login screen correctly", () => {
    const tree = render(<LoginScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

/* =======================
   INTERACTION TESTS
======================= */

describe("LoginScreen – Interaction tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows alert if fields are empty", async () => {
    global.alert = jest.fn();

    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Please fill all fields.");
    });
  });

  it("calls firebase login with valid credentials", async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: "test-uid" },
    });

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        role: "user",
        status: "active",
      }),
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Email"),
      "test@test.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Password"),
      "Test123!"
    );

    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(replaceMock).toHaveBeenCalledWith("/(tabs)/");
    });
  });

  it("navigates to signup screen when link is pressed", () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Sign up"));

    expect(pushMock).toHaveBeenCalledWith("/(auth)/signup");
  });
});

/* =======================
   MOCKING / EDGE CASE TESTS
======================= */

describe("LoginScreen – Mocking tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows error if user profile does not exist", async () => {
    global.alert = jest.fn();

    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: "missing-user" },
    });

    getDoc.mockResolvedValue({
      exists: () => false,
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Email"),
      "test@test.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Password"),
      "Test123!"
    );

    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "User profile not found."
      );
    });
  });

  it("blocks login if account is inactive", async () => {
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

    fireEvent.changeText(
      getByPlaceholderText("Email"),
      "inactive@test.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Password"),
      "Test123!"
    );

    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Your account has been deactivated."
      );
    });
  });
});
