import { Language } from "../types";

export interface TranslationStrings {
  // Navigation
  cockpit: string;
  findCharging: string;
  reservation: string;
  queue: string;
  charging: string;
  history: string;
  settings: string;
  welcome: string;

  // Cockpit View
  goodEvening: string;
  goodMorning: string;
  goodAfternoon: string;
  connectedAndReady: string;
  batteryStatus: string;
  estimatedRange: string;
  powerDelivery: string;
  energyDelivered: string;
  cost: string;
  searchCar: string;
  dragToRotate: string;
  vehicleLocked: string;
  vehicleUnlocked: string;
  doorsClosed: string;
  climateControl: string;
  climateActive: string;
  preconditioning: string;
  tirePressureNormal: string;
  speedMode: string;
  ecoMode: string;
  quickActions: string;
  instantCharge: string;
  reserveBayAction: string;
  viewMap: string;
  aiCopilotHint: string;
  systemHealthy: string;
  systemCaution: string;
  systemLowBattery: string;

  // Charging Screen & Cockpit Stage
  chargingTitle: string;
  readyTitle: string;
  energyFlowing: string;
  chargingComplete: string;
  startCharging: string;
  stopCharging: string;
  power: string;
  voltage: string;
  timeRemaining: string;
  batteryFullNotice: string;
  viewHistory: string;
  bayLabel: string;
  stationHub: string;
  ratePerKwh: string;
  sessionCost: string;
  sessionCompleteTitle: string;
  doneButton: string;

  // Find & Reserve
  findStationTitle: string;
  searchStationPlaceholder: string;
  availableBaysCount: string;
  distanceKm: string;
  reserveThisBay: string;
  reserveBayTitle: string;
  depositRequired: string;
  arrivalDeadline: string;
  confirmReservationBtn: string;
  cancelReservationBtn: string;
  bayReservedSuccess: string;

  // Queue View
  queueTitle: string;
  queueSubtitle: string;
  currentPosition: string;
  estimatedWait: string;
  fastTrackPass: string;
  notifyWhenReady: string;

  // History View
  historyTitle: string;
  historySubtitle: string;
  totalEnergyCharged: string;
  totalSpent: string;
  dateLabel: string;
  stationLabel: string;
  receiptId: string;
  exportReceipt: string;

  // Settings View
  settingsTitle: string;
  regionalLanguagePref: string;
  themePreference: string;
  darkThemeLabel: string;
  lightThemeLabel: string;
  notificationsTitle: string;
  paymentMethodsTitle: string;
  securityTitle: string;
  myVehiclesTitle: string;

  // Welcome & Auth
  welcomeTitle: string;
  welcomeSubtitle: string;
  signIn: string;
  createAccount: string;
  fullNameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  passwordLabel: string;
  vehicleModelLabel: string;
  currentBatteryLabel: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  signInSubtitle: string;
  createAccountSubtitle: string;
  getStartedBtn: string;
  networkBanner: string;
  heroHeading1: string;
  heroHeading2: string;
  openCockpit: string;
  exploreStations: string;
  stepReserve: string;
  stepCharge: string;
  stepGo: string;
  view360: string;
  exteriorPaint: string;
  powertrainLabel: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  copilotBadge: string;
  copilotTitle: string;
  copilotDesc: string;
  copilotBtn: string;
  footerRights: string;
  autoSpin: string;
  pauseSpin: string;

  // Payments & Currency
  telebirr: string;
  cbeBirr: string;
  currencyEtb: string;

  // Common Actions
  back: string;
  next: string;
  close: string;
  confirm: string;
  cancel: string;
  autoRotate: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;

  // Additional AHE and Cockpit strings
  liveData: string;
  stream: string;
  chargingMode: string;
  chargingActive: string;
  ready: string;
  autoOrbiting: string;
  stepPrereqRequired: string;
  stepPrereqDesc: string;
  findStationReserveBay: string;
  instantDemoSession: string;
  totalBilled: string;
  duration: string;
  finalSoc: string;
  proceedToHistory: string;
  returnToCockpit: string;
  sessionAtEnded: string;
  electricSuv: string;
  urbanCompact: string;
  electricCrossover: string;
  electricVehicle: string;
  beginChargingNotice: string;
  endChargingNotice: string;
  transferringPower: string;
  prevVehicle: string;
  nextVehicle: string;
  viewAngle: string;
  // Additional reservation & flow keys
  backToStation: string;
  selectBayStep: string;
  chooseBaySubtitle: string;
  available: string;
  reserved: string;
  offline: string;
  chooseTimeStep: string;
  arrivalTimeSubtitle: string;
  arriveNow: string;
  arriveNowDesc: string;
  reserveForLater: string;
  reserveForLaterDesc: string;
  flexibleTime: string;
  flexibleTimeDesc: string;
  slotReservedNotice: string;
  paymentMethodStep: string;
  paymentMethodSubtitle: string;
  securePaymentsNotice: string;
  youAreInControl: string;
  inControlSubtitle: string;
  reservationSummary: string;
  whyChargeFlow: string;
  guaranteedBay: string;
  saveTime: string;
  smartCoordination: string;
  seamlessExperience: string;
  enterPinTitle: string;
  confirmBayPinSubtitle: string;

  // Queue View
  queueOverview: string;
  currentlyCharging: string;
  yourVehicleBadge: string;
  nextInQueue: string;
  liveQueueDetails: string;
  vehicleLabel: string;
  statusLabel: string;
  batteryLabel: string;
  powerLabel: string;
  estTimeLabel: string;
  estStartLabel: string;
  yourReservation: string;
  resConfirmed: string;
  arrivalDeadlineLabel: string;
  startChargingNowBtn: string;
  navigateStationBtn: string;
  youAreNext: string;

  // History View
  pastChargingSessions: string;
  totalSessions: string;
  totalTime: string;
  avgCostPerKwh: string;
  sessionHistoryTitle: string;
  searchSessionsPlaceholder: string;
  filterBtn: string;
  exportBtn: string;
  showingSessions: string;
  offPeakTip: string;
  energyInsightsTitle: string;
  mostEnergy: string;
  mostFrequent: string;
  energyOverTime: string;
  costBreakdownTitle: string;
  co2SavedMessage: string;

  // Settings View
  profileTab: string;
  myVehicleTab: string;
  chargingPerfTab: string;
  notificationsTab: string;
  paymentsTab: string;
  securityTab: string;
  manageAccountSubtitle: string;
  profileOverview: string;
  editProfileBtn: string;
  switchModelBtn: string;
  activeVehicleSpecs: string;
  batteryCapacity: string;
  connectorProtocol: string;
  licensePlate: string;
  efficiencyLabel: string;
  accountSecurityTitle: string;
  changePasswordBtn: string;
  twoFactorAuth: string;
  twoFactorDesc: string;
  currentDevice: string;
  quickActionsTitle: string;
  accountStatusTitle: string;
  emailVerified: string;
  phoneVerified: string;
  paymentAdded: string;
  vehicleLinked: string;
  dangerZoneTitle: string;
  signOutBtn: string;
}

export const translations: Record<Language, TranslationStrings> = {
  EN: {
    cockpit: "Cockpit",
    findCharging: "Find Station",
    reservation: "Reservation",
    queue: "Live Queue",
    charging: "Active Session",
    history: "History",
    settings: "Settings",
    welcome: "Welcome",

    goodEvening: "Good evening",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    connectedAndReady: "Your EV, connected and ready.",
    batteryStatus: "Battery Status",
    estimatedRange: "Estimated Range",
    powerDelivery: "Power Delivery",
    energyDelivered: "Energy Delivered",
    cost: "Session Cost",
    searchCar: "Search your car model (e.g. BYD, Tesla)...",
    dragToRotate: "Drag to Rotate 3D Car",
    vehicleLocked: "Vehicle Locked",
    vehicleUnlocked: "Vehicle Unlocked",
    doorsClosed: "All Doors Closed",
    climateControl: "Climate Control",
    climateActive: "Climate 21°C Active",
    preconditioning: "Preconditioning",
    tirePressureNormal: "Tire Pressure: 2.4 Bar (Normal)",
    speedMode: "Sport / Comfort",
    ecoMode: "Eco Mode Active",
    quickActions: "Quick Controls",
    instantCharge: "Charge Now",
    reserveBayAction: "Reserve Bay",
    viewMap: "View Stations",
    aiCopilotHint: "Ask ChargeFlow AI Copilot",
    systemHealthy: "Optimal Battery State",
    systemCaution: "Battery Moderate (15–50%)",
    systemLowBattery: "Low Battery Warning (<15%)",

    chargingTitle: "Charging",
    readyTitle: "Connected & Ready",
    energyFlowing: "Energy Flowing",
    chargingComplete: "Charging Complete",
    startCharging: "Start Charging",
    stopCharging: "Stop Charging",
    power: "Power",
    voltage: "Voltage",
    timeRemaining: "Time Remaining",
    batteryFullNotice: "Battery is Full (100%)! Session completed safely.",
    viewHistory: "View History",
    bayLabel: "Bay",
    stationHub: "Addis EV Hub",
    ratePerKwh: "Rate per kWh",
    sessionCost: "Current Cost",
    sessionCompleteTitle: "Charging Session Summary",
    doneButton: "Done",

    findStationTitle: "EV Stations in Addis Ababa",
    searchStationPlaceholder: "Search by station name or district...",
    availableBaysCount: "Bays Available",
    distanceKm: "km away",
    reserveThisBay: "Reserve Selected Bay",
    reserveBayTitle: "Confirm Bay Reservation",
    depositRequired: "Refundable Deposit",
    arrivalDeadline: "Arrival Guarantee",
    confirmReservationBtn: "Confirm & Reserve",
    cancelReservationBtn: "Cancel",
    bayReservedSuccess: "Bay reserved successfully!",

    queueTitle: "Live Charging Queue",
    queueSubtitle: "Real-time queue monitoring at your reserved station.",
    currentPosition: "Queue Position",
    estimatedWait: "Estimated Wait",
    fastTrackPass: "Fast-Track Available",
    notifyWhenReady: "SMS & Push Notification Ready",

    historyTitle: "Charging History",
    historySubtitle: "Complete transaction ledger and receipt history.",
    totalEnergyCharged: "Total Energy Delivered",
    totalSpent: "Total Expenditure",
    dateLabel: "Date & Time",
    stationLabel: "Station & Bay",
    receiptId: "Receipt ID",
    exportReceipt: "Download Receipt",

    settingsTitle: "Account & Preferences",
    regionalLanguagePref: "Regional Language",
    themePreference: "Visual Theme",
    darkThemeLabel: "Futuristic Dark",
    lightThemeLabel: "Warm Cream Light",
    notificationsTitle: "Notification Alerts",
    paymentMethodsTitle: "Payment Options",
    securityTitle: "Security & Privacy",
    myVehiclesTitle: "Registered Vehicles",

    welcomeTitle: "Drive Clean. Live Better.",
    welcomeSubtitle: "Empowering Ethiopia's green electric mobility revolution.",
    signIn: "Sign In",
    createAccount: "Create Account",
    fullNameLabel: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "Ethiopian Phone Number",
    passwordLabel: "Password",
    vehicleModelLabel: "Select Vehicle / Car Type",
    currentBatteryLabel: "Current Battery Percentage",
    alreadyHaveAccount: "Already have an account? Sign In",
    dontHaveAccount: "Don't have an account? Create one",
    signInSubtitle: "Sign in to access your cockpit and charging bays.",
    createAccountSubtitle: "Join Ethiopia's premier green EV network.",
    getStartedBtn: "Get Started",
    networkBanner: "ETHIOPIA'S PREMIER EV NETWORK",
    heroHeading1: "YOUR EV.",
    heroHeading2: "READY WHEN YOU ARE.",
    openCockpit: "Open Vehicle Cockpit",
    exploreStations: "Explore Stations",
    stepReserve: "RESERVE",
    stepCharge: "CHARGE",
    stepGo: "GO",
    view360: "360° VIEW",
    exteriorPaint: "Exterior Paint",
    powertrainLabel: "Powertrain",
    step1Title: "Find a Station",
    step1Desc: "Explore 120kW DC fast charging stations across Addis Ababa with real-time bay availability.",
    step2Title: "Reserve Your Slot",
    step2Desc: "Guarantee your bay in advance with a 30 ETB deposit directly from your ChargeFlow wallet or Telebirr.",
    step3Title: "Charge Seamlessly",
    step3Desc: "Pull onto the charging pad. Monitor real-time energy flow and completed session records.",
    copilotBadge: "AI EV Assistant",
    copilotTitle: "ChargeFlow AI Copilot",
    copilotDesc: "Context-aware guidance for charging speeds, battery preconditioning, and route planning.",
    copilotBtn: "Ask AI Copilot",
    footerRights: "ChargeFlow Ethiopia © 2026 • Real-world EV Intelligence & Clean Energy",
    autoSpin: "Auto Spin",
    pauseSpin: "Pause Spin",

    telebirr: "Telebirr",
    cbeBirr: "CBE Birr",
    currencyEtb: "ETB",

    back: "Back",
    next: "Next",
    close: "Close",
    confirm: "Confirm",
    cancel: "Cancel",
    autoRotate: "Auto Rotate",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    resetView: "Reset Camera",

    liveData: "Live Data",
    stream: "STREAM",
    chargingMode: "Charging Mode",
    chargingActive: "Charging Active",
    ready: "READY",
    autoOrbiting: "Auto Orbiting",
    stepPrereqRequired: "Prerequisite Flow Required",
    stepPrereqDesc: "Step 07 requires an approved bay reservation and queue clearance.",
    findStationReserveBay: "Step 04: Find Station & Reserve Bay",
    instantDemoSession: "Instant Demo: Launch Bay 03 Session",
    totalBilled: "Total Billed",
    duration: "Duration",
    finalSoc: "Final SoC",
    proceedToHistory: "Proceed to Step 08: Charging History",
    returnToCockpit: "Return to Cockpit",
    sessionAtEnded: "Session ended successfully.",
    electricSuv: "Electric SUV",
    urbanCompact: "Urban Compact",
    electricCrossover: "Electric Crossover",
    electricVehicle: "Electric Vehicle",
    beginChargingNotice: "Begin contact charging session",
    endChargingNotice: "End charging session",
    transferringPower: "Energy Flowing",
    prevVehicle: "Previous Vehicle",
    nextVehicle: "Next Vehicle",
    viewAngle: "View Angle",
    // Additional reservation & flow keys
    backToStation: "Back to station",
    selectBayStep: "1. Select Bay",
    chooseBaySubtitle: "Choose an available charging bay",
    available: "Available",
    reserved: "Reserved",
    offline: "Offline",
    chooseTimeStep: "2. Choose Time",
    arrivalTimeSubtitle: "Select when you plan to arrive",
    arriveNow: "Arrive now",
    arriveNowDesc: "Start charging immediately",
    reserveForLater: "Reserve for later",
    reserveForLaterDesc: "Pick a time slot",
    flexibleTime: "Flexible",
    flexibleTimeDesc: "Join queue when near",
    slotReservedNotice: "Your slot is reserved for 15 minutes after arrival.",
    paymentMethodStep: "3. Payment Method",
    paymentMethodSubtitle: "No payment now. You'll pay during charging.",
    securePaymentsNotice: "Secure payments. Your payment details are safe with us.",
    youAreInControl: "You're in control",
    inControlSubtitle: "You can reschedule or cancel this reservation anytime before your arrival.",
    reservationSummary: "Reservation Summary",
    whyChargeFlow: "Why ChargeFlow?",
    guaranteedBay: "Guaranteed bay",
    saveTime: "Save time",
    smartCoordination: "Smart coordination",
    seamlessExperience: "Seamless experience",
    enterPinTitle: "Enter 4-Digit Security PIN",
    confirmBayPinSubtitle: "Confirm bay lock for",

    // Queue View
    queueOverview: "QUEUE OVERVIEW",
    currentlyCharging: "CURRENTLY CHARGING",
    yourVehicleBadge: "YOUR VEHICLE",
    nextInQueue: "NEXT IN QUEUE",
    liveQueueDetails: "LIVE QUEUE DETAILS",
    vehicleLabel: "VEHICLE",
    statusLabel: "STATUS",
    batteryLabel: "BATTERY",
    powerLabel: "POWER",
    estTimeLabel: "EST. TIME",
    estStartLabel: "EST. START",
    yourReservation: "YOUR RESERVATION",
    resConfirmed: "Reservation: CONFIRMED",
    arrivalDeadlineLabel: "Arrival deadline",
    startChargingNowBtn: "Start Charging Now",
    navigateStationBtn: "Navigate to Station",
    youAreNext: "YOU ARE NEXT",

    // History View
    pastChargingSessions: "All your past charging sessions",
    totalSessions: "Total sessions",
    totalTime: "Total time",
    avgCostPerKwh: "Avg. cost / kWh",
    sessionHistoryTitle: "SESSION HISTORY",
    searchSessionsPlaceholder: "Search sessions...",
    filterBtn: "Filter",
    exportBtn: "Export",
    showingSessions: "Showing past charging sessions",
    offPeakTip: "Tip: Charge during off-peak hours (10PM – 6AM) for the best rates.",
    energyInsightsTitle: "ENERGY INSIGHTS",
    mostEnergy: "Most energy",
    mostFrequent: "Most frequent",
    energyOverTime: "Energy over time (kWh)",
    costBreakdownTitle: "COST BREAKDOWN",
    co2SavedMessage: "You saved 18.7 kg CO₂ this month",

    // Settings View
    profileTab: "Profile",
    myVehicleTab: "My Vehicle",
    chargingPerfTab: "Charging Performance",
    notificationsTab: "Notifications",
    paymentsTab: "Payments",
    securityTab: "Security & Privacy",
    manageAccountSubtitle: "Manage your account, vehicle, preferences and security",
    profileOverview: "PROFILE OVERVIEW",
    editProfileBtn: "Edit Profile",
    switchModelBtn: "Switch Model",
    activeVehicleSpecs: "ACTIVE VEHICLE SPECIFICATIONS",
    batteryCapacity: "Battery Capacity",
    connectorProtocol: "Connector Protocol",
    licensePlate: "License Plate",
    efficiencyLabel: "Efficiency",
    accountSecurityTitle: "ACCOUNT SECURITY & AUTHENTICATION",
    changePasswordBtn: "Change Password",
    twoFactorAuth: "Two-Factor Authentication (2FA)",
    twoFactorDesc: "Require SMS confirmation code on login",
    currentDevice: "THIS DEVICE",
    quickActionsTitle: "QUICK ACTIONS",
    accountStatusTitle: "ACCOUNT STATUS",
    emailVerified: "Email verified",
    phoneVerified: "Phone verified",
    paymentAdded: "Payment added",
    vehicleLinked: "Vehicle linked",
    dangerZoneTitle: "DANGER ZONE",
    signOutBtn: "Sign out",
  },

  አማ: {
    cockpit: "ኮክፒት",
    findCharging: "ቻርጀር ፈልግ",
    reservation: "ቦታ ማስያዝ",
    queue: "ተራ መቆጣጠሪያ",
    charging: "ቻርጅ ክፍለ ጊዜ",
    history: "የቻርጅ ታሪክ",
    settings: "ማስተካከያዎች",
    welcome: "እንኳን ደህና መጡ",

    goodEvening: "እንደይት አመሹ",
    goodMorning: "እንደይት አደሩ",
    goodAfternoon: "እንደይት ዋሉ",
    connectedAndReady: "የእርስዎ ኤሌክትሪክ መኪና ዝግጁ ነው።",
    batteryStatus: "የባትሪ ሁኔታ",
    estimatedRange: "የሚጓዘው ርቀት",
    powerDelivery: "የኃይል መጠን",
    energyDelivered: "የተሰጠው ኃይል",
    cost: "ዋጋ",
    searchCar: "የመኪና ሞዴልዎን ይፈልጉ (ምሳሌ BYD, Tesla)...",
    dragToRotate: "3D መኪናውን ለማዞር ይጎትቱ",
    vehicleLocked: "መኪናው ተቆልፏል",
    vehicleUnlocked: "መኪናው ተከፍቷል",
    doorsClosed: "ሁሉም በሮች ተዘግተዋል",
    climateControl: "የአየር ንብረት መቆጣጠሪያ",
    climateActive: "አየር ንብረት 21°C ገቢር ነው",
    preconditioning: "ቅድመ-ዝግጅት",
    tirePressureNormal: "የጎማ ግፊት፡ 2.4 ባር (መደበኛ)",
    speedMode: "ስፖርት / ምቾት",
    ecoMode: "ኢኮ ሞድ ገቢር ነው",
    quickActions: "ፈጣን መቆጣጠሪያዎች",
    instantCharge: "አሁን ቻርጅ አድርግ",
    reserveBayAction: "ቦታ ያዝ",
    viewMap: "ጣቢያዎችን ተመልከት",
    aiCopilotHint: "የቻርጅፍሎው AI ረዳትን ይጠይቁ",
    systemHealthy: "ምርጥ የባትሪ ሁኔታ",
    systemCaution: "መካከለኛ ባትሪ (15–50%)",
    systemLowBattery: "አነስተኛ ባትሪ ማስጠንቀቂያ (<15%)",

    chargingTitle: "ቻርጅ በማድረግ ላይ",
    readyTitle: "ተገናኝቷል እና ዝግጁ ነው",
    energyFlowing: "ኃይል በመተላለፍ ላይ",
    chargingComplete: "ቻርጅ ተጠናቋል",
    startCharging: "ቻርጅ ጀምር",
    stopCharging: "ቻርጅ አቁም",
    power: "ኃይል",
    voltage: "ቮልቴጅ",
    timeRemaining: "የቀረው ጊዜ",
    batteryFullNotice: "🎉 ባትሪ ሙሉ (100%) ሆኗል! ክፍለ ጊዜው በጥንቃቄ ተጠናቋል።",
    viewHistory: "ታሪክ ተመልከት",
    bayLabel: "ቦታ",
    stationHub: "አዲስ ኢቪ ማዕከል",
    ratePerKwh: "ዋጋ በኪሎዋት ሰዓት",
    sessionCost: "የአሁኑ ዋጋ",
    sessionCompleteTitle: "የቻርጅ ክፍለ ጊዜ ማጠቃለያ",
    doneButton: "ተጠናቋል",

    findStationTitle: "በአዲስ አበባ የሚገኙ የኢቪ ጣቢያዎች",
    searchStationPlaceholder: "በጣቢያ ስም ወይም ክፍለ ከተማ ይፈልጉ...",
    availableBaysCount: "ክፍት ቦታዎች",
    distanceKm: "ኪ.ሜ ርቀት",
    reserveThisBay: "የተመረጠውን ቦታ ያዝ",
    reserveBayTitle: "የቦታ ማስያዣ ማረጋገጫ",
    depositRequired: "ተመላሽ ተቀማጭ",
    arrivalDeadline: "የመድረሻ ዋስትና",
    confirmReservationBtn: "አረጋግጥ እና ያዝ",
    cancelReservationBtn: "ሰርዝ",
    bayReservedSuccess: "ቦታው በተሳካ ሁኔታ ተይዟል!",

    queueTitle: "የቀጥታ ተራ መቆጣጠሪያ",
    queueSubtitle: "በተያዘው ጣቢያ ላይ ያለ የቀጥታ ተራ ክትትል።",
    currentPosition: "የተራ ቁጥር",
    estimatedWait: "የሚገመት የጥበቃ ጊዜ",
    fastTrackPass: "ፈጣን ማለፊያ ይገኛል",
    notifyWhenReady: "የኤስኤምኤስ እና የስልክ ማሳወቂያ ዝግጁ",

    historyTitle: "የቻርጅ ታሪክ",
    historySubtitle: "የክፍያዎች እና የደረሰኞች ሙሉ መዝገብ።",
    totalEnergyCharged: "ጠቅላላ የተሰጠ ኃይል",
    totalSpent: "ጠቅላላ ወጪ",
    dateLabel: "ቀን እና ሰዓት",
    stationLabel: "ጣቢያ እና ቦታ",
    receiptId: "የደረሰኝ ቁጥር",
    exportReceipt: "ደረሰኝ አውርድ",

    settingsTitle: "መለያ እና ምርጫዎች",
    regionalLanguagePref: "የቋንቋ ምርጫ",
    themePreference: "የገጽታ ቀለም",
    darkThemeLabel: "ዘመናዊ ጨለማ",
    lightThemeLabel: "ሞቅ ያለ ክሬም ብርሃን",
    notificationsTitle: "የማሳወቂያ ቅንብሮች",
    paymentMethodsTitle: "የክፍያ አማራጮች",
    securityTitle: "ደህንነት እና ግላዊነት",
    myVehiclesTitle: "የተመዘገቡ መኪናዎች",

    welcomeTitle: "በንጹሕ ኃይል ይንዱ። የተሻለ ኑሮ ይኑሩ።",
    welcomeSubtitle: "የኢትዮጵያን አረንጓዴ ኤሌክትሪክ ተሽከርካሪ አብዮት ማጎልበት።",
    signIn: "ግባ",
    createAccount: "መለያ ፍጠር",
    fullNameLabel: "ሙሉ ስም",
    emailLabel: "ኢሜይል አድራሻ",
    phoneLabel: "የኢትዮጵያ ስልክ ቁጥር",
    passwordLabel: "የይለፍ ቃል",
    vehicleModelLabel: "የመኪና ሞዴል ይምረጡ",
    currentBatteryLabel: "የአሁኑ የባትሪ በመቶኛ",
    alreadyHaveAccount: "መለያ አለዎት? ይግቡ",
    dontHaveAccount: "መለያ የለዎትም? መለያ ይፍጠሩ",
    signInSubtitle: "ወደ ኮክፒትዎ እና ቻርጀሮች ለመግባት ይግቡ።",
    createAccountSubtitle: "የኢትዮጵያ ቀዳሚ የኢቪ ኔትወርክን ይቀላቀሉ።",
    getStartedBtn: "ይጀምሩ",
    networkBanner: "የኢትዮጵያ ቀዳሚ የኢቪ ኔትወርክ",
    heroHeading1: "የእርስዎ ኢቪ።",
    heroHeading2: "እርስዎ ሲዘጋጁ ዝግጁ ነው።",
    openCockpit: "የተሽከርካሪ ኮክፒት ክፈት",
    exploreStations: "ጣቢያዎችን ያስሱ",
    stepReserve: "ቦታ ያስይዙ",
    stepCharge: "ቻርጅ ያድርጉ",
    stepGo: "ይጓዙ",
    view360: "360° እይታ",
    exteriorPaint: "የውጭ ቀለም",
    powertrainLabel: "የሞተር ኃይል",
    step1Title: "ጣቢያ ያግኙ",
    step1Desc: "በአዲስ አበባ ውስጥ ያሉ 120kW የዲሲ ፈጣን ቻርጅ ማድረጊያ ጣቢያዎችን በቅጽበት ይፈልጉ።",
    step2Title: "ቦታዎን ያስይዙ",
    step2Desc: "ከቻርጅፍሎው ቦርሳዎ ወይም በቴሌብር በ30 ብር ቅድመ ክፍያ የቻርጅ ማድረጊያ ቦታዎን ያረጋግጡ።",
    step3Title: "በቀላሉ ቻርጅ ያድርጉ",
    step3Desc: "ወደ ቻርጅ ማድረጊያው ፓድ ይግቡ። የኃይል ፍሰቱን እና የተጠናቀቁ ክፍለ-ጊዜዎችን ይከታተሉ።",
    copilotBadge: "AI የኢቪ ረዳት",
    copilotTitle: "ቻርጅፍሎው AI ኮፓይለት",
    copilotDesc: "የኃይል መሙላት ፍጥነትን፣ የባትሪ ቅድመ-ዝግጅትን እና የመንገድ እቅድን የሚያግዝ ዘመናዊ ረዳት።",
    copilotBtn: "AI ኮፓይለትን ይጠይቁ",
    footerRights: "ቻርጅፍሎው ኢትዮጵያ © 2026 • የኢቪ ብልህ ቴክኖሎጂ እና ንጹሕ ኃይል",
    autoSpin: "ራስ-አዙር",
    pauseSpin: "አፍታ አቁም",

    telebirr: "ቴሌብር",
    cbeBirr: "ሲቢኢ ብር",
    currencyEtb: "ብር",

    back: "ተመለስ",
    next: "ቀጣይ",
    close: "ዝጋ",
    confirm: "አረጋግጥ",
    cancel: "ሰርዝ",
    autoRotate: "ራስ-አዙር",
    zoomIn: "አቅርብ",
    zoomOut: "አርቅ",
    resetView: "ካሜራ መልስ",

    liveData: "የቀጥታ መረጃ",
    stream: "ቀጥታ",
    chargingMode: "የቻርጅ ሁኔታ",
    chargingActive: "ቻርጅ በማድረግ ላይ",
    ready: "ዝግጁ",
    autoOrbiting: "በራስ-ሰር በመዞር ላይ",
    stepPrereqRequired: "ቅድመ-ሁኔታ ያስፈልጋል",
    stepPrereqDesc: "የጸደቀ የቦታ ማስያዝ እና የተራ ፈቃድ ያስፈልጋል።",
    findStationReserveBay: "ደረጃ 04፡ ጣቢያ ፈልግ እና ቦታ ያዝ",
    instantDemoSession: "የሙከራ ክፍለ ጊዜ፡ ቤይ 03 ጀምር",
    totalBilled: "አጠቃላይ ክፍያ",
    duration: "የፈጀው ጊዜ",
    finalSoc: "የመጨረሻ ባትሪ %",
    proceedToHistory: "ወደ ደረጃ 08፡ የቻርጅ ታሪክ ቀጥል",
    returnToCockpit: "ወደ ኮክፒት ተመለስ",
    sessionAtEnded: "ክፍለ ጊዜው በተሳካ ሁኔታ ተጠናቋል።",
    electricSuv: "ኤሌክትሪክ SUV",
    urbanCompact: "የከተማ መኪና",
    electricCrossover: "ኤሌክትሪክ ክሮስኦቨር",
    electricVehicle: "ኤሌክትሪክ መኪና",
    beginChargingNotice: "የቻርጅ ክፍለ ጊዜ ጀምር",
    endChargingNotice: "የቻርጅ ክፍለ ጊዜ አቁም",
    transferringPower: "ኃይል በማስተላለፍ ላይ",
    prevVehicle: "ቀዳሚ መኪና",
    nextVehicle: "ቀጣይ መኪና",
    viewAngle: "የእይታ ማዕዘን",
    // Additional reservation & flow keys
    backToStation: "ወደ ጣቢያው ተመለስ",
    selectBayStep: "1. ቦታ ምረጥ",
    chooseBaySubtitle: "ዝግጁ የሆነ የኃይል መሙያ ቦታ ይምረጡ",
    available: "ክፍት",
    reserved: "የተያዘ",
    offline: "ከአገልግሎት ውጭ",
    chooseTimeStep: "2. ሰዓት ይምረጡ",
    arrivalTimeSubtitle: "የሚደርሱበትን ሰዓት ይምረጡ",
    arriveNow: "አሁን መድረስ",
    arriveNowDesc: "ወዲያውኑ ቻርጅ ማድረግ ይጀምሩ",
    reserveForLater: "ለቆየት ብሎ መያዝ",
    reserveForLaterDesc: "የሰዓት ክፍተት ይምረጡ",
    flexibleTime: "ተለዋዋጭ ሰዓት",
    flexibleTimeDesc: "ሲቃረቡ ተራ ይያዙ",
    slotReservedNotice: "የተያዘው ቦታ ከደረሱ በኋላ ለ15 ደቂቃዎች ይጠበቅልዎታል።",
    paymentMethodStep: "3. የክፍያ መንገድ",
    paymentMethodSubtitle: "አሁን ክፍያ አያስፈልግም። ቻርጅ በሚያደርጉበት ጊዜ ይከፍላሉ።",
    securePaymentsNotice: "አስተማማኝ ክፍያ። የክፍያ መረጃዎ ሙሉ በሙሉ የተጠበቀ ነው።",
    youAreInControl: "ሙሉ ቁጥጥር በእጅዎ ነው",
    inControlSubtitle: "ከመድረስዎ በፊት ቦታውን በማንኛውም ሰዓት መቀየር ወይም መሰረዝ ይችላሉ።",
    reservationSummary: "የቦታ ማስያዝ ማጠቃለያ",
    whyChargeFlow: "ለምን ቻርጅፍሎው?",
    guaranteedBay: "የተረጋገጠ ቦታ",
    saveTime: "ጊዜ ይቆጥቡ",
    smartCoordination: "ዘመናዊ ቅንጅት",
    seamlessExperience: "ቀላል እና ፈጣን አጠቃቀም",
    enterPinTitle: "የ4-ዲጂት የደህንነት ፒን ያስገቡ",
    confirmBayPinSubtitle: "ቦታውን ለማረጋገጥ ፒን ያስገቡ ለ",

    // Queue View
    queueOverview: "የተራ አጠቃላይ እይታ",
    currentlyCharging: "በመሙላት ላይ ያለ",
    yourVehicleBadge: "የእርስዎ መኪና",
    nextInQueue: "ቀጣይ በተራው",
    liveQueueDetails: "የቀጥታ ተራ ዝርዝሮች",
    vehicleLabel: "ተሽከርካሪ",
    statusLabel: "ሁኔታ",
    batteryLabel: "ባትሪ",
    powerLabel: "ኃይል",
    estTimeLabel: "የሚገመተው ጊዜ",
    estStartLabel: "የሚጀመርበት ሰዓት",
    yourReservation: "የእርስዎ ማስያዣ",
    resConfirmed: "ቦታ ማስያዝ፡ ተረጋግጧል",
    arrivalDeadlineLabel: "የመድረሻ የመጨረሻ ሰዓት",
    startChargingNowBtn: "አሁን ቻርጅ ማድረግ ጀምር",
    navigateStationBtn: "ወደ ጣቢያው ምራኝ",
    youAreNext: "የእርስዎ ተራ ነው",

    // History View
    pastChargingSessions: "ያለፉ የኃይል መሙላት ታሪኮች በሙሉ",
    totalSessions: "ጠቅላላ ክፍለ ጊዜያት",
    totalTime: "ጠቅላላ ጊዜ",
    avgCostPerKwh: "አማካይ ዋጋ / kWh",
    sessionHistoryTitle: "የክፍለ ጊዜ ታሪክ",
    searchSessionsPlaceholder: "ክፍለ ጊዜዎችን ፈልግ...",
    filterBtn: "አጣራ",
    exportBtn: "አውርድ",
    showingSessions: "ያለፉ የኃይል መሙያ ታሪኮች",
    offPeakTip: "ምክር፡ በዝቅተኛ የፍጆታ ሰዓታት (ከምሽቱ 4 ሰዓት - ጥዋት 12 ሰዓት) ቻርጅ በማድረግ ወጪዎን ይቀንሱ።",
    energyInsightsTitle: "የኃይል ግንዛቤዎች",
    mostEnergy: "ከፍተኛ ኃይል",
    mostFrequent: "ተደጋጋሚ ጣቢያ",
    energyOverTime: "የኃይል ፍጆታ በጊዜ (kWh)",
    costBreakdownTitle: "የወጪ ዝርዝር",
    co2SavedMessage: "በዚህ ወር 18.7 ኪ.ግ ካርቦን (CO₂) ቀንሰዋል",

    // Settings View
    profileTab: "መገለጫ",
    myVehicleTab: "የእኔ መኪና",
    chargingPerfTab: "የኃይል አፈፃፀም",
    notificationsTab: "ማሳወቂያዎች",
    paymentsTab: "ክፍያዎች",
    securityTab: "ደህንነት እና ግላዊነት",
    manageAccountSubtitle: "መለያዎን፣ ተሽከርካሪዎን እና ምርጫዎችዎን ያስተዳድሩ",
    profileOverview: "የመገለጫ አጠቃላይ እይታ",
    editProfileBtn: "መገለጫ አርትዕ",
    switchModelBtn: "ሞዴል ቀይር",
    activeVehicleSpecs: "የአሁኑ መኪና ዝርዝሮች",
    batteryCapacity: "የባትሪ አቅም",
    connectorProtocol: "የኮኔክተር አይነት",
    licensePlate: "የሰሌዳ ቁጥር",
    efficiencyLabel: "ቅልጥፍና",
    accountSecurityTitle: "የመለያ ደህንነት እና ማረጋገጫ",
    changePasswordBtn: "የይለፍ ቃል ቀይር",
    twoFactorAuth: "ባለሁለት-ደረጃ ማረጋገጫ (2FA)",
    twoFactorDesc: "በመግቢያ ሰዓት የኤስኤምኤስ ኮድ ይጠይቁ",
    currentDevice: "ይህ መሣሪያ",
    quickActionsTitle: "ፈጣን እርምጃዎች",
    accountStatusTitle: "የመለያ ሁኔታ",
    emailVerified: "ኢሜይል ተረጋግጧል",
    phoneVerified: "ስልክ ተረጋግጧል",
    paymentAdded: "ክፍያ ተገናኝቷል",
    vehicleLinked: "ተሽከርካሪ ተገናኝቷል",
    dangerZoneTitle: "አስፈላጊ ማስጠንቀቂያ",
    signOutBtn: "ውጣ",
  },

  ORM: {
    cockpit: "Kokpiitii",
    findCharging: "Bakka Chaarji Barbaadi",
    reservation: "Bakka Qabachuu",
    queue: "Toree Qabi",
    charging: "Chaarjii Irra Jira",
    history: "Seenaa Chaarjii",
    settings: "Sajoo",
    welcome: "Baga Dhuftan",

    goodEvening: "Akkam ooltan",
    goodMorning: "Akkam bultan",
    goodAfternoon: "Akkam ooltan",
    connectedAndReady: "Konkolaataan keessan qophiidha.",
    batteryStatus: "Haala Baatrii",
    estimatedRange: "Fageenya Tilmaamaa",
    powerDelivery: "Humna Kennamu",
    energyDelivered: "Humna Kenname",
    cost: "Gatii",
    searchCar: "Moodeela konkolaataa keessanii barbaadaa (fkn BYD, Tesla)...",
    dragToRotate: "Konkolaataa 3D naannessuuf harkisaa",
    vehicleLocked: "Konkolaataan Cufameera",
    vehicleUnlocked: "Konkolaataan Banameera",
    doorsClosed: "Hulaawwan Hundi Cufamaniiru",
    climateControl: "To'annoo Qilleensaa",
    climateActive: "Qilleensi 21°C Hojjataa Jira",
    preconditioning: "Qophii Duraa",
    tirePressureNormal: "Dhiibbaa Gommaa: 2.4 Bar (Idilee)",
    speedMode: "Ispoortii / Nageenya",
    ecoMode: "Mooodiin Ekoo Hojjataa Jira",
    quickActions: "To'annoowwan Saffisaa",
    instantCharge: "Amma Chaarjii Godhi",
    reserveBayAction: "Bakka Qabadhu",
    viewMap: "Buufatoota Ilaali",
    aiCopilotHint: "Gargaaraa ChargeFlow AI Gaafadhaa",
    systemHealthy: "Haala Baatrii Gaarii",
    systemCaution: "Baatrii Giddu-galeessa (15–50%)",
    systemLowBattery: "Akeekkachiisa Baatrii Xiqqaa (<15%)",

    chargingTitle: "Chaarjii Ta'aa Jira",
    readyTitle: "Walqabatee fi Qophii",
    energyFlowing: "Humni Daddarbaa Jira",
    chargingComplete: "Chaarjiin Xumurameera",
    startCharging: "Chaarjii Jalqabi",
    stopCharging: "Chaarjii Dhaabi",
    power: "Humna",
    voltage: "Voolteejii",
    timeRemaining: "Yeroo Hafe",
    batteryFullNotice: "🎉 Baatriin Guuteera (100%)! Chaarjiin nagaan xumurameera.",
    viewHistory: "Seenaa Ilaali",
    bayLabel: "Bakka",
    stationHub: "Giddugala EV Finfinnee",
    ratePerKwh: "Gatii kWh tokkoo",
    sessionCost: "Gatii Ammaa",
    sessionCompleteTitle: "Gabaasa Yeroo Chaarjii",
    doneButton: "Xumurame",

    findStationTitle: "Buufatoota EV Finfinnee Keessatti",
    searchStationPlaceholder: "Maqaa buufataan ykn kutaadhaan barbaadaa...",
    availableBaysCount: "Bakka Qophii",
    distanceKm: "km fagaata",
    reserveThisBay: "Bakka Filatame Qabadhu",
    reserveBayTitle: "Mirkaneessa Bakka Qabachuu",
    depositRequired: "Qabsiisa Deebi'u",
    arrivalDeadline: "Wabii Ga'umsaa",
    confirmReservationBtn: "Mirkaneessi fi Qabadhu",
    cancelReservationBtn: "Haqi",
    bayReservedSuccess: "Bakki milkaa'inaan qabameera!",

    queueTitle: "Toree Chaarjii Kallattii",
    queueSubtitle: "Buufata keessan irratti hordoffii toree kallattii.",
    currentPosition: "Lakk Toree",
    estimatedWait: "Yeroo Eeggannoo Tilmaamaa",
    fastTrackPass: "Toree Saffisaa Jira",
    notifyWhenReady: "Ergaa SMS fi Moobaayilaan Qophii",

    historyTitle: "Seenaa Chaarjii",
    historySubtitle: "Galmee kaffaltii fi nagahee guutuu.",
    totalEnergyCharged: "Waliigala Humna Kenname",
    totalSpent: "Waliigala Baasii",
    dateLabel: "Guyyaa fi Sa'aatii",
    stationLabel: "Buufata fi Bakka",
    receiptId: "Lakk Nagahee",
    exportReceipt: "Nagahee Buufadhu",

    settingsTitle: "Herrega fi Filannoowwan",
    regionalLanguagePref: "Afaan Naannoo",
    themePreference: "Bifa Mul'ataa",
    darkThemeLabel: "Dukkana Ammayyaa",
    lightThemeLabel: "Ifa Kirimii Ho'aa",
    notificationsTitle: "Sajoo Beeksisaa",
    paymentMethodsTitle: "Filannoowwan Kaffaltii",
    securityTitle: "Nageenya fi Dhuunfaa",
    myVehiclesTitle: "Konkolaattota Galmaa'an",

    welcomeTitle: "Qulqulluu Oofi. Jireenya Gaarii Jiraadhu.",
    welcomeSubtitle: "Warraaqsa konkolaataa elektirikii magariisa Itoophiyaa humneessuu.",
    signIn: "Seeni",
    createAccount: "Herrega Uumi",
    fullNameLabel: "Maqaa Guutuu",
    emailLabel: "Teessoo Imeelii",
    phoneLabel: "Lakk Bilbila Itoophiyaa",
    passwordLabel: "Jecha Icchiitii",
    vehicleModelLabel: "Moodeela Konkolaataa Filadhaa",
    currentBatteryLabel: "Dhibbeentaa Baatrii Ammaa",
    alreadyHaveAccount: "Herrega qabduu? Seenaa",
    dontHaveAccount: "Herrega hin qabduu? Uumaa",
    signInSubtitle: "Kokpiitii fi bakka chaarjii argachuuf seeni.",
    createAccountSubtitle: "Neetwoorkii EV magariisa duraa Itoophiyaatti makamaa.",
    getStartedBtn: "Jalqabi",
    networkBanner: "NEETWOORKII EV MAGARIISA DURAA ITOOPHIYAA",
    heroHeading1: "KONKOLAATAA KEESSAN.",
    heroHeading2: "YEROO BARBAADDANITTI QOPHAA'AA DHA.",
    openCockpit: "Kokpiitii Konkolaataa Bani",
    exploreStations: "Buufataalee Sakatta'aa",
    stepReserve: "QABACHUU",
    stepCharge: "CHAARJII",
    stepGo: "DEEMI",
    view360: "ILAALCHA 360°",
    exteriorPaint: "Halluu Alaa",
    powertrainLabel: "Humna Motoraa",
    step1Title: "Buufata Barbaadaa",
    step1Desc: "Buufataalee chaarjii saffisaa 120kW Finfinnee keessa jiran bakka banaa wajjin sakatta'aa.",
    step2Title: "Bakka Keessan Qabadhaa",
    step2Desc: "Waliigaltee Birrii 30 boorsaa ChargeFlow ykn Telebirr irraa kafaluun bakka keessan mirkaneeffadhaa.",
    step3Title: "Salphaatti Chaarjii Godhaa",
    step3Desc: "Bakka chaarjiitti seenaa. Yaatuu anniisaa fi galmee tajaajila xumuramee hordofaa.",
    copilotBadge: "Gargaaraa EV AI",
    copilotTitle: "ChargeFlow AI Copilot",
    copilotDesc: "Saffisa chaarjii, qophii baatrii fi karoora deemsaa ilaalchisee gorsa qabatamaa argadhaa.",
    copilotBtn: "AI Copilot Gaafadhaa",
    footerRights: "ChargeFlow Itoophiyaa © 2026 • Beekumsa EV fi Anniisaa Qulqulluu",
    autoSpin: "Ofiin Naannessi",
    pauseSpin: "Dhaabi",

    telebirr: "Telebirr",
    cbeBirr: "CBE Birr",
    currencyEtb: "ETB",

    back: "Duubatti",
    next: "Itti Fufi",
    close: "Cufi",
    confirm: "Mirkaneessi",
    cancel: "Haqi",
    autoRotate: "Ofiin Naannessu",
    zoomIn: "Guddisi",
    zoomOut: "Xiqqeessi",
    resetView: "Kaameraa Deebisi",

    liveData: "Daataa Kallattii",
    stream: "KALLATTII",
    chargingMode: "Haala Chaarjii",
    chargingActive: "Chaarjiin Hojjechaa Jira",
    ready: "QOPHAA'AA",
    autoOrbiting: "Ofiin Naanna'aa Jira",
    stepPrereqRequired: "Ulaagaa Duraa Barbaachisa",
    stepPrereqDesc: "Bakka qabachuu fi eeyyama sararaa barbaada.",
    findStationReserveBay: "Tarkaanfii 04: Buufata Barbaadi & Bakka Qabadhu",
    instantDemoSession: "Yaalii Battalaa: Bay 03 Jalqabi",
    totalBilled: "Waliigala Kaffaltii",
    duration: "Turtii",
    finalSoc: "Chaarjii Dhumaa",
    proceedToHistory: "Tarkaanfii 08: Gara Seenaa Chaarjiitti Darbi",
    returnToCockpit: "Gara Kokpiitiitti Deebi'i",
    sessionAtEnded: "Sirni chaarjii milkaa'inaan xumurameera.",
    electricSuv: "SUV Elektiriikii",
    urbanCompact: "Kompaktii Magaalaa",
    electricCrossover: "Kiroos'oovarii Elektiriikii",
    electricVehicle: "Konkolaataa Elektiriikii",
    beginChargingNotice: "Sirna chaarjii eegali",
    endChargingNotice: "Sirna chaarjii xumuri",
    transferringPower: "Dhangala'aa Annisaa",
    prevVehicle: "Konkolaataa Duraa",
    nextVehicle: "Konkolaataa Itti Aanu",
    viewAngle: "Kofa Mul'ataa",

    // Additional reservation & flow keys
    backToStation: "Gara buufataatti deebi'i",
    selectBayStep: "1. Bakka Filadhu",
    chooseBaySubtitle: "Bakka chaarjii banaa ta'e filadhu",
    available: "Banaa",
    reserved: "Qabameera",
    offline: "Tajaajilaan Ala",
    chooseTimeStep: "2. Yeroo Filadhu",
    arrivalTimeSubtitle: "Yeroo itti geessu filadhu",
    arriveNow: "Amma Ga'i",
    arriveNowDesc: "Battaluma chaarjii jalqabi",
    reserveForLater: "Yeroo biraaf qabadhu",
    reserveForLaterDesc: "Yeroo filadhu",
    flexibleTime: "Yeroo jijjiiramaa",
    flexibleTimeDesc: "Yoo dhiyaattu dabaree qabadhu",
    slotReservedNotice: "Bakki keessan erga geessanii booda daqiiqaa 15f ni eegama.",
    paymentMethodStep: "3. Mala Kaffaltii",
    paymentMethodSubtitle: "Amma kaffaltiin hin barbaachisu. Yeroo chaarjiitti kaffaltu.",
    securePaymentsNotice: "Kaffaltii amansiisaa. Odeeffannoon kaffaltii keessanii eegamaadha.",
    youAreInControl: "To'annoon guutuu harka keessaniiti",
    inControlSubtitle: "Osoo hin ga'in dura bakka kana yeroo barbaaddan jijjiiruu ykn haquu dandeessu.",
    reservationSummary: "Cuunfaa Bakka Qabachuu",
    whyChargeFlow: "Maaliif ChargeFlow?",
    guaranteedBay: "Bakka mirkanaa'e",
    saveTime: "Yeroo qusadhaa",
    smartCoordination: "Qindoomina ammayyaa",
    seamlessExperience: "Fayyadamummaa salphaa fi si'ataa",
    enterPinTitle: "PIN Eegumsaa Dijitii-4 Galchaa",
    confirmBayPinSubtitle: "Bakka cufuu mirkaneessuuf PIN galchaa",

    // Queue View
    queueOverview: "IJA-SAADAA DABAREE",
    currentlyCharging: "AMMA CHAARJII IRRA",
    yourVehicleBadge: "KONKOLAATAA KEESSAN",
    nextInQueue: "DABAREE ITTI AANU",
    liveQueueDetails: "BAL'INA DABAREE KALLATTII",
    vehicleLabel: "KONKOLAATAA",
    statusLabel: "HAALA",
    batteryLabel: "BAATIRII",
    powerLabel: "HUMNA",
    estTimeLabel: "YEROO TILMAAMAME",
    estStartLabel: "JALQABA TILMAAMAME",
    yourReservation: "QABANNAA KEESSAN",
    resConfirmed: "Bakka Qabachuu: MIRKAA'EERA",
    arrivalDeadlineLabel: "Yeroo dhumaa gahuu",
    startChargingNowBtn: "Amma Chaarjii Jalqabi",
    navigateStationBtn: "Gara Buufataatti Na Qajeelchi",
    youAreNext: "DABAREE KEESSAN",

    // History View
    pastChargingSessions: "Seenaa chaarjii darbe hunda",
    totalSessions: "Walgahii waliigalaa",
    totalTime: "Yeroo waliigalaa",
    avgCostPerKwh: "Gatii giddugaleessaa / kWh",
    sessionHistoryTitle: "SEENAA CHAARJII",
    searchSessionsPlaceholder: "Chaarjii barbaadi...",
    filterBtn: "Calali",
    exportBtn: "Baasi",
    showingSessions: "Seenaa chaarjii darban agarsiisaa jira",
    offPeakTip: "Gorsa: Yeroo baasii gadi-aanaatti (halkan keessaa 4:00 - ganama 12:00) chaarjii gochuun qusadhaa.",
    energyInsightsTitle: "HUBANNOO ENERJII",
    mostEnergy: "Enerjii guddaa",
    mostFrequent: "Buufata yeroo baay'ee",
    energyOverTime: "Fayyadama enerjii yeroo keessatti (kWh)",
    costBreakdownTitle: "CACCABSA BAASII",
    co2SavedMessage: "Ji'a kana keessa 18.7 kg CO₂ hambiftaniittu",

    // Settings View
    profileTab: "Piroofayilii",
    myVehicleTab: "Konkolaataa Koo",
    chargingPerfTab: "Hojii Chaarjii",
    notificationsTab: "Beeksisa",
    paymentsTab: "Kaffaltiiwwan",
    securityTab: "Eegumsa & Dhuunfaa",
    manageAccountSubtitle: "Herrega, konkolaataa fi filannoowwan keessan to'adhaa",
    profileOverview: "IJA-SAADAA PIROOFAAYILII",
    editProfileBtn: "Piroofaayilii Gulaali",
    switchModelBtn: "Moodela Jijjiiri",
    activeVehicleSpecs: "ODEEYFANNOO KONKOLAATAA",
    batteryCapacity: "Dandeettii Baatirii",
    connectorProtocol: "Gosa Qabsiisaa",
    licensePlate: "Lakkoofsa Gabatee",
    efficiencyLabel: "Gahumsa",
    accountSecurityTitle: "EEGUMSA HERREGAA & MIRKANEESSA",
    changePasswordBtn: "Jecha Icchiitii Jijjiiri",
    twoFactorAuth: "Mirkaneessa Sadarkaa-Lamaa (2FA)",
    twoFactorDesc: "Yeroo seentan koodii SMS gaafadhu",
    currentDevice: "MEESHAAN KANA",
    quickActionsTitle: "TARKANFIIWWAN SALPHAA",
    accountStatusTitle: "HAALA HERREGAA",
    emailVerified: "Imeeliin mirkanaa'eera",
    phoneVerified: "Bilbilli mirkanaa'eera",
    paymentAdded: "Kaffaltiin itti dabalameera",
    vehicleLinked: "Konkolaataan walqabateera",
    dangerZoneTitle: "BAKKA AKKAASITTI BEELAMU",
    signOutBtn: "Ba'i",
  },

  TIR: {
    cockpit: "ኮክፒት",
    findCharging: "ቻርጀር ድለይ",
    reservation: "ቦታ ምሓዝ",
    queue: "መስርዕ",
    charging: "ቻርጅ ክፍለ ግዜ",
    history: "ናይ ቻርጅ ታሪኽ",
    settings: "ምምሕያሻት",
    welcome: "እንቋዕ ብደሓን መጻእኩም",

    goodEvening: "ከመይ ኣምሲኹም",
    goodMorning: "ከመይ ሓዲርኩም",
    goodAfternoon: "ከመይ ውዒልኩም",
    connectedAndReady: "መኪናኹም ቕሩብ ኣላ።",
    batteryStatus: "ኩነታት ባትሪ",
    estimatedRange: "ዝጓዓዞ ርሕቐት",
    powerDelivery: "ዓቐን ሓይሊ",
    energyDelivered: "ዝተዋህበ ሓይሊ",
    cost: "ዋጋ",
    searchCar: "ሞዴል መኪናኹም ድለዩ (ንኣብነት BYD, Tesla)...",
    dragToRotate: "3D መኪና ንምዝዋር ስሓቡ",
    vehicleLocked: "መኪና ተዓጽያ",
    vehicleUnlocked: "መኪና ተኸፊታ",
    doorsClosed: "ኩሎም ማዕጾታት ተዓጽዮም",
    climateControl: "ምቁጽጻር ኣየር",
    climateActive: "ኣየር 21°C ንጡፍ ኣሎ",
    preconditioning: "ቅድመ-ድልውነት",
    tirePressureNormal: "ጸቕጢ ጎማ፡ 2.4 ባር (ስሩዕ)",
    speedMode: "ስፖርት / ቅሳነት",
    ecoMode: "ኢኮ ሞድ ንጡፍ ኣሎ",
    quickActions: "ቀለልቲ መቆጻጸሪታት",
    instantCharge: "ሕጂ ቻርጅ ግበር",
    reserveBayAction: "ቦታ ሓዝ",
    viewMap: "ጣብያታት ርአ",
    aiCopilotHint: "ንChargeFlow AI ረዳኢ ሕተት",
    systemHealthy: "ብሉጽ ኩነታት ባትሪ",
    systemCaution: "ማእከላይ ባትሪ (15–50%)",
    systemLowBattery: "ትሑት ባትሪ መጠንቀቕታ (<15%)",

    chargingTitle: "ቻርጅ ይግበር ኣሎ",
    readyTitle: "ተተሓሒዙን ድሉውን",
    energyFlowing: "ሓይሊ ይፈስስ ኣሎ",
    chargingComplete: "ቻርጅ ተወዲኡ",
    startCharging: "ቻርጅ ጀምር",
    stopCharging: "ቻርጅ ደው ኣብል",
    power: "ሓይሊ",
    voltage: "ቮልቴጅ",
    timeRemaining: "ዝተረፈ ግዜ",
    batteryFullNotice: "🎉 ባትሪ ምሉእ (100%) ኮይኑ! ብጥንቃቐ ተዛዚሙ።",
    viewHistory: "ታሪኽ ርአ",
    bayLabel: "ቦታ",
    stationHub: "ኣዲስ ኢቪ ማእከል",
    ratePerKwh: "ዋጋ ንሓደ kWh",
    sessionCost: "ናይ ሕጂ ዋጋ",
    sessionCompleteTitle: "ናይ ቻርጅ ክፍለ ግዜ ጽማቕ",
    doneButton: "ተወዲኡ",

    findStationTitle: "ኣብ ኣዲስ ኣበባ ዝርከቡ ናይ ኢቪ ጣብያታት",
    searchStationPlaceholder: "ብሽም ጣብያ ወይ ከባቢ ድለዩ...",
    availableBaysCount: "ክፉታት ቦታታት",
    distanceKm: "ኪ.ሜ ርሕቐት",
    reserveThisBay: "ዝተመርጸ ቦታ ሓዝ",
    reserveBayTitle: "ምልክታ ቦታ ምርግጋጽ",
    depositRequired: "ዝምለስ ተቀማጢ",
    arrivalDeadline: "ናይ ምብጻሕ ዋሕስ",
    confirmReservationBtn: "ኣረጋግጽን ሓዝን",
    cancelReservationBtn: "ሰርዝ",
    bayReservedSuccess: "ቦታ ብዓወት ተታሒዙ!",

    queueTitle: "ቀጥታዊ መስርዕ",
    queueSubtitle: "ኣብ ዝተሓዘ ጣብያ ዘሎ ቀጥታዊ ምክትታል መስርዕ።",
    currentPosition: "ቁጽሪ መስርዕ",
    estimatedWait: "ዝግመት ናይ ምጽባይ ግዜ",
    fastTrackPass: "ቅልጡፍ መሕለፊ ኣሎ",
    notifyWhenReady: "ኤስኤምኤስን ናይ ሞባይል ምልክታን ድሉው",

    historyTitle: "ናይ ቻርጅ ታሪኽ",
    historySubtitle: "ምሉእ ናይ ክፍሊትን ቅብሊትን መዝገብ።",
    totalEnergyCharged: "ጠቕላላ ዝተዋህበ ሓይሊ",
    totalSpent: "ጠቕላላ ወጻኢ",
    dateLabel: "ዕለትን ሰዓትን",
    stationLabel: "ጣብያን ቦታን",
    receiptId: "ቁጽሪ ቅብሊት",
    exportReceipt: "ቅብሊት ኣውርድ",

    settingsTitle: "ኣካውንትን ምርጫታትን",
    regionalLanguagePref: "ናይ ቋንቋ ምርጫ",
    themePreference: "ናይ ገጽታ ሕብሪ",
    darkThemeLabel: "ዘመናዊ ጸሊም",
    lightThemeLabel: "ዉዑይ ክሬም ብርሃን",
    notificationsTitle: "ናይ ምልክታ ቅጥዕታት",
    paymentMethodsTitle: "ናይ ክፍሊት ኣማራጺታት",
    securityTitle: "ውሕስነትን ውልቃውነትን",
    myVehiclesTitle: "ዝተመዝገቡ መካይን",

    welcomeTitle: "ብንጹህ ሓይሊ ንደቑ። ዝበለጸ ንበሩ።",
    welcomeSubtitle: "ናይ ኢትዮጵያ ቀጠልያ ኤሌክትሪክ መጓዓዝያ ሰውራ ምዕባለ።",
    signIn: "እቶ",
    createAccount: "ኣካውንት ፍጠር",
    fullNameLabel: "ምሉእ ሽም",
    emailLabel: "ኢሜይል ኣድራሻ",
    phoneLabel: "ናይ ኢትዮጵያ ስልኪ ቁጽሪ",
    passwordLabel: "መሕለፊ ቃል",
    vehicleModelLabel: "ሞዴል መኪና ምረጹ",
    currentBatteryLabel: "ናይ ሕጂ ባትሪ ሚእታዊት",
    alreadyHaveAccount: "ኣካውንት ኣለኩም ድዩ? እተዉ",
    dontHaveAccount: "ኣካውንት የብልኩምን? ፍጠሩ",
    signInSubtitle: "ናብ ኮክፒትኩምን ቻርጀራትኩምን ንምእታው እተዉ።",
    createAccountSubtitle: "ናይ ኢትዮጵያ ቀዳማይ ናይ ኢቪ መርበብ ተጸንበሩ።",
    getStartedBtn: "ጀምሩ",
    networkBanner: "ናይ ኢትዮጵያ ቀዳማይ ናይ ኢቪ መርበብ",
    heroHeading1: "ናትኩም ኢቪ።",
    heroHeading2: "ድሉዋት ኣብ ዝኾንኩምሉ ድሉው እዩ።",
    openCockpit: "ናይ መኪና ኮክፒት ክፈት",
    exploreStations: "ጣብያታት ዞሩ",
    stepReserve: "ቦታ ሓዝ",
    stepCharge: "ቻርጅ ግበር",
    stepGo: "ኺድ",
    view360: "360° ርእየት",
    exteriorPaint: "ናይ ደገ ሕብሪ",
    powertrainLabel: "ናይ ሞተር ሓይሊ",
    step1Title: "ጣብያ ርከቡ",
    step1Desc: "ኣብ ኣዲስ ኣበባ ዝርከቡ 120kW ናይ ዲሲ ቅልጡፍ ቻርጅ መውሃቢ ጣብያታት ብቐጥታ ድለዩ።" ,
    step2Title: "ቦታኹም ሕዙ",
    step2Desc: "ካብ ቻርጅፍሎው ቦርሳኹም ወይ ብቴሌብር ብ30 ቅርሺ ቅድመ ክፍሊት ብምግባር ቦታኹም ኣረጋግጹ።",
    step3Title: "ብቐሊሉ ቻርጅ ግበሩ",
    step3Desc: "ናብቲ ቻርጅ መውሃቢ ቦታ እተዉ። ዋሕዚ ኃይልን ዝተዛዘመ ክፍለ ግዜን ብቐጥታ ተኸታተሉ።",
    copilotBadge: "AI ናይ ኢቪ ሓጋዚ",
    copilotTitle: "ቻርጅፍሎው AI ኮፓይለት",
    copilotDesc: "ናይ ቻርጅ ፍጥነት፣ ናይ ባትሪ ቅድመ-ድልውነትን ናይ ጉዕዞ ውጥንን ዝሕግዝ ዘመናዊ ሓጋዚ።",
    copilotBtn: "AI ኮፓይለት ሕተቱ",
    footerRights: "ቻርጅፍሎው ኢትዮጵያ © 2026 • ብልሒ ኢቪን ንጹህ ኃይልን",
    autoSpin: "ብባዕሉ ዘውር",
    pauseSpin: "ኣዕርፍ",

    telebirr: "ቴሌብር",
    cbeBirr: "ሲቢኢ ብር",
    currencyEtb: "ብር",

    back: "ተመለስ",
    next: "ቀጻሊ",
    close: "ዕጾ",
    confirm: "ኣረጋግጽ",
    cancel: "ሰርዝ",
    autoRotate: "ባዕሉ ዝዘውር",
    zoomIn: "ኣዕቢ",
    zoomOut: "ኣንእስ",
    resetView: "ካሜራ መልስ",

    liveData: "ቀጥታዊ ዳታ",
    stream: "ቀጥታ",
    chargingMode: "ናይ ቻርጅ ኩነታት",
    chargingActive: "ቻርጅ ይግበር ኣሎ",
    ready: "ድሉው",
    autoOrbiting: "ባዕሉ ይዘውር ኣሎ",
    stepPrereqRequired: "ቅድመ-ኩነት የድሊ",
    stepPrereqDesc: "ዝጸደቐ ቦታ ምሓዝን ናይ ተራ ፍቓድን የድሊ።",
    findStationReserveBay: "ደረጃ 04፡ ጣብያ ድለይ ቦታ ሓዝን",
    instantDemoSession: "ፈተነ ፈጣን፡ ቤይ 03 ጀምር",
    totalBilled: "ጠቕላላ ክፍሊት",
    duration: "ዝወሰዶ ግዜ",
    finalSoc: "ናይ መወዳእታ ባትሪ %",
    proceedToHistory: "ናብ ደረጃ 08፡ ናይ ቻርጅ ታሪኽ ቀጽል",
    returnToCockpit: "ናብ ኮክፒት ተመለስ",
    sessionAtEnded: "ክፍለ ግዜ ብዕውት ኩነታት ተዛዚሙ።",
    electricSuv: "ኤለክትሪክ SUV",
    urbanCompact: "ናይ ከተማ መኪና",
    electricCrossover: "ኤለክትሪክ ክሮስኦቨር",
    electricVehicle: "ኤለክትሪክ መኪና",
    beginChargingNotice: "ናይ ቻርጅ ክፍለ ግዜ ጀምር",
    endChargingNotice: "ናይ ቻርጅ ክፍለ ግዜ ኣቋርጽ",
    transferringPower: "ሓይሊ ይፈስስ ኣሎ",
    prevVehicle: "ዝሓለፈ መኪና",
    nextVehicle: "ዝቕጽል መኪና",
    viewAngle: "ኩርናዕ ምርኣይ",
    // Additional reservation & flow keys
    backToStation: "ናብ መደበር ተመለስ",
    selectBayStep: "1. ቦታ ምረጽ",
    chooseBaySubtitle: "ክፉት ዝኾነ ናይ ቻርጅ ቦታ ምረጹ",
    available: "ክፉት",
    reserved: "ዝተታሕዘ",
    offline: "ካብ ኣገልግሎት ውጻኢ",
    chooseTimeStep: "2. ግዜ ምረጹ",
    arrivalTimeSubtitle: "እትበጽሕሉ ግዜ ምረጹ",
    arriveNow: "ሕጂ ምብጻሕ",
    arriveNowDesc: "ብቀጥታ ቻርጅ ምግባር ጀምሩ",
    reserveForLater: "ንጸኒሑ ምሓዝ",
    reserveForLaterDesc: "ናይ ግዜ ዕረፍቲ ምረጹ",
    flexibleTime: "ተዓጻጻፊ ግዜ",
    flexibleTimeDesc: "ክትቀርቡ እንከለኹም ተራ ሓዙ",
    slotReservedNotice: "ዝተታሕዘ ቦታ ምስ በጻሕኩም ን15 ደቓይቕ ይጽበየኩም።",
    paymentMethodStep: "3. ናይ ክፍሊት መንገዲ",
    paymentMethodSubtitle: "ሕጂ ክፍሊት ኣየድልን። ቻርጅ ኣብ እትገብርሉ ግዜ ትኸፍሉ እዮም።",
    securePaymentsNotice: "ውሑስ ክፍሊት። ናይ ክፍሊት ሓበሬታኹም ውሑስ እዩ።",
    youAreInControl: "ምሉእ ቁጽጽር ኣብ ኢድኩም እዩ",
    inControlSubtitle: "ቅድሚ ምብጻሕኩም ነዚ ምሓዝ ኣብ ዝኾነ ሰዓት ክትቅይርዎ ወይ ክትስርዝዎ ትኽእሉ ኢኹም።",
    reservationSummary: "ናይ ቦታ ምሓዝ ሓፈሻዊ ጸብጻብ",
    whyChargeFlow: "ስለምንታይ ቻርጅፍሎው?",
    guaranteedBay: "ዝተረጋገጸ ቦታ",
    saveTime: "ግዜ ቆጥቡ",
    smartCoordination: "ዘመናዊ ምውህሃድ",
    seamlessExperience: "ቀሊልን ቅልጡፍን ኣጠቓቕማ",
    enterPinTitle: "ናይ 4-ዲጂት ድሕነት ፒን የእትዉ",
    confirmBayPinSubtitle: "ቦታ ንምዕጻው ፒን የእትዉ ን",

    // Queue View
    queueOverview: "ሓፈሻዊ ትርኢት ተራ",
    currentlyCharging: "ኣብ ምምላእ ዘሎ",
    yourVehicleBadge: "ናይ መኪናኹም",
    nextInQueue: "ቀጻሊ ኣብ ተራ",
    liveQueueDetails: "ቀጥታዊ ዝርዝራት ተራ",
    vehicleLabel: "ተሽከርካሪ",
    statusLabel: "ኩነታት",
    batteryLabel: "ባትሪ",
    powerLabel: "ሓይሊ",
    estTimeLabel: "ዝግመት ግዜ",
    estStartLabel: "ዝግመት መጀመሪ",
    yourReservation: "ናይ ቦታ ምሓዝኩም",
    resConfirmed: "ቦታ ምሓዝ፡ ተረጋገጸ",
    arrivalDeadlineLabel: "ናይ ምብጻሕ ናይ መወዳእታ ግዜ",
    startChargingNowBtn: "ሕጂ ቻርጅ ምግባር ጀምር",
    navigateStationBtn: "ናብ መደበር ምረሓኒ",
    youAreNext: "ተራኹም እዩ",

    // History View
    pastChargingSessions: "ዝሓለፉ ኩሎም ናይ ቻርጅ ታሪኽ",
    totalSessions: "ጠቕላላ ዙርያታት",
    totalTime: "ጠቕላላ ግዜ",
    avgCostPerKwh: "ማእከላይ ዋጋ / kWh",
    sessionHistoryTitle: "ታሪኽ ቻርጅ",
    searchSessionsPlaceholder: "ቻርጅታት ድለዩ...",
    filterBtn: "ኣጻሪ",
    exportBtn: "ኣውርድ",
    showingSessions: "ዝሓለፉ ናይ ቻርጅ ታሪኻት የርእይ ኣሎ",
    offPeakTip: "ምኽሪ፡ ብውሑድ ዋጋ ኣብ ዝኽፈለሉ ሰዓታት (ካብ ምሸት 4:00 - ንግሆ 12:00) ቻርጅ ብምግባር ወጻኢኹም ኣንእሱ።",
    energyInsightsTitle: "ናይ ሓይሊ ርድኢት",
    mostEnergy: "ዝለዓለ ሓይሊ",
    mostFrequent: "ተደጋጋሚ መደበር",
    energyOverTime: "ናይ ሓይሊ ምጥቃም ኣብ ግዜ (kWh)",
    costBreakdownTitle: "ምምቃል ወጻኢታት",
    co2SavedMessage: "ኣብዚ ወርሒ 18.7 ኪ.ግ ካርቦን (CO₂) ኣድሒንኩም",

    // Settings View
    profileTab: "መገለጺ",
    myVehicleTab: "መኪናይ",
    chargingPerfTab: "ናይ ቻርጅ ኣፈጻጽማ",
    notificationsTab: "መፍለጥታታት",
    paymentsTab: "ክፍሊታት",
    securityTab: "ድሕነትን ግላውነትን",
    manageAccountSubtitle: "ኣካውንትኩም፣ መኪናኹምን ምርጫታትኩምን ኣመሓድሩ",
    profileOverview: "ሓፈሻዊ ትርኢት መገለጺ",
    editProfileBtn: "መገለጺ ኣዐርይ",
    switchModelBtn: "ሞዴል ቀይር",
    activeVehicleSpecs: "ዝርዝራት ናይ ሕጂ መኪና",
    batteryCapacity: "ዓቕሚ ባትሪ",
    connectorProtocol: "ዓይነት መላገቢ",
    licensePlate: "ቁጽሪ ታርጋ",
    efficiencyLabel: "ብቕዓት",
    accountSecurityTitle: "ድሕነት ኣካውንትን ምረጋገጽን",
    changePasswordBtn: "መሕለፊ ቃል ቀይር",
    twoFactorAuth: "ክልተ-ደረጃ መረጋገጺ (2FA)",
    twoFactorDesc: "ኣብ ምእታው ብኤስኤምኤስ ኮድ ይጠይቕ",
    currentDevice: "እዚ መሳርሒ",
    quickActionsTitle: "ቅልጡፍ ስጉምትታት",
    accountStatusTitle: "ኩነታት ኣካውንት",
    emailVerified: "ኢመይል ተረጋገጸ",
    phoneVerified: "ስልኪ ተረጋገጸ",
    paymentAdded: "ክፍሊት ተተሓሒዙ",
    vehicleLinked: "መኪና ተተሓሒዛ",
    dangerZoneTitle: "ናይ ጥንቃቐ ዞባ",
    signOutBtn: "ውጻእ",
  },
};
