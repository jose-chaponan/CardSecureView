import { Card } from '../types/card.types';

export const mockCards: Card[] = [
  {
    cardId: 'card_1',
    alias: 'Visa Crédito',
    maskedPan: '**** **** **** 1234',
    brand: 'Visa',
    holder: 'Jose Chaponan',
    expiry: '12/27',
    accountId: 'acc_1',
  },
  {
    cardId: 'card_2',
    alias: 'Mastercard Débito',
    maskedPan: '**** **** **** 5678',
    brand: 'Mastercard',
    holder: 'Jose Chaponan',
    expiry: '08/26',
    accountId: 'acc_2',
  },
  {
    cardId: 'card_3',
    alias: 'Visa Débito',
    maskedPan: '**** **** **** 9012',
    brand: 'Visa',
    holder: 'Jose Chaponan',
    expiry: '03/28',
    accountId: 'acc_3',
  },
];
