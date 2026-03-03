// Panchang calculation engine using astronomical algorithms

const TITHIS = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या',
];

const NAKSHATRAS = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा',
  'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा',
  'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती',
  'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा',
  'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद',
  'उत्तराभाद्रपद', 'रेवती',
];

const VARAS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const YOGAS = [
  'विष्कुम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन',
  'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल', 'गण्ड',
  'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र',
  'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव',
  'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म',
  'इन्द्र', 'वैधृति',
];

const KARANAS = [
  'बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि',
  'शकुनि', 'चतुष्पाद', 'नाग', 'किंस्तुघ्न',
];

function julianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const A = Math.floor((14 - m) / 12);
  const Y = y + 4800 - A;
  const M = m + 12 * A - 3;
  return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
}

function moonLongitude(date: Date): number {
  const jd = julianDay(date);
  const T = (jd - 2451545.0) / 36525;
  let L = 218.3164477 + 481267.88123421 * T;
  L = L % 360;
  if (L < 0) L += 360;
  return L;
}

function sunLongitude(date: Date): number {
  const jd = julianDay(date);
  const T = (jd - 2451545.0) / 36525;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mrad = (M * Math.PI) / 180;
  const C = 1.9146 * Math.sin(Mrad) + 0.0200 * Math.sin(2 * Mrad);
  let L = 280.46646 + 36000.76983 * T + C;
  L = L % 360;
  if (L < 0) L += 360;
  return L;
}

export function getTithi(date: Date): string {
  const moon = moonLongitude(date);
  const sun = sunLongitude(date);
  let diff = moon - sun;
  if (diff < 0) diff += 360;
  const tithiIndex = Math.floor(diff / 12) % 15;
  return TITHIS[tithiIndex];
}

export function getNakshatra(date: Date): string {
  const moon = moonLongitude(date);
  const nakshatraIndex = Math.floor((moon / 360) * 27) % 27;
  return NAKSHATRAS[nakshatraIndex];
}

export function getVara(date: Date): string {
  return VARAS[date.getDay()];
}

export function getYoga(date: Date): string {
  const moon = moonLongitude(date);
  const sun = sunLongitude(date);
  let combined = moon + sun;
  combined = combined % 360;
  const yogaIndex = Math.floor((combined / 360) * 27) % 27;
  return YOGAS[yogaIndex];
}

export function getKarana(date: Date): string {
  const moon = moonLongitude(date);
  const sun = sunLongitude(date);
  let diff = moon - sun;
  if (diff < 0) diff += 360;
  const karanaIndex = Math.floor(diff / 6) % 11;
  return KARANAS[karanaIndex];
}

export function getPaksha(date: Date): string {
  const moon = moonLongitude(date);
  const sun = sunLongitude(date);
  let diff = moon - sun;
  if (diff < 0) diff += 360;
  return diff < 180 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
}

export function getSunrise(date: Date): string {
  // Approximate sunrise for India (IST UTC+5:30)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const B = (360 / 365) * (dayOfYear - 81);
  const Brad = (B * Math.PI) / 180;
  const EoT = 9.87 * Math.sin(2 * Brad) - 7.53 * Math.cos(Brad) - 1.5 * Math.sin(Brad);
  const lat = 23.0; // Approximate India latitude
  const decl = 23.45 * Math.sin(Brad);
  const declRad = (decl * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(declRad));
  const sunriseHour = 12 - (hourAngle * 180) / (Math.PI * 15) - EoT / 60 + 5.5;
  const h = Math.floor(sunriseHour);
  const m = Math.floor((sunriseHour - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} IST`;
}

export function getSunset(date: Date): string {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const B = (360 / 365) * (dayOfYear - 81);
  const Brad = (B * Math.PI) / 180;
  const EoT = 9.87 * Math.sin(2 * Brad) - 7.53 * Math.cos(Brad) - 1.5 * Math.sin(Brad);
  const lat = 23.0;
  const decl = 23.45 * Math.sin(Brad);
  const declRad = (decl * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(declRad));
  const sunsetHour = 12 + (hourAngle * 180) / (Math.PI * 15) - EoT / 60 + 5.5;
  const h = Math.floor(sunsetHour);
  const m = Math.floor((sunsetHour - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} IST`;
}

export function getBrahmaMuhurat(date: Date): string {
  const sunrise = getSunrise(date);
  const [h, m] = sunrise.split(':').map(Number);
  const totalMin = h * 60 + m - 96;
  const bh = Math.floor(totalMin / 60);
  const bm = totalMin % 60;
  const eh = Math.floor((totalMin + 48) / 60);
  const em = (totalMin + 48) % 60;
  return `${bh.toString().padStart(2, '0')}:${bm.toString().padStart(2, '0')} - ${eh.toString().padStart(2, '0')}:${em.toString().padStart(2, '0')} IST`;
}

export function getAbhijitMuhurat(date: Date): string {
  const sunrise = getSunrise(date);
  const sunset = getSunset(date);
  const [sh, sm] = sunrise.split(':').map(Number);
  const [eh, em] = sunset.split(':').map(Number);
  const totalDayMin = (eh * 60 + em) - (sh * 60 + sm);
  const midMin = sh * 60 + sm + totalDayMin / 2;
  const startMin = midMin - 24;
  const endMin = midMin + 24;
  const formatTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = Math.floor(min % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };
  return `${formatTime(startMin)} - ${formatTime(endMin)} IST`;
}

export interface PanchangData {
  tithi: string;
  nakshatra: string;
  vara: string;
  yoga: string;
  karana: string;
  paksha: string;
  sunrise: string;
  sunset: string;
  brahmaMuhurat: string;
  abhijitMuhurat: string;
}

export function getPanchangData(date: Date): PanchangData {
  return {
    tithi: getTithi(date),
    nakshatra: getNakshatra(date),
    vara: getVara(date),
    yoga: getYoga(date),
    karana: getKarana(date),
    paksha: getPaksha(date),
    sunrise: getSunrise(date),
    sunset: getSunset(date),
    brahmaMuhurat: getBrahmaMuhurat(date),
    abhijitMuhurat: getAbhijitMuhurat(date),
  };
}

export function formatDateReadable(date: Date): string {
  return date.toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTimeIST(date: Date): string {
  return date.toLocaleTimeString('hi-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
}
