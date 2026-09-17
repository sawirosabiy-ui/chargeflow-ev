import React, { useState } from 'react';
import { 
  User, 
  Car, 
  Globe, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  Check, 
  CreditCard,
  Lock,
  Edit,
  Mail,
  Phone,
  MapPin,
  Camera,
  Trash2,
  ChevronRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  Zap,
  Activity,
  Plus,
  Building2,
  Smartphone,
  AlertCircle,
  Key,
  Shield,
  SmartphoneNfc
} from 'lucide-react';
import { useChargeFlowStore, PaymentMethodItem } from '../../store/useChargeFlowStore';
import { useTranslation } from '../../localization/useTranslation';
import { AVAILABLE_CARS, CarSpec, VEHICLE_COLORS, getVehicleColorByHex } from '../../data/cars';
import { Language } from '../../types';
import { VehicleCutout } from '../vehicle/VehicleCutout';

export const SettingsView: React.FC = () => {
  const user = useChargeFlowStore((s) => s.user);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const language = useChargeFlowStore((s) => s.language);
  const setLanguage = useChargeFlowStore((s) => s.setLanguage);
  const selectCar = useChargeFlowStore((s) => s.selectCar);
  const setVehicleColor = useChargeFlowStore((s) => s.setVehicleColor);
  const updateUserProfile = useChargeFlowStore((s) => s.updateUserProfile);
  const notifications = useChargeFlowStore((s) => s.notifications);
  const toggleNotificationSetting = useChargeFlowStore((s) => s.toggleNotificationSetting);
  const paymentMethods = useChargeFlowStore((s) => s.paymentMethods);
  const setDefaultPaymentMethod = useChargeFlowStore((s) => s.setDefaultPaymentMethod);
  const addPaymentMethod = useChargeFlowStore((s) => s.addPaymentMethod);
  const removePaymentMethod = useChargeFlowStore((s) => s.removePaymentMethod);
  const toggleTwoFactor = useChargeFlowStore((s) => s.toggleTwoFactor);
  const logout = useChargeFlowStore((s) => s.logout);
  const setView = useChargeFlowStore((s) => s.setView);
  const theme = useChargeFlowStore((s) => s.theme);
  const { t } = useTranslation();
  const isCream = theme === 'cream';

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicle' | 'charging' | 'notifications' | 'payments' | 'security'>('profile');

  // Modals & Forms State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Profile Form state
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email || 'abiy.tesfaye@gmail.com');
  const [phoneInput, setPhoneInput] = useState(user.phone);

  // Add Payment Form state
  const [newPaymentType, setNewPaymentType] = useState<'telebirr' | 'cbe' | 'card'>('telebirr');
  const [newPaymentTitle, setNewPaymentTitle] = useState('');
  const [newPaymentSubtitle, setNewPaymentSubtitle] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = () => {
    updateUserProfile({
      name: nameInput,
      email: emailInput,
      phone: phoneInput,
    });
    setIsEditProfileOpen(false);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentTitle) return;
    addPaymentMethod({
      type: newPaymentType,
      title: newPaymentTitle,
      subtitle: newPaymentSubtitle || 'Connected Account',
      isDefault: false,
      iconName: newPaymentType === 'telebirr' ? 'Smartphone' : newPaymentType === 'cbe' ? 'Building2' : 'CreditCard',
    });
    setNewPaymentTitle('');
    setNewPaymentSubtitle('');
    setIsAddPaymentOpen(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length >= 6) {
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setIsChangePasswordOpen(false);
        setCurrentPassword('');
        setNewPassword('');
      }, 1200);
    }
  };

  const tabs = [
    { id: 'profile', label: t.profileTab, icon: User },
    { id: 'vehicle', label: t.myVehicleTab, icon: Car },
    { id: 'charging', label: t.chargingPerfTab, icon: Activity },
    { id: 'notifications', label: t.notificationsTab, icon: Bell },
    { id: 'payments', label: t.paymentsTab, icon: CreditCard },
    { id: 'security', label: t.securityTab, icon: ShieldCheck },
  ];

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 select-none min-w-0 font-sans transition-colors duration-300 ${isCream ? "bg-[#FAF8F5] text-stone-900" : "bg-[#070B11] text-slate-100"}`}>

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isCream ? "text-stone-900" : "text-white"}`}>{t.settingsTitle}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.manageAccountSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-xl bg-[#0E131F] border border-white/5 text-slate-300">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2DD4BF]"></span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2DD4BF] to-teal-400 p-0.5 shadow">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[#2DD4BF] font-bold text-xs">
                {user.name.split(' ')[0][0]}{user.name.split(' ')[1]?.[0] || 'A'}
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight">{user.name}</span>
              <span className="text-[10px] text-[#2DD4BF] font-mono block">Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Tab Navigation Bar (Matching Settings.jpg) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/5 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#133835] text-[#2DD4BF] border border-[#2DD4BF]/40 shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2DD4BF]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Grid: Active Tab Content (8 Cols) + Right Status Cards (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 Cols): Dynamic Tab Views */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Overview Card */}
              <div className={`p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 text-stone-900 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-5 shadow-2xl relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                    {t.profileOverview}
                  </span>
                  <button
                    onClick={() => {
                      setNameInput(user.name);
                      setEmailInput(user.email || 'abiy.tesfaye@gmail.com');
                      setPhoneInput(user.phone);
                      setIsEditProfileOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131A29] hover:bg-slate-800 border border-white/10 text-xs font-semibold text-white transition-all"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span>{t.editProfileBtn}</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#2DD4BF] to-teal-500 p-1 shadow-xl">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white text-2xl font-black">
                        {user.name.split(' ')[0][0]}{user.name.split(' ')[1]?.[0] || 'A'}
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsEditProfileOpen(true)}
                      className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#2DD4BF] text-slate-950 shadow-md hover:scale-110 transition-transform"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-lg font-black text-white">{user.name}</h2>
                      <span className="w-4 h-4 rounded-full bg-[#2DD4BF] text-slate-950 flex items-center justify-center text-[10px] font-bold">✓</span>
                    </div>
                    <div className="text-xs text-amber-400 font-medium">👑 Premium Member</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-mono pt-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-[#2DD4BF]" />
                        <span>{user.email || 'abiy.tesfaye@gmail.com'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-[#2DD4BF]" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 sm:col-span-2">
                        <MapPin className="w-3.5 h-3.5 text-[#2DD4BF]" />
                        <span>Addis Ababa, Ethiopia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Language Settings Card */}
              <div className={`p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 text-stone-900 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-4 shadow-2xl`}>
                <div className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                  {t.regionalLanguagePref}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { code: 'EN', label: 'English (US)' },
                    { code: 'አማ', label: 'አማርኛ (Amharic)' },
                    { code: 'ORM', label: 'Afaan Oromoo' },
                    { code: 'TIR', label: 'ትግርኛ (Tigrinya)' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as Language)}
                      className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                        language === lang.code
                          ? 'bg-[#2DD4BF]/15 border-[#2DD4BF] text-[#2DD4BF]'
                          : 'bg-[#131A29] border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {language === lang.code && <Check className="w-4 h-4 text-[#2DD4BF]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY VEHICLE */}
          {activeTab === 'vehicle' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 text-stone-900 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-5 shadow-2xl`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                    {t.activeVehicleSpecs}
                  </span>
                  <button
                    onClick={() => setIsEditVehicleOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] text-slate-950 font-black text-xs transition-all shadow-md"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{t.switchModelBtn}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-6 space-y-3">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase">{vehicle.model}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Active Telemetry Connected</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 text-xs font-mono">
                      <div className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} flex items-center justify-between`}>
                        <span className={`font-sans ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.batteryCapacity}</span>
                        <span className="font-bold text-white">{vehicle.capacityKwh} kWh</span>
                      </div>
                      <div className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} flex items-center justify-between`}>
                        <span className={`font-sans ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.estimatedRange}</span>
                        <span className="font-bold text-emerald-400">{vehicle.maxRangeKm} km</span>
                      </div>
                      <div className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} flex items-center justify-between`}>
                        <span className={`font-sans ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.connectorProtocol}</span>
                        <span className="font-bold text-white">GB/T DC Fast</span>
                      </div>
                      <div className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} flex items-center justify-between`}>
                        <span className={`font-sans ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.licensePlate}</span>
                        <span className="font-bold text-white">{vehicle.plate}</span>
                      </div>
                      <div className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} flex items-center justify-between`}>
                        <span className={`font-sans ${isCream ? "text-stone-500" : "text-slate-400"}`}>Exterior Color</span>
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                            style={{ backgroundColor: vehicle.paintColor || '#0284C7' }}
                          />
                          <span>{getVehicleColorByHex(vehicle.paintColor).name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6 flex flex-col items-center justify-center space-y-4">
                    <div className="w-56 h-28 flex items-center justify-center">
                      <VehicleCutout 
                        modelId={vehicle.id} 
                        modelName={vehicle.model} 
                        paintColor={vehicle.paintColor} 
                        className="w-full h-full" 
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 w-full text-center font-mono text-xs">
                      <div className="p-2 rounded-xl bg-[#131A29]">
                        <div className="font-bold text-emerald-400">{vehicle.batterySoc}%</div>
                        <div className="text-[9px] text-slate-400">Current SoC</div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#131A29]">
                        <div className="font-bold text-white">120 kW</div>
                        <div className="text-[9px] text-slate-400">Max DC</div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#131A29]">
                        <div className="font-bold text-white">Aug 2026</div>
                        <div className="text-[9px] text-slate-400">Service</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Car Color & Exterior Finish Swatch Selector */}
                <div className={`p-4 rounded-2xl border ${isCream ? "bg-stone-100/90 border-stone-200" : "bg-[#131A29] border-white/5"} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-wider ${isCream ? "text-stone-800" : "text-slate-200"}`}>
                        Car Color & Exterior Finish
                      </div>
                      <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                        Change the exterior paint of your connected 3D vehicle
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                        style={{ backgroundColor: vehicle.paintColor || '#0284C7' }}
                      />
                      <span>{getVehicleColorByHex(vehicle.paintColor).name}</span>
                    </div>
                  </div>

                  {/* 7 Circular Swatches */}
                  <div className="flex items-center justify-start gap-2.5 sm:gap-3 pt-1 overflow-x-auto pb-1">
                    {VEHICLE_COLORS.map((color) => {
                      const isSelected = (vehicle.paintColor || '#0284C7').toLowerCase() === color.hex.toLowerCase();
                      const isLight = color.id === 'white' || color.id === 'silver';
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setVehicleColor(color.hex, color.name)}
                          title={`${color.name} (${color.hex})`}
                          className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'scale-110 ring-2 ring-teal-400 ring-offset-2 shadow-[0_0_14px_rgba(45,212,191,0.6)]'
                              : 'hover:scale-105 opacity-80 hover:opacity-100'
                          } ${isCream ? 'ring-offset-white' : 'ring-offset-[#131A29]'}`}
                          style={{
                            backgroundColor: color.hex,
                            border: `1px solid ${color.borderHex || 'rgba(255,255,255,0.2)'}`,
                          }}
                        >
                          {isSelected && (
                            <Check
                              className={`w-4 h-4 ${isLight ? 'text-slate-950' : 'text-white'}`}
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHARGING PERFORMANCE */}
          {activeTab === 'charging' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 text-stone-900 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-5 shadow-2xl`}>
                <div className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                  CHARGING PERFORMANCE & EFFICIENCY
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-4 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} space-y-1`}>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Total Energy</div>
                    <div className="text-2xl font-black text-white font-mono">248.7 <span className="text-xs text-slate-400">kWh</span></div>
                  </div>
                  <div className={`p-4 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} space-y-1`}>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Avg Speed</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">86.2 <span className="text-xs text-slate-400">kW</span></div>
                  </div>
                  <div className={`p-4 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} space-y-1`}>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Total Sessions</div>
                    <div className="text-2xl font-black text-white font-mono">16</div>
                  </div>
                  <div className={`p-4 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} space-y-1`}>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Efficiency</div>
                    <div className="text-2xl font-black text-[#2DD4BF] font-mono">94.8%</div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} space-y-2 text-xs`}>
                  <div className="font-bold text-white">Charging Health Summary</div>
                  <p className="text-slate-400 leading-relaxed">
                    Your battery thermal management and charging curve are optimal. Recommended charging cutoff at 90% preserves maximum battery cell lifespan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 text-stone-900 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-4 shadow-2xl`}>
                <div className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                  {t.notificationsTitle}
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'reservationReminders', title: 'Reservation Reminders', desc: 'Alert 15 minutes before your reserved bay booking starts.' },
                    { key: 'chargingComplete', title: 'Charging Complete Notifications', desc: 'Instant alert when vehicle reaches target SoC (90%).' },
                    { key: 'queueUpdates', title: 'Queue Position Updates', desc: 'Real-time push notifications when you advance in the charging queue.' },
                    { key: 'paymentAlerts', title: 'Payment & Receipt Notifications', desc: 'Immediate Telebirr and CBE transaction receipts.' },
                    { key: 'promotional', title: 'Off-Peak Discounts & Announcements', desc: 'Notifications regarding off-peak tariff savings in Addis Ababa.' },
                  ].map((item) => {
                    const isEnabled = notifications[item.key as keyof typeof notifications];
                    return (
                      <div
                        key={item.key}
                        onClick={() => toggleNotificationSetting(item.key as keyof typeof notifications)}
                        className={`p-4 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} border border-white/5 hover:border-white/10 flex items-center justify-between cursor-pointer transition-all`}
                      >
                        <div className="space-y-0.5 max-w-md">
                          <div className="font-bold text-white text-xs">{item.title}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>

                        {/* Toggle Switch */}
                        <div className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${isEnabled ? 'bg-[#2DD4BF]' : 'bg-slate-800'}`}>
                          <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 text-stone-900 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-5 shadow-2xl`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                    {t.paymentMethodsTitle}
                  </span>
                  <button
                    onClick={() => setIsAddPaymentOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] text-slate-950 font-black text-xs transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Payment</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        pm.isDefault
                          ? 'bg-[#133835]/40 border-[#2DD4BF]/50'
                          : 'bg-[#131A29] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-[#2DD4BF]">
                          {pm.type === 'telebirr' && <Smartphone className="w-5 h-5" />}
                          {pm.type === 'cbe' && <Building2 className="w-5 h-5" />}
                          {pm.type === 'card' && <CreditCard className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{pm.title}</span>
                            {pm.isDefault && (
                              <span className="px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] text-[9px] font-bold font-mono">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{pm.subtitle}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!pm.isDefault && (
                          <button
                            onClick={() => setDefaultPaymentMethod(pm.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors"
                          >
                            Set Default
                          </button>
                        )}
                        {paymentMethods.length > 1 && (
                          <button
                            onClick={() => removePaymentMethod(pm.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & PRIVACY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 text-stone-900 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-4 shadow-2xl`}>
                <div className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                  {t.accountSecurityTitle}
                </div>

                <div className="space-y-3">
                  {/* Change Password Card */}
                  <div className={`p-4 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} flex items-center justify-between`}>
                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-xs">Account Password</div>
                      <div className="text-[10px] text-slate-400">Last changed 5 days ago</div>
                    </div>
                    <button
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                    >
                      Change Password
                    </button>
                  </div>

                  {/* 2FA Toggle */}
                  <div 
                    onClick={toggleTwoFactor}
                    className={`p-4 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} flex items-center justify-between cursor-pointer`}
                  >
                    <div className="space-y-0.5">
                      <div className={`font-bold text-xs ${isCream ? "text-stone-900" : "text-white"}`}>{t.twoFactorAuth}</div>
                      <div className={`text-[10px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.twoFactorDesc}</div>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${user.twoFactorEnabled ? 'bg-[#2DD4BF]' : 'bg-slate-800'}`}>
                      <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${user.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </div>

                  {/* Active Session */}
                  <div className={`p-4 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} flex items-center justify-between`}>
                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>Current Session</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Chrome on Linux • Addis Ababa (Active Now)</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">{t.currentDevice}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 Cols): Quick Actions, Account Status, Preferences & Danger Zone */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Actions Card */}
          <div className={`p-5 sm:p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 text-stone-900 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-3.5 shadow-2xl`}>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
              {t.quickActionsTitle}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button 
                onClick={() => setIsChangePasswordOpen(true)}
                className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} hover:bg-slate-800 text-left transition-colors flex items-center justify-between group`}
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span className="text-xs font-semibold text-white">Password</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => setActiveTab('payments')}
                className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} hover:bg-slate-800 text-left transition-colors flex items-center justify-between group`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span className="text-xs font-semibold text-white">Payments</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => setActiveTab('notifications')}
                className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} hover:bg-slate-800 text-left transition-colors flex items-center justify-between group`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span className="text-xs font-semibold text-white">Notifications</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => setActiveTab('security')}
                className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-900" : "bg-[#131A29]"} hover:bg-slate-800 text-left transition-colors flex items-center justify-between group`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span className="text-xs font-semibold text-white">Security</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Account Status Donut Card */}
          <div className={`p-5 sm:p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 text-stone-900 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-4 shadow-2xl`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                {t.accountStatusTitle}
              </span>
              <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
            </div>

            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#131A29" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#2DD4BF" strokeWidth="8" strokeDasharray="251" strokeDashoffset="0" />
                </svg>
                <span className="absolute font-mono font-black text-sm text-white">100%</span>
              </div>

              <div className="space-y-1 text-[11px] font-medium text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.emailVerified}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.phoneVerified}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.paymentAdded}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.vehicleLinked}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-5 rounded-3xl border border-rose-500/20 bg-rose-500/5 space-y-3">
            <div className="text-[11px] font-mono font-bold tracking-widest text-rose-400 uppercase">
              {t.dangerZoneTitle}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={logout}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-white/10 text-rose-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.signOutBtn}</span>
              </button>

              <button 
                onClick={logout}
                className="py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-semibold text-xs transition-all"
                title="Delete Account"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: EDIT PROFILE */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E131F] border border-white/15 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Edit Profile Details</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold outline-none focus:border-[#2DD4BF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold outline-none focus:border-[#2DD4BF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Mobile Number (Telebirr/CBE)</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono outline-none focus:border-[#2DD4BF]"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2.5 rounded-xl bg-[#2DD4BF] text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(45,212,191,0.4)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SWITCH EV MODEL */}
      {isEditVehicleOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E131F] border border-white/15 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Select Your Connected EV Model</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {AVAILABLE_CARS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    selectCar(c);
                    setIsEditVehicleOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 transition-all ${
                    vehicle.id === c.id
                      ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] border-[#2DD4BF]/40 font-bold shadow-[0_0_15px_rgba(45,212,191,0.15)]'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <VehicleCutout 
                      modelId={c.id} 
                      modelName={c.name} 
                      paintColor={c.paintColor} 
                      className="w-14 h-8 shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.capacity} • {c.range} • {c.drive}</div>
                    </div>
                  </div>
                  {vehicle.id === c.id && <Check className="w-4 h-4 text-[#2DD4BF] shrink-0" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsEditVehicleOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD PAYMENT METHOD */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddPayment} className="bg-[#0E131F] border border-white/15 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Ethiopian Payment Method</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Payment Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'telebirr', label: 'Telebirr' },
                    { id: 'cbe', label: 'CBE Birr' },
                    { id: 'card', label: 'Debit Card' },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setNewPaymentType(p.id as any)}
                      className={`p-2 rounded-xl border text-xs font-semibold ${
                        newPaymentType === p.id ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-[#2DD4BF]' : 'bg-slate-900 border-white/10 text-slate-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Account / Card Title</label>
                <input
                  type="text"
                  placeholder={newPaymentType === 'telebirr' ? 'Telebirr Mobile' : newPaymentType === 'cbe' ? 'CBE Main Account' : 'Commercial Bank Visa'}
                  value={newPaymentTitle}
                  onChange={(e) => setNewPaymentTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Account / Phone Number (Masked)</label>
                <input
                  type="text"
                  placeholder={newPaymentType === 'telebirr' ? '+251 91 ••• 5678' : '•••• 8912'}
                  value={newPaymentSubtitle}
                  onChange={(e) => setNewPaymentSubtitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono outline-none focus:border-[#2DD4BF]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddPaymentOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#2DD4BF] text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(45,212,191,0.4)]"
              >
                Link Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: CHANGE PASSWORD */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handlePasswordSubmit} className="bg-[#0E131F] border border-white/15 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Change Account Password</h3>
            {passwordSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Password updated successfully!</span>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:border-[#2DD4BF]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">New Password (min. 6 characters)</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:border-[#2DD4BF]"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={passwordSuccess}
                className="flex-1 py-2.5 rounded-xl bg-[#2DD4BF] text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(45,212,191,0.4)] disabled:opacity-50"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
