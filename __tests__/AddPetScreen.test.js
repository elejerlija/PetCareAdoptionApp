import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import ManagePets from "../app/(admin)/managePets.jsx";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "MaterialIcons",
}));

jest.mock("../firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  onSnapshot: jest.fn(() => jest.fn()),
  serverTimestamp: jest.fn(),
}));

describe("AddPetScreen interaction test", () => {
  it("shows error alert when trying to add pet without name", () => {
    jest.spyOn(Alert, "alert");

    const { getByText, getAllByText } = render(<ManagePets />);

    fireEvent.press(getByText("+ Add New Pet"));

    
    fireEvent.press(getAllByText("Add Pet")[1]);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Pet name is required."
    );
  });
});
