import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Bell } from 'lucide-react';
import { toast } from 'sonner';

function getDaysUntilDate(month: number, day: number): number {
  const today = new Date();
  const target = new Date(today.getFullYear(), month - 1, day);
  if (target < today) target.setFullYear(today.getFullYear() + 1);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getNextEkadashi(): number {
  // Approximate: Ekadashi falls on 11th day of each lunar fortnight (~every 15 days)
  const today = new Date();
  const dayOfMonth = today.getDate();
  // Rough approximation
  const nextEkadashi = dayOfMonth <= 11 ? 11 - dayOfMonth : 26 - dayOfMonth;
  return Math.max(0, nextEkadashi);
}

export default function VratModeDashboard() {
  const [fastingCheckedIn, setFastingCheckedIn] = useState(false);
  const [navratriDay, setNavratriDay] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('fastingCheckIn');
    if (stored === today) setFastingCheckedIn(true);

    const storedNavratri = localStorage.getItem('navratriDay');
    if (storedNavratri) setNavratriDay(parseInt(storedNavratri));
  }, []);

  const handleFastingCheckIn = () => {
    const today = new Date().toDateString();
    localStorage.setItem('fastingCheckIn', today);
    setFastingCheckedIn(true);
    toast.success('🙏 Fasting check-in recorded! Jai Mata Di!');
  };

  const handleNavratriProgress = (day: number) => {
    localStorage.setItem('navratriDay', day.toString());
    setNavratriDay(day);
    toast.success(`🌺 Navratri Day ${day} marked!`);
  };

  const ekadashiDays = getNextEkadashi();
  const shivratriDays = getDaysUntilDate(2, 26); // Maha Shivratri approx Feb 26

  return (
    <div className="space-y-3 bg-gradient-to-br from-saffron/5 to-gold/5 rounded-2xl border-2 border-saffron/20 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🌙</span>
        <h3 className="font-devanagari text-saffron font-semibold">व्रत मोड Dashboard</h3>
      </div>

      {/* Brahma Muhurat */}
      <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gold/20">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌅</span>
          <div>
            <p className="text-xs font-semibold font-body text-foreground">Brahma Muhurat</p>
            <p className="text-xs text-muted-foreground font-body">Ideal time for prayer</p>
          </div>
        </div>
        <span className="text-sm font-bold text-saffron font-body">4:30 AM</span>
      </div>

      {/* Fasting Tracker */}
      <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gold/20">
        <div className="flex items-center gap-2">
          <span className="text-lg">🍃</span>
          <div>
            <p className="text-xs font-semibold font-body text-foreground">Today's Fast</p>
            <p className="text-xs text-muted-foreground font-body">
              {fastingCheckedIn ? 'Checked in ✓' : 'Not checked in yet'}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleFastingCheckIn}
          disabled={fastingCheckedIn}
          className={`h-8 text-xs font-body gap-1 ${
            fastingCheckedIn
              ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-100'
              : 'bg-saffron hover:bg-saffron-dark text-white'
          }`}
        >
          {fastingCheckedIn ? <><Check className="h-3 w-3" /> Done</> : 'Check In'}
        </Button>
      </div>

      {/* Countdowns */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 border border-gold/20 text-center">
          <p className="text-2xl font-bold text-saffron font-body">{ekadashiDays}</p>
          <p className="text-xs text-muted-foreground font-body">days to Ekadashi</p>
          <p className="text-xs font-semibold font-body mt-0.5">🌙 एकादशी</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gold/20 text-center">
          <p className="text-2xl font-bold text-saffron font-body">{shivratriDays}</p>
          <p className="text-xs text-muted-foreground font-body">days to Shivratri</p>
          <p className="text-xs font-semibold font-body mt-0.5">🔱 शिवरात्रि</p>
        </div>
      </div>

      {/* Navratri Tracker */}
      <div className="bg-white rounded-xl p-3 border border-gold/20">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold font-body text-foreground">🌺 Navratri Tracker</p>
          <p className="text-xs text-muted-foreground font-body">{navratriDay}/9 days</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: 9 }, (_, i) => i + 1).map(day => (
            <button
              key={day}
              onClick={() => handleNavratriProgress(day)}
              className={`w-8 h-8 rounded-full text-xs font-bold font-body transition-all ${
                day <= navratriDay
                  ? 'bg-saffron text-white shadow-saffron'
                  : 'bg-saffron/10 text-saffron border border-saffron/30'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-body mt-2">
          Tap a day to mark progress
        </p>
      </div>
    </div>
  );
}
