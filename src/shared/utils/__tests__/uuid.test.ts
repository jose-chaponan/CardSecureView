import { generateUUID } from '../uuid';

describe('generateUUID', () => {
  it('returns the mocked uuid string', () => {
    expect(generateUUID()).toBe('mock-uuid-1234');
  });

  it('returns a string type', () => {
    expect(typeof generateUUID()).toBe('string');
  });

  it('is called with v4', () => {
    const uuid = require('react-native-uuid');
    generateUUID();
    expect(uuid.v4).toHaveBeenCalled();
  });
});
