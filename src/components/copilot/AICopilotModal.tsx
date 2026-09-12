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
  ArrowRight
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';

interface Message {
  id: string;
  sender: 'copilot' | 'user';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType: 'precondition' | 'lock' | 'unlock' | 'navigate_reserve' | 'navigate_stations' | 'change_car';
    executed?: boolean;
  }[];
}

export const AICopilotModal: React.FC = () => {
  const isCopilotOpen = useChargeFlowStore((s) => s.isCopilotOpen);
  const setCopilotOpen = useChargeFlowStore((s) => s.setCopilotOpen);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const user = useChargeFlowStore((s) => s.user);
  const stations = useChargeFlowStore((s) => s.stations);
  const setView = useChargeFlowStore((s) => s.setView);
  const togglePrecondition = useChargeFlowStore((s) => s.togglePrecondition);
  const toggleLock = useChargeFlowStore((s) => s.toggleLock);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'copilot',
      text: `Hello ${user.name.split(' ')[0] || 'driver'}! I'm your ChargeFlow AI Copilot. Connected to your **${vehicle.model}** with **${vehicle.batterySoc}% SoC** (~${Math.round(vehicle.maxRangeKm * (vehicle.batterySoc / 100))} km estimated range). How can I assist your EV journey in Addis Ababa today?`,
      timestamp: 'Just now',
      actions: [
        { label: '📍 Find 120kW Fast Charger', actionType: 'navigate_stations' },
        { label: vehicle.isPreconditioned ? '🔥 Battery Preconditioned (ON)' : '⚡ Precondition Battery', actionType: 'precondition' },
        { label: '🗺️ Check Range to Bishoftu', actionType: 'navigate_reserve' },
      ],
    },
  ]);

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

  const handleActionClick = (actionType: string, msgIndex: number, actionIndex: number) => {
    if (actionType === 'precondition') {
      togglePrecondition();
      addCopilotResponse(
        vehicle.isPreconditioned
          ? `Battery preconditioning stopped. Pack temperature normal.`
          : `⚡ **Battery Thermal Preconditioning activated!** Bringing pack to optimal 28°C for maximum 120kW peak charging speed at Addis EV Hub.`
      );
    } else if (actionType === 'lock') {
      if (!vehicle.isLocked) toggleLock();
      addCopilotResponse(`🔒 Vehicle doors and charge flap are now **securely locked**.`);
    } else if (actionType === 'unlock') {
      if (vehicle.isLocked) toggleLock();
      addCopilotResponse(`🔓 Vehicle doors **unlocked**. Welcome back!`);
    } else if (actionType === 'navigate_reserve') {
      setView('reservation');
      setCopilotOpen(false);
    } else if (actionType === 'navigate_stations') {
      setView('find_charge');
      setCopilotOpen(false);
    }
  };

  const generateAIResponse = (query: string): { text: string; actions?: Message['actions'] } => {
    const q = query.toLowerCase();

    // 1. Preconditioning
    if (q.includes('precondition') || q.includes('battery heat') || q.includes('warm up') || q.includes('fast charge speed')) {
      return {
        text: `Optimal DC fast charging requires battery temperature between 25°C - 32°C. Your ${vehicle.model} pack is at 22°C. Preconditioning now will reduce your 10%-80% charge duration by 8 minutes at 120kW dispensers.`,
        actions: [
          { label: vehicle.isPreconditioned ? '❄️ Turn OFF Preconditioning' : '⚡ Turn ON Preconditioning Now', actionType: 'precondition' }
        ]
      };
    }

    // 2. Range to Bishoftu / Adama / Hawassa / Entoto
    if (q.includes('bishoftu') || q.includes('debre zeit')) {
      const currentRange = Math.round(vehicle.maxRangeKm * (vehicle.batterySoc / 100));
      const distance = 45;
      const roundTrip = distance * 2;
      return {
        text: `📍 **Addis Ababa to Bishoftu**: ~45 km (Expressway).\n- Current estimated range: **${currentRange} km** (${vehicle.batterySoc}% SoC).\n- Round-trip requirement: **~90 km** (plus ~10% elevation buffer).\n${currentRange >= roundTrip ? '✅ **You can easily complete the round trip** without charging.' : '⚠️ You will need a quick 10-minute top-up before returning.'}`,
        actions: [
          { label: '📅 Reserve Bay at Addis EV Hub', actionType: 'navigate_reserve' }
        ]
      };
    }

    if (q.includes('adama') || q.includes('nazret')) {
      const currentRange = Math.round(vehicle.maxRangeKm * (vehicle.batterySoc / 100));
      return {
        text: `📍 **Addis to Adama**: ~92 km via Expressway.\n- Your current range: **${currentRange} km**.\n- Estimated battery on arrival: **~${Math.max(5, vehicle.batterySoc - 35)}%**.\n- Tip: Charge at Addis EV Hub before departure to guarantee 100% peace of mind!`,
        actions: [
          { label: '⚡ Reserve Charging Bay', actionType: 'navigate_reserve' }
        ]
      };
    }

    // 3. Nearest Station / Best Charger in Addis
    if (q.includes('nearest') || q.includes('station') || q.includes('charger') || q.includes('where')) {
      return {
        text: `Here are the nearest live DC fast charging hubs in Addis Ababa:\n\n1. **Addis EV Hub (Bole Medhanialem)** — 2.4 km (5/8 bays free, 120 kW GB/T & CCS2)\n2. **Kazanchis Green Charge** — 3.8 km (3/6 bays free, 60 kW GB/T)\n3. **Mexico Square Rapid** — 5.1 km (4/8 bays free, 120 kW)`,
        actions: [
          { label: '🚀 Reserve Bay 03 (Addis EV Hub)', actionType: 'navigate_reserve' },
          { label: '🗺️ View Live Station Map', actionType: 'navigate_stations' }
        ]
      };
    }

    // 4. Tariff / Price / Cost calculation (Telebirr / CBE)
    if (q.includes('cost') || q.includes('price') || q.includes('tariff') || q.includes('telebirr') || q.includes('cbe') || q.includes('birr') || q.includes('etb')) {
      const remainingKwh = Math.round((100 - vehicle.batterySoc) * (vehicle.capacityKwh / 100));
      const costEtb = Math.round(remainingKwh * 19.50);
      return {
        text: `💡 **Charging Tariff Breakdown for ${vehicle.model}**:\n- Base Rate: **19.50 ETB / kWh** (Off-peak: 18.00 ETB)\n- Energy needed for 100% charge: **${remainingKwh} kWh**\n- Estimated full charge cost: **~${costEtb} ETB**\n- Accepted payment methods: **Telebirr Instant**, **CBE Birr**, **Chapa Direct** with automated digital invoice.`,
        actions: [
          { label: '💳 View Payment Methods', actionType: 'navigate_reserve' }
        ]
      };
    }

    // 5. Battery Range
    if (q.includes('range') || q.includes('how far') || q.includes('battery') || q.includes('percentage')) {
      const currentRange = Math.round(vehicle.maxRangeKm * (vehicle.batterySoc / 100));
      return {
        text: `🔋 **Live Battery Telemetry**:\n- Model: **${vehicle.model}** (${vehicle.capacityKwh} kWh Pack)\n- Current SoC: **${vehicle.batterySoc}%**\n- Estimated City Range: **${currentRange} km**\n- Highway Range: **~${Math.round(currentRange * 0.88)} km**\n- Drivetrain: **${vehicle.drive || 'FWD'}**\n- Efficiency: **12.4 kWh / 100 km**`,
        actions: [
          { label: '⚡ Top-up at Addis EV Hub', actionType: 'navigate_reserve' }
        ]
      };
    }

    // 6. Lock / Unlock
    if (q.includes('lock') || q.includes('door') || q.includes('security')) {
      if (q.includes('unlock')) {
        return {
          text: `Your ${vehicle.model} is currently ${vehicle.isLocked ? 'locked' : 'unlocked'}. Would you like me to unlock the doors?`,
          actions: [{ label: '🔓 Unlock Vehicle', actionType: 'unlock' }]
        };
      }
      return {
        text: `Vehicle security check: All windows and charging flap closed. Would you like me to lock the doors?`,
        actions: [{ label: '🔒 Lock Vehicle', actionType: 'lock' }]
      };
    }

    // Default intelligent fallback response
    return {
      text: `Understood! With your **${vehicle.model}** at **${vehicle.batterySoc}% battery**, I can help you plan charging stops, navigate Addis Ababa EV hubs, activate battery thermal conditioning, or calculate tariffs in Ethiopian Birr (ETB). What would you like to do?`,
      actions: [
        { label: '📍 Find 120kW Charger', actionType: 'navigate_stations' },
        { label: '📅 Reserve a Charging Bay', actionType: 'navigate_reserve' },
        { label: '⚡ Precondition Battery', actionType: 'precondition' }
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
          timestamp: 'Just now',
          actions,
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: 'Just now',
      },
    ]);

    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: response.text,
          timestamp: 'Just now',
          actions: response.actions,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput('');
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: prompt,
        timestamp: 'Just now',
      },
    ]);

    setIsTyping(true);
    setTimeout(() => {
      const response = generateAIResponse(prompt);
      setMessages((prev) => [
        ...prev,
        {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: response.text,
          timestamp: 'Just now',
          actions: response.actions,
        },
      ]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      {/* Slide-out / Floating AI Chatbot Container */}
      <div className="w-full sm:max-w-md h-full sm:h-[620px] max-h-screen bg-[#070D18] sm:border sm:border-[#2DD4BF]/30 sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(45,212,191,0.15)] flex flex-col overflow-hidden">
        {/* 1. Header with Glowing AI Orb */}
        <div className="p-4 bg-[#0A1222] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Glowing AI Lens */}
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#2DD4BF] to-[#0284C7] p-0.5 shadow-[0_0_15px_rgba(45,212,191,0.5)] flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-[#070D18] flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/images/ui/copilot-orb-exact.jpg" 
                  alt="AI Orb" 
                  className="w-full h-full object-cover mix-blend-screen animate-pulse"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Sparkles className="w-4 h-4 text-[#2DD4BF] absolute" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-wide">AI COPILOT</h3>
                <span className="px-1.5 py-0.5 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] text-[9px] font-mono font-bold border border-[#2DD4BF]/30">
                  BETA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {vehicle.model} • {vehicle.batterySoc}% SoC • Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([messages[0]])}
              title="Reset Conversation"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCopilotOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Chat Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((msg, msgIdx) => {
            const isCopilot = msg.sender === 'copilot';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isCopilot ? 'justify-start' : 'justify-end'}`}
              >
                {isCopilot && (
                  <div className="w-6 h-6 rounded-lg bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3 rounded-2xl space-y-2 ${
                    isCopilot
                      ? 'bg-[#0E1626] border border-white/10 text-slate-200 rounded-tl-sm'
                      : 'bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6] text-slate-950 font-medium rounded-tr-sm shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Interactive Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actions.map((act, actIdx) => (
                        <button
                          key={act.label}
                          onClick={() => handleActionClick(act.actionType, msgIdx, actIdx)}
                          className="px-2.5 py-1 rounded-xl bg-[#080D18] hover:bg-[#132338] border border-[#2DD4BF]/40 text-[#2DD4BF] hover:text-white font-mono text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[9px] font-mono ${isCopilot ? 'text-slate-500' : 'text-slate-900/70'} text-right`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-center">
              <div className="w-6 h-6 rounded-lg bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF] shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl bg-[#0E1626] border border-white/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-[#09101C]/80 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            'How far can I drive?',
            'Find 120kW fast charger',
            'Precondition battery',
            'Trip to Bishoftu',
            'Full charge cost with Telebirr',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSuggestedPrompt(prompt)}
              className="px-2.5 py-1 rounded-full bg-[#111A2C] hover:bg-[#1C2C4A] border border-white/10 text-[10px] text-slate-300 hover:text-white whitespace-nowrap transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* 4. Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#0A1222] border-t border-white/10 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot about charging, range, tariffs..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#060A14] border border-white/10 text-white text-xs placeholder:text-slate-500 outline-none focus:border-[#2DD4BF]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
              input.trim()
                ? 'bg-[#2DD4BF] text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.5)]'
                : 'bg-white/5 text-slate-600'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICopilotModal;
