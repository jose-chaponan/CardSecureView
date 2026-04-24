import { mockCards } from '../cards.mock';

describe('mockCards', () => {
  it('exports an array of 4 cards', () => {
    expect(Array.isArray(mockCards)).toBe(true);
    expect(mockCards).toHaveLength(4);
  });

  it('each card has all required fields', () => {
    const requiredFields = [
      'cardId',
      'alias',
      'maskedPan',
      'pan',
      'cvv',
      'brand',
      'holder',
      'expiry',
      'accountId',
    ] as const;
    mockCards.forEach(card => {
      requiredFields.forEach(field => {
        expect(card).toHaveProperty(field);
        expect(card[field]).toBeTruthy();
      });
    });
  });

  it('maskedPan follows the **** **** **** XXXX pattern', () => {
    mockCards.forEach(card => {
      expect(card.maskedPan).toMatch(/^\*{4} \*{4} \*{4} \d{4}$/);
    });
  });

  it('all cardIds are unique', () => {
    const ids = mockCards.map(c => c.cardId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('expiry follows MM/YY format', () => {
    mockCards.forEach(card => {
      expect(card.expiry).toMatch(/^\d{2}\/\d{2}$/);
    });
  });
});
