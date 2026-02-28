'use client';

import { useState, useEffect } from 'react';
import { Instagram, Linkedin, MessageCircle, MessageSquare, CheckCircle2 } from 'lucide-react';

type Platform = 'instagram' | 'linkedin' | 'whatsapp' | 'imessage';

const PLATFORMS = [
  {
    id: 'instagram' as Platform,
    name: 'Instagram',
    desc: 'Share your visual feed & stories',
    icon: Instagram,
  },
  {
    id: 'linkedin' as Platform,
    name: 'LinkedIn',
    desc: 'Connect professionally',
    icon: Linkedin,
  },
  {
    id: 'whatsapp' as Platform,
    name: 'WhatsApp',
    desc: 'Chat via WhatsApp',
    icon: MessageCircle,
  },
  {
    id: 'imessage' as Platform,
    name: 'iMessage',
    desc: 'Direct text message',
    icon: MessageSquare,
  },
];

export default function Home() {
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Fetch initial selection
  useEffect(() => {
    fetch('/api/selection')
      .then((res) => res.json())
      .then((data) => {
        if (data.active_platform) {
          setActivePlatform(data.active_platform as Platform);
        }
      })
      .catch((err) => console.error('Error fetching platform', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (platformId: Platform) => {
    if (platformId === activePlatform) return;

    // Optimistic UI update
    setActivePlatform(platformId);

    try {
      const res = await fetch('/api/selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: platformId }),
      });

      if (res.ok) {
        // Show success toast
        setShowToast(false);
        setTimeout(() => setShowToast(true), 50);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        // Revert on failure (simplified for MVP)
        console.error('Failed to update');
      }
    } catch (error) {
      console.error('Error updating platform', error);
    }
  };

  return (
    <main>
      <div className="header">
        <h1 className="title">Rion, how do you want to connect today?</h1>
        <p className="subtitle">Select the app that opens when your NFC is tapped.</p>
      </div>

      {loading ? (
        <div className="loader">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="loader-card skeleton"></div>
          ))}
        </div>
      ) : (
        <div className="options-container">
          {PLATFORMS.map((platform) => {
            const isActive = activePlatform === platform.id;
            const Icon = platform.icon;

            return (
              <div
                key={platform.id}
                className={`option-card ${platform.id} ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(platform.id)}
              >
                <div className="icon-container">
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                <div className="label-container">
                  <div className="platform-name">{platform.name}</div>
                  <div className="platform-desc">{platform.desc}</div>
                </div>

                <div className="radio-circle">
                  <div className="radio-dot" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={`status-toast ${showToast ? 'show' : ''}`}>
        <CheckCircle2 size={18} />
        <span>NFC Link Updated</span>
      </div>
    </main>
  );
}
