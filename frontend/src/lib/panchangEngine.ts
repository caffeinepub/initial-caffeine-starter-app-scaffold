/**
 * Panchang Engine - Accurate Hindu Calendar Calculations
 * Based on Jean Meeus "Astronomical Algorithms" (2nd Edition)
 * All calculations use IST (UTC+5:30) and fixed location: 23.0°N, 80.0°E (Central India)
 */

const IST_OFFSET_HOURS = 5.5; // UTC+5:30
const LAT = 23.0; // Central India latitude
const LON = 80.0; // Central India longitude

// ─── Helper Math ─────────────────────────────────────────────────────────────

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Convert a JS Date to Julian Day Number */
function dateToJD(date: Date): number {
  // Work in UTC
  const Y = date.getUTCFullYear();
  const M = date.getUTCMonth() + 1;
  const D =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400;

  let y = Y;
  let m = M;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + D + B - 1524.5;
}

/** Julian centuries since J2000.0 */
function jdToT(jd: number): number {
  return (jd - 2451545.0) / 36525;
}

// ─── Sun Position ─────────────────────────────────────────────────────────────

/** Returns Sun's apparent ecliptic longitude in degrees (Meeus Ch.25) */
function getSunLongitude(jd: number): number {
  const T = jdToT(jd);
  // Geometric mean longitude of the Sun
  const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  // Mean anomaly of the Sun
  const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRad(M);
  // Equation of center
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  // Sun's true longitude
  const sunLon = L0 + C;
  // Apparent longitude (nutation correction)
  const omega = 125.04 - 1934.136 * T;
  const apparent = sunLon - 0.00569 - 0.00478 * Math.sin(toRad(omega));
  return normalizeAngle(apparent);
}

// ─── Moon Position ────────────────────────────────────────────────────────────

/** Returns Moon's ecliptic longitude in degrees (Meeus Ch.47, simplified) */
function getMoonLongitude(jd: number): number {
  const T = jdToT(jd);
  // Moon's mean longitude
  const L1 = normalizeAngle(
    218.3164477 +
      481267.88123421 * T -
      0.0015786 * T * T +
      T * T * T / 538841 -
      T * T * T * T / 65194000
  );
  // Moon's mean elongation
  const D = normalizeAngle(
    297.8501921 +
      445267.1114034 * T -
      0.0018819 * T * T +
      T * T * T / 545868 -
      T * T * T * T / 113065000
  );
  // Sun's mean anomaly
  const M = normalizeAngle(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000);
  // Moon's mean anomaly
  const M1 = normalizeAngle(
    134.9633964 +
      477198.8675055 * T +
      0.0087414 * T * T +
      T * T * T / 69699 -
      T * T * T * T / 14712000
  );
  // Moon's argument of latitude
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

  // Major periodic terms for longitude (in 0.000001 degrees)
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

/**
 * Compute sunrise and sunset times for a given date at the fixed location.
 * Returns times as Date objects in local IST.
 * Uses Meeus Ch.15 algorithm.
 */
function getSunriseSunset(date: Date): { sunrise: Date; sunset: Date } {
  // Use noon IST of the given date as reference
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // JD for noon UT on the given date
  const jdNoon = dateToJD(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)));

  const T = jdToT(jdNoon);

  // Sun's mean longitude and anomaly
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

  // Obliquity of ecliptic
  const eps0 = 23.439291111 - 0.013004167 * T;
  const eps = eps0 + 0.00256 * Math.cos(toRad(omega));

  // Sun's right ascension and declination
  const sunRA = toDeg(Math.atan2(Math.cos(toRad(eps)) * Math.sin(toRad(apparent)), Math.cos(toRad(apparent))));
  const sunDec = toDeg(Math.asin(Math.sin(toRad(eps)) * Math.sin(toRad(apparent))));

  // Hour angle for sunrise/sunset (h0 = -0.8333 degrees for standard sunrise)
  const h0 = -0.8333;
  const latRad = toRad(LAT);
  const decRad = toRad(sunDec);
  const cosH = (Math.sin(toRad(h0)) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));

  // Clamp to valid range
  const cosHClamped = Math.max(-1, Math.min(1, cosH));
  const H = toDeg(Math.acos(cosHClamped));

  // Equation of time (approximate)
  const B = toRad(360 / 365 * (jdNoon - 2451545 + 10));
  const eqTime = -7.655 * Math.sin(B) + 9.873 * Math.sin(2 * B + 3.588) + 0.439 * Math.sin(4 * B + 0.072);

  // Solar noon in hours UT
  const solarNoonUT = 12 - LON / 15 - eqTime / 60;

  // Sunrise and sunset in hours UT
  const sunriseUT = solarNoonUT - H / 15;
  const sunsetUT = solarNoonUT + H / 15;

  // Convert to IST (UTC+5:30)
  const sunriseIST = sunriseUT + IST_OFFSET_HOURS;
  const sunsetIST = sunsetUT + IST_OFFSET_HOURS;

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

/** Returns Tithi number (1-30) and name for a given date */
export function getTithi(date: Date): { number: number; name: string; nameEn: string; paksha: string } {
  // Use IST noon for calculation
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  // Convert IST noon to UTC for JD calculation
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET_HOURS * 3600 * 1000);
  const jd = dateToJD(utcNoon);

  const sunLon = getSunLongitude(jd);
  const moonLon = getMoonLongitude(jd);

  // Angular difference (Moon - Sun), normalized to 0-360
  let diff = normalizeAngle(moonLon - sunLon);

  // Each tithi is 12 degrees
  const tithiIndex = Math.floor(diff / 12); // 0-29
  const tithiNumber = tithiIndex + 1; // 1-30

  const paksha = tithiIndex < 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const pakshaEn = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';

  return {
    number: tithiNumber,
    name: TITHI_NAMES[tithiIndex],
    nameEn: TITHI_NAMES_EN[tithiIndex],
    paksha,
  };
}

// ─── Nakshatra ────────────────────────────────────────────────────────────────

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

/** Returns Nakshatra (1-27) and name for a given date */
export function getNakshatra(date: Date): { number: number; name: string; nameEn: string } {
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET_HOURS * 3600 * 1000);
  const jd = dateToJD(utcNoon);

  const moonLon = getMoonLongitude(jd);
  // Each nakshatra spans 360/27 = 13.333... degrees
  const nakshatraIndex = Math.floor(moonLon / (360 / 27)); // 0-26
  return {
    number: nakshatraIndex + 1,
    name: NAKSHATRA_NAMES[nakshatraIndex],
    nameEn: NAKSHATRA_NAMES_EN[nakshatraIndex],
  };
}

// ─── Yoga ─────────────────────────────────────────────────────────────────────

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

/** Returns Yoga (1-27) and name for a given date */
export function getYoga(date: Date): { number: number; name: string; nameEn: string } {
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET_HOURS * 3600 * 1000);
  const jd = dateToJD(utcNoon);

  const sunLon = getSunLongitude(jd);
  const moonLon = getMoonLongitude(jd);

  // Yoga = (Sun longitude + Moon longitude) / (360/27)
  const sum = normalizeAngle(sunLon + moonLon);
  const yogaIndex = Math.floor(sum / (360 / 27)); // 0-26
  return {
    number: yogaIndex + 1,
    name: YOGA_NAMES[yogaIndex],
    nameEn: YOGA_NAMES_EN[yogaIndex],
  };
}

// ─── Karana ───────────────────────────────────────────────────────────────────

export const KARANA_NAMES: string[] = [
  'बव', 'बालव', 'कौलव', 'तैतिल', 'गर',
  'वणिज', 'विष्टि', 'शकुनि', 'चतुष्पाद', 'नाग', 'किंस्तुघ्न',
];

export const KARANA_NAMES_EN: string[] = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara',
  'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kinstughna',
];

/** Returns Karana name for a given date */
export function getKarana(date: Date): { name: string; nameEn: string } {
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET_HOURS * 3600 * 1000);
  const jd = dateToJD(utcNoon);

  const sunLon = getSunLongitude(jd);
  const moonLon = getMoonLongitude(jd);
  const diff = normalizeAngle(moonLon - sunLon);

  // Each karana is 6 degrees (half a tithi)
  const karanaIndex = Math.floor(diff / 6); // 0-59

  // The 7 movable karanas repeat 8 times (indices 0-55), then 4 fixed karanas
  let name: string;
  let nameEn: string;
  if (karanaIndex === 0) {
    // Kinstughna (fixed)
    name = KARANA_NAMES[10];
    nameEn = KARANA_NAMES_EN[10];
  } else if (karanaIndex >= 57) {
    // Fixed karanas at end: Shakuni, Chatushpada, Naga
    const fixedIdx = karanaIndex - 57 + 7;
    name = KARANA_NAMES[Math.min(fixedIdx, 9)];
    nameEn = KARANA_NAMES_EN[Math.min(fixedIdx, 9)];
  } else {
    // Movable karanas (7 repeating)
    const movableIdx = ((karanaIndex - 1) % 7);
    name = KARANA_NAMES[movableIdx];
    nameEn = KARANA_NAMES_EN[movableIdx];
  }

  return { name, nameEn };
}

// ─── Vara (Weekday) ───────────────────────────────────────────────────────────

export const VARA_NAMES: string[] = [
  'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार',
];

export const VARA_NAMES_EN: string[] = [
  'Ravivara (Sunday)', 'Somavara (Monday)', 'Mangalavara (Tuesday)',
  'Budhavara (Wednesday)', 'Guruvara (Thursday)', 'Shukravara (Friday)', 'Shanivara (Saturday)',
];

export function getVara(date: Date): { name: string; nameEn: string } {
  const day = date.getDay(); // 0=Sunday
  return { name: VARA_NAMES[day], nameEn: VARA_NAMES_EN[day] };
}

// ─── Rahu Kaal / Gulika / Yamaganda ──────────────────────────────────────────

/**
 * Rahu Kaal order by weekday (0=Sun, 1=Mon, ... 6=Sat)
 * The number represents which 1/8th segment of the day is Rahu Kaal
 * (1-indexed, where 1 = first segment after sunrise)
 */
const RAHU_KAAL_SEGMENT: Record<number, number> = {
  0: 8, // Sunday: 8th segment
  1: 2, // Monday: 2nd segment
  2: 7, // Tuesday: 7th segment
  3: 5, // Wednesday: 5th segment
  4: 6, // Thursday: 6th segment
  5: 4, // Friday: 4th segment
  6: 3, // Saturday: 3rd segment
};

const GULIKA_KAAL_SEGMENT: Record<number, number> = {
  0: 6, // Sunday
  1: 5, // Monday
  2: 4, // Tuesday
  3: 3, // Wednesday
  4: 2, // Thursday
  5: 1, // Friday
  6: 7, // Saturday
};

const YAMAGANDA_SEGMENT: Record<number, number> = {
  0: 4, // Sunday
  1: 3, // Monday
  2: 2, // Tuesday
  3: 1, // Wednesday
  4: 8, // Thursday
  5: 7, // Friday
  6: 6, // Saturday
};

function getKaalPeriod(date: Date, segmentMap: Record<number, number>): { start: Date; end: Date } {
  const { sunrise, sunset } = getSunriseSunset(date);
  const dayDurationMs = sunset.getTime() - sunrise.getTime();
  const segmentMs = dayDurationMs / 8;
  const dayOfWeek = date.getDay();
  const segment = segmentMap[dayOfWeek];

  const start = new Date(sunrise.getTime() + (segment - 1) * segmentMs);
  const end = new Date(sunrise.getTime() + segment * segmentMs);
  return { start, end };
}

export function getRahuKaal(date: Date): { start: Date; end: Date } {
  return getKaalPeriod(date, RAHU_KAAL_SEGMENT);
}

export function getGulikaKaal(date: Date): { start: Date; end: Date } {
  return getKaalPeriod(date, GULIKA_KAAL_SEGMENT);
}

export function getYamagandaKaal(date: Date): { start: Date; end: Date } {
  return getKaalPeriod(date, YAMAGANDA_SEGMENT);
}

// ─── Brahma Muhurat & Abhijit Muhurat ─────────────────────────────────────────

/** Brahma Muhurat: 96 minutes before sunrise, lasts 48 minutes */
export function getBrahmaMuhurat(date: Date): { start: Date; end: Date } {
  const { sunrise } = getSunriseSunset(date);
  const start = new Date(sunrise.getTime() - 96 * 60 * 1000);
  const end = new Date(sunrise.getTime() - 48 * 60 * 1000);
  return { start, end };
}

/**
 * Abhijit Muhurat: The 8th muhurat of the day.
 * Day is divided into 15 muhurats (each = day_duration / 15).
 * Abhijit is the 8th, centered around solar noon.
 */
export function getAbhijitMuhurat(date: Date): { start: Date; end: Date } {
  const { sunrise, sunset } = getSunriseSunset(date);
  const dayDurationMs = sunset.getTime() - sunrise.getTime();
  const muhurtaDurationMs = dayDurationMs / 15;
  const start = new Date(sunrise.getTime() + 7 * muhurtaDurationMs);
  const end = new Date(sunrise.getTime() + 8 * muhurtaDurationMs);
  return { start, end };
}

// ─── Vikram Samvat ────────────────────────────────────────────────────────────

/**
 * Vikram Samvat year.
 * VS = Gregorian year + 56 (before Chaitra Shukla Pratipada) or +57 (after).
 * Approximate: VS = Gregorian year + 57 for dates after ~April, else +56.
 */
export function getVikramSamvat(date: Date): number {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  // Hindu new year (Chaitra Shukla Pratipada) is roughly in March-April
  // Approximate: if before April 14, use +56, else +57
  if (month < 4 || (month === 4 && day < 14)) {
    return date.getFullYear() + 56;
  }
  return date.getFullYear() + 57;
}

// ─── Hindu Month ──────────────────────────────────────────────────────────────

export const HINDU_MONTHS: string[] = [
  'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद',
  'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन',
];

export const HINDU_MONTHS_EN: string[] = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada',
  'Ashwin', 'Kartik', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna',
];

/**
 * Hindu month based on Sun's zodiac sign (Saura month).
 * Sun enters each zodiac sign roughly every 30 days.
 * Aries (0°) = Chaitra, Taurus (30°) = Vaishakha, etc.
 */
export function getHinduMonth(date: Date): { name: string; nameEn: string } {
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET_HOURS * 3600 * 1000);
  const jd = dateToJD(utcNoon);
  const sunLon = getSunLongitude(jd);

  // Sun's zodiac sign (0-11)
  const signIndex = Math.floor(sunLon / 30);
  return {
    name: HINDU_MONTHS[signIndex],
    nameEn: HINDU_MONTHS_EN[signIndex],
  };
}

// ─── Ayana ────────────────────────────────────────────────────────────────────

/**
 * Uttarayana: Sun moving north (winter solstice to summer solstice, ~Dec 21 to Jun 21)
 * Dakshinayana: Sun moving south (summer solstice to winter solstice, ~Jun 21 to Dec 21)
 * Based on Sun's ecliptic longitude: 270°-90° = Uttarayana, 90°-270° = Dakshinayana
 */
export function getAyana(date: Date): { name: string; nameEn: string } {
  const istNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const utcNoon = new Date(istNoon.getTime() - IST_OFFSET_HOURS * 3600 * 1000);
  const jd = dateToJD(utcNoon);
  const sunLon = getSunLongitude(jd);

  // Uttarayana: Sun longitude 270° to 90° (passing through 0°)
  const isUttarayana = sunLon >= 270 || sunLon < 90;
  return {
    name: isUttarayana ? 'उत्तरायण' : 'दक्षिणायन',
    nameEn: isUttarayana ? 'Uttarayana' : 'Dakshinayana',
  };
}

// ─── Format Helpers ───────────────────────────────────────────────────────────

export function formatTimeIST(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const mm = minutes.toString().padStart(2, '0');
  return `${hours}:${mm} ${ampm}`;
}

export function formatDateReadable(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export interface PanchangData {
  date: Date;
  tithi: ReturnType<typeof getTithi>;
  nakshatra: ReturnType<typeof getNakshatra>;
  yoga: ReturnType<typeof getYoga>;
  karana: ReturnType<typeof getKarana>;
  vara: ReturnType<typeof getVara>;
  sunrise: Date;
  sunset: Date;
  rahuKaal: { start: Date; end: Date };
  gulikaKaal: { start: Date; end: Date };
  yamagandaKaal: { start: Date; end: Date };
  brahmaMuhurat: { start: Date; end: Date };
  abhijitMuhurat: { start: Date; end: Date };
  vikramSamvat: number;
  hinduMonth: ReturnType<typeof getHinduMonth>;
  ayana: ReturnType<typeof getAyana>;
}

export function getPanchangData(date: Date): PanchangData {
  const { sunrise, sunset } = getSunriseSunset(date);
  return {
    date,
    tithi: getTithi(date),
    nakshatra: getNakshatra(date),
    yoga: getYoga(date),
    karana: getKarana(date),
    vara: getVara(date),
    sunrise,
    sunset,
    rahuKaal: getRahuKaal(date),
    gulikaKaal: getGulikaKaal(date),
    yamagandaKaal: getYamagandaKaal(date),
    brahmaMuhurat: getBrahmaMuhurat(date),
    abhijitMuhurat: getAbhijitMuhurat(date),
    vikramSamvat: getVikramSamvat(date),
    hinduMonth: getHinduMonth(date),
    ayana: getAyana(date),
  };
}
