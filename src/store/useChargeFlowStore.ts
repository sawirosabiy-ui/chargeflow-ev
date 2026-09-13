import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppView, Language, EVStation, ChargingHistoryRecord } from '../types';
import { MOCK_EV_STATIONS } from '../data/mockStations';
import { AVAILABLE_CARS, CarSpec } from '../data/cars';
import {
  DbUser,
  DbTransaction,
  DbReservation,
  getUserWallet,
  deductWalletFee,
  topupWallet,
  saveUserReservation,
  updateReservationStatus,
  cancelUserReservation,
  getUserActiveReservation,
  getUserHistory,
  recordUserCompletedSession,
} from '../data/db';

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
  pendingIntent: {
    view?: AppView;
    action?: string;
    payload?: any;
  } | null;

  // User & Vehicle (Defaults to Unauthenticated Guest)
  user: {
    id: string;
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

  // User Wallet & Ledger
  wallet: {
    balanceEtb: number;
    transactions: DbTransaction[];
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
    id?: string;
    stationId?: string;
    stationName: string;
    bayId?: string;
    bayNumber: string;
    depositEtb: number;
    slotTime?: string;
    date?: string;
    status: 'RESERVED' | 'QUEUED' | 'READY_TO_CHARGE' | 'CHARGING' | 'COMPLETED' | 'CANCELLED';
    queuePosition?: number;
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

  // Station Data & History Ledger (Isolated per User)
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
  setPendingIntent: (intent: { view?: AppView; action?: string; payload?: any } | null) => void;
  requireAuth: (intent?: { view?: AppView; action?: string; payload?: any }) => boolean;
  loginUser: (user: DbUser) => void;
  loadUserData: (userId: string) => void;
  updateUserProfile: (profile: Partial<{ name: string; email: string; phone: string; avatarUrl: string }>) => void;
  selectCar: (car: CarSpec) => void;
  updateUserBatterySoc: (soc: number) => void;
  toggleNotificationSetting: (key: keyof ChargeFlowState['notifications']) => void;
  setDefaultPaymentMethod: (id: string) => void;
  addPaymentMethod: (method: Omit<PaymentMethodItem, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  toggleTwoFactor: () => void;
  
  // Wallet Actions
  topupWalletBalance: (amount: number, method?: string) => void;

  // Reservation & Charging State Machine
  confirmReservation: (stationId: string, bayId: string, slotTime?: string, date?: string) => { success: boolean; error?: string };
  setReadyToCharge: () => void;
  cancelActiveReservation: () => void;
  startChargingSession: () => boolean;
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
      currentView: 'welcome',
      isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
      isCopilotOpen: false,
      language: 'EN',
      theme: 'dark',
      completionNotification: null,
      isAuthModalOpen: false,
      authModalMode: 'signup',
      pendingIntent: null,

      // Initial Guest User State (No fake hardcoded user)
      user: {
        id: '',
        name: '',
        email: '',
        phone: '',
        isAuthenticated: false,
        twoFactorEnabled: false,
      },

      // Vehicle (Default showroom vehicle)
      vehicle: {
        id: AVAILABLE_CARS[0].id,
        model: AVAILABLE_CARS[0].name,
        brand: AVAILABLE_CARS[0].brand,
        plate: 'ET-3-A49281',
        batterySoc: 38,
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

      // User-specific Wallet (Empty until account creation / sign-in)
      wallet: {
        balanceEtb: 0,
        transactions: [],
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

      // Active Station & Reservation (Clean state: No fake active reservation)
      selectedStationId: null,
      selectedBayId: null,
      reservation: null,

      // Charging Session Engine (Clean state: No fake active charging session)
      chargingSession: {
        status: 'IDLE',
        powerKw: 0,
        energyDeliveredKwh: 0,
        totalCostEtb: 0,
        ratePerKwh: 19.50,
        targetSoc: 90,
        elapsedSeconds: 0,
      },

      // Cinematic Single Cockpit State (Clean state)
      cockpitCharging: {
        status: 'idle',
        battery: 38,
        targetBattery: 90,
        chargingPower: 0,
        estimatedMinutes: 0,
        rangeAddedKm: 0,
        energyDeliveredKwh: 0,
        batteryTempC: 25,
        efficiencyKwhPer100Km: 18.2,
        autoRotate: false,
        isVehicleDrawerOpen: false,
        selectedSubsystem: null,
      },

      // Stations & History (Clean state: No fake history records)
      stations: MOCK_EV_STATIONS,
      history: [],

      // Actions
      setView: (view) => set({ currentView: view }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setCopilotOpen: (open) => set({ isCopilotOpen: open }),
      toggleCopilot: () => set((state) => ({ isCopilotOpen: !state.isCopilotOpen })),
      setLanguage: (lang) => set({ language: lang }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'cream' : 'dark' })),
      setTheme: (t) => set({ theme: t }),
      dismissCompletionNotification: () => set({ completionNotification: null }),
      openAuthModal: (mode = 'signup') => set({ isAuthModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      setPendingIntent: (intent) => set({ pendingIntent: intent }),

      requireAuth: (intent) => {
        const isAuth = get().user.isAuthenticated;
        if (!isAuth) {
          set({
            pendingIntent: intent || null,
            isAuthModalOpen: true,
            authModalMode: 'signup',
          });
          return false;
        }
        return true;
      },

      loginUser: (dbUser) => {
        const userId = dbUser.id;
        const walletData = getUserWallet(userId);
        const activeRes = getUserActiveReservation(userId);
        const userSessions = getUserHistory(userId);

        const chosenCar = AVAILABLE_CARS.find((c) => c.id === dbUser.vehicleId) || AVAILABLE_CARS[0];
        const batterySoc = dbUser.batterySoc || 38;

        const historyRecords: ChargingHistoryRecord[] = userSessions.map((s) => ({
          id: s.id,
          date: s.date,
          time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stationName: s.stationName,
          bayName: s.bayNumber,
          energyKwh: s.energyKwh,
          powerKw: 120,
          durationMin: s.durationMin,
          totalCostEtb: s.costEtb,
          ratePerKwh: s.ratePerKwh || 19.50,
          paymentMethod: s.paymentMethod || 'Telebirr',
          transactionId: s.transactionId || `TB-${s.id}`,
        }));

        set((state) => {
          const nextReservation = activeRes
            ? {
                id: activeRes.id,
                stationId: activeRes.stationId,
                stationName: activeRes.stationName,
                bayId: activeRes.bayId,
                bayNumber: activeRes.bayNumber,
                depositEtb: activeRes.depositEtb,
                slotTime: activeRes.slotTime,
                date: activeRes.date,
                status: activeRes.status,
                queuePosition: activeRes.queuePosition,
                arrivalDeadlineMin: activeRes.arrivalDeadlineMin,
                pinConfirmed: activeRes.pinConfirmed,
              }
            : null;

          return {
            user: {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              phone: dbUser.phone,
              isAuthenticated: true,
              twoFactorEnabled: false,
            },
            vehicle: {
              ...state.vehicle,
              id: chosenCar.id,
              model: chosenCar.name,
              brand: chosenCar.brand,
              capacityKwh: chosenCar.capacityKwh,
              maxRangeKm: chosenCar.rangeKm,
              modelPath: chosenCar.modelPath,
              scale: chosenCar.scale,
              batterySoc,
            },
            cockpitCharging: {
              ...state.cockpitCharging,
              battery: batterySoc,
            },
            wallet: {
              balanceEtb: walletData.balance,
              transactions: walletData.transactions,
            },
            reservation: nextReservation,
            history: historyRecords,
            isAuthModalOpen: false,
          };
        });

        // Handle pending intent if user tried to perform an action as guest
        const intent = get().pendingIntent;
        if (intent?.view) {
          set({ currentView: intent.view, pendingIntent: null });
        } else {
          set({ currentView: 'cockpit', pendingIntent: null });
        }
      },

      loadUserData: (userId) => {
        if (!userId) return;
        const walletData = getUserWallet(userId);
        const activeRes = getUserActiveReservation(userId);
        const userSessions = getUserHistory(userId);

        const historyRecords: ChargingHistoryRecord[] = userSessions.map((s) => ({
          id: s.id,
          date: s.date,
          time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stationName: s.stationName,
          bayName: s.bayNumber,
          energyKwh: s.energyKwh,
          powerKw: 120,
          durationMin: s.durationMin,
          totalCostEtb: s.costEtb,
          ratePerKwh: s.ratePerKwh || 19.50,
          paymentMethod: s.paymentMethod || 'Telebirr',
          transactionId: s.transactionId || `TB-${s.id}`,
        }));

        set({
          wallet: {
            balanceEtb: walletData.balance,
            transactions: walletData.transactions,
          },
          history: historyRecords,
          reservation: activeRes
            ? {
                id: activeRes.id,
                stationId: activeRes.stationId,
                stationName: activeRes.stationName,
                bayId: activeRes.bayId,
                bayNumber: activeRes.bayNumber,
                depositEtb: activeRes.depositEtb,
                slotTime: activeRes.slotTime,
                date: activeRes.date,
                status: activeRes.status,
                queuePosition: activeRes.queuePosition,
                arrivalDeadlineMin: activeRes.arrivalDeadlineMin,
                pinConfirmed: activeRes.pinConfirmed,
              }
            : null,
        });
      },

      updateUserProfile: (profile) =>
        set((state) => ({
          user: { ...state.user, ...profile },
        })),

      selectCar: (car) =>
        set((state) => ({
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
          },
        })),

      updateUserBatterySoc: (soc) =>
        set((state) => ({
          vehicle: { ...state.vehicle, batterySoc: soc },
          cockpitCharging: { ...state.cockpitCharging, battery: soc },
        })),

      toggleNotificationSetting: (key) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: !state.notifications[key],
          },
        })),

      setDefaultPaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((pm) => ({
            ...pm,
            isDefault: pm.id === id,
          })),
        })),

      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [
            ...state.paymentMethods,
            { ...method, id: `pm-${Date.now()}` },
          ],
        })),

      removePaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((pm) => pm.id !== id),
        })),

      toggleTwoFactor: () =>
        set((state) => ({
          user: { ...state.user, twoFactorEnabled: !state.user.twoFactorEnabled },
        })),

      // Top up user-specific wallet
      topupWalletBalance: (amount, method = 'Telebirr') => {
        const userId = get().user.id;
        if (!userId) return;
        const res = topupWallet(userId, amount, method);
        if (res.success) {
          const fresh = getUserWallet(userId);
          set({
            wallet: {
              balanceEtb: fresh.balance,
              transactions: fresh.transactions,
            },
          });
        }
      },

      // RESERVATION STATE MACHINE
      confirmReservation: (stationId, bayId, slotTime = '18:00 - 18:30', date = 'Today, May 16') => {
        const isAuth = get().requireAuth({
          view: 'reservation',
          action: 'confirm_reservation',
          payload: { stationId, bayId },
        });
        if (!isAuth) {
          return { success: false, error: 'Authentication required' };
        }

        const userId = get().user.id;
        const station = get().stations.find((s) => s.id === stationId) || get().stations[0];
        const bay = station.bays.find((b) => b.id === bayId) || station.bays[0];
        const depositFee = 50.0; // Standard 50 ETB reservation fee

        // Check wallet balance
        const currentBalance = get().wallet.balanceEtb;
        if (currentBalance < depositFee) {
          return {
            success: false,
            error: `Insufficient wallet balance (${currentBalance} ETB). 50 ETB reservation fee required.`,
          };
        }

        // Deduct reservation fee from user-isolated ledger
        const deduction = deductWalletFee(userId, depositFee, 'RESERVATION_FEE', {
          stationName: station.name,
          bayNumber: bay.name,
          description: `Reservation deposit for ${bay.name} at ${station.name}`,
        });

        if (!deduction.success) {
          return { success: false, error: deduction.error };
        }

        // Create persistent user-isolated reservation
        const newReservation: DbReservation = {
          id: `RES-${Date.now().toString().slice(-4)}`,
          userId,
          stationId: station.id,
          stationName: station.name,
          bayId: bay.id,
          bayNumber: bay.name,
          depositEtb: depositFee,
          slotTime,
          date,
          status: 'QUEUED',
          queuePosition: 2, // Conceptually in line
          arrivalDeadlineMin: 15,
          pinConfirmed: true,
          createdAt: Date.now(),
        };

        saveUserReservation(userId, newReservation);
        const freshWallet = getUserWallet(userId);

        set({
          selectedStationId: station.id,
          selectedBayId: bay.id,
          wallet: {
            balanceEtb: freshWallet.balance,
            transactions: freshWallet.transactions,
          },
          reservation: {
            id: newReservation.id,
            stationId: station.id,
            stationName: station.name,
            bayId: bay.id,
            bayNumber: bay.name,
            depositEtb: depositFee,
            slotTime,
            date,
            status: 'QUEUED',
            queuePosition: 2,
            arrivalDeadlineMin: 15,
            pinConfirmed: true,
          },
          currentView: 'queue',
        });

        return { success: true };
      },

      setReadyToCharge: () => {
        const userId = get().user.id;
        const res = get().reservation;
        if (!res) return;

        updateReservationStatus(userId, 'READY_TO_CHARGE');
        set((state) => ({
          reservation: state.reservation
            ? { ...state.reservation, status: 'READY_TO_CHARGE', queuePosition: 1 }
            : null,
        }));
      },

      cancelActiveReservation: () => {
        const userId = get().user.id;
        cancelUserReservation(userId);
        set({
          reservation: null,
          selectedBayId: null,
          selectedStationId: null,
          currentView: 'find_charge',
        });
      },

      // CHARGING STATE MACHINE
      startChargingSession: () => {
        const isAuth = get().requireAuth();
        if (!isAuth) return false;

        const res = get().reservation;
        // Require valid reservation in READY_TO_CHARGE or RESERVED state
        if (!res) {
          set({ currentView: 'find_charge' });
          return false;
        }

        const userId = get().user.id;
        updateReservationStatus(userId, 'CHARGING');

        set((state) => {
          const currentSoc = state.vehicle.batterySoc || 38;
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
            cockpitCharging: {
              ...state.cockpitCharging,
              status: 'charging',
              battery: resetSoc,
              chargingPower: 148,
            },
            reservation: state.reservation
              ? { ...state.reservation, status: 'CHARGING' }
              : null,
            currentView: 'charging',
          };
        });

        return true;
      },

      pauseChargingSession: () => {
        set((state) => ({
          chargingSession: {
            ...state.chargingSession,
            status: 'PAUSED',
            powerKw: 0,
          },
          cockpitCharging: {
            ...state.cockpitCharging,
            status: 'paused',
            chargingPower: 0,
          },
        }));
      },

      resumeChargingSession: () => {
        set((state) => ({
          chargingSession: {
            ...state.chargingSession,
            status: 'CHARGING',
            powerKw: 148,
          },
          cockpitCharging: {
            ...state.cockpitCharging,
            status: 'charging',
            chargingPower: 148,
          },
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
          },
        }));
      },

      stopChargingSession: () => {
        const userId = get().user.id;
        const s = get().chargingSession;
        const res = get().reservation;
        const vehicle = get().vehicle;

        const finalKwh = Number(s.energyDeliveredKwh.toFixed(2)) || 18.5;
        const finalCost = Math.round(finalKwh * s.ratePerKwh) || 360;

        // Deduct charging cost from wallet
        if (userId) {
          deductWalletFee(userId, finalCost, 'CHARGING_SESSION', {
            stationName: res?.stationName || 'Addis EV Hub (Bole)',
            bayNumber: res?.bayNumber || 'Bay 03',
            description: `Charging Session (${finalKwh} kWh delivered at ${s.ratePerKwh} ETB/kWh)`,
          });

          // Record real completed session in DB
          recordUserCompletedSession(userId, {
            stationName: res?.stationName || 'Addis EV Hub (Bole)',
            bayNumber: res?.bayNumber || 'Bay 03',
            vehicleModel: vehicle.model,
            energyKwh: finalKwh,
            costEtb: finalCost,
            durationMin: Math.max(1, Math.round(s.elapsedSeconds / 60)),
            batterySocStart: 38,
            batterySocEnd: vehicle.batterySoc || 90,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            paymentMethod: 'Telebirr',
            transactionId: `TB-${Date.now().toString().slice(-8)}`,
            ratePerKwh: s.ratePerKwh,
          });

          // Clear completed reservation
          cancelUserReservation(userId);
        }

        const freshWallet = userId ? getUserWallet(userId) : { balance: 0, transactions: [] };
        const freshSessions = userId ? getUserHistory(userId) : [];

        const updatedHistory: ChargingHistoryRecord[] = freshSessions.map((sess) => ({
          id: sess.id,
          date: sess.date,
          time: new Date(sess.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stationName: sess.stationName,
          bayName: sess.bayNumber,
          energyKwh: sess.energyKwh,
          powerKw: 120,
          durationMin: sess.durationMin,
          totalCostEtb: sess.costEtb,
          ratePerKwh: sess.ratePerKwh || 19.50,
          paymentMethod: sess.paymentMethod || 'Telebirr',
          transactionId: sess.transactionId || `TB-${sess.id}`,
        }));

        set((state) => ({
          chargingSession: { ...state.chargingSession, status: 'COMPLETED', powerKw: 0 },
          cockpitCharging: {
            ...state.cockpitCharging,
            status: 'complete',
            chargingPower: 0,
            battery: state.vehicle.batterySoc,
          },
          reservation: null,
          wallet: {
            balanceEtb: freshWallet.balance,
            transactions: freshWallet.transactions,
          },
          history: updatedHistory,
          completionNotification: {
            show: true,
            message: `Charging completed: ${finalKwh} kWh delivered (${finalCost} ETB deducted from wallet).`,
            finalKwh,
            finalCostEtb: finalCost,
          },
        }));
      },

      tickChargingSession: () => {
        const s = get().chargingSession;
        if (s.status !== 'CHARGING') return;

        const vehicle = get().vehicle;
        const currentSoc = vehicle.batterySoc || 38;
        const nextSeconds = s.elapsedSeconds + 1;

        // Progress battery smoothly: +1% every 3 seconds
        const socIncrement = nextSeconds % 3 === 0 ? 1 : 0;
        const nextSoc = Math.min(100, currentSoc + socIncrement);

        const dynamicPower = Math.round(148 + Math.sin(nextSeconds * 0.5) * 2.5);
        const addedKwh = Number((dynamicPower / 3600).toFixed(3));
        const nextKwh = Number((s.energyDeliveredKwh + addedKwh).toFixed(2));
        const nextCost = Math.round(nextKwh * s.ratePerKwh);

        // Auto completion if targetSoc or 100 reached
        if (nextSoc >= 100 || nextSoc >= (s.targetSoc || 100)) {
          set((state) => ({
            vehicle: { ...state.vehicle, batterySoc: nextSoc },
            cockpitCharging: { ...state.cockpitCharging, battery: nextSoc },
          }));
          get().stopChargingSession();
          return;
        }

        set((state) => ({
          chargingSession: {
            ...state.chargingSession,
            elapsedSeconds: nextSeconds,
            powerKw: dynamicPower,
            energyDeliveredKwh: nextKwh,
            totalCostEtb: nextCost,
          },
          vehicle: {
            ...state.vehicle,
            batterySoc: nextSoc,
          },
          cockpitCharging: {
            ...state.cockpitCharging,
            battery: nextSoc,
            energyDeliveredKwh: nextKwh,
            chargingPower: dynamicPower,
          },
        }));
      },

      toggleLock: () =>
        set((state) => ({
          vehicle: { ...state.vehicle, isLocked: !state.vehicle.isLocked },
        })),

      togglePrecondition: () =>
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            isPreconditioned: !state.vehicle.isPreconditioned,
          },
        })),

      logout: () => {
        set({
          user: {
            id: '',
            name: '',
            email: '',
            phone: '',
            isAuthenticated: false,
            twoFactorEnabled: false,
          },
          wallet: {
            balanceEtb: 0,
            transactions: [],
          },
          reservation: null,
          history: [],
          chargingSession: {
            status: 'IDLE',
            powerKw: 0,
            energyDeliveredKwh: 0,
            totalCostEtb: 0,
            ratePerKwh: 19.50,
            targetSoc: 90,
            elapsedSeconds: 0,
          },
          cockpitCharging: {
            status: 'idle',
            battery: 38,
            targetBattery: 90,
            chargingPower: 0,
            estimatedMinutes: 0,
            rangeAddedKm: 0,
            energyDeliveredKwh: 0,
            batteryTempC: 25,
            efficiencyKwhPer100Km: 18.2,
            autoRotate: false,
            isVehicleDrawerOpen: false,
            selectedSubsystem: null,
          },
          currentView: 'welcome',
          pendingIntent: null,
        });
      },

      // Cinematic Cockpit Actions
      startCockpitCharging: () => {
        const isAuth = get().requireAuth();
        if (!isAuth) return;
        if (!get().reservation) {
          set({ currentView: 'find_charge' });
          return;
        }
        get().startChargingSession();
      },

      pauseCockpitCharging: () => get().pauseChargingSession(),
      resumeCockpitCharging: () => get().resumeChargingSession(),
      stopCockpitCharging: () => get().stopChargingSession(),

      setCockpitAutoRotate: (auto) =>
        set((state) => ({
          cockpitCharging: { ...state.cockpitCharging, autoRotate: auto },
        })),

      toggleVehicleDrawer: () =>
        set((state) => ({
          cockpitCharging: {
            ...state.cockpitCharging,
            isVehicleDrawerOpen: !state.cockpitCharging.isVehicleDrawerOpen,
          },
        })),

      setVehicleDrawerOpen: (open) =>
        set((state) => ({
          cockpitCharging: { ...state.cockpitCharging, isVehicleDrawerOpen: open },
        })),

      setSelectedSubsystem: (sub) =>
        set((state) => ({
          cockpitCharging: { ...state.cockpitCharging, selectedSubsystem: sub },
        })),

      tickCockpitCharging: () => get().tickChargingSession(),
    }),
    {
      name: 'chargeflow-session-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        user: state.user,
        vehicle: state.vehicle,
        wallet: state.wallet,
        reservation: state.reservation,
        history: state.history,
      }),
    }
  )
);

export default useChargeFlowStore;
