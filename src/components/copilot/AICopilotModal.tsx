import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  Zap, 
  Compass, 
  ShieldCheck, 
  Flame, 
  Lock, 
  Unlock, 
  BatteryCharging, 
  MapPin, 
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  ArrowRight,
  Wallet,
  Clock
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { getUserCopilotMessages, saveUserCopilotMessages } from '../../data/db';
import { Language } from '../../types';

interface Message {
  id: string;
  sender: 'copilot' | 'user';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType:
      | 'precondition'
      | 'lock'
      | 'unlock'
      | 'navigate_reserve'
      | 'navigate_stations'
      | 'navigate_wallet'
      | 'navigate_charging'
      | 'start_charging';
    executed?: boolean;
  }[];
}

export const AICopilotModal: React.FC = () => {
  const isCopilotOpen = useChargeFlowStore((s) => s.isCopilotOpen);
  const setCopilotOpen = useChargeFlowStore((s) => s.setCopilotOpen);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const user = useChargeFlowStore((s) => s.user);
  const wallet = useChargeFlowStore((s) => s.wallet);
  const reservation = useChargeFlowStore((s) => s.reservation);
  const stations = useChargeFlowStore((s) => s.stations);
  const setView = useChargeFlowStore((s) => s.setView);
  const togglePrecondition = useChargeFlowStore((s) => s.togglePrecondition);
  const toggleLock = useChargeFlowStore((s) => s.toggleLock);
  const language = useChargeFlowStore((s) => s.language);
  const startChargingSession = useChargeFlowStore((s) => s.startChargingSession);
  const chargingSession = useChargeFlowStore((s) => s.chargingSession);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Generate localized initial welcome message
  const getInitialWelcomeMessage = (lang: Language): Message => {
    const userName = user.name ? user.name.split(' ')[0] : (lang === 'አማ' ? 'አሽከርካሪ' : 'driver');
    const range = Math.round(vehicle.maxRangeKm * (vehicle.batterySoc / 100));
    const balance = wallet.balanceEtb.toFixed(0);

    if (lang === 'አማ') {
      const resText = reservation ? ` • ንቁ ቦታ ማስያዣ፦ ${reservation.stationName} (${reservation.bayNumber})` : '';
      return {
        id: `welcome-${lang}-${Date.now()}`,
        sender: 'copilot',
        text: `ሰላም ${userName}! እኔ የቻርጅፍሎው AI ረዳት ነኝ። ከተሽከርካሪዎ ${vehicle.model} ጋር ተገናኝቻለሁ (${vehicle.batterySoc}% ባትሪ፣ ~${range} ኪ.ሜ)። የዋሌት ቀሪ ሂሳብ፦ ${balance} ብር${resText}። ዛሬ አዲስ አበባ ውስጥ በምን ልርዳዎ?`,
        timestamp: 'አሁን',
        actions: [
          { label: '📍 በአዲስ አበባ ያሉ ቻርጀሮች', actionType: 'navigate_stations' },
          { label: vehicle.isPreconditioned ? '❄️ የባትሪ ማሞቂያ አቁም' : '⚡ ባትሪ አሞቅ (Precondition)', actionType: 'precondition' },
          { label: '📅 ቦታ ያስይዙ (Reserve)', actionType: 'navigate_reserve' },
        ],
      };
    }

    if (lang === 'ORM') {
      const resText = reservation ? ` • Qabannoo: ${reservation.stationName} (${reservation.bayNumber})` : '';
      return {
        id: `welcome-${lang}-${Date.now()}`,
        sender: 'copilot',
        text: `Akkam ${userName}! Ani gargaaraa ChargeFlow AI ti. Konkolaataa keessan ${vehicle.model} wajjin wal qabateera (Baatrii ${vehicle.batterySoc}%, tilmaamaan ~${range} km)። Boorsaa: ${balance} ETB${resText}። Har'a Finfinnee keessatti akkamitti isin gargaaruu danda'a?`,
        timestamp: 'Amma',
        actions: [
          { label: '📍 Wiirtuuwwan Finfinnee', actionType: 'navigate_stations' },
          { label: vehicle.isPreconditioned ? '❄️ Baatrii Dhaabi' : '⚡ Baatrii Qopheessi', actionType: 'precondition' },
          { label: '📅 Bakka Qabadhu', actionType: 'navigate_reserve' },
        ],
      };
    }

    if (lang === 'TIR') {
      const resText = reservation ? ` • ዝተታሕዘ፦ ${reservation.stationName} (${reservation.bayNumber})` : '';
      return {
        id: `welcome-${lang}-${Date.now()}`,
        sender: 'copilot',
        text: `ሰላም ${userName}! ኣነ ናይ ChargeFlow AI ረዳኢ እየ። ምስ ተሽከርካሪኹም ${vehicle.model} ተተሓሒዘ ኣለኹ (${vehicle.batterySoc}% ባትሪ፣ ~${range} ኪ.ሜ)። ናይ ቦርሳ ሚዛን፦ ${balance} ቅርሺ${resText}። ሎሚ ኣብ ኣዲስ ኣበባ ብምንታይ ክሕግዘኩም?`,
        timestamp: 'ሕጂ',
        actions: [
          { label: '📍 ኣብ ኣዲስ ኣበባ ዘለዉ ቻርጀራት', actionType: 'navigate_stations' },
          { label: vehicle.isPreconditioned ? '❄️ ምምዕርራይ ደው ኣብል' : '⚡ ባትሪ ኣዳሉ', actionType: 'precondition' },
          { label: '📅 ቦታ ሓዝ', actionType: 'navigate_reserve' },
        ],
      };
    }

    // Default English
    const resText = reservation ? ` • Active Reservation: ${reservation.stationName} (${reservation.bayNumber})` : '';
    return {
      id: `welcome-${lang}-${Date.now()}`,
      sender: 'copilot',
      text: `Hello ${userName}! I'm your ChargeFlow AI Copilot. Connected to your ${vehicle.model} with ${vehicle.batterySoc}% SoC (~${range} km estimated range). Wallet Balance: ${balance} ETB${resText}. How can I assist your EV journey in Addis Ababa today?`,
      timestamp: 'Just now',
      actions: [
        { label: '📍 Live Stations in Addis', actionType: 'navigate_stations' },
        { label: vehicle.isPreconditioned ? '🔥 Preconditioning (ON)' : '⚡ Precondition Battery', actionType: 'precondition' },
        { label: '📅 Reserve a Charging Bay', actionType: 'navigate_reserve' },
      ],
    };
  };

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = getUserCopilotMessages(user.id || 'guest');
    if (saved && saved.length > 0) return saved;
    return [getInitialWelcomeMessage(language)];
  });

  // Reload conversation when user or language changes
  useEffect(() => {
    // Refresh welcome message in the newly selected language
    setMessages([getInitialWelcomeMessage(language)]);
  }, [user.id, language]);

  // Persist conversation per user
  useEffect(() => {
    if (messages.length > 0) {
      saveUserCopilotMessages(user.id || 'guest', messages);
    }
  }, [messages, user.id]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotOpen) {
      scrollToBottom();
    }
  }, [messages, isCopilotOpen, isTyping]);

  if (!isCopilotOpen) return null;

  const handleActionClick = (actionType: string) => {
    if (actionType === 'precondition') {
      togglePrecondition();
      const statusText = vehicle.isPreconditioned
        ? (language === 'አማ' ? 'የባትሪ ቅድመ-ማሞቂያ ቆሟል።' : 'Battery thermal preconditioning stopped.')
        : (language === 'አማ' ? '⚡ የባትሪ ቅድመ-ማሞቂያ ተጀምሯል! ለከፍተኛ 120kW ቻርጅ ፍጥነት ባትሪው ወደ 28°C እየሞቀ ነው።' : '⚡ **Battery Thermal Preconditioning activated!** Bringing pack to optimal 28°C for maximum 120kW peak charging speed.');
      addCopilotResponse(statusText);
    } else if (actionType === 'lock') {
      if (!vehicle.isLocked) toggleLock();
      addCopilotResponse(language === 'አማ' ? '🔒 የተሽከርካሪው በሮች እና የቻርጅ ክዳን በደህንነት ተቆልፈዋል።' : '🔒 Vehicle doors and charge flap are now securely locked.');
    } else if (actionType === 'unlock') {
      if (vehicle.isLocked) toggleLock();
      addCopilotResponse(language === 'አማ' ? '🔓 የተሽከርካሪው በሮች ተከፍተዋል።' : '🔓 Vehicle doors unlocked. Welcome back!');
    } else if (actionType === 'navigate_reserve') {
      setView('reservation');
      setCopilotOpen(false);
    } else if (actionType === 'navigate_stations') {
      setView('find_charge');
      setCopilotOpen(false);
    } else if (actionType === 'navigate_charging') {
      setView('charging');
      setCopilotOpen(false);
    } else if (actionType === 'start_charging') {
      const ok = startChargingSession();
      if (ok) {
        setView('charging');
        setCopilotOpen(false);
      }
    }
  };

  const generateAIResponse = (query: string): { text: string; actions?: Message['actions'] } => {
    const q = query.toLowerCase();
    const currentRange = Math.round(vehicle.maxRangeKm * (vehicle.batterySoc / 100));

    // 0. Start Charging / Live Charging Session Command
    if (
      q.includes('start charging') ||
      q.includes('start charge') ||
      q.includes('begin charge') ||
      q.includes('begin charging') ||
      q.includes('ቻርጅ ጀምር') ||
      q.includes('ቻርጅ አድርግ') ||
      ((q.includes('charge') || q.includes('ቻርጅ')) && (q.includes('start') || q.includes('now') || q.includes('begin') || q.includes('ጀምር')))
    ) {
      if (chargingSession.status === 'CHARGING') {
        return {
          text: language === 'አማ'
            ? '⚡ ቻርጅ ማድረግ አስቀድሞ በሂደት ላይ ነው! የቀጥታ መረጃ 148 kW እየተላለፈ ነው።'
            : '⚡ Charging is already actively in progress! Live telemetry is streaming at 148 kW.',
          actions: [
            { label: language === 'አማ' ? '⚡ ወደ ቀጥታ ክፍለ-ጊዜ ሂድ' : '⚡ Go to Live Session', actionType: 'navigate_charging' }
          ]
        };
      }

      if (reservation && (reservation.status === 'RESERVED' || reservation.status === 'READY_TO_CHARGE' || reservation.status === 'NEXT_IN_QUEUE')) {
        const ok = startChargingSession();
        if (ok) {
          return {
            text: language === 'አማ'
              ? `⚡ **ቻርጅ መሙላት ተጀምሯል!** በ${reservation.stationName} (${reservation.bayNumber}) ላይ 148 kW ኃይል እየተላከ ነው። ወደ ቀጥታ ክፍለ-ጊዜ ለመሄድ ከታች ይጫኑ።`
              : `⚡ **Charging session started!** 148 kW high-power energy delivery active at ${reservation.stationName} (${reservation.bayNumber}). Tap below to view live 3D telemetry.`,
            actions: [
              { label: language === 'አማ' ? '⚡ የቀጥታ ክፍለ-ጊዜ ተመልከት' : '⚡ View Live Session', actionType: 'navigate_charging' }
            ]
          };
        }
      }

      return {
        text: language === 'አማ'
          ? '⚠️ ቻርጅ ከመጀመርዎ በፊት ንቁ የተረጋገጠ ቦታ ማስያዣ (50 ብር ተቀማጭ የተከፈለበት) ያስፈልግዎታል። እባክዎ መጀመሪያ ቻርጀር ይምረጡ።'
          : '⚠️ You need an active confirmed reservation (with 50 ETB deposit paid) before you can start charging. Please find and reserve a bay first.',
        actions: [
          { label: language === 'አማ' ? '📍 ቻርጀር ፈልግ' : '📍 Find a Charger', actionType: 'navigate_stations' },
          { label: language === 'አማ' ? '📅 ቦታ ያስይዙ' : '📅 Reserve Bay', actionType: 'navigate_reserve' }
        ]
      };
    }

    // 1. Preconditioning
    if (q.includes('precondition') || q.includes('ማሞቅ') || q.includes('warm') || q.includes('speed') || q.includes('heat')) {
      if (language === 'አማ') {
        return {
          text: `ጥሩ የዲሲ ፈጣን ቻርጅ ፍጥነት ለማግኘት የባትሪው ሙቀት በ25°C እና 32°C መካከል መሆን አለበት። የእርስዎ ${vehicle.model} ባትሪ አሁን 22°C ላይ ነው። ማሞቂያውን አሁን ማስጀመር የ10%-80% ቻርጅ ጊዜዎን በ8 ደቂቃ ይቀንሰዋል።`,
          actions: [
            { label: vehicle.isPreconditioned ? '❄️ ማሞቂያ አቁም' : '⚡ አሁን ማሞቅ ጀምር', actionType: 'precondition' }
          ]
        };
      }
      return {
        text: `Optimal DC fast charging requires battery temperature between 25°C - 32°C. Your ${vehicle.model} pack is at 22°C. Preconditioning now will reduce your 10%-80% charge duration by 8 minutes at 120kW dispensers.`,
        actions: [
          { label: vehicle.isPreconditioned ? '❄️ Turn OFF Preconditioning' : '⚡ Turn ON Preconditioning Now', actionType: 'precondition' }
        ]
      };
    }

    // 2. Station Finder in Addis
    if (q.includes('station') || q.includes('ቦታ') || q.includes('ቻርጀር') || q.includes('charger') || q.includes('nearest') || q.includes('where')) {
      if (language === 'አማ') {
        return {
          text: `በአዲስ አበባ ውስጥ ያሉ ዋና ዋና ፈጣን የኤሌክትሪክ ቻርጅ ጣቢያዎች፦\n\n1. **አዲስ ኢቪ ሀብ (ቦሌ መድኃኔዓለም)** — 2.4 ኪ.ሜ (5/8 ክፍት ቦታዎች፣ 120 kW GB/T & CCS2)\n2. **ካዛንቺስ ግሪን ቻርጅ** — 3.8 ኪ.ሜ (3/6 ክፍት ቦታዎች፣ 60 kW GB/T)\n3. **ሜክሲኮ አደባባይ ራፒድ** — 5.1 ኪ.ሜ (4/8 ክፍት ቦታዎች፣ 120 kW)`,
          actions: [
            { label: '📅 ቦሌ ኢቪ ሀብ ቦታ ያስይዙ', actionType: 'navigate_reserve' },
            { label: '🗺️ የጣቢያዎች ካርታ ይመልከቱ', actionType: 'navigate_stations' }
          ]
        };
      }
      return {
        text: `Here are the nearest live DC fast charging hubs in Addis Ababa:\n\n1. **Addis EV Hub (Bole Medhanialem)** — 2.4 km (5/8 bays free, 120 kW GB/T & CCS2)\n2. **Kazanchis Green Charge** — 3.8 km (3/6 bays free, 60 kW GB/T)\n3. **Mexico Square Rapid** — 5.1 km (4/8 bays free, 120 kW)`,
        actions: [
          { label: '📅 Reserve Bay at Addis EV Hub', actionType: 'navigate_reserve' },
          { label: '🗺️ View Live Station Map', actionType: 'navigate_stations' }
        ]
      };
    }

    // 3. Wallet / Tariff / Price
    if (q.includes('wallet') || q.includes('ዋጋ') || q.includes('ብር') || q.includes('cost') || q.includes('price') || q.includes('tariff') || q.includes('balance') || q.includes('telebirr')) {
      const remainingKwh = Math.round((100 - vehicle.batterySoc) * (vehicle.capacityKwh / 100));
      const costEtb = Math.round(remainingKwh * 19.50);
      if (language === 'አማ') {
        return {
          text: `የቻርጅፍሎው ዋሌት መረጃ፦\n- የወቅቱ ቀሪ ሂሳብ፦ **${wallet.balanceEtb.toFixed(2)} ብር**\n- የቦታ ማስያዣ ተቀማጭ፦ **50.00 ብር**\n- የ120kW ታሪፍ፦ **19.50 ብር / ኪሎዋት ሰዓት (kWh)**\n- ባትሪዎን ሙሉ (100%) ለማድረግ የሚያስፈልገው፦ **~${remainingKwh} kWh (~${costEtb} ብር)**`,
          actions: [
            { label: '📅 አሁን ቦታ ያስይዙ', actionType: 'navigate_reserve' }
          ]
        };
      }
      return {
        text: `ChargeFlow Wallet & Tariff breakdown:\n- Current Wallet Balance: **${wallet.balanceEtb.toFixed(2)} ETB**\n- Reservation Deposit: **50.00 ETB**\n- 120kW Supercharger Rate: **19.50 ETB / kWh**\n- Estimated cost to full (100%): **~${remainingKwh} kWh (~${costEtb} ETB)**`,
        actions: [
          { label: '📅 Reserve a Charging Bay', actionType: 'navigate_reserve' }
        ]
      };
    }

    // 4. Trip Range (Bishoftu / Adama)
    if (q.includes('bishoftu') || q.includes('ቢሾፍቱ') || q.includes('adama') || q.includes('አዳማ') || q.includes('range')) {
      if (language === 'አማ') {
        return {
          text: `📍 **አዲስ አበባ ወደ ቢሾፍቱ/አዳማ የጉዞ ግምት**፦\n- አሁን ያለው የተሽከርካሪዎ ርቀት፦ **${currentRange} ኪ.ሜ** (${vehicle.batterySoc}% ባትሪ)\n- ወደ ቢሾፍቱ መድረስ እና መመለስ፦ **~90 ኪ.ሜ**\n${currentRange >= 100 ? '✅ ባትሪዎ ሳይሞላ ጉዞውን በቀላሉ ማጠናቀቅ ይችላሉ።' : '⚠️ ጉዞ ከመጀመርዎ በፊት በቦሌ ኢቪ ሀብ የ10 ደቂቃ ቻርጅ ቢያደርጉ ይመከራል።'}`,
          actions: [
            { label: '📅 ቦሌ ኢቪ ሀብ ቦታ ያስይዙ', actionType: 'navigate_reserve' }
          ]
        };
      }
      return {
        text: `📍 **Addis to Bishoftu / Adama Trip Analysis**:\n- Current estimated range: **${currentRange} km** (${vehicle.batterySoc}% SoC).\n- Round-trip requirement to Bishoftu: **~90 km**.\n${currentRange >= 100 ? '✅ You can easily complete the round trip with your current battery.' : '⚠️ A quick 10-minute top-up at Addis EV Hub is recommended before departure.'}`,
        actions: [
          { label: '📅 Reserve Charging Bay', actionType: 'navigate_reserve' }
        ]
      };
    }

    // Default Fallback
    if (language === 'አማ') {
      return {
        text: `የእርስዎን **${vehicle.model}** (${vehicle.batterySoc}% ባትሪ፣ ${wallet.balanceEtb.toFixed(0)} ብር ዋሌት) አስመልክቶ ቻርጅ ጣቢያ ለማግኘት፣ ቦታ ለማስያዝ ወይም ታሪፍ ለማወቅ መጠየቅ ይችላሉ።`,
        actions: [
          { label: '📍 ቻርጅ ጣቢያዎችን እይ', actionType: 'navigate_stations' },
          { label: '📅 ቦታ ያዝ', actionType: 'navigate_reserve' }
        ]
      };
    }

    return {
      text: `Regarding your **${vehicle.model}** (${vehicle.batterySoc}% SoC, ${wallet.balanceEtb.toFixed(0)} ETB in wallet), I can help you find fast chargers, reserve a bay, plan routes, or explain energy costs.`,
      actions: [
        { label: '📍 Find 120kW Chargers', actionType: 'navigate_stations' },
        { label: '📅 Reserve Charging Bay', actionType: 'navigate_reserve' }
      ]
    };
  };

  const addCopilotResponse = (text: string, actions?: Message['actions']) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'copilot',
          text,
          timestamp: language === 'አማ' ? 'አሁን' : 'Just now',
          actions,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: language === 'አማ' ? 'አሁን' : 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);

    const reply = generateAIResponse(userText);
    addCopilotResponse(reply.text, reply.actions);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div 
        onClick={() => setCopilotOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-xl h-[85vh] max-h-[680px] rounded-3xl p-4 sm:p-6 bg-[#090E1A]/95 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden text-slate-100">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-teal-400 uppercase">ChargeFlow AI Copilot</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {language}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {vehicle.model} • {vehicle.batterySoc}% SoC • {wallet.balanceEtb.toFixed(0)} ETB
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={() => setCopilotOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'copilot' && (
                <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-2 max-w-[85%] ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-semibold shadow-md'
                      : 'bg-[#111927] border border-white/10 text-slate-200'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {m.text}
                </div>

                {m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act.actionType)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#162133] hover:bg-teal-500/20 border border-white/10 hover:border-teal-400/50 text-[11px] font-semibold text-teal-300 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3 text-teal-400" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[9px] font-mono text-slate-500 px-1">
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-teal-400 font-mono">
              <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span className="animate-pulse">ChargeFlow AI is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="pt-3 border-t border-white/10 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'አማ'
                ? 'የቻርጅፍሎው AI ረዳትን ይጠይቁ (ጣቢያዎች፣ ዋጋ፣ ባትሪ)...'
                : 'Ask ChargeFlow AI (stations, wallet, battery, range)...'
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#050811] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-bold transition-all hover:scale-105 cursor-pointer shadow-[0_0_15px_rgba(45,212,191,0.3)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICopilotModal;
