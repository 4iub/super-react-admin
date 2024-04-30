import { create } from 'zustand';
import { createSelectorHooks, createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { persist, createJSONStorage } from 'zustand/middleware';

interface State {
  name: string;
};

interface Action {
  setName: (name: string) => void;
}

export const useUserStore = create<State & Action>()(persist((set) => {
  return {
    name: 'Gus Fring',
    setName: name => set({ name }),
  };
}, {
  name: 'user-store',
  storage: createJSONStorage(() => localStorage),
}));

export const useUserHooksStore = createSelectorHooks(useUserStore);
export const useUserFunctionsStore = createSelectorFunctions(useUserStore);
