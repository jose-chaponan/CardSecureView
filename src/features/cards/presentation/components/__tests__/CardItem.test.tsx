import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CardItem from '../CardItem';
import { mockCards } from '../../../data/mocks/cards.mock';

const card = mockCards[0];
const mockOnViewSensitive = jest.fn();

describe('CardItem', () => {
  beforeEach(() => mockOnViewSensitive.mockClear());

  it('renders the card brand', () => {
    const { getByText } = render(
      <CardItem card={card} onViewSensitive={mockOnViewSensitive} />,
    );
    expect(getByText(card.brand)).toBeTruthy();
  });

  it('renders the card alias', () => {
    const { getByText } = render(
      <CardItem card={card} onViewSensitive={mockOnViewSensitive} />,
    );
    expect(getByText(card.alias)).toBeTruthy();
  });

  it('renders the masked PAN', () => {
    const { getByText } = render(
      <CardItem card={card} onViewSensitive={mockOnViewSensitive} />,
    );
    expect(getByText(card.maskedPan)).toBeTruthy();
  });

  it('renders the card holder name', () => {
    const { getByText } = render(
      <CardItem card={card} onViewSensitive={mockOnViewSensitive} />,
    );
    expect(getByText(card.holder)).toBeTruthy();
  });

  it('renders the expiry date', () => {
    const { getByText } = render(
      <CardItem card={card} onViewSensitive={mockOnViewSensitive} />,
    );
    expect(getByText(card.expiry)).toBeTruthy();
  });

  it('renders the "Ver datos sensibles" button', () => {
    const { getByText } = render(
      <CardItem card={card} onViewSensitive={mockOnViewSensitive} />,
    );
    expect(getByText('Ver datos sensibles')).toBeTruthy();
  });

  it('calls onViewSensitive with the cardId when the button is pressed', () => {
    const { getByText } = render(
      <CardItem card={card} onViewSensitive={mockOnViewSensitive} />,
    );
    fireEvent.press(getByText('Ver datos sensibles'));
    expect(mockOnViewSensitive).toHaveBeenCalledWith(card.cardId);
    expect(mockOnViewSensitive).toHaveBeenCalledTimes(1);
  });

  it('renders with correct accessibility label on the button', () => {
    const { getByRole } = render(
      <CardItem card={card} onViewSensitive={mockOnViewSensitive} />,
    );
    const btn = getByRole('button', {
      name: `Ver datos sensibles de tarjeta ${card.alias}`,
    });
    expect(btn).toBeTruthy();
  });

  it('renders different brands correctly', () => {
    const mastercardCard = mockCards[1];
    const { getByText } = render(
      <CardItem card={mastercardCard} onViewSensitive={mockOnViewSensitive} />,
    );
    expect(getByText(mastercardCard.brand)).toBeTruthy();
    expect(getByText(mastercardCard.maskedPan)).toBeTruthy();
  });
});
