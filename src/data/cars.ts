import { useGLTF } from '@react-three/drei';

// Configure local Draco decoder
useGLTF.setDecoderPath('/draco/');

export interface CarSpec {
  id: string;
  name: string;
  brand: string;
  capacity: string;
  capacityKwh: number;
  range: string;
  rangeKm: number;
  drive: string;
  acceleration: string;
  modelPath: string;
  scale: number;
  paintColor?: string;
  badge?: string;
  image2D?: string;
}

const RAW_CARS: CarSpec[] = [
  {
    id: 'audi-q4-e-tron',
    name: 'Audi Q4 e-tron',
    brand: 'Audi',
    capacity: '82.0 kWh',
    capacityKwh: 82.0,
    range: '520 km',
    rangeKm: 520,
    drive: 'Quattro AWD',
    acceleration: '6.2s',
    modelPath: '/models/byd-atto-3.glb',
    scale: 4.35,
    paintColor: '#64748b',
    badge: 'Premium e-SUV',
  },
  {
    id: 'bmw-i4',
    name: 'BMW i4',
    brand: 'BMW',
    capacity: '80.7 kWh',
    capacityKwh: 80.7,
    range: '590 km',
    rangeKm: 590,
    drive: 'RWD',
    acceleration: '5.7s',
    modelPath: '/models/byd-seal-u.glb',
    scale: 4.45,
    paintColor: '#1e3a8a',
    badge: 'Gran Coupé',
  },
  {
    id: 'byd-atto-3',
    name: 'BYD Atto 3',
    brand: 'BYD',
    capacity: '60.5 kWh',
    capacityKwh: 60.5,
    range: '420 km',
    rangeKm: 420,
    drive: 'FWD',
    acceleration: '7.3s',
    modelPath: '/models/byd-atto-3.glb',
    scale: 4.2,
    paintColor: '#0284c7',
    badge: 'Flagship SUV',
    image2D: '/images/cars/atto3_hud_thumb.png',
  },
  {
    id: 'byd-seagull',
    name: 'BYD Seagull',
    brand: 'BYD',
    capacity: '30.1 kWh',
    capacityKwh: 30.1,
    range: '305 km',
    rangeKm: 305,
    drive: 'FWD',
    acceleration: '4.9s',
    modelPath: '/models/byd-seagull.glb',
    scale: 3.65,
    paintColor: '#84cc16',
    badge: 'Urban EV',
    image2D: '/images/cars/byd-seagull.jpg',
  },
  {
    id: 'byd-seal-u',
    name: 'BYD Seal U',
    brand: 'BYD',
    capacity: '71.8 kWh',
    capacityKwh: 71.8,
    range: '500 km',
    rangeKm: 500,
    drive: 'AWD',
    acceleration: '5.9s',
    modelPath: '/models/byd-seal-u.glb',
    scale: 4.4,
    paintColor: '#10b981',
    badge: 'Comfort Crossover',
  },
  {
    id: 'byd-sealion-7',
    name: 'BYD Sealion 7',
    brand: 'BYD',
    capacity: '82.5 kWh',
    capacityKwh: 82.5,
    range: '550 km',
    rangeKm: 550,
    drive: 'AWD',
    acceleration: '4.5s',
    modelPath: '/models/byd-sealion-7.glb',
    scale: 4.55,
    paintColor: '#059669',
    badge: 'Performance SUV',
  },
  {
    id: 'byd-song-plus',
    name: 'BYD Song Plus EV',
    brand: 'BYD',
    capacity: '71.7 kWh',
    capacityKwh: 71.7,
    range: '505 km',
    rangeKm: 505,
    drive: 'FWD',
    acceleration: '7.9s',
    modelPath: '/models/byd-song-plus.glb',
    scale: 4.45,
    paintColor: '#6366f1',
    badge: 'Family SUV',
  },
  {
    id: 'byd-yangwang-u8',
    name: 'BYD Yangwang U8',
    brand: 'BYD',
    capacity: '49.0 kWh',
    capacityKwh: 49.0,
    range: '1000 km (PHEV)',
    rangeKm: 1000,
    drive: '4WD',
    acceleration: '3.6s',
    modelPath: '/models/byd-yangwang-u8.glb',
    scale: 4.8,
    paintColor: '#d97706',
    badge: 'Luxury Offroad',
  },
  {
    id: 'byd-yangwang-u9',
    name: 'BYD Yangwang U9',
    brand: 'BYD',
    capacity: '80.0 kWh',
    capacityKwh: 80.0,
    range: '450 km',
    rangeKm: 450,
    drive: 'AWD',
    acceleration: '2.36s',
    modelPath: '/models/byd-yangwang-u9.glb',
    scale: 4.6,
    paintColor: '#e11d48',
    badge: 'Track Hypercar',
  },
  {
    id: 'hyundai-ioniq-5',
    name: 'Hyundai IONIQ 5',
    brand: 'Hyundai',
    capacity: '77.4 kWh',
    capacityKwh: 77.4,
    range: '507 km',
    rangeKm: 507,
    drive: 'AWD',
    acceleration: '5.1s',
    modelPath: '/models/byd-seal-u.glb',
    scale: 4.4,
    paintColor: '#38bdf8',
    badge: '800V Ultra-Fast',
  },
  {
    id: 'kia-ev6',
    name: 'Kia EV6',
    brand: 'Kia',
    capacity: '77.4 kWh',
    capacityKwh: 77.4,
    range: '528 km',
    rangeKm: 528,
    drive: 'AWD',
    acceleration: '5.2s',
    modelPath: '/models/byd-seal-u.glb',
    scale: 4.45,
    paintColor: '#dc2626',
    badge: 'Crossover GT',
  },
  {
    id: 'polestar-4',
    name: 'Polestar 4',
    brand: 'Polestar',
    capacity: '102 kWh',
    capacityKwh: 102,
    range: '438 km',
    rangeKm: 438,
    drive: 'Performance AWD',
    acceleration: '3.8s',
    modelPath: '/models/byd-seal-u.glb',
    scale: 4.35,
    paintColor: '#CBD5E1',
    badge: 'Performance Coupe',
    image2D: '/images/cars/halo-car.jpg',
  },
  {
    id: 'tesla-model-3',
    name: 'Tesla Model 3',
    brand: 'Tesla',
    capacity: '60.0 kWh',
    capacityKwh: 60.0,
    range: '491 km',
    rangeKm: 491,
    drive: 'RWD',
    acceleration: '5.8s',
    modelPath: '/models/tesla-model-y.glb',
    scale: 4.35,
    paintColor: '#e2e8f0',
    badge: 'Performance Sedan',
    image2D: '/images/cars/tesla-model-y.jpg',
  },
  {
    id: 'tesla-model-y',
    name: 'Tesla Model Y',
    brand: 'Tesla',
    capacity: '75.0 kWh',
    capacityKwh: 75.0,
    range: '533 km',
    rangeKm: 533,
    drive: 'AWD',
    acceleration: '3.7s',
    modelPath: '/models/tesla-model-y.glb',
    scale: 4.45,
    paintColor: '#94a3b8',
    badge: 'Long Range SUV',
    image2D: '/images/cars/tesla-model-y.jpg',
  },
  {
    id: 'volkswagen-id-4',
    name: 'Volkswagen ID.4',
    brand: 'Volkswagen',
    capacity: '77.0 kWh',
    capacityKwh: 77.0,
    range: '522 km',
    rangeKm: 522,
    drive: 'RWD',
    acceleration: '8.5s',
    modelPath: '/models/byd-atto-3.glb',
    scale: 4.35,
    paintColor: '#0ea5e9',
    badge: 'Global EV',
  },
];

// STRICT ALPHABETICAL ORDER BY NAME
export const AVAILABLE_CARS: CarSpec[] = [...RAW_CARS].sort((a, b) => a.name.localeCompare(b.name));

/**
 * Smart car search with fallback reference matching
 * If query doesn't match any car directly, recommends a compatible reference car.
 */
export const searchCarsWithSmartMatch = (query: string): {
  matches: CarSpec[];
  referenceMatch: CarSpec | null;
  message?: string;
} => {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    return { matches: AVAILABLE_CARS, referenceMatch: null };
  }

  const direct = AVAILABLE_CARS.filter(
    (c) => c.name.toLowerCase().includes(clean) || c.brand.toLowerCase().includes(clean)
  );

  if (direct.length > 0) {
    return { matches: direct, referenceMatch: null };
  }

  // Smart reference fallback matching for popular EVs not directly in stock
  let reference = AVAILABLE_CARS.find((c) => c.id === 'byd-atto-3') || AVAILABLE_CARS[0];
  let note = `We couldn't find "${query}" directly. Based on electric charging standards in Addis Ababa, we recommend using "${reference.name}" as your reference profile (compatible GB/T / CCS2 DC Fast profile).`;

  if (clean.includes('toyota') || clean.includes('bz4x') || clean.includes('nissan') || clean.includes('honda')) {
    reference = AVAILABLE_CARS.find((c) => c.id === 'byd-atto-3') || reference;
    note = `For "${query}", your battery architecture aligns closely with the **BYD Atto 3** reference profile (60.5 kWh, 420 km range).`;
  } else if (clean.includes('mini') || clean.includes('fiat') || clean.includes('wuling') || clean.includes('changan') || clean.includes('e-star')) {
    reference = AVAILABLE_CARS.find((c) => c.id === 'byd-seagull') || reference;
    note = `For compact city EV "${query}", we matched your setup with the **BYD Seagull** reference profile (30.1 kWh, 305 km range).`;
  } else if (clean.includes('lucid') || clean.includes('porsche') || clean.includes('taycan') || clean.includes('audi')) {
    reference = AVAILABLE_CARS.find((c) => c.id === 'audi-q4-e-tron') || reference;
    note = `For premium EV "${query}", we matched your setup with the **Audi Q4 e-tron** reference profile.`;
  }

  return {
    matches: [],
    referenceMatch: reference,
    message: note,
  };
};

export const preloadCarModel = (modelPath: string) => {
  try {
    useGLTF.preload(modelPath);
  } catch {
    // Non-blocking preload
  }
};
