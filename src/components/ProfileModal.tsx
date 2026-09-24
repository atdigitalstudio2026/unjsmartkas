import React from 'react';
import { useApp } from '../context/AppContext';

export const ProfileModal: React.FC = () => {
  const { isProfileOpen, setIsProfileOpen, showToast } = useApp();

  if (!isProfileOpen) return null;

  const avatarUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCPshfqadEayN1sH2jRqQcGPTKppexgumAMLpsbvC7vmoDYNuK35xBOSpXG5Ls1ooVPfk0O3MbgJNfT2de5Y5G6LeDUXLfMM_j1qIiddglEfonojnVuAkkctpz1pck6_XDXKoYz3LFjoyef_HC33IzXEEcSGefaTrHkOBE84OSxlMsS2bsxfU6ZN8l44cuX6Xxf8xJ06Dxyt574ZnTNEk7yyBeUq7yLVg2f2lzKP4ckpEUbrr06KAJE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-[#eaedff]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948] text-[22px]">
              person
            </span>
            <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Profil Bendahara
            </span>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6d7a72] hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Citra Dewi"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-[#85f8c4]"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#006948] border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>

          <div>
            <h3 className="font-bold text-[18px] text-[#131b2e]">Citra Dewi</h3>
            <p className="text-xs text-[#006948] font-semibold">
              Bendahara Umum HIMA ILKOM 2024/2025
            </p>
            <p className="text-[11px] text-[#3d4a42] mt-0.5">NIM: 220101004 • Semester 6</p>
          </div>

          <div className="w-full bg-[#f2f3ff] rounded-xl p-3 text-left space-y-2 text-xs border border-[#eaedff]">
            <div className="flex justify-between">
              <span className="text-[#3d4a42]">Organisasi</span>
              <span className="font-semibold text-[#131b2e]">
                Himpunan Mahasiswa Ilmu Komputer
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3d4a42]">Rekening Operasional</span>
              <span className="font-semibold text-[#131b2e]">Bank Mandiri 137-00-98721-1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3d4a42]">Tingkat Otoritas</span>
              <span className="font-semibold text-[#006948]">Super Admin Kas (Tier 1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3d4a42]">Kriptografi Kunci</span>
              <span className="font-mono text-[10px] text-[#3d4a42]">ed25519:citra_dewi_ok</span>
            </div>
          </div>

          <div className="w-full pt-2">
            <button
              onClick={() => {
                showToast('Status sinkronisasi ledger abadi aktif dan terverifikasi.', 'sync', 'success');
                setIsProfileOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#eaedff] text-[#006948] text-xs font-semibold hover:bg-[#e2e7ff] transition-colors cursor-pointer"
            >
              Sinkronisasi Ulang Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
