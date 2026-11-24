import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export function EastJavaEmblem({ className = 'w-28 h-32' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 215" className={className} aria-label="Lambang Provinsi Jawa Timur">
      <defs>
        <linearGradient id="ejSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e88e5" />
          <stop offset="100%" stopColor="#4fc3f7" />
        </linearGradient>
        <linearGradient id="ejGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      {/* Outer shield */}
      <path
        d="M25,12 L155,12 L155,105 C155,152 90,185 90,185 C90,185 25,152 25,105 Z"
        fill="url(#ejSky)"
        stroke="#1e293b"
        strokeWidth="3.5"
      />
      {/* Inner yellow-gold border */}
      <path
        d="M32,19 L148,19 L148,104 C148,145 90,176 90,176 C90,176 32,145 32,104 Z"
        fill="none"
        stroke="#facc15"
        strokeWidth="2.5"
      />

      {/* Star at top */}
      <polygon
        points="90,23 94,34 106,34 96,41 100,52 90,45 80,52 84,41 74,34 86,34"
        fill="#fef08a"
        stroke="#854d0e"
        strokeWidth="1"
      />

      {/* Volcano / Mountains */}
      <path d="M38,118 L72,82 L94,104 L118,78 L142,118 Z" fill="#15803d" stroke="#14532d" strokeWidth="1.2" />
      <path d="M46,118 L72,88 L90,108 Z" fill="#22c55e" opacity="0.55" />

      {/* River & Dam Waves */}
      <path d="M44,122 Q67,114 90,122 T136,122 L136,144 Q112,158 90,164 Q68,158 44,144 Z" fill="#0284c7" />
      <path d="M52,130 Q71,124 90,130 T128,130" fill="none" stroke="#e0f2fe" strokeWidth="2" />
      <path d="M58,139 Q74,134 90,139 T122,139" fill="none" stroke="#e0f2fe" strokeWidth="2" />

      {/* Tugu Pahlawan Monument */}
      <polygon points="84,124 96,124 93,54 87,54" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.5" />
      <rect x="81" y="124" width="18" height="7" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1.2" />
      <line x1="90" y1="54" x2="90" y2="124" stroke="#94a3b8" strokeWidth="1" />

      {/* Rice (Padi) Left */}
      <g stroke="#1e293b" strokeWidth="0.7">
        <path d="M44,145 Q34,105 42,60" fill="none" stroke="#ca8a04" strokeWidth="2.5" />
        {[65, 76, 87, 98, 109, 120, 131].map((y, idx) => (
          <ellipse key={idx} cx={38 + (idx % 2) * 5} cy={y} rx="4" ry="7" fill="#facc15" transform={`rotate(${idx % 2 === 0 ? -25 : 25} ${38 + (idx % 2) * 5} ${y})`} />
        ))}
      </g>

      {/* Cotton (Kapas) Right */}
      <g>
        <path d="M136,145 Q146,105 138,60" fill="none" stroke="#15803d" strokeWidth="2.5" />
        {[66, 80, 94, 108, 122, 134].map((y, idx) => (
          <g key={idx}>
            <circle cx={138 - (idx % 2) * 2} cy={y} r="6.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
            <path d={`M${134 - (idx % 2) * 2},${y + 4} L${142 - (idx % 2) * 2},${y + 4}`} stroke="#16a34a" strokeWidth="2.5" />
          </g>
        ))}
      </g>

      {/* Gear wheel at base */}
      <circle cx="90" cy="148" r="11" fill="#cbd5e1" stroke="#334155" strokeWidth="1.8" />
      <circle cx="90" cy="148" r="5" fill="#0284c7" stroke="#334155" strokeWidth="1.2" />

      {/* JAWA TIMUR Banner */}
      <path d="M53,164 L127,164 L122,178 L58,178 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
      <text x="90" y="174" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#1e293b" fontFamily="Arial, sans-serif">
        JAWA TIMUR
      </text>

      {/* Bottom Scroll: JER BASUKI MAWA BEYA */}
      <path d="M22,186 Q90,204 158,186 L163,200 Q90,218 17,200 Z" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.6" />
      <text x="90" y="201" textAnchor="middle" fontSize="8.2" fontWeight="800" fill="#1e293b" fontFamily="Arial, sans-serif" letterSpacing="0.4">
        JER BASUKI MAWA BEYA
      </text>
    </svg>
  );
}

export function Sman2Logo({ className = 'w-28 h-28' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} aria-label="Logo SMA Negeri 2 Pasuruan">
      {/* Outer dark navy pentagon/shield */}
      <polygon
        points="90,10 158,42 152,126 90,170 28,126 22,42"
        fill="#1e3a8a"
        stroke="#0f172a"
        strokeWidth="3"
      />
      <polygon
        points="90,17 151,46 146,122 90,162 34,122 29,46"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="2"
      />
      {/* Top text: SMA */}
      <text x="90" y="42" textAnchor="middle" fontSize="14" fontWeight="800" fill="#ffffff" fontFamily="Arial, sans-serif" letterSpacing="2">
        SMA
      </text>
      {/* Inner circle */}
      <circle cx="90" cy="92" r="42" fill="#1d4ed8" stroke="#f8fafc" strokeWidth="2.5" />
      {/* Stylized wings / laurel */}
      <path d="M52,98 C52,74 70,62 90,62 C110,62 128,74 128,98" fill="none" stroke="#93c5fd" strokeWidth="2" />
      <path d="M62,102 L76,88 L76,112 Z" fill="#e0f2fe" opacity="0.85" />
      <path d="M118,102 L104,88 L104,112 Z" fill="#e0f2fe" opacity="0.85" />
      {/* Bold number 2 */}
      <text x="90" y="108" textAnchor="middle" fontSize="42" fontWeight="900" fill="#ffffff" fontFamily="Georgia, serif">
        2
      </text>
      {/* Bottom ribbon PASURUAN */}
      <path d="M40,124 Q90,144 140,124 L135,139 Q90,158 45,139 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
      <text x="90" y="139" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#1e3a8a" fontFamily="Arial, sans-serif" letterSpacing="0.8">
        PASURUAN
      </text>
    </svg>
  );
}

export function SchoolWatermarkBackground({ schoolName }: { schoolName: string }) {
  const rows = Array.from({ length: 28 });
  return (
    <div className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0">
      {/* Faint tiled text rows matching scanned security paper */}
      <div className="absolute inset-0 flex flex-col justify-between py-2 px-3 opacity-[0.045]">
        {rows.map((_, idx) => (
          <div
            key={idx}
            className="whitespace-nowrap text-[11px] font-bold tracking-[0.22em] text-sky-700 leading-none"
          >
            {`${schoolName}   ${schoolName}   ${schoolName}   ${schoolName}`}
          </div>
        ))}
      </div>
      {/* Center faint circular seal watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
        <Sman2Logo className="w-[340px] h-[340px]" />
      </div>
    </div>
  );
}

export function SchoolStamp({ className = 'w-28 h-28' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} aria-label="Stempel Resmi Sekolah">
      <g fill="none" stroke="#1d4ed8" opacity="0.82">
        <circle cx="90" cy="90" r="80" strokeWidth="3.5" />
        <circle cx="90" cy="90" r="74" strokeWidth="1.2" />
        <circle cx="90" cy="90" r="52" strokeWidth="2.2" />

        <defs>
          <path id="stampTopArc" d="M 27,90 A 63,63 0 1,1 153,90" />
          <path id="stampBottomArc" d="M 26,95 A 64,64 0 0,0 154,95" />
        </defs>

        <text fill="#1d4ed8" stroke="none" fontSize="10.2" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1.1">
          <textPath href="#stampTopArc" startOffset="50%" textAnchor="middle">
            PEMERINTAH PROVINSI JAWA TIMUR
          </textPath>
        </text>
        <text fill="#1d4ed8" stroke="none" fontSize="10.5" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1.2">
          <textPath href="#stampBottomArc" startOffset="50%" textAnchor="middle">
            DINAS PENDIDIKAN
          </textPath>
        </text>

        {/* Stars */}
        <text x="26" y="96" fill="#1d4ed8" stroke="none" fontSize="11" fontWeight="700">★</text>
        <text x="143" y="96" fill="#1d4ed8" stroke="none" fontSize="11" fontWeight="700">★</text>

        {/* Inner school logo outline */}
        <polygon points="90,52 118,67 114,104 90,122 66,104 62,67" strokeWidth="1.8" />
        <text x="90" y="84" fill="#1d4ed8" stroke="none" textAnchor="middle" fontSize="9.5" fontWeight="800" fontFamily="Arial, sans-serif">
          SMAN 2
        </text>
        <text x="90" y="97" fill="#1d4ed8" stroke="none" textAnchor="middle" fontSize="8.5" fontWeight="800" fontFamily="Arial, sans-serif">
          KOTA PASURUAN
        </text>
      </g>
    </svg>
  );
}

export function SignatureInk({ variant }: { variant: 'kepala' | 'wali' | 'ortu' }) {
  if (variant === 'kepala') {
    return (
      <svg viewBox="0 0 140 54" className="w-28 h-11" aria-hidden="true">
        <path
          d="M16,38 C28,28 45,16 62,18 C75,20 42,40 58,42 C72,44 88,24 102,22 C110,21 96,35 118,30 C124,29 128,27 132,26"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M36,44 C56,34 84,22 114,14"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (variant === 'wali') {
    return (
      <svg viewBox="0 0 130 56" className="w-24 h-12" aria-hidden="true">
        <path
          d="M20,20 C35,10 62,12 50,24 C38,36 22,48 34,48 C46,48 54,18 60,12 C62,18 58,42 64,44 C70,46 76,28 80,26 C82,34 86,42 92,38 C98,34 104,22 106,16 C104,30 100,44 98,50"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 140 54" className="w-28 h-11" aria-hidden="true">
      <path
        d="M22,18 L22,44 M22,30 L42,30 M42,16 C40,28 40,38 44,42 C50,36 56,28 60,34 C64,40 72,20 82,14 C94,10 104,16 92,24 C78,32 54,36 68,42 C82,48 100,32 106,26"
        fill="none"
        stroke="#0f172a"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerificationQR({ payload, label }: { payload: string; label: string }) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(payload, {
      width: 120,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        // Ignore transient QR errors
      });
    return () => {
      active = false;
    };
  }, [payload]);

  return (
    <div className="relative inline-flex items-center justify-center w-[62px] h-[62px] bg-white">
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`QR Verifikasi ${label}`}
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full border border-slate-300 bg-slate-50" />
      )}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center border border-slate-300">
          <div className="w-2 h-2 rounded-full bg-sky-700" />
        </div>
      </div>
    </div>
  );
}
