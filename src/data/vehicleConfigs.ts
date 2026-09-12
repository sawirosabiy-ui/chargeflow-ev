export interface VirtualChargingPortConfig {
  side: 'right' | 'left' | 'front-right' | 'front-left' | 'rear-right' | 'rear-left';
  // Exact local coordinates relative to centered grounded vehicle (Y=0 at floor)
  position: {
    x: number;
    y: number;
    z: number;
  };
  // Outward normal orientation for connector gun & flap
  rotation?: {
    x?: number;
    y?: number;
    z?: number;
  };
  flapWidth?: number;
  flapHeight?: number;
}

export interface VehicleConfig {
  id: string;
  modelPath: string;
  name: string;
  brand: string;
  defaultScale: number;
  chargingPort: VirtualChargingPortConfig;
}

/**
 * Universal Per-Vehicle Virtual Charging Port Registry
 * Calibrated specifically for all supported EV models matching real-world vehicle specs
 */
export const VEHICLE_CONFIGS: Record<string, VehicleConfig> = {
  'byd-atto-3': {
    id: 'byd-atto-3',
    modelPath: '/models/byd-atto-3.glb',
    name: 'BYD Atto 3',
    brand: 'BYD',
    defaultScale: 4.2,
    chargingPort: {
      side: 'rear-right',
      position: { x: -0.90, y: 0.74, z: -1.15 },
      rotation: { x: 0, y: 0, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },

  'byd-seagull': {
    id: 'byd-seagull',
    modelPath: '/models/byd-seagull.glb',
    name: 'BYD Seagull',
    brand: 'BYD',
    defaultScale: 3.65,
    chargingPort: {
      side: 'front-right',
      position: { x: 0.90, y: 0.70, z: 0.88 },
      rotation: { x: 0, y: 0.15, z: 0 },
      flapWidth: 0.13,
      flapHeight: 0.15,
    },
  },

  'tesla-model-3': {
    id: 'tesla-model-3',
    modelPath: '/models/tesla-model-y.glb', // compatible geometry fallback
    name: 'Tesla Model 3',
    brand: 'Tesla',
    defaultScale: 4.35,
    chargingPort: {
      side: 'rear-left',
      position: { x: -0.74, y: 0.74, z: -1.78 },
      rotation: { x: 0, y: -Math.PI + 0.2, z: 0 },
      flapWidth: 0.12,
      flapHeight: 0.14,
    },
  },

  'tesla-model-y': {
    id: 'tesla-model-y',
    modelPath: '/models/tesla-model-y.glb',
    name: 'Tesla Model Y',
    brand: 'Tesla',
    defaultScale: 4.45,
    chargingPort: {
      side: 'rear-left',
      position: { x: -0.74, y: 0.76, z: -1.82 },
      rotation: { x: 0, y: -Math.PI + 0.2, z: 0 },
      flapWidth: 0.12,
      flapHeight: 0.14,
    },
  },

  'hyundai-ioniq-5': {
    id: 'hyundai-ioniq-5',
    modelPath: '/models/byd-seal-u.glb',
    name: 'Hyundai IONIQ 5',
    brand: 'Hyundai',
    defaultScale: 4.4,
    chargingPort: {
      side: 'rear-right',
      position: { x: 0.88, y: 0.76, z: -1.65 },
      rotation: { x: 0, y: -0.15, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },

  'kia-ev6': {
    id: 'kia-ev6',
    modelPath: '/models/byd-seal-u.glb',
    name: 'Kia EV6',
    brand: 'Kia',
    defaultScale: 4.45,
    chargingPort: {
      side: 'rear-right',
      position: { x: 0.86, y: 0.74, z: -1.72 },
      rotation: { x: 0, y: -0.2, z: 0 },
      flapWidth: 0.13,
      flapHeight: 0.15,
    },
  },

  'bmw-i4': {
    id: 'bmw-i4',
    modelPath: '/models/byd-seal-u.glb',
    name: 'BMW i4',
    brand: 'BMW',
    defaultScale: 4.45,
    chargingPort: {
      side: 'rear-right',
      position: { x: 0.84, y: 0.72, z: -1.58 },
      rotation: { x: 0, y: -0.1, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },

  'audi-q4-e-tron': {
    id: 'audi-q4-e-tron',
    modelPath: '/models/byd-atto-3.glb',
    name: 'Audi Q4 e-tron',
    brand: 'Audi',
    defaultScale: 4.35,
    chargingPort: {
      side: 'rear-right',
      position: { x: 0.88, y: 0.78, z: -1.68 },
      rotation: { x: 0, y: -0.15, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },

  'mercedes-eqe': {
    id: 'mercedes-eqe',
    modelPath: '/models/byd-seal-u.glb',
    name: 'Mercedes EQE',
    brand: 'Mercedes-Benz',
    defaultScale: 4.5,
    chargingPort: {
      side: 'rear-right',
      position: { x: 0.88, y: 0.75, z: -1.75 },
      rotation: { x: 0, y: -0.15, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },

  'volkswagen-id-4': {
    id: 'volkswagen-id-4',
    modelPath: '/models/byd-atto-3.glb',
    name: 'Volkswagen ID.4',
    brand: 'Volkswagen',
    defaultScale: 4.35,
    chargingPort: {
      side: 'rear-right',
      position: { x: 0.86, y: 0.77, z: -1.65 },
      rotation: { x: 0, y: -0.15, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },

  'nissan-ariya': {
    id: 'nissan-ariya',
    modelPath: '/models/byd-atto-3.glb',
    name: 'Nissan Ariya',
    brand: 'Nissan',
    defaultScale: 4.4,
    chargingPort: {
      side: 'front-right',
      position: { x: 0.90, y: 0.78, z: 0.98 },
      rotation: { x: 0, y: 0.12, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },

  'chevrolet-bolt-euv': {
    id: 'chevrolet-bolt-euv',
    modelPath: '/models/byd-seagull.glb',
    name: 'Chevrolet Bolt EUV',
    brand: 'Chevrolet',
    defaultScale: 4.1,
    chargingPort: {
      side: 'front-left',
      position: { x: -0.86, y: 0.75, z: 0.92 },
      rotation: { x: 0, y: -0.12, z: 0 },
      flapWidth: 0.13,
      flapHeight: 0.15,
    },
  },

  'byd-seal-u': {
    id: 'byd-seal-u',
    modelPath: '/models/byd-seal-u.glb',
    name: 'BYD Seal U',
    brand: 'BYD',
    defaultScale: 4.4,
    chargingPort: {
      side: 'front-right',
      position: { x: 0.94, y: 0.76, z: 1.05 },
      rotation: { x: 0, y: 0.1, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },

  'byd-song-plus': {
    id: 'byd-song-plus',
    modelPath: '/models/byd-song-plus.glb',
    name: 'BYD Song Plus EV',
    brand: 'BYD',
    defaultScale: 4.45,
    chargingPort: {
      side: 'front-right',
      position: { x: 0.94, y: 0.72, z: 1.05 },
      rotation: { x: 0, y: 0.1, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },

  'byd-yangwang-u8': {
    id: 'byd-yangwang-u8',
    modelPath: '/models/byd-yangwang-u8.glb',
    name: 'BYD Yangwang U8',
    brand: 'Yangwang',
    defaultScale: 4.8,
    chargingPort: {
      side: 'rear-right',
      position: { x: 1.05, y: 0.95, z: -1.25 },
      rotation: { x: 0, y: -0.1, z: 0 },
      flapWidth: 0.16,
      flapHeight: 0.18,
    },
  },

  'byd-yangwang-u9': {
    id: 'byd-yangwang-u9',
    modelPath: '/models/byd-yangwang-u9.glb',
    name: 'BYD Yangwang U9',
    brand: 'Yangwang',
    defaultScale: 4.6,
    chargingPort: {
      side: 'rear-right',
      position: { x: 0.98, y: 0.68, z: -0.95 },
      rotation: { x: 0, y: -0.15, z: 0 },
      flapWidth: 0.13,
      flapHeight: 0.15,
    },
  },

  'byd-sealion-7': {
    id: 'byd-sealion-7',
    modelPath: '/models/byd-sealion-7.glb',
    name: 'BYD Sealion 7',
    brand: 'BYD',
    defaultScale: 4.55,
    chargingPort: {
      side: 'front-right',
      position: { x: 0.98, y: 0.74, z: 1.08 },
      rotation: { x: 0, y: 0.1, z: 0 },
      flapWidth: 0.14,
      flapHeight: 0.16,
    },
  },
};

/**
 * Shared Universal Charging Port Offsets Configuration Map
 * Used by VehicleStage and universal ChargingCable anchor system
 */
export const CAR_PORT_OFFSETS: Record<string, { position: [number, number, number]; rotation: [number, number, number]; side?: 'left' | 'right' }> = {
  'byd-atto-3': { position: [-0.90, 0.74, -1.15], rotation: [0, 0, 0], side: 'right' },
  'byd-song-plus': { position: [0.95, 0.75, 1.20], rotation: [0, 0, 0], side: 'right' },
  'vw-id4': { position: [0.90, 0.70, -1.35], rotation: [0, 0, 0], side: 'right' },
  'volkswagen-id-4': { position: [0.90, 0.70, -1.35], rotation: [0, 0, 0], side: 'right' },
  'tesla-model-y': { position: [-0.92, 0.78, -1.45], rotation: [0, 0, 0], side: 'left' },
  'tesla-model-3': { position: [-0.90, 0.76, -1.40], rotation: [0, 0, 0], side: 'left' },
  'hyundai-ioniq-5': { position: [0.88, 0.76, -1.55], rotation: [0, 0, 0], side: 'right' },
  'kia-ev6': { position: [0.88, 0.74, -1.60], rotation: [0, 0, 0], side: 'right' },
  'bmw-i4': { position: [0.86, 0.72, -1.50], rotation: [0, 0, 0], side: 'right' },
  'audi-q4-e-tron': { position: [0.88, 0.76, -1.55], rotation: [0, 0, 0], side: 'right' },
  'mercedes-eqe': { position: [0.88, 0.75, -1.60], rotation: [0, 0, 0], side: 'right' },
  'nissan-ariya': { position: [0.90, 0.76, 1.10], rotation: [0, 0, 0], side: 'right' },
  'chevrolet-bolt-euv': { position: [-0.88, 0.74, 1.05], rotation: [0, 0, 0], side: 'left' },
  'byd-seagull': { position: [0.88, 0.68, 0.95], rotation: [0, 0, 0], side: 'right' },
  'byd-seal-u': { position: [0.94, 0.75, 1.18], rotation: [0, 0, 0], side: 'right' },
  'byd-yangwang-u8': { position: [1.02, 0.92, -1.30], rotation: [0, 0, 0], side: 'right' },
  'byd-yangwang-u9': { position: [0.92, 0.65, 0.85], rotation: [0, 0, 0], side: 'right' },
  'byd-sealion-7': { position: [0.92, 0.74, 1.15], rotation: [0, 0, 0], side: 'right' },
};

/**
 * Helper to get the charging port configuration for any model path or ID
 */
export function getVehicleConfig(modelPathOrId: string): VehicleConfig {
  const cleanKey = (modelPathOrId || '')
    .toLowerCase()
    .replace(/^.*[\\/]/, '') // filename
    .replace(/\.glb$/, '')
    .replace(/^202[0-9]_/, '') // remove year prefix if any
    .replace(/_/g, '-');

  if (VEHICLE_CONFIGS[cleanKey]) {
    return VEHICLE_CONFIGS[cleanKey];
  }

  // Substring search fallback
  for (const [key, config] of Object.entries(VEHICLE_CONFIGS)) {
    if (cleanKey.includes(key) || key.includes(cleanKey)) {
      return config;
    }
  }

  // Default fallback (BYD Atto 3 front right fender)
  return VEHICLE_CONFIGS['byd-atto-3'];
}

