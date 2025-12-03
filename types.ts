export interface ElementInfo {
  name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: number;
  category: string;
  description: string;
  environmentInfo: string;
  commonUses: string[];
  funFact: string;
}

export interface AtomProps {
  atomicNumber: number;
  showShells?: boolean;
  speed?: number;
}

export enum ViewMode {
  ORBITAL = 'ORBITAL',
  CLOUD = 'CLOUD' // Simplified placeholder for future expansion
}