export type PortfolioMode = 'analytics' | 'map';

export interface SavedView {
  id: string;
  name: string;
  createdAt: number;
  viewport: { panX: number; panY: number; zoom: number };
  nodePositions: Record<string, { x: number; y: number }>;
  edgeToggles: { correlation: boolean; catalyst: boolean; hedge: boolean; parlay: boolean };
}

const KEYS = {
  MODE: 'pm.portfolio.mode',
  VIEWS: 'pm.portfolio.views',
  ACTIVE_VIEW: 'pm.portfolio.activeView',
};

export const getPortfolioMode = (): PortfolioMode => {
  if (typeof window === 'undefined') return 'analytics';
  return (localStorage.getItem(KEYS.MODE) as PortfolioMode) || 'analytics';
};

export const setPortfolioMode = (mode: PortfolioMode) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.MODE, mode);
};

export const getSavedViews = (): SavedView[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.VIEWS);
  return raw ? JSON.parse(raw) : [];
};

export const saveView = (view: SavedView) => {
  if (typeof window === 'undefined') return;
  const views = getSavedViews();
  const updated = [...views, view];
  localStorage.setItem(KEYS.VIEWS, JSON.stringify(updated));
};

export const getActiveViewId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEYS.ACTIVE_VIEW);
};

export const setActiveView = (id: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ACTIVE_VIEW, id);
};
