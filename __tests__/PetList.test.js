jest.mock('../firebase', () => ({
  app: {},
  db: {},
  auth: {},
  storage: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));


import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PetList from '../app/(tabs)/list';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

import * as PetsContext from '../context/PetsContext';

describe('PetList interaction test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows favorites empty text when Favorites button is pressed', () => {
    jest.spyOn(PetsContext, 'usePets').mockReturnValue({
      pets: [],
      loadingPets: false,
      loadingFavorites: false,
      isFavorite: jest.fn(),
      toggleFavorite: jest.fn(),
      getCityOfPet: jest.fn(),
    });

    const { getByText } = render(<PetList />);

    fireEvent.press(getByText('Favorites'));

    expect(getByText('No favorite pets yet.')).toBeTruthy();
  });

  it('shows empty pets text when All Pets button is pressed', () => {
    jest.spyOn(PetsContext, 'usePets').mockReturnValue({
      pets: [],
      loadingPets: false,
      loadingFavorites: false,
      isFavorite: jest.fn(),
      toggleFavorite: jest.fn(),
      getCityOfPet: jest.fn(),
    });

    const { getByText } = render(<PetList />);

    fireEvent.press(getByText('All Pets'));

    expect(getByText('No pets yet.')).toBeTruthy();
  });

  it('renders pet names when pets exist', () => {
    jest.spyOn(PetsContext, 'usePets').mockReturnValue({
      pets: [
        { id: '1', name: 'Luna', age: 2 },
        { id: '2', name: 'Max', age: 4 },
      ],
      loadingPets: false,
      loadingFavorites: false,
      isFavorite: jest.fn(() => false),
      toggleFavorite: jest.fn(),
      getCityOfPet: jest.fn(() => 'Prishtina'),
    });

    const { getByText, queryByText } = render(<PetList />);

    expect(queryByText('No pets yet.')).toBeNull();
    expect(getByText('Luna')).toBeTruthy();
    expect(getByText('Max')).toBeTruthy();
  });
});
