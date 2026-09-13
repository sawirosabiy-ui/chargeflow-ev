import React, { useState } from "react";
import { 
  X, 
  Zap, 
  Lock, 
  Smartphone, 
  Mail, 
  User,
  Car,
  BatteryCharging,
  ArrowRight,
  Check,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useChargeFlowStore } from "../../store/useChargeFlowStore";
import { AVAILABLE_CARS, CarSpec } from "../../data/cars";
import { useTranslation } from "../../localization/useTranslation";
import { getBatteryVisualState } from "../../utils/batteryVisualState";
import { findDbUserByIdentifier, saveDbUser, DbUser } from "../../data/db";

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    loginUser, 
    theme 
  } = useChargeFlowStore();

  const { t } = useTranslation();
  const isCream = theme === "cream";

  const [mode, setMode] = useState<"signin" | "signup">(authModalMode || "signup");

  // Synchronize mode whenever modal is opened
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || "signup");
      setSignInError("");
      setSignUpError("");
    }
  }, [isAuthModalOpen, authModalMode]);

  // Sign In Fields (Clean, no fake prefilled data)
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");

  // Create Account Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+251 9");
  const [password, setPassword] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("byd-atto-3");
  const [batterySoc, setBatterySoc] = useState(38);
  const [signUpError, setSignUpError] = useState("");
  const [carDropdownOpen, setCarDropdownOpen] = useState(false);

  if (!isAuthModalOpen) return null;

  const batteryVisual = getBatteryVisualState(batterySoc);

  // Validate and submit Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError("");

    if (!signInIdentifier.trim()) {
      setSignInError("Please enter your Ethiopian phone number or email");
      return;
    }
    if (!signInPassword.trim()) {
      setSignInError("Please enter your password");
      return;
    }

    const existingUser = findDbUserByIdentifier(signInIdentifier);
    if (!existingUser) {
      setSignInError("No account found with this phone or email. Please create an account.");
      return;
    }

    loginUser(existingUser);
    closeAuthModal();
  };

  // Validate and submit Create Account
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError("");

    if (!name.trim()) {
      setSignUpError("Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSignUpError("Please enter a valid email address");
      return;
    }
    if (!phone.trim() || phone.replace(/[\s-]/g, '').length < 10) {
      setSignUpError("Please enter a valid Ethiopian phone number (+251 9...)");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setSignUpError("Password must be at least 6 characters");
      return;
    }

    const existingUser = findDbUserByIdentifier(email) || findDbUserByIdentifier(phone);
    if (existingUser) {
      setSignUpError("An account with this email or phone already exists. Please sign in.");
      return;
    }

    const newUser: DbUser = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      vehicleId: selectedCarId,
      batterySoc,
      createdAt: new Date().toISOString(),
    };

    saveDbUser(newUser);
    loginUser(newUser);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Soft Blurred Backdrop */}
      <div 
        onClick={closeAuthModal}
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      {/* Futuristic Glassmorphism Card */}
      <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl border transition-all duration-300 overflow-hidden ${
        isCream
          ? "bg-[#FAF7F2]/95 border-stone-300/80 text-stone-900 shadow-stone-300/60"
          : "bg-[#090F1C]/90 border-white/10 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
      }`}>
        {/* Glow Accent Sphere */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

        {/* Top Header & Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-teal-400">
                CHARGEFLOW
              </div>
              <h2 className={`text-base sm:text-lg font-black tracking-tight ${isCream ? "text-stone-900" : "text-white"}`}>
                {mode === "signin" ? t.signIn : t.createAccount}
              </h2>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isCream ? "hover:bg-stone-200 text-stone-600" : "hover:bg-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* SIGN IN FORM                                                      */}
        {/* ================================================================= */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4 pt-5">
            <p className={`text-xs ${isCream ? "text-stone-600" : "text-slate-400"}`}>
              {t.signInSubtitle || "Sign in to access your vehicle cockpit, wallet balance, and charging reservations."}
            </p>

            {signInError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{signInError}</span>
              </div>
            )}

            {/* Phone or Email */}
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                Ethiopian Phone or Email
              </label>
              <div className="relative flex items-center">
                <Smartphone className="w-4 h-4 text-teal-400 absolute left-3.5" />
                <input
                  type="text"
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  placeholder="+251 91 234 5678 or email"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border transition-all focus:outline-none ${
                    isCream
                      ? "bg-white border-stone-300 text-stone-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      : "bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-teal-400 absolute left-3.5" />
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border transition-all focus:outline-none ${
                    isCream
                      ? "bg-white border-stone-300 text-stone-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      : "bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Sign In CTA */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>{t.signIn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch Mode Prompt */}
            <div className="pt-2 text-center">
              <p className={`text-xs ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                {t.dontHaveAccount || "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setSignInError("");
                  }}
                  className="text-teal-400 font-bold hover:underline cursor-pointer"
                >
                  {t.createAccount}
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* CREATE ACCOUNT FORM (Concise, Onboarding Fields)                   */}
        {/* ================================================================= */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3.5 pt-4">
            <p className={`text-xs ${isCream ? "text-stone-600" : "text-slate-400"}`}>
              {t.createAccountSubtitle || "Set up your EV profile to reserve charging slots and manage smart energy."}
            </p>

            {signUpError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{signUpError}</span>
              </div>
            )}

            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-3.5 h-3.5 text-teal-400 absolute left-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dawit Alemu"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition-all focus:outline-none ${
                      isCream
                        ? "bg-white border-stone-300 text-stone-900 focus:border-emerald-600"
                        : "bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-3.5 h-3.5 text-teal-400 absolute left-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dawit@gmail.com"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition-all focus:outline-none ${
                      isCream
                        ? "bg-white border-stone-300 text-stone-900 focus:border-emerald-600"
                        : "bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400"
                    }`}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  Ethiopian Phone
                </label>
                <div className="relative flex items-center">
                  <Smartphone className="w-3.5 h-3.5 text-teal-400 absolute left-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 91 234 5678"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border transition-all focus:outline-none ${
                      isCream
                        ? "bg-white border-stone-300 text-stone-900 focus:border-emerald-600"
                        : "bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  Create Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-3.5 h-3.5 text-teal-400 absolute left-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border transition-all focus:outline-none ${
                      isCream
                        ? "bg-white border-stone-300 text-stone-900 focus:border-emerald-600"
                        : "bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400"
                    }`}
                    required
                  />
                </div>
              </div>
            </div>

            {/* EV Model Selection Dropdown */}
            <div className="space-y-1.5 pt-1 relative">
              <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                Select Your EV
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCarDropdownOpen(!carDropdownOpen)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isCream
                      ? "bg-white border-stone-300 text-stone-900 hover:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      : "bg-[#050811] border-white/10 text-white hover:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div className="text-left truncate">
                      {(() => {
                        const selectedCar = AVAILABLE_CARS.find((c) => c.id === selectedCarId) || AVAILABLE_CARS[0];
                        return (
                          <div className="flex items-center gap-2">
                            <span className="font-bold truncate text-white">{selectedCar.name}</span>
                            <span className="text-[10px] font-mono text-teal-400 font-semibold">({selectedCar.brand})</span>
                            <span className={`text-[10px] font-mono hidden sm:inline ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                              • {selectedCar.rangeKm} km • {selectedCar.drive}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-teal-400 transition-transform shrink-0 ${carDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {carDropdownOpen && (
                  <div className={`absolute top-full left-0 right-0 mt-1.5 max-h-52 overflow-y-auto rounded-2xl border shadow-2xl p-1.5 z-50 backdrop-blur-2xl space-y-1 ${
                    isCream ? "bg-white border-stone-300 text-stone-900" : "bg-[#0C1220] border-white/15 text-slate-100"
                  }`}>
                    {AVAILABLE_CARS.map((car) => {
                      const isSelected = selectedCarId === car.id;
                      return (
                        <button
                          key={car.id}
                          type="button"
                          onClick={() => {
                            setSelectedCarId(car.id);
                            setCarDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? isCream
                                ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-300"
                                : "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40"
                              : isCream
                                ? "text-stone-700 hover:bg-stone-100"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold truncate">{car.name}</span>
                                <span className="text-[10px] font-mono text-teal-400 uppercase">{car.brand}</span>
                              </div>
                              <div className={`text-[10px] font-mono mt-0.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                                {car.capacity} · {car.rangeKm} km Range · {car.drive}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Battery Level Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  Current Battery SoC
                </span>
                <span className="font-mono font-bold text-xs" style={{ color: batteryVisual.color }}>
                  {batterySoc}% ({t[batteryVisual.labelKey]})
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={98}
                value={batterySoc}
                onChange={(e) => setBatterySoc(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Submit Create Account CTA */}
            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>{t.createAccount}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch Mode Prompt */}
            <div className="text-center pt-1">
              <p className={`text-xs ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                {t.alreadyHaveAccount || "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setSignUpError("");
                  }}
                  className="text-teal-400 font-bold hover:underline cursor-pointer"
                >
                  {t.signIn}
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
