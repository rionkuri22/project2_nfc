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
  const [contextMessage, setContextMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Helper to generate dynamic deep links
  const getDynamicUrl = (platform: Platform, context: string) => {
    const base = PLATFORM_LINKS[platform];
    if (!context.trim()) return base;

    // Only WhatsApp and iMessage support pre-filled draft texts
    if (platform === 'whatsapp') {
      return `${base}?text=${encodeURIComponent('Hi I met you (Rion Kurihara) today at ' + context.trim())}`;
    } else if (platform === 'imessage') {
      return `${base}&body=${encodeURIComponent('Hi I met you (Rion Kurihara) today at ' + context.trim())}`;
    }
    return base;
  };

  const saveStateToDB = async (platformId: Platform, context: string) => {
    try {
      const res = await fetch('/api/selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: platformId, context_message: context }),
      });

      if (res.ok) {
        setShowToast(false);
        setTimeout(() => setShowToast(true), 50);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        console.error('Failed to update DB');
      }
    } catch (error) {
      console.error('Error updating platform', error);
    }
  };

  const handleSelect = (platformId: Platform) => {
    if (platformId === activePlatform) return;
    setActivePlatform(platformId);
    saveStateToDB(platformId, contextMessage);
  };

  const handleContextBlur = () => {
    if (activePlatform) {
      saveStateToDB(activePlatform, contextMessage);
    }
  };

  return (
    <main>
      <div className="header">
        <h1 className="title">Rion, how do you want to connect today?</h1>
        <p className="subtitle">Select an app below, then let them scan your QR code.</p>
        <div className="context-input-container">
          <input
            type="text"
            className="context-input"
            placeholder="Where did we meet? (e.g. CMUhacks)"
            value={contextMessage}
            onChange={(e) => setContextMessage(e.target.value)}
            onBlur={handleContextBlur}
          />
        </div>
      </div>

      <div className="qr-container">
        {activePlatform ? (
          <div className="qr-box">
            <QRCodeSVG
              value={getDynamicUrl(activePlatform, contextMessage)}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#111827"}
              level={"Q"}
              includeMargin={true}
            />
            <p className="qr-hint">Scan to open {PLATFORMS.find(p => p.id === activePlatform)?.name}</p>
            {contextMessage && (activePlatform === 'whatsapp' || activePlatform === 'imessage') && (
              <p className="qr-subhint">Draft message attached!</p>
            )}
          </div>
        ) : (
          <div className="qr-box empty">
            <div className="qr-placeholder" />
            <p className="qr-hint">Select a platform below to generate your QR Code</p>
          </div>
        )}
      </div>

      <div className="context-input-container">
        <input
          type="text"
          className="context-input"
          placeholder="Where did we meet?"
          value={contextMessage}
          onChange={(e) => setContextMessage(e.target.value)}
          onBlur={handleContextBlur}
        />
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
