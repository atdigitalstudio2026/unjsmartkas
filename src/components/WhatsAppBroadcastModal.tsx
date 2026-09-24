import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';

export const WhatsAppBroadcastModal: React.FC = () => {
  const {
    isBroadcastModalOpen,
    setIsBroadcastModalOpen,
    members,
    showToast,
  } = useApp();

  const unpaidMembers = members.filter((m) => m.status === 'tunggakan');
  const [copied, setCopied] = useState(false);

  if (!isBroadcastModalOpen) return null;

  const unpaidNames = unpaidMembers.map((m) => `• ${m.name} (${m.department}) - ${formatRupiah(m.dueAmount)}`).join('\n');

  const broadcastMessage = `*📢 PENGINGAT IURAN KAS BPH HIMA ILKOM 2024/2025*
_Periode: Mei 2025_

Halo rekan-rekan pengurus! 👋
Terima kasih kepada 28 anggota yang telah melunasi iuran tepat waktu (Tingkat Kepatuhan: 70%).

Mengingatkan sisa *3 hari* batas akhir pembayaran iuran kas bulan Mei bagi rekan yang belum:
${unpaidNames}

💳 *Rekening Pembayaran:*
• Bank Mandiri: *137-00-98721-1*
• a.n: HIMA ILKOM (Kas Utama)
• QRIS KasKampus: Tersedia di m-banking / e-wallet

Setelah transfer, mohon kirim bukti struk ke Bendahara Umum (Citra Dewi) untuk divalidasi ke sistem Buku Kas.

Terima kasih atas kerja sama dan transparansinya! 🙌
_Salam integritas, Bendahara Umum HIMA ILKOM_`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(broadcastMessage);
    setCopied(true);
    showToast('Pesan siaran WhatsApp disalin ke clipboard!', 'content_copy', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(broadcastMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#eaedff]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948] text-[22px]">
              mark_chat_unread
            </span>
            <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Siaran Pengingat WhatsApp
            </span>
          </div>
          <button
            onClick={() => setIsBroadcastModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6d7a72] hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-3">
          <div className="bg-[#85f8c4]/20 p-3 rounded-xl flex items-center gap-2 border border-[#85f8c4]/40">
            <span className="material-symbols-outlined text-[#006948] text-[20px]">
              group
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#006948]">
                Target: Grup WhatsApp BPH Kas Kampus
              </span>
              <span className="text-[11px] text-[#3d4a42]">
                Total {unpaidMembers.length} anggota dengan tunggakan aktif
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#131b2e]">
              Draf Pesan Pengingat Otomatis
            </label>
            <textarea
              readOnly
              rows={11}
              value={broadcastMessage}
              className="w-full bg-[#faf8ff] p-3 rounded-xl font-mono text-[11px] text-[#131b2e] border border-[#eaedff] focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f2f3ff] border-t border-[#eaedff] grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="h-11 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] font-label-md text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#eaedff] cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="h-11 rounded-xl bg-[#006948] text-white font-label-md text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#00855d] cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Buka WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
