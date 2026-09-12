export type AppView = 
  | 'welcome' 
  | 'cockpit' 
  | 'find_charge' 
  | 'reservation' 
  | 'queue' 
  | 'charging' 
  | 'history' 
  | 'settings';

export type Language = 'EN' | 'አማ' | 'ORM' | 'TIR';

export interface StationBay {
  id: string;
  name: string;
  powerKw: number;
  connector: 'GB/T' | 'CCS2' | 'Type 2';
  status: 'available' | 'charging' | 'reserved';
}

export interface EVStation {
  id: string;
  name: string;
  area: string;
  address: string;
  distanceKm: number;
  etaMin: number;
  pricePerKwh: number;
  maxPowerKw: number;
  totalBays: number;
  availableBays: number;
  connectors: ('GB/T' | 'CCS2' | 'Type 2')[];
  bays: StationBay[];
  coordinates: { x: number; y: number };
  imageUrl?: string;
}

export interface ChargingHistoryRecord {
  id: string;
  date: string;
  time: string;
  stationName: string;
  bayName: string;
  energyKwh: number;
  powerKw: number;
  durationMin: number;
  totalCostEtb: number;
  ratePerKwh: number;
  paymentMethod: string;
  transactionId: string;
}
