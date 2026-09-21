export interface GameItem {
  id: string;
  title: string;
  category: string;
  description: string;
  controls: string;
  badge?: string;
  rating: number;
  plays: string;
  color: string;
  iframe: string;
  url: string;
  custom?: boolean;
}

export type ViewMode = 'portal' | 'os';

export interface OSWindow {
  id: string;
  gameId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}
