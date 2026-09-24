import React from 'react';
import { useApp } from '../context/AppContext';

export const ReceiptLightboxModal: React.FC = () => {
  const { lightboxImage, setLightboxImage } = useApp();

  if (!lightboxImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setLightboxImage(null)}
    >
      <div
        className="relative max-w-lg w-full bg-[#131b2e] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-white/10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="p-3 bg-black/40 flex items-center justify-between text-white border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#85f8c4] text-[20px]">
              receipt_long
            </span>
            <span className="font-label-md text-[13px] font-semibold truncate">
              {lightboxImage.title || 'Bukti Struk Transaksi'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Image content */}
        <div className="p-3 flex items-center justify-center overflow-auto flex-1 bg-black/20">
          <img
            src={lightboxImage.url}
            alt={lightboxImage.title}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Footer info */}
        <div className="p-3 bg-black/40 flex items-center justify-between text-xs text-white/70 border-t border-white/10">
          <span>Otentikasi Bukti Struk Kas Digital</span>
          <button
            type="button"
            onClick={() => {
              const a = document.createElement('a');
              a.href = lightboxImage.url;
              a.download = 'bukti_struk_kaskampus.jpg';
              a.target = '_blank';
              a.click();
            }}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Unduh Berkas
          </button>
        </div>
      </div>
    </div>
  );
};
