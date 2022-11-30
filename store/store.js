import create from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      session: undefined,
      setSession: (session) => set({ session }),
    }),
    {
      name: 'session',
      getStorage: () => localStorage,
    },
  ),
);

const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));

export { useAuthStore, useProductStore };
