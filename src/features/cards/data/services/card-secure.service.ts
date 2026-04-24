import { NativeEventEmitter, NativeModules } from 'react-native';

const { CardSecureModule } = NativeModules;

export const cardSecureService = {
  openSecureView: (
    cardId: string,
    pan: string,
    cvv: string,
    expiry: string,
    holder: string,
    token: string,
  ): Promise<void> =>
    CardSecureModule.openSecureView(cardId, pan, cvv, expiry, holder, token),

  createEventEmitter: () => new NativeEventEmitter(CardSecureModule),
};
