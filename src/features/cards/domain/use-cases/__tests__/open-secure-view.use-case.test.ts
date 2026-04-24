import { openSecureViewUseCase } from '../open-secure-view.use-case';
import { cardSecureService } from '../../../data/services/card-secure.service';
import { mockCards } from '../../../data/mocks/cards.mock';

jest.mock('../../../data/services/card-secure.service', () => ({
  cardSecureService: {
    openSecureView: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('openSecureViewUseCase', () => {
  const card = mockCards[0];
  const token = 'TOKEN-1234567890';

  beforeEach(() => jest.clearAllMocks());

  it('calls cardSecureService.openSecureView with all card fields and the token', async () => {
    await openSecureViewUseCase(card, token);
    expect(cardSecureService.openSecureView).toHaveBeenCalledWith(
      card.cardId,
      card.pan,
      card.cvv,
      card.expiry,
      card.holder,
      token,
    );
  });

  it('propagates errors from cardSecureService', async () => {
    (cardSecureService.openSecureView as jest.Mock).mockRejectedValueOnce(
      new Error('native error'),
    );
    await expect(openSecureViewUseCase(card, token)).rejects.toThrow(
      'native error',
    );
  });
});
