import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PetList from '../app/(tabs)/list';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../context/PetsContext', () => ({
  usePets: () => ({
    pets: [],
    loadingPets: false,
    loadingFavorites: false,
    isFavorite: jest.fn(),
  }),
}));

describe('PetList interaction test', () => {
  it('shows favorites empty text when Favorites button is pressed', () => {
    const { getByText } = render(<PetList />);

    fireEvent.press(getByText('Favorites'));

    expect(getByText('No favorite pets yet.')).toBeTruthy();
  });
});
