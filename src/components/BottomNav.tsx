import React from 'react';
import { useApp, ScreenType } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, setCatatKasInitialType } = useApp();

  // If on catat-kas, we can hide the bottom nav or keep it available
  if (currentScreen === 'catat-kas') {
    return null;
  }

  const navItems: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'beranda', label: 'Beranda', icon: 'dashboard' },
    { id: 'buku-kas', label: 'Buku Kas', icon: 'receipt_long' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-[#eaedff]">
      <div className="flex items-center justify-around h-16 px-3 max-w-md mx-auto">
        {/* Beranda */}
        <button
          onClick={() => setCurrentScreen('beranda')}
          className={`flex flex-col items-center justify-center w-16 h-12 gap-0.5 transition-colors cursor-pointer active:scale-95 ${
            currentScreen === 'beranda'
              ? 'text-[#006948] font-semibold'
              : 'text-[#3d4a42] hover:text-[#006948]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              currentScreen === 'beranda' ? 'fill' : ''
            }`}
          >
            dashboard
          </span>
          <span className="font-label-sm text-[11px] leading-none">Beranda</span>
        </button>

        {/* Buku Kas */}
        <button
          onClick={() => setCurrentScreen('buku-kas')}
          className={`flex flex-col items-center justify-center w-16 h-12 gap-0.5 transition-colors cursor-pointer active:scale-95 ${
            currentScreen === 'buku-kas'
              ? 'text-[#006948] font-semibold'
              : 'text-[#3d4a42] hover:text-[#006948]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              currentScreen === 'buku-kas' ? 'fill' : ''
            }`}
          >
            receipt_long
          </span>
          <span className="font-label-sm text-[11px] leading-none">Buku Kas</span>
        </button>

        {/* Center Floating (+) Button */}
        <div className="flex items-center justify-center -mt-5">
          <button
            aria-label="Catat Transaksi Kas"
            onClick={() => {
              setCatatKasInitialType('inflow');
              setCurrentScreen('catat-kas');
            }}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#006948] text-white shadow-lg shadow-[#006948]/25 hover:bg-[#00855d] active:scale-95 transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform duration-200">
              add
            </span>
          </button>
        </div>

        {/* Transparansi */}
        <button
          onClick={() => setCurrentScreen('transparansi')}
          className={`flex flex-col items-center justify-center w-16 h-12 gap-0.5 transition-colors cursor-pointer active:scale-95 ${
            currentScreen === 'transparansi'
              ? 'text-[#006948] font-semibold'
              : 'text-[#3d4a42] hover:text-[#006948]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              currentScreen === 'transparansi' ? 'fill' : ''
            }`}
          >
            clinical_notes
          </span>
          <span className="font-label-sm text-[11px] leading-none">Transparansi</span>
        </button>
      </div>
    </nav>
  );
};
