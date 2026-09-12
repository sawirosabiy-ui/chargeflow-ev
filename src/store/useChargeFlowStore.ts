import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppView, Language, EVStation, ChargingHistoryRecord } from '../types';
import { MOCK_EV_STATIONS } from '../data/mockStations';
import { AVAILABLE_CARS, CarSpec } from '../data/cars';

export interface PaymentMethodItem {
  id: string;
  type: 'telebirr' | 'cbe' | 'card';
  title: string;
  subtitle: string;
  isDefault: boolean;
  iconName: string;
}

export interface ChargeFlowState {
  // Navigation & Shell
  currentView: AppView;
  isSidebarOpen: boolean;
  isCopilotOpen: boolean;
  language: Language;
  theme: 'dark' | 'cream';
  completionNotification: {
    show: boolean;
    message: string;
    finalKwh: number;
    finalCostEtb: number;
  } | null;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  
  // User & Vehicle
  user: {
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    isAuthenticated: boolean;
    twoFactorEnabled: boolean;
  };
  vehicle: {
    id: string;
    model: string;
    brand: string;
    plate: string;
    batterySoc: number;
    capacityKwh: number;
    maxRangeKm: number;
    drive?: string;
    acceleration?: string;
    modelPath: string;
    scale: number;
    paintColor: string;
    isLocked: boolean;
    isPreconditioned: boolean;
    image2D?: string;
  };
  
  // Notification Preferences
  notifications: {
    reservationReminders: boolean;
    chargingComplete: boolean;
    queueUpdates: boolean;
    paymentAlerts: boolean;
    promotional: boolean;
  };

  // Payment Methods
  paymentMethods: PaymentMethodItem[];

  // Active Station & Reservation
  selectedStationId: string | null;
  selectedBayId: string | null;
  reservation: {
    stationName: string;
    bayNumber: string;
    depositEtb: number;
    arrivalDeadlineMin: number;
    pinConfirmed: boolean;
  } | null;

  // Charging Session Engine
  chargingSession: {
    status: 'IDLE' | 'CONNECTING' | 'CHARGING' | 'PAUSED' | 'COMPLETED' | 'STOPPED' | 'ERROR';
    powerKw: number;
    energyDeliveredKwh: number;
    totalCostEtb: number;
    ratePerKwh: number;
    targetSoc: number;
    elapsedSeconds: number;
  };

  // Cinematic Single Cockpit State
  cockpitCharging: {
    status: 'idle' | 'starting' | 'charging' | 'paused' | 'stopping' | 'complete';
    battery: number;
    targetBattery: number;
    chargingPower: number;
    estimatedMinutes: number;
    rangeAddedKm: number;
    energyDeliveredKwh: number;
    batteryTempC: number;
    efficiencyKwhPer100Km: number;
    autoRotate: boolean;
    isVehicleDrawerOpen: boolean;
    selectedSubsystem: 'battery' | 'motor' | 'inverter' | 'thermal' | null;
  };

  // Station Data & History Ledger
  stations: EVStation[];
  history: ChargingHistoryRecord[];

  // Actions
  setView: (view: AppView) => void;
  toggleSidebar: () => void;
  setCopilotOpen: (open: boolean) => void;
  toggleCopilot: () => void;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  setTheme: (t: 'dark' | 'cream') => void;
  dismissCompletionNotification: () => void;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  updateUserProfile: (profile: Partial<{ name: string; email: string; phone: string; avatarUrl: string }>) => void;
  selectCar: (car: CarSpec) => void;
  updateUserBatterySoc: (soc: number) => void;
  toggleNotificationSetting: (key: keyof ChargeFlowState['notifications']) => void;
  setDefaultPaymentMethod: (id: string) => void;
  addPaymentMethod: (method: Omit<PaymentMethodItem, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  toggleTwoFactor: () => void;
  confirmReservation: (stationId: string, bayId: string) => void;
  startChargingSession: () => void;
  pauseChargingSession: () => void;
  resumeChargingSession: () => void;
  stopChargingSession: () => void;
  resetChargingSession: () => void;
  tickChargingSession: () => void;
  toggleLock: () => void;
  togglePrecondition: () => void;
  logout: () => void;

  // Cinematic Cockpit Actions
  startCockpitCharging: () => void;
  pauseCockpitCharging: () => void;
  resumeCockpitCharging: () => void;
  stopCockpitCharging: () => void;
  setCockpitAutoRotate: (auto: boolean) => void;
  toggleVehicleDrawer: () => void;
  setVehicleDrawerOpen: (open: boolean) => void;
  setSelectedSubsystem: (sub: 'battery' | 'motor' | 'inverter' | 'thermal' | null) => void;
  tickCockpitCharging: () => void;
}

export type CinematicChargingStatus =
  | 'idle'
  | 'starting'
  | 'charging'
  | 'paused'
  | 'stopping'
  | 'complete';

export const useChargeFlowStore = create<ChargeFlowState>()(
  persist(
    (set, get) => ({
      // Navigation & Shell
      currentView: 'cockpit',
      isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
      isCopilotOpen: false,
      language: 'ORM',
      theme: 'dark',
      completionNotification: null,
      isAuthModalOpen: false,
      authModalMode: 'signup',

      // User & Vehicle
      user: {
        name: 'Abiy Tesfaye',
        email: 'abiy.tesfaye@gmail.com',
        phone: '+251 91 234 5678',
        isAuthenticated: true,
        twoFactorEnabled: true,
      },
      vehicle: {
        id: AVAILABLE_CARS[0].id,
        model: AVAILABLE_CARS[0].name,
        brand: AVAILABLE_CARS[0].brand,
        plate: 'ET-3-A49281',
        batterySoc: 100,
        capacityKwh: AVAILABLE_CARS[0].capacityKwh,
        maxRangeKm: AVAILABLE_CARS[0].rangeKm,
        drive: AVAILABLE_CARS[0].drive,
        acceleration: AVAILABLE_CARS[0].acceleration,
        modelPath: AVAILABLE_CARS[0].modelPath,
        scale: AVAILABLE_CARS[0].scale,
        paintColor: '#CBD5E1',
        isLocked: true,
        isPreconditioned: false,
      },

      // Notification Defaults
      notifications: {
        reservationReminders: true,
        chargingComplete: true,
        queueUpdates: true,
        paymentAlerts: true,
        promotional: false,
      },

      // Payment Methods List
      paymentMethods: [
        {
          id: 'pm-telebirr',
          type: 'telebirr',
          title: 'Telebirr SuperApp',
          subtitle: '+251 91 ••• 5678',
          isDefault: true,
          iconName: 'Smartphone',
        },
        {
          id: 'pm-cbe',
          type: 'cbe',
          title: 'CBE Birr',
          subtitle: 'Commercial Bank of Ethiopia (•••• 8912)',
          isDefault: false,
          iconName: 'Building2',
        },
        {
          id: 'pm-visa',
          type: 'card',
          title: 'Visa Debit Card',
          subtitle: '•••• •••• •••• 4821 (Exp 08/28)',
          isDefault: false,
          iconName: 'CreditCard',
        },
      ],

      // Active Station & Reservation
      selectedStationId: 'addis-ev-hub-bole',
      selectedBayId: 'bay-03',
      reservation: {
        stationName: 'Addis EV Hub (Bole Medhanialem)',
        bayNumber: 'Bay 03',
        depositEtb: 30.00,
        arrivalDeadlineMin: 15,
        pinConfirmed: true,
      },

      // Charging Session Engine
      chargingSession: {
        status: 'CHARGING',
        powerKw: 86,
        energyDeliveredKwh: 32.4,
        totalCostEtb: 631.80,
        ratePerKwh: 19.50,
        targetSoc: 90,
        elapsedSeconds: 720,
      },

      // Cinematic Single Cockpit State
      cockpitCharging: {
        status: 'complete',
        battery: 100,
        targetBattery: 100,
        chargingPower: 0,
        estimatedMinutes: 0,
        rangeAddedKm: 310,
        energyDeliveredKwh: 42.8,
        batteryTempC: 31,
        efficiencyKwhPer100Km: 18.2,
        autoRotate: false,
        isVehicleDrawerOpen: false,
        selectedSubsystem: null,
      },

      // Stations & History
      stations: MOCK_EV_STATIONS,
      history: [
        {
          id: 'tx-01',
          date: 'May 28, 2026',
          time: '14:15',
          stationName: 'Addis EV Hub (Bole Medhanialem)',
          bayName: 'Bay 02',
          energyKwh: 24.6,
          powerKw: 86,
          durationMin: 37,
          totalCostEtb: 576,
          ratePerKwh: 19.50,
          paymentMethod: 'Telebirr',
          transactionId: 'TB-9823481902',
        },
        {
          id: 'tx-02',
          date: 'May 27, 2026',
          time: '11:04',
          stationName: 'Kazanchis Green Charge',
          bayName: 'Bay 03',
          energyKwh: 22.1,
          powerKw: 60,
          durationMin: 32,
          totalCostEtb: 397,
          ratePerKwh: 18.00,
          paymentMethod: 'CBE Birr',
          transactionId: 'CBE-390192834',
        },
        {
          id: 'tx-03',
          date: 'May 25, 2026',
          time: '16:45',
          stationName: 'Mexico Square Rapid Port',
          bayName: 'Bay 01',
          energyKwh: 28.3,
          powerKw: 120,
          durationMin: 36,
          totalCostEtb: 566,
          ratePerKwh: 20.00,
          paymentMethod: 'Telebirr',
          transactionId: 'TB-7719284102',
        },
      ],

      // Actions
      setView: (view) => set({ currentView: view }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setCopilotOpen: (open) => set({ isCopilotOpen: open }),
      toggleCopilot: () => set((state) => ({ isCopilotOpen: !state.isCopilotOpen })),
      setLanguage: (lang) => set({ language: lang }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'cream' : 'dark' })),
      setTheme: (theme) => set({ theme }),
      dismissCompletionNotification: () => set({ completionNotification: null }),
      openAuthModal: (mode = 'signup') => set({ isAuthModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      updateUserProfile: (profile) => set((state) => ({
        user: { ...state.user, ...profile }
      })),

      selectCar: (car) => set((state) => ({
        vehicle: {
          ...state.vehicle,
          id: car.id,
          model: car.name,
          brand: car.brand,
          capacityKwh: car.capacityKwh,
          maxRangeKm: car.rangeKm,
          drive: car.drive,
          acceleration: car.acceleration,
          modelPath: car.modelPath,
          scale: car.scale,
          paintColor: car.paintColor || '#2DD4BF',
        }
      })),

      updateUserBatterySoc: (soc) => set((state) => ({
        vehicle: { ...state.vehicle, batterySoc: soc }
      })),

      toggleNotificationSetting: (key) => set((state) => ({
        notifications: {
          ...state.notifications,
          [key]: !state.notifications[key]
        }
      })),

      setDefaultPaymentMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.map((pm) => ({
          ...pm,
          isDefault: pm.id === id
        }))
      })),

      addPaymentMethod: (method) => set((state) => ({
        paymentMethods: [
          ...state.paymentMethods,
          {
            ...method,
            id: `pm-${Date.now()}`
          }
        ]
      })),

      removePaymentMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.filter((pm) => pm.id !== id)
      })),

      toggleTwoFactor: () => set((state) => ({
        user: { ...state.user, twoFactorEnabled: !state.user.twoFactorEnabled }
      })),

      confirmReservation: (stationId, bayId) => {
        const station = get().stations.find((s) => s.id === stationId) || get().stations[0];
        const bay = station.bays.find((b) => b.id === bayId) || station.bays[0];

        set({
          selectedStationId: station.id,
          selectedBayId: bay.id,
          reservation: {
            stationName: station.name,
            bayNumber: bay.name,
            depositEtb: 30.00,
            arrivalDeadlineMin: 15,
            pinConfirmed: true,
          },
          currentView: 'queue',
        });
      },

      startChargingSession: () => {
        set((state) => {
          const currentSoc = state.vehicle.batterySoc || 66;
          const resetSoc = currentSoc >= 100 ? 38 : currentSoc;
          return {
            chargingSession: {
              ...state.chargingSession,
              status: 'CHARGING',
              powerKw: 148,
              energyDeliveredKwh: 0,
              totalCostEtb: 0,
              elapsedSeconds: 0,
            },
            vehicle: {
              ...state.vehicle,
              batterySoc: resetSoc,
            },
          };
        });
      },

      pauseChargingSession: () => {
        set((state) => ({
          chargingSession: {
            ...state.chargingSession,
            status: 'PAUSED',
            powerKw: 0,
          }
        }));
      },

      resumeChargingSession: () => {
        set((state) => ({
          chargingSession: {
            ...state.chargingSession,
            status: 'CHARGING',
            powerKw: 148,
          }
        }));
      },

      resetChargingSession: () => {
        set((state) => ({
          chargingSession: {
            ...state.chargingSession,
            status: 'IDLE',
            powerKw: 0,
            energyDeliveredKwh: 0,
            totalCostEtb: 0,
            elapsedSeconds: 0,
          }
        }));
      },

      stopChargingSession: () => {
        const s = get().chargingSession;
        const res = get().reservation;
        const finalKwh = Number(s.energyDeliveredKwh.toFixed(2));
        const finalCost = Math.round(finalKwh * s.ratePerKwh);

        const newRecord: ChargingHistoryRecord = {
          id: `tx-${Date.now()}`,
          date: 'Today',
          time: 'Just now',
          stationName: res?.stationName || 'Addis EV Hub (Bole)',
          bayName: res?.bayNumber || 'Bay 02',
          energyKwh: finalKwh > 0 ? finalKwh : 18.5,
          powerKw: s.powerKw,
          durationMin: Math.max(1, Math.round(s.elapsedSeconds / 60)),
          totalCostEtb: finalCost > 0 ? finalCost : 360,
          ratePerKwh: s.ratePerKwh,
          paymentMethod: 'Telebirr',
          transactionId: `TB-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        };

        set((state) => ({
          chargingSession: { ...state.chargingSession, status: 'COMPLETED', powerKw: 0 },
          history: [newRecord, ...state.history],
        }));
      },

      tickChargingSession: () => {
        const s = get().chargingSession;
        if (s.status !== 'CHARGING') return;

        const vehicle = get().vehicle;
        const currentSoc = vehicle.batterySoc || 38;
        const nextSeconds = s.elapsedSeconds + 1;

        // Progress battery % smoothly: +1% every 3 seconds (~3 minutes to fill up from 38% to 100%)
        const socIncrement = (nextSeconds % 3 === 0) ? 1 : 0;
        const nextSoc = Math.min(100, currentSoc + socIncrement);

        // Realistic dynamic power ~146-150 kW with small fluctuation
        const dynamicPower = Math.round(148 + Math.sin(nextSeconds * 0.5) * 2.5);
        const addedKwh = Number((dynamicPower / 3600).toFixed(3)); // kWh delivered in 1 second
        const nextKwh = Number((s.energyDeliveredKwh + addedKwh).toFixed(2));
        const nextCost = Math.round(nextKwh * s.ratePerKwh);

        // Auto cutoff when target SoC or 100% is reached
        if (nextSoc >= 100 || nextSoc >= (s.targetSoc || 100)) {
          const res = get().reservation;
          const finalKwh = Number((nextKwh + 0.1).toFixed(2));
          const finalCost = Math.round(finalKwh * s.ratePerKwh) || 360;

          const completeRecord: ChargingHistoryRecord = {
            id: 'tx-' + Date.now(),
            date: 'Today',
            time: 'Just now',
            stationName: res?.stationName || 'Addis EV Hub (Bole)',
            bayName: res?.bayNumber || 'Bay 03',
            energyKwh: finalKwh,
            powerKw: 149,
            durationMin: Math.max(1, Math.round(nextSeconds / 60)),
            totalCostEtb: finalCost,
            ratePerKwh: s.ratePerKwh,
            paymentMethod: 'Telebirr',
            transactionId: 'TB-' + Math.floor(1000000000 + Math.random() * 9000000000),
          };

          set((state) => ({
            chargingSession: {
              ...state.chargingSession,
              status: 'COMPLETED',
              powerKw: 0,
              energyDeliveredKwh: finalKwh,
              totalCostEtb: finalCost,
              elapsedSeconds: nextSeconds,
            },
            vehicle: {
              ...state.vehicle,
              batterySoc: 100,
            },
            history: [completeRecord, ...state.history],
            completionNotification: {
              show: true,
              message: '🎉 Battery is Full (100%)! Contact charging session at Bay 03 complete. Please disconnect to avoid idle overstay fees.',
              finalKwh: finalKwh,
              finalCostEtb: finalCost,
            },
          }));
          return;
        }

        set((state) => ({
          chargingSession: {
            ...state.chargingSession,
            powerKw: dynamicPower,
            energyDeliveredKwh: nextKwh,
            totalCostEtb: nextCost,
            elapsedSeconds: nextSeconds,
          },
          vehicle: {
            ...state.vehicle,
            batterySoc: nextSoc,
          },
        }));
      },

      toggleLock: () => set((state) => ({
        vehicle: { ...state.vehicle, isLocked: !state.vehicle.isLocked }
      })),

      togglePrecondition: () => set((state) => ({
        vehicle: { ...state.vehicle, isPreconditioned: !state.vehicle.isPreconditioned }
      })),

      logout: () => set((state) => ({
        user: { ...state.user, isAuthenticated: false },
        currentView: 'welcome',
      })),

      // Cinematic Single Cockpit Action Implementations
      startCockpitCharging: () => {
        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            status: 'starting',
            chargingPower: 30,
          }
        }));

        setTimeout(() => {
          const current = get().cockpitCharging.status;
          if (current === 'starting') {
            set((state) => ({
              cockpitCharging: {
                ...state.cockpitCharging,
                status: 'charging',
                chargingPower: 120,
              }
            }));
          }
        }, 1200);
      },

      pauseCockpitCharging: () => {
        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            status: 'paused',
            chargingPower: 0,
          }
        }));
      },

      resumeCockpitCharging: () => {
        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            status: 'charging',
            chargingPower: 120,
          }
        }));
      },

      stopCockpitCharging: () => {
        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            status: 'stopping',
            chargingPower: 0,
          }
        }));

        setTimeout(() => {
          const current = get().cockpitCharging.status;
          if (current === 'stopping') {
            set((state) => ({
              cockpitCharging: {
                ...state.cockpitCharging,
                status: 'idle',
                chargingPower: 0,
              }
            }));
          }
        }, 700);
      },

      setCockpitAutoRotate: (auto) => {
        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            autoRotate: auto,
          }
        }));
      },

      toggleVehicleDrawer: () => {
        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            isVehicleDrawerOpen: !state.cockpitCharging.isVehicleDrawerOpen,
          }
        }));
      },

      setVehicleDrawerOpen: (open) => {
        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            isVehicleDrawerOpen: open,
          }
        }));
      },

      setSelectedSubsystem: (sub) => {
        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            selectedSubsystem: sub,
          }
        }));
      },

      tickCockpitCharging: () => {
        const c = get().cockpitCharging;
        if (c.status !== 'charging') return;

        if (c.battery >= c.targetBattery) {
          set((state) => ({
            cockpitCharging: {
              ...state.cockpitCharging,
              status: 'complete',
              battery: 100,
              chargingPower: 0,
              estimatedMinutes: 0,
            }
          }));
          return;
        }

        const nextBattery = Math.min(100, Number((c.battery + 0.15).toFixed(1)));
        const nextEnergy = Number((c.energyDeliveredKwh + 0.04).toFixed(2));
        const nextRange = Math.round(180 + (nextBattery - 67) * 4.2);
        const nextMins = Math.max(1, Math.round((c.targetBattery - nextBattery) * 0.72));

        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            battery: nextBattery,
            energyDeliveredKwh: nextEnergy,
            rangeAddedKm: nextRange,
            estimatedMinutes: nextMins,
          }
        }));
      },
    }),
    {
      name: 'chargeflow-storage-v3',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        vehicle: state.vehicle,
        language: state.language,
        notifications: state.notifications,
        paymentMethods: state.paymentMethods,
        reservation: state.reservation,
        history: state.history,
      }),
    }
  )
);
