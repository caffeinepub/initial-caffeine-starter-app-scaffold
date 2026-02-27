/**
 * Panchang Engine - Complete client-side astronomical calculations
 * Using Jean Meeus algorithms for Hindu calendar computations
 */

const IST_OFFSET = 5.5; // UTC+5:30
const LAT = 23.0; // Central India latitude
const LON = 80.0; // Central India longitude

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function toJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400;

  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5;
}

function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRad(M);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  const sunLon = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const apparent = sunLon - 0.00569 - 0.00478 * Math.sin(toRad(omega));
  return normalizeAngle(apparent);
}

function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L1 = normalizeAngle(
    218.3164477 +
      481267.88123421 * T -
      0.0015786 * T * T +
      T * T * T / 538841 -
      T * T * T * T / 65194000
  );
  const D = normalizeAngle(
    297.8501921 +
      445267.1114034 * T -
      0.0018819 * T * T +
      T * T * T / 545868 -
      T * T * T * T / 113065000
  );
  const M = normalizeAngle(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000);
  const M1 = normalizeAngle(
    134.9633964 +
      477198.8675055 * T +
      0.0087414 * T * T +
      T * T * T / 69699 -
      T * T * T * T / 14712000
  );
  const F = normalizeAngle(
    93.272095 +
      483202.0175233 * T -
      0.0036539 * T * T -
      T * T * T / 3526000 +
      T * T * T * T / 863310000
  );

  const Drad = toRad(D);
  const Mrad = toRad(M);
  const M1rad = toRad(M1);
  const Frad = toRad(F);

  let sumL = 0;
  sumL += 6288774 * Math.sin(M1rad);
  sumL += 1274027 * Math.sin(2 * Drad - M1rad);
  sumL += 658314 * Math.sin(2 * Drad);
  sumL += 213618 * Math.sin(2 * M1rad);
  sumL -= 185116 * Math.sin(Mrad);
  sumL -= 114332 * Math.sin(2 * Frad);
  sumL += 58793 * Math.sin(2 * Drad - 2 * M1rad);
  sumL += 57066 * Math.sin(2 * Drad - Mrad - M1rad);
  sumL += 53322 * Math.sin(2 * Drad + M1rad);
  sumL += 45758 * Math.sin(2 * Drad - Mrad);
  sumL -= 40923 * Math.sin(Mrad - M1rad);
  sumL -= 34720 * Math.sin(Drad);
  sumL -= 30383 * Math.sin(Mrad + M1rad);
  sumL += 15327 * Math.sin(2 * Drad - 2 * Frad);
  sumL -= 12528 * Math.sin(M1rad + 2 * Frad);
  sumL += 10980 * Math.sin(M1rad - 2 * Frad);
  sumL += 10675 * Math.sin(4 * Drad - M1rad);
  sumL += 10034 * Math.sin(3 * M1rad);
  sumL += 8548 * Math.sin(4 * Drad - 2 * M1rad);
  sumL -= 7888 * Math.sin(2 * Drad + Mrad - M1rad);
  sumL -= 6766 * Math.sin(2 * Drad + Mrad);
  sumL -= 5163 * Math.sin(Drad - M1rad);
  sumL += 4987 * Math.sin(Drad + Mrad);
  sumL += 4036 * Math.sin(2 * Drad - Mrad + M1rad);
  sumL += 3994 * Math.sin(2 * Drad + 2 * M1rad);
  sumL += 3861 * Math.sin(4 * Drad);
  sumL += 3665 * Math.sin(2 * Drad - 3 * M1rad);
  sumL -= 2689 * Math.sin(Mrad - 2 * M1rad);
  sumL -= 2602 * Math.sin(2 * Drad - M1rad + 2 * Frad);
  sumL += 2390 * Math.sin(2 * Drad - Mrad - 2 * M1rad);
  sumL -= 2348 * Math.sin(Drad + M1rad);
  sumL += 2236 * Math.sin(2 * Drad - 2 * Mrad);
  sumL -= 2120 * Math.sin(Mrad + 2 * M1rad);
  sumL -= 2069 * Math.sin(2 * Mrad);
  sumL += 2048 * Math.sin(2 * Drad - 2 * Mrad - M1rad);
  sumL -= 1773 * Math.sin(2 * Drad + M1rad - 2 * Frad);
  sumL -= 1595 * Math.sin(2 * Drad + 2 * Frad);
  sumL += 1215 * Math.sin(4 * Drad - Mrad - M1rad);
  sumL -= 1110 * Math.sin(2 * M1rad + 2 * Frad);
  sumL -= 892 * Math.sin(3 * Drad - M1rad);
  sumL -= 810 * Math.sin(2 * Drad + Mrad + M1rad);
  sumL += 759 * Math.sin(4 * Drad - Mrad - 2 * M1rad);
  sumL -= 713 * Math.sin(2 * Mrad - M1rad);
  sumL -= 700 * Math.sin(2 * Drad + 2 * Mrad - M1rad);
  sumL += 691 * Math.sin(2 * Drad + Mrad - 2 * M1rad);
  sumL += 596 * Math.sin(2 * Drad - Mrad - 2 * Frad);
  sumL += 549 * Math.sin(4 * Drad + M1rad);
  sumL += 537 * Math.sin(4 * M1rad);
  sumL += 520 * Math.sin(4 * Drad - Mrad);
  sumL -= 487 * Math.sin(Drad - 2 * M1rad);
  sumL -= 399 * Math.sin(2 * Drad + Mrad - 2 * Frad);
  sumL -= 381 * Math.sin(2 * M1rad - 2 * Frad);
  sumL += 351 * Math.sin(Drad + Mrad + M1rad);
  sumL -= 340 * Math.sin(3 * Drad - 2 * M1rad);
  sumL += 330 * Math.sin(4 * Drad - 3 * M1rad);
  sumL += 327 * Math.sin(2 * Drad - Mrad + 2 * M1rad);
  sumL -= 323 * Math.sin(2 * Mrad + M1rad);
  sumL += 299 * Math.sin(Drad + Mrad - M1rad);
  sumL += 294 * Math.sin(2 * Drad + 3 * M1rad);

  const moonLon = L1 + sumL / 1000000;
  return normalizeAngle(moonLon);
}

// ─── Sunrise / Sunset ─────────────────────────────────────────────────────────

function computeSunriseSunset(date: Date): { sunrise: Date; sunset: Date } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jdNoon = toJulianDay(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)));
  const T = (jdNoon - 2451545.0) / 36525;

  const L0 = normalizeAngle(280.46646 + 36000.76983 * T);
  const M = normalizeAngle(357.52911 + 35999.05029 * T);
  const Mrad = toRad(M);
  const C =
    (1.914602 - 0.004817 * T) * Math.sin(Mrad) +
    0.019993 * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  const sunLon = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const apparent = sunLon - 0.00569 - 0.00478 * Math.sin(toRad(omega));

  const eps0 = 23.439291111 - 0.013004167 * T;
  const eps = eps0 + 0.00256 * Math.cos(toRad(omega));

  const sunDec = toDeg(Math.asin(Math.sin(toRad(eps)) * Math.sin(toRad(apparent))));

  const h0 = -0.8333;
  const latRad = toRad(LAT);
  const decRad = toRad(sunDec);
  const cosH =
    (Math.sin(toRad(h0)) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad));
  const cosHClamped = Math.max(-1, Math.min(1, cosH));
  const H = toDeg(Math.acos(cosHClamped));

  const B = toRad((360 / 365) * (jdNoon - 2451545 + 10));
  const eqTime =
    -7.655 * Math.sin(B) +
    9.873 * Math.sin(2 * B + 3.588) +
    0.439 * Math.sin(4 * B + 0.072);

  const solarNoonUT = 12 - LON / 15 - eqTime / 60;
  const sunriseUT = solarNoonUT - H / 15;
  const sunsetUT = solarNoonUT + H / 15;

  const sunriseIST = sunriseUT + IST_OFFSET;
  const sunsetIST = sunsetUT + IST_OFFSET;

  function hoursToDate(hours: number, baseDate: Date): Date {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), h, m, s);
  }

  return {
    sunrise: hoursToDate(sunriseIST, date),
    sunset: hoursToDate(sunsetIST, date),
  };
}

// ─── Tithi ────────────────────────────────────────────────────────────────────

export const TITHI_NAMES: string[] = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या',
];

export const TITHI_NAMES_EN: string[] = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

export const NAKSHATRA_NAMES: string[] = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा',
  'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा',
  'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती',
  'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा',
  'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वा भाद्रपद',
  'उत्तरा भाद्रपद', 'रेवती',
];

export const NAKSHATRA_NAMES_EN: string[] = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purvashadha',
  'Uttarashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];

export const YOGA_NAMES: string[] = [
  'विष्कम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन',
  'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल', 'गण्ड',
  'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र',
  'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव',
  'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म',
  'इन्द्र', 'वैधृति',
];

export const YOGA_NAMES_EN: string[] = [
  'Vishkambha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti',
];

export const KARANA_NAMES: string[] = [
  'बव', 'बालव', 'कौलव', 'तैतिल', 'गर',
  'वणिज', 'विष्टि', 'शकुनि', 'चतुष्पाद', 'नाग', 'किंस्तुघ्न',
];

export const KARANA_NAMES_EN: string[] = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara',
  'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kinstughna',
];

export const VARA_NAMES: string[] = [
  'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार',
];

export const VARA_NAMES_EN: string[] = [
  'Ravivara (Sunday)', 'Somavara (Monday)', 'Mangalavara (Tuesday)',
  'Budhavara (Wednesday)', 'Guruvara (Thursday)', 'Shukravara (Friday)', 'Shanivara (Saturday)',
];

// ─── Core calculation functions ───────────────────────────────────────────────

function getTithiData(date: Date): { number: number; name: string; nameEn: string; paksha: string } {
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET * 3600 * 1000);
  const jd = toJulianDay(utcNoon);

  const sunLon = getSunLongitude(jd);
  const moonLon = getMoonLongitude(jd);
  const diff = normalizeAngle(moonLon - sunLon);

  const tithiIndex = Math.floor(diff / 12);
  const tithiNumber = tithiIndex + 1;
  const paksha = tithiIndex < 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';

  return {
    number: tithiNumber,
    name: TITHI_NAMES[tithiIndex],
    nameEn: TITHI_NAMES_EN[tithiIndex],
    paksha,
  };
}

function getNakshatraData(date: Date): { number: number; name: string; nameEn: string } {
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET * 3600 * 1000);
  const jd = toJulianDay(utcNoon);
  const moonLon = getMoonLongitude(jd);
  const nakshatraIndex = Math.floor(moonLon / (360 / 27));
  return {
    number: nakshatraIndex + 1,
    name: NAKSHATRA_NAMES[nakshatraIndex],
    nameEn: NAKSHATRA_NAMES_EN[nakshatraIndex],
  };
}

function getYogaData(date: Date): { number: number; name: string; nameEn: string } {
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET * 3600 * 1000);
  const jd = toJulianDay(utcNoon);
  const sunLon = getSunLongitude(jd);
  const moonLon = getMoonLongitude(jd);
  const sum = normalizeAngle(sunLon + moonLon);
  const yogaIndex = Math.floor(sum / (360 / 27));
  return {
    number: yogaIndex + 1,
    name: YOGA_NAMES[yogaIndex],
    nameEn: YOGA_NAMES_EN[yogaIndex],
  };
}

function getKaranaData(date: Date): { name: string; nameEn: string } {
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET * 3600 * 1000);
  const jd = toJulianDay(utcNoon);
  const sunLon = getSunLongitude(jd);
  const moonLon = getMoonLongitude(jd);
  const diff = normalizeAngle(moonLon - sunLon);
  const karanaIndex = Math.floor(diff / 6);

  let name: string;
  let nameEn: string;
  if (karanaIndex === 0) {
    name = KARANA_NAMES[10];
    nameEn = KARANA_NAMES_EN[10];
  } else if (karanaIndex >= 57) {
    const fixedIdx = karanaIndex - 57 + 7;
    name = KARANA_NAMES[Math.min(fixedIdx, 9)];
    nameEn = KARANA_NAMES_EN[Math.min(fixedIdx, 9)];
  } else {
    const movableIdx = (karanaIndex - 1) % 7;
    name = KARANA_NAMES[movableIdx];
    nameEn = KARANA_NAMES_EN[movableIdx];
  }
  return { name, nameEn };
}

function getVaraData(date: Date): { name: string; nameEn: string } {
  const day = date.getDay();
  return { name: VARA_NAMES[day], nameEn: VARA_NAMES_EN[day] };
}

function getKaalPeriod(
  date: Date,
  segmentMap: Record<number, number>
): { start: Date; end: Date } {
  const { sunrise, sunset } = computeSunriseSunset(date);
  const dayDurationMs = sunset.getTime() - sunrise.getTime();
  const segmentMs = dayDurationMs / 8;
  const dayOfWeek = date.getDay();
  const segment = segmentMap[dayOfWeek];
  const start = new Date(sunrise.getTime() + (segment - 1) * segmentMs);
  const end = new Date(sunrise.getTime() + segment * segmentMs);
  return { start, end };
}

const RAHU_KAAL_SEGMENT: Record<number, number> = {
  0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3,
};
const GULIKA_KAAL_SEGMENT: Record<number, number> = {
  0: 6, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 7,
};
const YAMAGANDA_SEGMENT: Record<number, number> = {
  0: 4, 1: 3, 2: 2, 3: 1, 4: 8, 5: 7, 6: 6,
};

// ─── Public exports (simple string versions) ─────────────────────────────────

/** Returns Tithi name string for Home page */
export function getTithi(date: Date): string {
  return getTithiData(date).name;
}

/** Returns Nakshatra name string for Home page */
export function getNakshatra(date: Date): string {
  return getNakshatraData(date).name;
}

/** Returns Vara (weekday) name string for Home page */
export function getVara(date: Date): string {
  return getVaraData(date).name;
}

/** Returns Yoga name string */
export function getYoga(date: Date): string {
  return getYogaData(date).name;
}

/** Returns Karana name string */
export function getKarana(date: Date): string {
  return getKaranaData(date).name;
}

/** Returns Paksha string */
export function getPaksha(date: Date): string {
  return getTithiData(date).paksha;
}

/** Returns Vikram Samvat year */
export function getVikramSamvat(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 4 ? year + 57 : year + 56;
}

/** Returns Hindu month name */
export function getHinduMonth(date: Date): string {
  const hinduMonths = [
    'माघ', 'फाल्गुन', 'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़',
    'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष',
  ];
  return hinduMonths[date.getMonth()];
}

/** Returns Ayana name */
export function getAyana(date: Date): string {
  const month = date.getMonth() + 1;
  return month >= 1 && month <= 6 ? 'उत्तरायण' : 'दक्षिणायन';
}

// ─── Brahma Muhurat (string version for VratModeDashboard) ───────────────────

export function getBrahmaMuhurat(date: Date): { start: string; end: string } {
  const { sunrise } = computeSunriseSunset(date);
  const sunriseMs = sunrise.getTime();
  // Brahma Muhurat: 1.5 hours before sunrise, lasting 48 minutes
  const endMs = sunriseMs - 24 * 60 * 1000; // 24 min before sunrise
  const startMs = endMs - 48 * 60 * 1000;   // 48 min duration

  const fmt = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h < 12 ? 'AM' : 'PM';
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return {
    start: fmt(new Date(startMs)),
    end: fmt(new Date(endMs)),
  };
}

// ─── Tithi number (for Ekadashi calculation) ─────────────────────────────────

export function getTithiNumber(date: Date): number {
  return getTithiData(date).number;
}

// ─── Ekadashi & Shivratri ─────────────────────────────────────────────────────

/**
 * Compute the next Ekadashi date from today.
 * Ekadashi is the 11th tithi of each paksha (fortnight), occurring twice per lunar month.
 */
export function getNextEkadashi(fromDate: Date = new Date()): { date: Date; daysRemaining: number } {
  for (let i = 0; i <= 20; i++) {
    const checkDate = new Date(fromDate);
    checkDate.setDate(checkDate.getDate() + i);
    checkDate.setHours(6, 0, 0, 0);

    const tithiNum = getTithiNumber(checkDate);
    // Ekadashi is tithi 11 (Shukla) or tithi 26 (Krishna = 11th of dark fortnight)
    if (tithiNum === 11 || tithiNum === 26) {
      return { date: checkDate, daysRemaining: i };
    }
  }

  const fallback = new Date(fromDate);
  fallback.setDate(fallback.getDate() + 15);
  return { date: fallback, daysRemaining: 15 };
}

/**
 * Compute the next Mahashivratri date.
 * Mahashivratri falls on the 14th night of Krishna Paksha of Phalguna (Feb/Mar).
 */
export function getNextShivratri(fromDate: Date = new Date()): { date: Date; daysRemaining: number } {
  for (let i = 0; i <= 400; i++) {
    const checkDate = new Date(fromDate);
    checkDate.setDate(checkDate.getDate() + i);
    checkDate.setHours(6, 0, 0, 0);

    const tithiNum = getTithiNumber(checkDate);
    const month = checkDate.getMonth() + 1;
    // Chaturdashi of Krishna Paksha = tithi 29 (14th of dark fortnight)
    // Phalguna = Feb/Mar (month 2 or 3)
    if (tithiNum === 29 && (month === 2 || month === 3)) {
      return { date: checkDate, daysRemaining: i };
    }
  }

  const fallback = new Date(fromDate.getFullYear() + 1, 1, 18);
  const diff = Math.round((fallback.getTime() - fromDate.getTime()) / 86400000);
  return { date: fallback, daysRemaining: diff };
}

// ─── getPanchangData (used by Panchang.tsx) ───────────────────────────────────

export interface PanchangData {
  tithi: { number: number; name: string; nameEn: string; paksha: string };
  nakshatra: { number: number; name: string; nameEn: string };
  yoga: { number: number; name: string; nameEn: string };
  karana: { name: string; nameEn: string };
  vara: { name: string; nameEn: string };
  sunrise: Date;
  sunset: Date;
  brahmaMuhurat: { start: Date; end: Date };
  abhijitMuhurat: { start: Date; end: Date };
  rahuKaal: { start: Date; end: Date };
  gulikaKaal: { start: Date; end: Date };
  yamagandaKaal: { start: Date; end: Date };
  vikramSamvat: number;
  hinduMonth: { name: string; nameEn: string };
  ayana: { name: string; nameEn: string };
}

export function getPanchangData(date: Date): PanchangData {
  const { sunrise, sunset } = computeSunriseSunset(date);

  // Brahma Muhurat: ~96 min before sunrise, 48 min duration
  const brahmaMuhuratEnd = new Date(sunrise.getTime() - 24 * 60 * 1000);
  const brahmaMuhuratStart = new Date(brahmaMuhuratEnd.getTime() - 48 * 60 * 1000);

  // Abhijit Muhurat: middle of the day
  const dayMs = sunset.getTime() - sunrise.getTime();
  const abhijitStart = new Date(sunrise.getTime() + dayMs * 0.458);
  const abhijitEnd = new Date(sunrise.getTime() + dayMs * 0.542);

  const rahuKaal = getKaalPeriod(date, RAHU_KAAL_SEGMENT);
  const gulikaKaal = getKaalPeriod(date, GULIKA_KAAL_SEGMENT);
  const yamagandaKaal = getKaalPeriod(date, YAMAGANDA_SEGMENT);

  const hinduMonths = [
    { name: 'माघ', nameEn: 'Magha' },
    { name: 'फाल्गुन', nameEn: 'Phalguna' },
    { name: 'चैत्र', nameEn: 'Chaitra' },
    { name: 'वैशाख', nameEn: 'Vaishakha' },
    { name: 'ज्येष्ठ', nameEn: 'Jyeshtha' },
    { name: 'आषाढ़', nameEn: 'Ashadha' },
    { name: 'श्रावण', nameEn: 'Shravana' },
    { name: 'भाद्रपद', nameEn: 'Bhadrapada' },
    { name: 'आश्विन', nameEn: 'Ashwin' },
    { name: 'कार्तिक', nameEn: 'Kartik' },
    { name: 'मार्गशीर्ष', nameEn: 'Margashirsha' },
    { name: 'पौष', nameEn: 'Pausha' },
  ];

  const month = date.getMonth();
  const year = date.getFullYear();
  const vikramSamvat = (month + 1) >= 4 ? year + 57 : year + 56;

  const ayanaMonth = month + 1;
  const ayana =
    ayanaMonth >= 1 && ayanaMonth <= 6
      ? { name: 'उत्तरायण', nameEn: 'Uttarayana' }
      : { name: 'दक्षिणायन', nameEn: 'Dakshinayana' };

  return {
    tithi: getTithiData(date),
    nakshatra: getNakshatraData(date),
    yoga: getYogaData(date),
    karana: getKaranaData(date),
    vara: getVaraData(date),
    sunrise,
    sunset,
    brahmaMuhurat: { start: brahmaMuhuratStart, end: brahmaMuhuratEnd },
    abhijitMuhurat: { start: abhijitStart, end: abhijitEnd },
    rahuKaal,
    gulikaKaal,
    yamagandaKaal,
    vikramSamvat,
    hinduMonth: hinduMonths[month],
    ayana,
  };
}

// ─── Formatting helpers (used by Panchang.tsx) ────────────────────────────────

/** Format a Date object to IST time string like "6:30 AM" */
export function formatTimeIST(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h < 12 ? 'AM' : 'PM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/** Format a Date to a readable string like "Monday, 27 February 2026" */
export function formatDateReadable(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
