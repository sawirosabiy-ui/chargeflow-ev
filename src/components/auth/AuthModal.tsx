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
  AlertCircle
} from "lucide-react";
import { useChargeFlowStore } from "../../store/useChargeFlowStore";
import { AVAILABLE_CARS, CarSpec } from "../../data/cars";
import { useTranslation } from "../../localization/useTranslation";
import { getBatteryVisualState } from "../../utils/batteryVisualState";

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    updateUserProfile, 
    selectCar, 
    setView,
    theme
  } = useChargeFlowStore();

  const { t } = useTranslation();
  const isCream = theme === "cream";

  const [mode, setMode] = useState<"signin" | "signup">(authModalMode || "signup");

  // Synchronize mode whenever modal is opened
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || "signup");
    }
  }, [isAuthModalOpen, authModalMode]);

  // Sign In Fields
  const [signInIdentifier, setSignInIdentifier] = useState("+251 91 234 5678");
  const [signInPassword, setSignInPassword] = useState("••••••••");
  const [signInError, setSignInError] = useState("");

  // Create Account Fields (only required onboarding fields)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+251 9");
  const [password, setPassword] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("byd-atto-3");
  const [batterySoc, setBatterySoc] = useState(72);
  const [signUpError, setSignUpError] = useState("");

  if (!isAuthModalOpen) return null;

  const batteryVisual = getBatteryVisualState(batterySoc);

  // Validate and submit Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInIdentifier.trim()) {
      setSignInError("Please enter your Ethiopian phone number or email");
      return;
    }
    if (!signInPassword.trim()) {
      setSignInError("Please enter your password");
      return;
    }

    const isEmail = signInIdentifier.includes("@");
    updateUserProfile({
      name: isEmail ? signInIdentifier.split("@")[0] : "Abiy Tesfaye",
      email: isEmail ? signInIdentifier : "abiy.tesfaye@gmail.com",
      phone: isEmail ? "+251 91 234 5678" : signInIdentifier,
    });
    useChargeFlowStore.setState((s) => ({
      user: { ...s.user, isAuthenticated: true },
    }));

    closeAuthModal();
    setView("cockpit");
  };

  // Validate and submit Create Account
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setSignUpError("Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSignUpError("Please enter a valid email address");
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setSignUpError("Please enter a valid Ethiopian phone number (+251 9...)");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setSignUpError("Password must be at least 6 characters");
      return;
    }

    const chosenCar = AVAILABLE_CARS.find((c) => c.id === selectedCarId) || AVAILABLE_CARS[0];
    selectCar(chosenCar);

    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    useChargeFlowStore.setState((s) => ({
      user: { ...s.user, isAuthenticated: true },
      vehicle: { ...s.vehicle, batterySoc },
    }));

    closeAuthModal();
    setView("cockpit");
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
              {t.signInSubtitle}
            </p>

            {signInError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{signInError}</span>
              </div>
            )}

            {/* Phone or Email */}
            <div className="space-y-1.5 text-left">
              <label className={`text-xs font-semibold ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                {t.phoneLabel} / {t.emailLabel}
              </label>
              <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
                isCream 
                  ? "bg-white border-stone-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20" 
                  : "bg-white/5 border-white/10 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/20"
              }`}>
                <Smartphone className="w-4 h-4 text-teal-400 shrink-0" />
                <input
                  type="text"
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  placeholder="+251 91 234 5678 or email"
                  className="w-full bg-transparent text-xs sm:text-sm outline-none font-medium placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className={`text-xs font-semibold ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                {t.passwordLabel}
              </label>
              <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
                isCream 
                  ? "bg-white border-stone-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20" 
                  : "bg-white/5 border-white/10 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/20"
              }`}>
                <Lock className="w-4 h-4 text-teal-400 shrink-0" />
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-xs sm:text-sm outline-none font-medium placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{t.signIn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch to Sign Up */}
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setSignInError("");
                }}
                className={`text-xs font-semibold transition-colors cursor-pointer hover:underline ${
                  isCream ? "text-emerald-700" : "text-teal-400"
                }`}
              >
                {t.dontHaveAccount}
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* CREATE ACCOUNT FORM (Only the required onboarding fields)         */}
        {/* ================================================================= */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3.5 pt-4">
            <p className={`text-xs ${isCream ? "text-stone-600" : "text-slate-400"}`}>
              {t.createAccountSubtitle}
            </p>

            {signUpError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{signUpError}</span>
              </div>
            )}

            {/* Name & Email (2 columns on tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Full Name */}
              <div className="space-y-1">
                <label className={`text-[11px] font-semibold ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  {t.fullNameLabel}
                </label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  isCream ? "bg-white border-stone-300" : "bg-white/5 border-white/10"
                }`}>
                  <User className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Abiy Tesfaye"
                    className="w-full bg-transparent text-xs outline-none font-medium placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className={`text-[11px] font-semibold ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  {t.emailLabel}
                </label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  isCream ? "bg-white border-stone-300" : "bg-white/5 border-white/10"
                }`}>
                  <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@chargeflow.et"
                    className="w-full bg-transparent text-xs outline-none font-medium placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Phone & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Phone */}
              <div className="space-y-1">
                <label className={`text-[11px] font-semibold ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  {t.phoneLabel}
                </label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  isCream ? "bg-white border-stone-300" : "bg-white/5 border-white/10"
                }`}>
                  <Smartphone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 91 234 5678"
                    className="w-full bg-transparent text-xs outline-none font-medium placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className={`text-[11px] font-semibold ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  {t.passwordLabel}
                </label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  isCream ? "bg-white border-stone-300" : "bg-white/5 border-white/10"
                }`}>
                  <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full bg-transparent text-xs outline-none font-medium placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Model Selection */}
            <div className="space-y-1 text-left">
              <label className={`text-[11px] font-semibold ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                {t.vehicleModelLabel}
              </label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                isCream ? "bg-white border-stone-300" : "bg-white/5 border-white/10"
              }`}>
                <Car className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className={`w-full bg-transparent text-xs outline-none font-medium cursor-pointer ${
                    isCream ? "text-stone-900" : "text-white"
                  }`}
                >
                  {AVAILABLE_CARS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.name} ({c.capacity} · {c.range})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Battery Percentage Slider */}
            <div className="space-y-1.5 text-left pt-1">
              <div className="flex items-center justify-between">
                <label className={`text-[11px] font-semibold flex items-center gap-1.5 ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  <BatteryCharging className="w-3.5 h-3.5" style={{ color: batteryVisual.color }} />
                  <span>{t.currentBatteryLabel}</span>
                </label>
                <span 
                  className="font-mono font-bold text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    color: batteryVisual.color,
                    borderColor: batteryVisual.color,
                    backgroundColor: `${batteryVisual.color}15`
                  }}
                >
                  {batterySoc}% • {t[batteryVisual.labelKey]}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={batterySoc}
                onChange={(e) => setBatterySoc(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-1.5 rounded-lg bg-slate-700"
              />
            </div>

            {/* Create Account Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>{t.createAccount}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch to Sign In */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setSignUpError("");
                }}
                className={`text-xs font-semibold transition-colors cursor-pointer hover:underline ${
                  isCream ? "text-emerald-700" : "text-teal-400"
                }`}
              >
                {t.alreadyHaveAccount}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
