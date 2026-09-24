import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';

export const TagihModal: React.FC = () => {
  const {
    whatsappModalMember,
    setWhatsappModalMember,
    markMemberPaid,
    showToast,
  } = useApp();

  const [copied, setCopied] = useState(false);

  if (!whatsappModalMember) return null;

  const personalMessage = `Halo Kak ${whatsappModalMember.name} (${whatsappModalMember.department})! 👋

Mengingatkan iuran kas wajib BPH Kas Kampus untuk ${whatsappModalMember.monthsDue || 'bulan Mei 2025'} sebesar *${formatRupiah(whatsappModalMember.dueAmount)}*.

Pembayaran dapat ditransfer ke:
🏦 Bank Mandiri: *137-00-98721-1*
a.n HIMA ILKOM (Kas Utama)

Setelah transfer, mohon kirim bukti struk ya kak agar langsung divalidasi ke Buku Kas Digital. Terima kasih! 🙏
_Citra Dewi - Bendahara Umum_`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(personalMessage);
    setCopied(true);
    showToast('Pesan tagihan disalin!', 'content_copy', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const phone = whatsappModalMember.phone || '6281234567890';
    const encoded = encodeURIComponent(personalMessage);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank');
  };

  const handleMarkPaid = () => {
    markMemberPaid(whatsappModalMember.id);
    setWhatsappModalMember(null);
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
            <span className="material-symbols-outlined text-[#da3437] text-[22px]">
              outgoing_mail
            </span>
            <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Tagih Iuran Kas Anggota
            </span>
          </div>
          <button
            onClick={() => setWhatsappModalMember(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6d7a72] hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3.5">
          {/* Member Summary Card */}
          <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center font-bold text-sm">
                {whatsappModalMember.initials}
              </div>
              <div>
                <h4 className="font-semibold text-[14px] text-[#131b2e]">
                  {whatsappModalMember.name}
                </h4>
                <p className="text-xs text-[#3d4a42]">
                  {whatsappModalMember.department} • {whatsappModalMember.role}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#b61722] block">
                {formatRupiah(whatsappModalMember.dueAmount)}
              </span>
              <span className="text-[10px] text-[#3d4a42]">
                {whatsappModalMember.monthsDue || 'Belum Lunas'}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#131b2e]">
              Draf Pesan WhatsApp Pribadi
            </label>
            <textarea
              readOnly
              rows={7}
              value={personalMessage}
              className="w-full bg-[#faf8ff] p-3 rounded-xl font-mono text-[11px] text-[#131b2e] border border-[#eaedff] focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#f2f3ff] border-t border-[#eaedff] flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="h-10 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] font-label-md text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#eaedff] cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Tersalin' : 'Salin Pesan'}</span>
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="h-10 rounded-xl bg-[#006948] text-white font-label-md text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#00855d] cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Kirim ke WA</span>
            </button>
          </div>

          <button
            onClick={handleMarkPaid}
            className="w-full h-10 rounded-xl bg-[#85f8c4] text-[#002114] font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#68dba9] cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Konfirmasi Telah Lunas &amp; Catat di Kas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
