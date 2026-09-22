import React, { useState, useRef, useEffect } from "react";
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
  ArrowLeft,
  Check,
  AlertCircle,
  ChevronDown,
  Building2,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useChargeFlowStore } from "../../store/useChargeFlowStore";
import { AVAILABLE_CARS, CarSpec, VEHICLE_COLORS, getVehicleColorByHex } from "../../data/cars";
import { useTranslation } from "../../localization/useTranslation";
import { getBatteryVisualState } from "../../utils/batteryVisualState";
import { findDbUserByIdentifier, saveDbUser, DbUser } from "../../data/db";
import { VehicleCutout } from "../vehicle/VehicleCutout";

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    loginUser, 
    theme,
    vehicle,
    selectCar,
    setVehicleColor,
    setView,
  } = useChargeFlowStore();

  const { t } = useTranslation();
  const isCream = theme === "cream";

  const [mode, setMode] = useState<"signin" | "signup">(authModalMode || "signup");
  const [signUpStep, setSignUpStep] = useState<1 | 2 | 3 | 4>(1);

  // Synchronize mode whenever modal is opened
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || "signup");
      setSignUpStep(1);
      setSignInError("");
      setSignUpError("");
    }
  }, [isAuthModalOpen, authModalMode]);

  // Sign In Fields
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");

  // Create Account Fields
  const [userRole, setUserRole] = useState<"driver" | "operator">("driver");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+251 9");
  const [password, setPassword] = useState("");
  const [selectedCarId, setSelectedCarId] = useState(vehicle.id || "byd-atto-3");
  const [selectedColorHex, setSelectedColorHex] = useState(vehicle.paintColor || VEHICLE_COLORS[0].hex);
  const [batterySoc, setBatterySoc] = useState(vehicle.batterySoc || 38);
  const [signUpError, setSignUpError] = useState("");
  const [carDropdownOpen, setCarDropdownOpen] = useState(false);

  // OTP Verification Fields
  const [simulatedOtp, setSimulatedOtp] = useState("5824");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [otpCopied, setOtpCopied] = useState(false);
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Synchronize color when opening modal
  useEffect(() => {
    if (isAuthModalOpen && vehicle.paintColor) {
      setSelectedColorHex(vehicle.paintColor);
    }
  }, [isAuthModalOpen, vehicle.paintColor]);

  // Generate OTP when entering step 4
  useEffect(() => {
    if (signUpStep === 4) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setSimulatedOtp(code);
      setOtpDigits(["", "", "", ""]);
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 100);
    }
  }, [signUpStep]);

  // Password Strength Calculation (5 States)
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Enter Password", color: "#64748B", widthPct: 5 };
    const hasLen = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpec = /[^A-Za-z0-9]/.test(pass);

    let score = 0;
    if (pass.length >= 6) score++;
    if (hasLen) score++;
    if (hasUpper) score++;
    if (hasNum) score++;
    if (hasSpec) score++;

    if (score <= 1) return { score: 1, label: "Very Weak", color: "#F43F5E", widthPct: 20 };
    if (score === 2) return { score: 2, label: "Weak", color: "#F59E0B", widthPct: 40 };
    if (score === 3) return { score: 3, label: "Medium", color: "#FACC15", widthPct: 65 };
    if (score === 4) return { score: 4, label: "Strong", color: "#2DD4BF", widthPct: 85 };
    return { score: 5, label: "Very Strong", color: "#10B981", widthPct: 100 };
  };

  const passStrength = calculatePasswordStrength(password);
  const passwordCriteria = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const handleColorSelect = (hex: string) => {
    setSelectedColorHex(hex);
    const colorObj = getVehicleColorByHex(hex);
    setVehicleColor(hex, colorObj.name);
  };

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(simulatedOtp);
    setOtpCopied(true);
    setTimeout(() => setOtpCopied(false), 2000);
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = clean;
    setOtpDigits(nextDigits);

    if (clean && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
    if (!pasted) return;
    const nextDigits = ["", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      nextDigits[i] = pasted[i];
    }
    setOtpDigits(nextDigits);
    const nextIndex = Math.min(pasted.length, 3);
    otpInputRefs[nextIndex].current?.focus();
  };

  if (!isAuthModalOpen) return null;

  const batteryVisual = getBatteryVisualState(batterySoc);

  // Validate Sign In
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
    setView("cockpit");
  };

  // Step 2 to Step 3 validation
  const handleStep2Continue = (e: React.FormEvent) => {
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
    if (!phone.trim() || phone.replace(/[\s-]/g, "").length < 10) {
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

    setSignUpStep(3);
  };

  // Step 3 to Step 4 (Proceed to OTP)
  const handleStep3Continue = () => {
    setSignUpStep(4);
  };

  // Verify OTP and Complete Registration
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join("");
    if (entered.length < 4) {
      setSignUpError("Please enter the complete 4-digit code");
      return;
    }
    if (entered !== simulatedOtp) {
      setSignUpError("Invalid verification code. Please check or click Copy OTP.");
      return;
    }

    const colorObj = getVehicleColorByHex(selectedColorHex);
    const newUser: DbUser = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      vehicleId: selectedCarId,
      vehicleColor: colorObj.name,
      paintColor: colorObj.hex,
      batterySoc,
      createdAt: new Date().toISOString(),
    };

    saveDbUser(newUser);
    loginUser(newUser);
    closeAuthModal();
    setView("cockpit");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Soft Blurred Backdrop */}
      <div 
        onClick={closeAuthModal}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Futuristic Glassmorphism Card */}
      <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl border transition-all duration-300 overflow-hidden ${
        isCream
          ? "bg-[#FAF7F2]/95 border-stone-300/80 text-stone-900 shadow-stone-300/60"
          : "bg-[#090F1C]/95 border-white/10 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
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
                      ? "bg-white border-stone-300 text-stone-900 focus:border-emerald-600"
                      : "bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400"
                  }`}
                  required
                />
              </div>
            </div>

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
                      ? "bg-white border-stone-300 text-stone-900 focus:border-emerald-600"
                      : "bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400"
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>{t.signIn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <p className={`text-xs ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                {t.dontHaveAccount || "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setSignUpStep(1);
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
        {/* CREATE ACCOUNT 4-STEP WIZARD                                      */}
        {/* ================================================================= */}
        {mode === "signup" && (
          <div className="space-y-4 pt-3">
            {/* Step Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                <span className="text-teal-400 uppercase">
                  Step {signUpStep} of 4: {
                    signUpStep === 1 ? "Select Role" :
                    signUpStep === 2 ? "Account Details" :
                    signUpStep === 3 ? "Vehicle Setup" : "Verify Phone"
                  }
                </span>
                <span className="text-slate-400">{signUpStep * 25}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${signUpStep * 25}%` }}
                />
              </div>
            </div>

            {signUpError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{signUpError}</span>
              </div>
            )}

            {/* STEP 1: ROLE SELECTION */}
            {signUpStep === 1 && (
              <div className="space-y-3.5 pt-1 animate-in fade-in">
                <p className={`text-xs ${isCream ? "text-stone-600" : "text-slate-400"}`}>
                  Choose how you plan to use the ChargeFlow EV Network:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setUserRole("driver")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      userRole === "driver"
                        ? "bg-teal-500/15 border-teal-400 text-white shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                        <Car className="w-4 h-4" />
                      </div>
                      {userRole === "driver" && <Check className="w-4 h-4 text-teal-400" />}
                    </div>
                    <div className="font-bold text-sm text-white">EV Driver</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                      For personal & commercial EV owners. Reserve 120kW hubs and monitor live battery charge.
                    </div>
                  </div>

                  <div
                    onClick={() => setUserRole("operator")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      userRole === "operator"
                        ? "bg-teal-500/15 border-teal-400 text-white shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                        <Building2 className="w-4 h-4" />
                      </div>
                      {userRole === "operator" && <Check className="w-4 h-4 text-teal-400" />}
                    </div>
                    <div className="font-bold text-sm text-white">Station Operator</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                      For commercial charging hub hosts. Track dispenser telemetry, queue lines, and grid flow.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSignUpStep(2)}
                  className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all cursor-pointer"
                >
                  <span>Continue to Account Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: CREDENTIALS & REAL-TIME PASSWORD STRENGTH METER */}
            {signUpStep === 2 && (
              <form onSubmit={handleStep2Continue} className="space-y-3 pt-1 animate-in fade-in">
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
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

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
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password & 5-State Strength Meter */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                      Create Password
                    </label>
                    {password && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md" style={{ color: passStrength.color, backgroundColor: `${passStrength.color}20` }}>
                        {passStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-3.5 h-3.5 text-teal-400 absolute left-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter strong password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border bg-[#050811] border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Visual Strength Meter Bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full transition-all duration-300 rounded-full"
                      style={{ width: `${passStrength.widthPct}%`, backgroundColor: passStrength.color }}
                    />
                  </div>

                  {/* Password Checklist Criteria */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.length ? "text-emerald-400 font-bold" : ""}`}>
                      <Check className={`w-3 h-3 ${passwordCriteria.length ? "text-emerald-400" : "text-slate-600"}`} />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.upper ? "text-emerald-400 font-bold" : ""}`}>
                      <Check className={`w-3 h-3 ${passwordCriteria.upper ? "text-emerald-400" : "text-slate-600"}`} />
                      <span>Uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.number ? "text-emerald-400 font-bold" : ""}`}>
                      <Check className={`w-3 h-3 ${passwordCriteria.number ? "text-emerald-400" : "text-slate-600"}`} />
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.special ? "text-emerald-400 font-bold" : ""}`}>
                      <Check className={`w-3 h-3 ${passwordCriteria.special ? "text-emerald-400" : "text-slate-600"}`} />
                      <span>Special symbol (!@#$)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSignUpStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all cursor-pointer"
                  >
                    <span>Configure Vehicle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: VEHICLE & BATTERY SETUP WITH ACCURATE 2D CUTOUTS */}
            {signUpStep === 3 && (
              <div className="space-y-3.5 pt-1 animate-in fade-in">
                {/* EV Model Dropdown with Matching Previews */}
                <div className="space-y-1.5 relative">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                    Selected Vehicle
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCarDropdownOpen(!carDropdownOpen)}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#050811] text-white hover:border-teal-400 text-xs flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {(() => {
                          const active = AVAILABLE_CARS.find((c) => c.id === selectedCarId) || AVAILABLE_CARS[0];
                          return (
                            <>
                              <VehicleCutout 
                                modelId={active.id} 
                                modelName={active.name} 
                                paintColor={selectedColorHex} 
                                className="w-12 h-7 shrink-0" 
                              />
                              <div className="text-left truncate">
                                <span className="font-bold text-white">{active.name}</span>
                                <span className="text-[10px] font-mono text-teal-400 ml-1.5 uppercase font-semibold">({active.brand})</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-teal-400 transition-transform shrink-0 ${carDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {carDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 max-h-52 overflow-y-auto rounded-2xl border border-white/15 bg-[#0C1220] text-slate-100 shadow-2xl p-1.5 z-50 backdrop-blur-2xl space-y-1">
                        {AVAILABLE_CARS.map((car) => {
                          const isSelected = selectedCarId === car.id;
                          return (
                            <button
                              key={car.id}
                              type="button"
                              onClick={() => {
                                setSelectedCarId(car.id);
                                selectCar(car);
                                setCarDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40"
                                  : "text-slate-300 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <VehicleCutout 
                                  modelId={car.id} 
                                  modelName={car.name} 
                                  paintColor={selectedColorHex} 
                                  className="w-10 h-6 shrink-0" 
                                />
                                <div className="truncate">
                                  <div className="font-bold truncate">{car.name}</div>
                                  <div className="text-[9px] font-mono text-slate-400">
                                    {car.capacity} • {car.rangeKm} km Range
                                  </div>
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Car Color Swatches */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                      Car Color
                    </label>
                    <span className="text-[11px] font-mono text-teal-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: selectedColorHex }} />
                      {getVehicleColorByHex(selectedColorHex).name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1.5 p-2 rounded-2xl border border-white/10 bg-black/25">
                    {VEHICLE_COLORS.map((color) => {
                      const isSelected = selectedColorHex.toLowerCase() === color.hex.toLowerCase();
                      const isLight = color.id === "white" || color.id === "silver";
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => handleColorSelect(color.hex)}
                          title={color.name}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "scale-110 ring-2 ring-teal-400 ring-offset-2 ring-offset-[#090F1C] shadow-[0_0_14px_rgba(45,212,191,0.6)]"
                              : "hover:scale-105 opacity-80 hover:opacity-100"
                          }`}
                          style={{ 
                            backgroundColor: color.hex,
                            border: `1px solid ${color.borderHex || "rgba(255,255,255,0.25)"}`
                          }}
                        >
                          {isSelected && <Check className={`w-3.5 h-3.5 ${isLight ? "text-slate-950" : "text-white"}`} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Battery Level Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Starting Battery SoC</span>
                    <div 
                      className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs"
                      style={{ borderColor: batteryVisual.color, backgroundColor: `${batteryVisual.color}15` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: batteryVisual.color }} />
                      <span className="font-mono font-bold" style={{ color: batteryVisual.color }}>
                        {batterySoc}% ({t[batteryVisual.labelKey]})
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={10}
                    max={98}
                    value={batterySoc}
                    onChange={(e) => setBatterySoc(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />

                  <div className="flex items-center justify-between gap-1.5 pt-0.5">
                    {[20, 40, 60, 80, 95].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setBatterySoc(pct)}
                        className={`flex-1 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                          batterySoc === pct
                            ? "bg-teal-500/20 border-teal-400 text-teal-300 shadow-sm"
                            : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSignUpStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStep3Continue}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all cursor-pointer"
                  >
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: OTP VERIFICATION WITH COPY BUTTON & AUTO-FOCUS */}
            {signUpStep === 4 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center space-y-2">
                  <div className="text-xs text-slate-300">
                    We sent a 4-digit verification code to <span className="font-mono text-teal-300 font-bold">{phone}</span>
                  </div>
                  
                  {/* Simulated SMS Badge with Copy OTP button */}
                  <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#060A13] border border-teal-500/40">
                    <span className="text-[10px] font-mono text-slate-400">Simulated SMS Code:</span>
                    <span className="font-mono font-black text-sm tracking-widest text-teal-300">{simulatedOtp}</span>
                    <button
                      type="button"
                      onClick={handleCopyOtp}
                      className="px-2 py-0.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {otpCopied ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300">✓ OTP copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 4-Box Split OTP Input */}
                <div className="flex items-center justify-center gap-3 py-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpInputRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 text-center text-xl font-mono font-black rounded-2xl border border-white/20 bg-[#050811] text-teal-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/40 focus:outline-none transition-all shadow-inner"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSignUpStep(3)}
                    className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Launch Cockpit</span>
                  </button>
                </div>
              </form>
            )}

            {/* Switch to Sign In */}
            <div className="text-center pt-2 border-t border-white/5">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
