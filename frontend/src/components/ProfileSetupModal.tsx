import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSetUserProfile } from '../hooks/useQueries';
import { Mantra } from '../backend';
import { Loader2 } from 'lucide-react';

const FIRST_USER_ADMIN_TOKEN = 'vdHHsU40C6W3rU2dA4Ncu';

interface ProfileSetupModalProps {
  open?: boolean;
}

export default function ProfileSetupModal({ open = true }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const { mutate: setProfile, isPending } = useSetUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProfile({
      profile: { name: name.trim(), selectedMantra: Mantra.omNamahShivaya },
      token: FIRST_USER_ADMIN_TOKEN,
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md border-border/50"
        style={{
          background: 'linear-gradient(135deg, oklch(14% 0.025 240), oklch(18% 0.03 250))',
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-center mb-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(245,158,11,0.15))',
                border: '2px solid rgba(249,115,22,0.4)',
                boxShadow: '0 0 20px rgba(249,115,22,0.3)',
              }}
            >
              🙏
            </div>
          </div>
          <DialogTitle className="text-center text-foreground text-xl">
            स्वागत है!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            अपना नाम दर्ज करें और अपनी आध्यात्मिक यात्रा शुरू करें
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              आपका नाम
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="अपना नाम लिखें..."
              className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-saffron-500/60 focus:ring-saffron-500/30"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || isPending}
            className="w-full font-semibold text-white border-0"
            style={{
              background: name.trim() && !isPending
                ? 'linear-gradient(135deg, #f97316, #f59e0b)'
                : undefined,
              boxShadow: name.trim() && !isPending ? '0 0 20px rgba(249,115,22,0.4)' : undefined,
            }}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                सहेज रहे हैं...
              </>
            ) : (
              '🙏 शुरू करें'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
