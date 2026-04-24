import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import DashboardScreen from '../DashboardScreen';
import { mockCards } from '../../../data/mocks/cards.mock';

const mockOpenSecureView = jest.fn();
const mockLogout = jest.fn();

const mockState = {
  cards: mockCards,
  isLoading: false,
  openSecureView: mockOpenSecureView,
  logout: mockLogout,
};

jest.mock('../../hooks/useDashboardScreen', () => ({
  useDashboardScreen: () => mockState,
}));

describe('DashboardScreen', () => {
  beforeEach(() => {
    mockState.cards = mockCards;
    mockState.isLoading = false;
    jest.clearAllMocks();
  });

  it('renders the greeting text', () => {
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('Bienvenido')).toBeTruthy();
  });

  it('renders the header title', () => {
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('Mis tarjetas')).toBeTruthy();
  });

  it('renders the logout button', () => {
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('Salir')).toBeTruthy();
  });

  it('calls logout when Salir is pressed', () => {
    const { getByText } = render(<DashboardScreen />);
    fireEvent.press(getByText('Salir'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('renders skeleton placeholders when isLoading is true', () => {
    mockState.isLoading = true;
    mockState.cards = [];
    const { queryAllByText } = render(<DashboardScreen />);
    expect(queryAllByText('Ver datos sensibles')).toHaveLength(0);
  });

  it('renders cards list when data is loaded', () => {
    const { getAllByText } = render(<DashboardScreen />);
    expect(getAllByText('Ver datos sensibles')).toHaveLength(mockCards.length);
  });

  it('shows empty message when cards list is empty', () => {
    mockState.cards = [];
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('No tienes tarjetas registradas.')).toBeTruthy();
  });

  it('calls openSecureView with the card id when button is pressed', () => {
    const { getAllByText } = render(<DashboardScreen />);
    fireEvent.press(getAllByText('Ver datos sensibles')[0]);
    expect(mockOpenSecureView).toHaveBeenCalledWith(mockCards[0].cardId);
  });
});
