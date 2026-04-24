import { create } from 'zustand';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  initialized: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setInitialized: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: false,
  initialized: false,

  setUser: user => set({ user }),
  setInitialized: () => set({ initialized: true }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await auth().signOut();
  },
}));
