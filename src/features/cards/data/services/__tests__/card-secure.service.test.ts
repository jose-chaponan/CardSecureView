import { NativeModules, NativeEventEmitter } from 'react-native';
import { cardSecureService } from '../card-secure.service';

describe('cardSecureService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('openSecureView', () => {
    it('calls CardSecureModule.openSecureView with all parameters', async () => {
      await cardSecureService.openSecureView(
        'card_1',
        '4111111111111111',
        '123',
        '12/27',
        'JOHN DOE',
        'TOKEN-1234567890',
      );
      expect(NativeModules.CardSecureModule.openSecureView).toHaveBeenCalledWith(
        'card_1',
        '4111111111111111',
        '123',
        '12/27',
        'JOHN DOE',
        'TOKEN-1234567890',
      );
    });

    it('propagates rejections from the native module', async () => {
      (NativeModules.CardSecureModule.openSecureView as jest.Mock).mockRejectedValueOnce(
        new Error('native error'),
      );
      await expect(
        cardSecureService.openSecureView('c', 'p', 'v', 'e', 'h', 't'),
      ).rejects.toThrow('native error');
    });
  });

  describe('createEventEmitter', () => {
    it('returns a NativeEventEmitter instance', () => {
      const emitter = cardSecureService.createEventEmitter();
      expect(emitter).toBeInstanceOf(NativeEventEmitter);
    });
  });
});
