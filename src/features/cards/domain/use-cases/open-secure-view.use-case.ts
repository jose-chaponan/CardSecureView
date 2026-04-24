import { Card } from '../entities/card.entity';
import { cardSecureService } from '../../data/services/card-secure.service';

export const openSecureViewUseCase = async (
  card: Card,
  token: string,
): Promise<void> => {
  await cardSecureService.openSecureView(
    card.cardId,
    card.pan,
    card.cvv,
    card.expiry,
    card.holder,
    token,
  );
};
