import { EVStation } from '../types';

export const MOCK_EV_STATIONS: EVStation[] = [
  {
    id: 'addis-ev-hub-bole',
    name: 'Addis EV Hub (Bole Medhanialem)',
    area: 'Bole, Addis Ababa',
    address: 'Cameroon St, Next to Medhanialem Mall',
    distanceKm: 2.4,
    etaMin: 9,
    pricePerKwh: 19.50,
    maxPowerKw: 120,
    totalBays: 8,
    availableBays: 5,
    connectors: ['GB/T', 'CCS2'],
    coordinates: { x: 62, y: 44 },
    imageUrl: '/images/stations/addis-ev-hub.jpg',
    bays: [
      { id: 'bay-01', name: 'Bay 01 (DC Fast)', powerKw: 120, connector: 'GB/T', status: 'charging' },
      { id: 'bay-02', name: 'Bay 02 (DC Fast)', powerKw: 120, connector: 'GB/T', status: 'available' },
      { id: 'bay-03', name: 'Bay 03 (DC Fast)', powerKw: 120, connector: 'CCS2', status: 'available' },
      { id: 'bay-04', name: 'Bay 04 (DC Fast)', powerKw: 120, connector: 'GB/T', status: 'reserved' },
      { id: 'bay-05', name: 'Bay 05 (DC Fast)', powerKw: 120, connector: 'CCS2', status: 'available' },
      { id: 'bay-06', name: 'Bay 06 (DC Fast)', powerKw: 120, connector: 'GB/T', status: 'available' },
    ]
  },
  {
    id: 'kazanchis-green-charge',
    name: 'Kazanchis Green Charge Hub',
    area: 'Kazanchis, Addis Ababa',
    address: 'Menelik II Ave, UNECA District',
    distanceKm: 3.8,
    etaMin: 14,
    pricePerKwh: 18.00,
    maxPowerKw: 60,
    totalBays: 6,
    availableBays: 3,
    connectors: ['GB/T'],
    coordinates: { x: 48, y: 32 },
    imageUrl: '/images/stations/kazanchis.jpg',
    bays: [
      { id: 'kz-01', name: 'Bay 01 (DC 60kW)', powerKw: 60, connector: 'GB/T', status: 'available' },
      { id: 'kz-02', name: 'Bay 02 (DC 60kW)', powerKw: 60, connector: 'GB/T', status: 'charging' },
      { id: 'kz-03', name: 'Bay 03 (DC 60kW)', powerKw: 60, connector: 'GB/T', status: 'available' },
      { id: 'kz-04', name: 'Bay 04 (DC 60kW)', powerKw: 60, connector: 'GB/T', status: 'available' },
    ]
  },
  {
    id: 'mexico-square-rapid',
    name: 'Mexico Square Rapid Port',
    area: 'Kirkos, Addis Ababa',
    address: 'Ras Abebe Aregay St, Near LRT Station',
    distanceKm: 5.1,
    etaMin: 18,
    pricePerKwh: 20.00,
    maxPowerKw: 120,
    totalBays: 8,
    availableBays: 4,
    connectors: ['GB/T', 'CCS2'],
    coordinates: { x: 34, y: 52 },
    imageUrl: '/images/stations/addis-ev-hub.jpg',
    bays: [
      { id: 'mx-01', name: 'Bay 01 (DC Fast)', powerKw: 120, connector: 'GB/T', status: 'available' },
      { id: 'mx-02', name: 'Bay 02 (DC Fast)', powerKw: 120, connector: 'CCS2', status: 'available' },
      { id: 'mx-03', name: 'Bay 03 (DC Fast)', powerKw: 120, connector: 'GB/T', status: 'charging' },
      { id: 'mx-04', name: 'Bay 04 (DC Fast)', powerKw: 120, connector: 'GB/T', status: 'available' },
    ]
  },
  {
    id: 'cmc-terminal-charge',
    name: 'CMC Terminal Charge',
    area: 'Yeka / CMC, Addis Ababa',
    address: 'CMC Road, Near Sunshine Real Estate',
    distanceKm: 7.2,
    etaMin: 22,
    pricePerKwh: 16.50,
    maxPowerKw: 30,
    totalBays: 4,
    availableBays: 2,
    connectors: ['GB/T', 'Type 2'],
    coordinates: { x: 78, y: 24 },
    bays: [
      { id: 'cmc-01', name: 'Bay 01 (AC/DC)', powerKw: 30, connector: 'GB/T', status: 'available' },
      { id: 'cmc-02', name: 'Bay 02 (AC/DC)', powerKw: 30, connector: 'Type 2', status: 'charging' },
      { id: 'cmc-03', name: 'Bay 03 (AC/DC)', powerKw: 30, connector: 'GB/T', status: 'available' },
    ]
  }
];
