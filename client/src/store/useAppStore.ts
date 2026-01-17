import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isLiveMode: boolean;
  toggleLiveMode: () => void;
  isLoading: boolean;
  funds: any[]; // Defined in data/funds.ts
  investDrawerOpen: boolean;
  selectedFundId: string | null;
  openInvestDrawer: (fundId: string) => void;
  closeInvestDrawer: () => void;
  balance: number;
  addDeposit: (amount: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLiveMode: false,
      toggleLiveMode: () => set((state) => ({ isLiveMode: !state.isLiveMode })),
      isLoading: false,
      funds: [],
      investDrawerOpen: false,
      selectedFundId: null,
      openInvestDrawer: (fundId) => set({ investDrawerOpen: true, selectedFundId: fundId }),
      closeInvestDrawer: () => set({ investDrawerOpen: false, selectedFundId: null }),
      balance: 12450.00,
      addDeposit: (amount) => set((state) => ({ balance: state.balance + amount })), // Mock calculation
    }),
    {
      name: 'printmoney-storage',
    }
  )
);
