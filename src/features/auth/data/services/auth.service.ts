import auth from '@react-native-firebase/auth';

export const authService = {
  login: async (email: string, password: string): Promise<void> => {
    await auth().signInWithEmailAndPassword(email, password);
  },

  logout: async (): Promise<void> => {
    await auth().signOut();
  },
};
