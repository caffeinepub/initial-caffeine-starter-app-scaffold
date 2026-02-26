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
import type { UserProfile } from '../backend';
import { Mantra } from '../backend';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  open?: boolean;
  onComplete?: () => void;
}

export default function ProfileSetupModal({ open = true, onComplete }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const saveProfile = useSetUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Please enter your name');
      return;
    }

    const profile: UserProfile = {
      name: trimmed,
      selectedMantra: Mantra.omNamahShivaya,
    };

    saveProfile.mutate(profile, {
      onSuccess: () => {
        toast.success('🙏 Profile saved! Jai Shri Ram!');
        onComplete?.();
      },
      onError: () => {
        toast.error('Failed to save profile. Please try again.');
      },
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        style={{
          background: 'linear-gradient(135deg, oklch(0.97 0.025 85), oklch(0.94 0.04 80))',
          border: '2px solid oklch(0.82 0.18 80 / 0.4)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-center" style={{ color: 'oklch(0.35 0.14 20)' }}>
            🙏 स्वागत है! प्रोफ़ाइल बनाएं
          </DialogTitle>
          <DialogDescription className="text-center" style={{ color: 'oklch(0.55 0.05 40)' }}>
            अपना नाम दर्ज करें और अपनी आध्यात्मिक यात्रा शुरू करें।
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="name" style={{ color: 'oklch(0.35 0.14 20)' }}>
              आपका नाम (Your Name)
            </Label>
            <Input
              id="name"
              placeholder="अपना नाम लिखें..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              disabled={saveProfile.isPending}
              style={{
                border: '1px solid oklch(0.82 0.18 80 / 0.4)',
                background: 'oklch(0.99 0.01 85)',
              }}
            />
          </div>
          <Button
            type="submit"
            className="w-full font-heading"
            disabled={saveProfile.isPending || !name.trim()}
            style={{
              background: 'linear-gradient(135deg, oklch(0.62 0.18 45), oklch(0.72 0.19 55))',
              border: 'none',
              color: '#FFF8DC',
            }}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                सहेज रहे हैं...
              </>
            ) : (
              '🙏 प्रोफ़ाइल सहेजें'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
