export interface Card {
  cardId: string;
  alias: string;
  maskedPan: string;
  pan: string;
  cvv: string;
  brand: string;
  holder: string;
  expiry: string;
  accountId: string;
}

export interface CardItemProps {
  card: Card;
  onViewSensitive: (cardId: string) => void;
}
