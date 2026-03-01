'use client';

import { useState } from 'react';
import { Instagram, Linkedin, MessageCircle, MessageSquare, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

type Platform = 'instagram' | 'linkedin' | 'whatsapp' | 'imessage';

const PLATFORMS = [
  {
    id: 'instagram' as Platform,
    name: 'Instagram',
    icon: Instagram,
  },
  {
    id: 'linkedin' as Platform,
    name: 'LinkedIn',
    icon: Linkedin,
  },
  {
    id: 'whatsapp' as Platform,
    name: 'WhatsApp',
    icon: MessageCircle,
  },
  {
    id: 'imessage' as Platform,
    name: 'iMessage',
    icon: MessageSquare,
  },
];

const PLATFORM_LINKS: Record<Platform, string> = {
  instagram: 'https://www.instagram.com/rionkurihara22/',
  linkedin: 'https://www.linkedin.com/in/rion-kurihara-2b8a8b215/',
  whatsapp: 'https://wa.me/817013890622',
  imessage: 'sms:+14126702184'
};

export default function Home() {
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const [showToast, setShowToast] = useState(false);

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
        <p className="subtitle">Select an app below, then let them scan your QR code.</p>
      </div>

      <div className="qr-container">
        {activePlatform ? (
          <div className="qr-box">
            <QRCodeSVG
              value={PLATFORM_LINKS[activePlatform]}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#111827"}
              level={"Q"}
              includeMargin={true}
            />
            <p className="qr-hint">Scan to open {PLATFORMS.find(p => p.id === activePlatform)?.name}</p>
          </div>
        ) : (
          <div className="qr-box empty">
            <div className="qr-placeholder" />
            <p className="qr-hint">Select a platform below to generate your QR Code</p>
          </div>
        )}
      </div>

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
              </div>

              <div className="radio-circle">
                <div className="radio-dot" />
              </div>
            </div>
          );
        })}
      </div>

      <div className={`status-toast ${showToast ? 'show' : ''}`}>
        <CheckCircle2 size={18} />
        <span>NFC Link Updated</span>
      </div>
    </main>
  );
}
