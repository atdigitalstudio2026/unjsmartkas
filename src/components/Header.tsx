import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KasKampusLogo } from './KasKampusLogo';

export const Header: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    setIsNotificationsOpen,
    setIsProfileOpen,
  } = useApp();

  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCPshfqadEayN1sH2jRqQcGPTKppexgumAMLpsbvC7vmoDYNuK35xBOSpXG5Ls1ooVPfk0O3MbgJNfT2de5Y5G6LeDUXLfMM_j1qIiddglEfonojnVuAkkctpz1pck6_XDXKoYz3LFjoyef_HC33IzXEEcSGefaTrHkOBE84OSxlMsS2bsxfU6ZN8l44cuX6Xxf8xJ06Dxyt574ZnTNEk7yyBeUq7yLVg2f2lzKP4ckpEUbrr06KAJE';

  const getSubtitle = () => {
    switch (currentScreen) {
      case 'beranda':
        return 'Beranda';
      case 'buku-kas':
        return 'Buku Kas';
      case 'transparansi':
        return 'Transparansi';
      default:
        return 'Buku Kas';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#faf8ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]/60">
      <div className="h-16 px-4 max-w-md mx-auto flex items-center justify-between">
        {currentScreen === 'catat-kas' ? (
          <div className="flex items-center gap-2">
            <button
              aria-label="Kembali"
              className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] active:scale-95 transition-all cursor-pointer"
              onClick={() => setCurrentScreen('buku-kas')}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <KasKampusLogo className="h-7 w-auto" />
            <h1 className="font-headline-sm text-[18px] text-[#131b2e] font-bold tracking-tight">
              Catat Kas
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <KasKampusLogo className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-[18px] text-[#006948] leading-tight tracking-tight font-bold">
                KasKampus
              </span>
              <span className="font-label-sm text-[11px] text-[#3d4a42] font-medium tracking-wide">
                {getSubtitle()}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {currentScreen !== 'catat-kas' && (
            <button
              aria-label="Pemberitahuan"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative w-11 h-11 flex items-center justify-center rounded-full text-[#3d4a42] hover:text-[#006948] hover:bg-[#eaedff] transition-colors cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#b61722] ring-2 ring-[#faf8ff]"></span>
            </button>
          )}

          <button
            onClick={() => setIsProfileOpen(true)}
            aria-label="Profil Bendahara"
            className="flex items-center justify-center p-0.5 rounded-full ring-1 ring-[#006948]/20 hover:ring-[#006948] transition-all cursor-pointer active:scale-95"
          >
            {!avatarError ? (
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src={avatarUrl}
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#85f8c4] text-[#002114] flex items-center justify-center font-bold text-xs">
                CD
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
