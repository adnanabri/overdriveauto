/* Overdriveauto shared settings, catalogue, icons and helpers.
   Loaded by the store (index.html) and the operations site (ops/). Edit parts and prices here. */
(function () {
'use strict';
/* ---------- Settings ---------- */
const WA_NUMBER = '17783250746'; // Orders, requests and seller sign-ups go to this WhatsApp number (international format, digits only).
const WA_DISPLAY = '+1 778 325 0746';
const TRADE_OFF = 0.10;

/* ---------- Reference data ---------- */
const LINES = { everyday:'Japanese & everyday', luxury:'Luxury & European', truck:'Truck & heavy', performance:'Performance' };
const CATS = { service:'Filters & service', brakes:'Brakes', suspension:'Suspension', engine:'Engine', electrical:'Ignition & electrical', cooling:'Cooling', lighting:'Lighting', drivetrain:'Clutch & drivetrain', turbo:'Turbo', body:'Body & accessories' };
const SRC = {
  dar:     { label:'In stock in Dar', eta:'Same day in Dar', delivery:'Same day in Dar, 1–3 days upcountry', pay:'In full, after we confirm', dep:1, returns:"Within 7 days if it doesn't fit", when:'Dar stock today', long:'On our shelf in Dar es Salaam, ready to go out today.' },
  partner: { label:'Kariakoo partner shop', eta:'1–2 days', delivery:'1–2 days', pay:'In full, after we confirm', dep:1, returns:"Within 7 days if it doesn't fit", when:'Kariakoo parts in 1–2 days', long:'From an established partner parts shop in Kariakoo. We check the fit and deliver it to you.' },
  japan:   { label:'From Japan', eta:'10–14 days', delivery:'10–14 days by air to Dar', pay:'50% deposit now, balance on arrival', dep:0.5, imported:true, returns:'Only if we sent the wrong part', when:'Japan parts in 10–14 days', long:'Ordered for you from suppliers in Japan, matched to your chassis number and shipped straight to Dar. The price includes freight, duty, VAT and clearing.' },
  canada:  { label:'From Canada', eta:'12–16 days', delivery:'12–16 days by air to Dar', pay:'50% deposit now, balance on arrival', dep:0.5, imported:true, returns:'Only if we sent the wrong part', when:'Canada parts in 12–16 days', long:'Bought for you from major parts suppliers in Canada and the US, checked in Canada, then flown to Dar. The price includes freight, duty, VAT and clearing.' },
  china:   { label:'From China', eta:'14–21 days', delivery:'14–21 days by air to Dar', pay:'In full, after we confirm stock', dep:1, imported:true, returns:'Only if we sent the wrong part', when:'China parts in 14–21 days', long:"Ordered for you from checked suppliers in China and shipped straight to Dar. We don't sell brake, steering or suspension parts from China. The price includes freight, duty, VAT and clearing." }
};
const ALL_SRC = Object.keys(SRC);
const DELIVERY = {
  pickup: { label:'Collect in Dar', note:"Chang'ombe pickup point, Mon–Sat", fee:0 },
  boda:   { label:'Delivery in Dar by boda', note:'Same day for Dar stock', fee:7000 },
  bus:    { label:'Upcountry by bus parcel', note:'Arusha, Mwanza, Dodoma, Mbeya and more', fee:15000 }
};
const PAY = {
  mobile: { label:'Mobile money', note:'M-Pesa, Airtel Money and others. We send a payment number after we confirm.' },
  bank:   { label:'Bank transfer', note:'We send bank details on WhatsApp.' },
  cash:   { label:'Cash on delivery', note:'Dar stock and partner parts only.' }
};

const VEHICLES = {
  'Toyota': [ {m:'Land Cruiser Prado',y:[2003,2024]}, {m:'Land Cruiser 70',y:[2000,2024]}, {m:'Hilux',y:[2005,2024]}, {m:'Noah',y:[2007,2022]}, {m:'IST',y:[2002,2016]}, {m:'Harrier',y:[2003,2022]}, {m:'RAV4',y:[2006,2024]} ],
  'Nissan': [ {m:'X-Trail',y:[2007,2022]}, {m:'Navara',y:[2008,2024]} ],
  'Subaru': [ {m:'Forester',y:[2008,2022]}, {m:'Impreza / WRX',y:[2008,2021]} ],
  'Mercedes-Benz': [ {m:'C-Class',y:[2008,2023]}, {m:'E-Class',y:[2010,2023]} ],
  'BMW': [ {m:'3 Series',y:[2012,2023]}, {m:'X5',y:[2007,2023]} ],
  'Land Rover': [ {m:'Range Rover Sport',y:[2006,2023]}, {m:'Discovery',y:[2010,2023]} ],
  'Lexus': [ {m:'RX',y:[2009,2023]} ],
  'Freightliner': [ {m:'Cascadia',y:[2008,2024],truck:true} ],
  'Scania': [ {m:'R-series',y:[2005,2020],truck:true} ],
  'Volvo Trucks': [ {m:'FH',y:[2008,2022],truck:true} ]
};

const F = (mk, md, a, b) => ({ mk, md, y:[a, b] });
const PRODUCTS = [
  { id:'p01', name:'Oil filter', line:'everyday', cat:'service', brand:'Toyota Genuine', cond:'New OEM', oem:['90915-YZZD4'], src:'dar', price:18000, fits:[F('Toyota','Hilux',2005,2024),F('Toyota','Land Cruiser Prado',2009,2024),F('Toyota','RAV4',2006,2018),F('Toyota','Harrier',2003,2013)] },
  { id:'p02', name:'Front brake pads, set of 4', line:'everyday', cat:'brakes', brand:'Toyota Genuine', cond:'New OEM', oem:['04465-60320'], src:'dar', price:165000, fits:[F('Toyota','Land Cruiser Prado',2010,2024)] },
  { id:'p03', name:'Iridium spark plugs, set of 4', line:'everyday', cat:'electrical', brand:'Denso', cond:'New', oem:['SK16R11','90919-01210'], src:'dar', price:96000, fits:[F('Toyota','IST',2002,2016),F('Toyota','Noah',2007,2022)] },
  { id:'p04', name:'Front shock absorbers, pair', line:'everyday', cat:'suspension', brand:'KYB Excel-G', cond:'New aftermarket', oem:['339264'], src:'partner', price:290000, fits:[F('Toyota','Noah',2007,2021)] },
  { id:'p05', name:'Radiator, automatic', line:'everyday', cat:'cooling', brand:'Koyorad', cond:'New aftermarket', oem:['PL011926','16400-0L380'], src:'dar', price:385000, fits:[F('Toyota','Hilux',2016,2024)] },
  { id:'p06', name:'Timing belt kit with water pump', line:'everyday', cat:'engine', brand:'Aisin', cond:'New OEM supplier', oem:['TKF-007'], src:'canada', price:610000, fits:[F('Subaru','Forester',2008,2012),F('Subaru','Impreza / WRX',2008,2014)] },
  { id:'p07', name:'Outer CV joint, front', line:'everyday', cat:'drivetrain', brand:'GKN', cond:'New aftermarket', oem:['304712'], src:'partner', price:115000, fits:[F('Nissan','X-Trail',2007,2013)] },
  { id:'p08', name:'Alternator, 12V', line:'everyday', cat:'electrical', brand:'Denso', cond:'Remanufactured', oem:['27060-17201'], src:'partner', price:540000, fits:[F('Toyota','Land Cruiser 70',2000,2024)] },
  { id:'p09', name:'Clutch kit, 3-piece', line:'everyday', cat:'drivetrain', brand:'Exedy', cond:'New OEM supplier', oem:['TYK2196'], src:'partner', price:470000, fits:[F('Toyota','Hilux',2005,2015)] },
  { id:'p10', name:'Front brake pads with wear sensor', line:'luxury', cat:'brakes', brand:'Mercedes-Benz Genuine', cond:'New OEM', oem:['A0004207800'], src:'canada', price:420000, fits:[F('Mercedes-Benz','C-Class',2015,2021),F('Mercedes-Benz','E-Class',2016,2023)] },
  { id:'p11', name:'Air suspension strut, front left', line:'luxury', cat:'suspension', brand:'Land Rover Genuine', cond:'Used OEM, tested', oem:['LR087081'], src:'canada', price:1850000, fits:[F('Land Rover','Range Rover Sport',2014,2022)] },
  { id:'p12', name:'Ignition coil', line:'luxury', cat:'electrical', brand:'Bosch', cond:'New OEM supplier', oem:['0221504470','12138657273'], src:'canada', price:165000, fits:[F('BMW','3 Series',2012,2019),F('BMW','X5',2010,2018)] },
  { id:'p13', name:'Electric water pump', line:'luxury', cat:'cooling', brand:'Pierburg', cond:'New OEM supplier', oem:['7.02851.20.0'], src:'canada', price:980000, fits:[F('BMW','X5',2010,2018),F('BMW','3 Series',2012,2019)] },
  { id:'p14', name:'Oil filter element', line:'luxury', cat:'service', brand:'MANN-FILTER', cond:'New OEM supplier', oem:['HU 7008 z','A2761800009'], src:'dar', price:48000, fits:[F('Mercedes-Benz','C-Class',2011,2023),F('Mercedes-Benz','E-Class',2011,2023)] },
  { id:'p15', name:'LED headlight, right', line:'luxury', cat:'lighting', brand:'Lexus Genuine', cond:'Used OEM, tested', oem:['81145-0E220'], src:'canada', price:2350000, fits:[F('Lexus','RX',2016,2022)] },
  { id:'p16', name:'Front lower control arm', line:'luxury', cat:'suspension', brand:'Lemförder', cond:'New OEM supplier', oem:['LR073353'], src:'canada', price:760000, fits:[F('Land Rover','Range Rover Sport',2014,2022),F('Land Rover','Discovery',2017,2023)] },
  { id:'p17', name:'Lube oil filter', line:'truck', cat:'service', brand:'Fleetguard', cond:'New', oem:['LF9009'], src:'dar', price:95000, fits:[F('Freightliner','Cascadia',2008,2017)], engine:'Cummins ISX15 engine' },
  { id:'p18', name:'Fuel filter kit', line:'truck', cat:'service', brand:'Detroit Genuine', cond:'New OEM', oem:['A4720920705'], src:'canada', price:230000, fits:[F('Freightliner','Cascadia',2011,2024)], engine:'Detroit DD15 engine' },
  { id:'p19', name:'Air dryer cartridge', line:'truck', cat:'brakes', brand:'Bendix', cond:'New', oem:['5008414'], src:'canada', price:260000, fits:[F('Freightliner','Cascadia',2008,2024)], engine:'Bendix AD-IS air dryer' },
  { id:'p20', name:'Turbocharger, remanufactured', line:'truck', cat:'turbo', brand:'Holset', cond:'Remanufactured', oem:['HE451VE'], src:'canada', price:6900000, fits:[F('Freightliner','Cascadia',2010,2017)], engine:'Cummins ISX15 engine' },
  { id:'p21', name:'Transmission filter kit', line:'truck', cat:'drivetrain', brand:'Allison Genuine', cond:'New OEM', oem:['29558329'], src:'canada', price:210000, fits:[F('Freightliner','Cascadia',2008,2024)], engine:'Allison 3000 or 4000 series' },
  { id:'p22', name:'Spring brake chamber 30/30', line:'truck', cat:'brakes', brand:'Haldex', cond:'New', oem:['GC3030LS'], src:'partner', price:150000, universal:'truck', fitNote:'Most air-brake trucks and trailers' },
  { id:'p23', name:'Service filter pack: oil, fuel, air', line:'truck', cat:'service', brand:'Scania Genuine', cond:'New OEM', oem:['2002705','1873018','1869992'], src:'partner', price:680000, fits:[F('Scania','R-series',2005,2016)] },
  { id:'p24', name:'Air filter element', line:'truck', cat:'service', brand:'Donaldson', cond:'New', oem:['P785542'], src:'dar', price:185000, fits:[F('Volvo Trucks','FH',2008,2022)] },
  { id:'p25', name:'Turbo upgrade, bolt-on', line:'performance', cat:'turbo', brand:'Garrett', cond:'New', oem:['G25-550'], src:'canada', price:4950000, fits:[F('Subaru','Impreza / WRX',2008,2014),F('Subaru','Forester',2009,2013)] },
  { id:'p26', name:'Shock absorbers, set of 4', line:'performance', cat:'suspension', brand:'Bilstein B6 4600', cond:'New', oem:['24-186001','24-186018'], src:'canada', price:2100000, fits:[F('Toyota','Land Cruiser Prado',2010,2024),F('Toyota','Hilux',2016,2024)] },
  { id:'p27', name:'High-flow air filter', line:'performance', cat:'service', brand:'K&N', cond:'New', oem:['33-3017'], src:'dar', price:210000, fits:[F('Toyota','Hilux',2016,2024),F('Toyota','Land Cruiser Prado',2016,2024)] },
  { id:'p28', name:'Front brake pads and slotted discs', line:'performance', cat:'brakes', brand:'EBC', cond:'New', oem:['PD13KF'], src:'canada', price:1450000, fits:[F('Subaru','Impreza / WRX',2008,2021)] },
  { id:'j01', name:'Front lower control arm, right', line:'everyday', cat:'suspension', brand:'Toyota Genuine', cond:'New OEM', oem:['48068-60030'], src:'japan', price:410000, fits:[F('Toyota','Land Cruiser Prado',2009,2024)] },
  { id:'j02', name:'Fuel injector', line:'everyday', cat:'engine', brand:'Denso', cond:'New OEM supplier', oem:['23670-30400'], src:'japan', price:690000, fits:[F('Toyota','Hilux',2005,2015)], engine:'1KD-FTV or 2KD-FTV engine' },
  { id:'j03', name:'Engine mount, front', line:'everyday', cat:'engine', brand:'Toyota Genuine', cond:'New OEM', oem:['12361-21050'], src:'japan', price:145000, fits:[F('Toyota','IST',2002,2016)] },
  { id:'j04', name:'Sliding door roller, lower right', line:'everyday', cat:'body', brand:'Toyota Genuine', cond:'New OEM', oem:['68304-28040'], src:'japan', price:120000, fits:[F('Toyota','Noah',2007,2021)] },
  { id:'j05', name:'Turbocharger', line:'everyday', cat:'turbo', brand:'Toyota Genuine', cond:'New OEM', oem:['17201-51020'], src:'japan', price:4800000, fits:[F('Toyota','Land Cruiser 70',2007,2024)], engine:'1VD-FTV V8 diesel' },
  { id:'j06', name:'CVT oil filter', line:'everyday', cat:'service', brand:'Nissan Genuine', cond:'New OEM', oem:['31726-3JX0A'], src:'japan', price:55000, fits:[F('Nissan','X-Trail',2014,2022)] },
  { id:'j07', name:'Rear brake pads', line:'everyday', cat:'brakes', brand:'Subaru Genuine', cond:'New OEM', oem:['26696SG000'], src:'japan', price:135000, fits:[F('Subaru','Forester',2013,2018)] },
  { id:'j08', name:'Door mirror, right', line:'everyday', cat:'body', brand:'Toyota Genuine', cond:'Used OEM, tested', oem:['87910-48270'], src:'japan', price:520000, fits:[F('Toyota','Harrier',2014,2020)] },
  { id:'c01', name:'LED headlight bulbs H4, pair', line:'everyday', cat:'lighting', brand:'Generic', cond:'New aftermarket', oem:['H4 / 9003'], src:'china', price:85000, universal:'all', fitNote:'Most cars and pickups that use H4 bulbs' },
  { id:'c02', name:'Tail light, right', line:'everyday', cat:'lighting', brand:'Aftermarket', cond:'New aftermarket', oem:['81550-0K290'], src:'china', price:260000, fits:[F('Toyota','Hilux',2016,2020)] },
  { id:'c03', name:'Front grille', line:'everyday', cat:'body', brand:'Aftermarket', cond:'New aftermarket', oem:['53101-60B10'], src:'china', price:340000, fits:[F('Toyota','Land Cruiser Prado',2018,2023)] },
  { id:'c04', name:'Reversing camera with 4.3-inch screen', line:'everyday', cat:'body', brand:'Generic', cond:'New', oem:['RC-430'], src:'china', price:180000, universal:'all', fitNote:'Most cars, pickups and vans' },
  { id:'c05', name:'Fog light kit with switch', line:'everyday', cat:'lighting', brand:'Aftermarket', cond:'New aftermarket', oem:['FL-HLX-16'], src:'china', price:230000, fits:[F('Toyota','Hilux',2016,2024)] },
  { id:'c06', name:'All-weather floor mats, set of 4', line:'everyday', cat:'body', brand:'Aftermarket', cond:'New', oem:['FM-PRD-150'], src:'china', price:150000, fits:[F('Toyota','Land Cruiser Prado',2010,2024)] }
];
const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

/* ---------- Icons ---------- */
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONS = {
  service: svg('<rect x="6.5" y="6" width="11" height="14" rx="2"/><path d="M6.5 10h11M6.5 16h11M10 6V3.5h4V6"/>'),
  brakes: svg('<circle cx="11" cy="13" r="7.5"/><circle cx="11" cy="13" r="2.2"/><path d="M14.5 4.2l3.6 1.6a2 2 0 0 1 1.2 1.8v4.6"/>'),
  suspension: svg('<path d="M6 3.5h12M6 20.5h12M8 6.5l8 1.8-8 1.8 8 1.8-8 1.8 8 1.8-8 1.8"/>'),
  engine: svg('<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M5.6 18.4l1.9-1.9M16.5 7.5l1.9-1.9"/>'),
  electrical: svg('<path d="M13.5 2.5L5.5 13.5h5.5l-1 8 8-11h-5.5z"/>'),
  cooling: svg('<rect x="3.5" y="6" width="17" height="12" rx="1.5"/><path d="M7.5 6v12M11.5 6v12M15.5 6v12"/>'),
  lighting: svg('<path d="M11 6.5C6.8 6.5 4 9 4 12s2.8 5.5 7 5.5h1.5v-11z"/><path d="M16 8.5l4.5-1M16 12h4.5M16 15.5l4.5 1"/>'),
  drivetrain: svg('<circle cx="7" cy="12" r="3.5"/><circle cx="17" cy="12" r="3.5"/><path d="M10.5 12h3M7 8.5V6M17 8.5V6M7 15.5V18M17 15.5V18"/>'),
  turbo: svg('<circle cx="10.5" cy="13.5" r="7"/><path d="M10.5 13.5a2.6 2.6 0 1 1 2.6-2.6"/><path d="M15.5 8.5V4.5h5v5"/>'),
  body: svg('<path d="M5 20.5V9l5-5.5h9v17z"/><path d="M5 11h14M15 14.5h2"/>')
};
const I = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  car: svg('<path d="M4 15.5V12l2-4.5h12l2 4.5v3.5z"/><circle cx="7.5" cy="16" r="1.6"/><circle cx="16.5" cy="16" r="1.6"/><path d="M4 12h16"/>'),
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chat: svg('<path d="M4.5 19.5l1.2-3.6A7.5 7.5 0 1 1 8.4 18.6z"/>'),
  copy: svg('<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>')
};

/* ---------- Helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const fmt = n => 'TZS ' + Math.round(n).toLocaleString('en-US');
const digits = s => (s || '').replace(/\D/g, '');

window.ODA_BASE = { WA_NUMBER, WA_DISPLAY, TRADE_OFF, LINES, CATS, SRC, ALL_SRC, DELIVERY, PAY, VEHICLES, PRODUCTS, byId, svg, ICONS, I, esc, fmt, digits };
})();
