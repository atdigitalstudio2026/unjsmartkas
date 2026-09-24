import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatSignedRupiah, formatRupiah } from '../utils/formatters';

export const TransactionDetailModal: React.FC = () => {
  const {
    selectedTransaction,
    setSelectedTransaction,
    updateTransaction,
    deleteTransaction,
    setLightboxImage,
    showToast,
  } = useApp();

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!selectedTransaction) return null;

  const isInflow = selectedTransaction.type === 'inflow';

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `KasKampus: ${selectedTransaction.title}`,
          text: `Bukti Transaksi ${selectedTransaction.title} sebesar ${formatSignedRupiah(
            selectedTransaction.amount,
            selectedTransaction.type
          )} telah tercatat di Buku Kas Kampus. Ref: ${selectedTransaction.referenceNumber}`,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `KasKampus: ${selectedTransaction.title} (${formatSignedRupiah(
          selectedTransaction.amount,
          selectedTransaction.type
        )}) - Ref: ${selectedTransaction.referenceNumber}`
      );
      showToast('Tautan ringkasan transaksi disalin!', 'share', 'info');
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(selectedTransaction.referenceNumber);
    showToast(`No. Ref ${selectedTransaction.referenceNumber} disalin ke clipboard!`, 'content_copy', 'success');
  };

  const handleToggleVerification = () => {
    const updated = {
      ...selectedTransaction,
      verified: !selectedTransaction.verified,
      statusText: !selectedTransaction.verified ? 'Terverifikasi Digital' : 'Menunggu Review',
    };
    updateTransaction(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#eaedff] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948] text-[22px]">
              receipt_long
            </span>
            <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Rincian Transaksi
            </span>
          </div>
          <button
            onClick={() => setSelectedTransaction(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6d7a72] hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-[#131b2e]">
          {/* Top Amount Banner */}
          <div className="text-center py-2.5 bg-[#faf8ff] rounded-xl border border-[#eaedff]">
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold mb-1 ${
                isInflow
                  ? 'bg-[#85f8c4] text-[#002114]'
                  : 'bg-[#ffdad6] text-[#ba1a1a]'
              }`}
            >
              {isInflow ? 'Pemasukan Kas' : 'Pengeluaran Kas'}
            </span>
            <h3
              className={`font-currency-display text-[26px] font-bold ${
                isInflow ? 'text-[#006948]' : 'text-[#ba1a1a]'
              }`}
            >
              {formatSignedRupiah(selectedTransaction.amount, selectedTransaction.type)}
            </h3>
            <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-[#3d4a42]">
              <span className="font-mono font-medium">{selectedTransaction.referenceNumber}</span>
              <button
                type="button"
                onClick={handleCopyRef}
                title="Salin Nomor Referensi"
                className="text-[#006948] hover:text-[#00855d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
              </button>
              <span>•</span>
              <span>{selectedTransaction.dateString}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs bg-white rounded-xl p-3 border border-[#eaedff]">
            <div className="flex justify-between py-1 border-b border-[#f2f3ff]">
              <span className="text-[#3d4a42]">Judul Transaksi</span>
              <span className="font-semibold text-right text-[#131b2e] max-w-[60%]">
                {selectedTransaction.title}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#f2f3ff]">
              <span className="text-[#3d4a42]">Kategori / Pos</span>
              <span className="font-semibold text-right text-[#131b2e]">
                {selectedTransaction.category}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#f2f3ff]">
              <span className="text-[#3d4a42]">Metode Pembayaran</span>
              <span className="font-semibold text-right text-[#131b2e]">
                {selectedTransaction.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#f2f3ff]">
              <span className="text-[#3d4a42]">Pihak Terkait</span>
              <span className="font-semibold text-right text-[#131b2e]">
                {selectedTransaction.relatedPerson}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#f2f3ff]">
              <span className="text-[#3d4a42]">Waktu Tercatat</span>
              <span className="font-semibold text-right text-[#131b2e]">
                {selectedTransaction.timeString}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#3d4a42]">Status Audit</span>
              <button
                type="button"
                onClick={handleToggleVerification}
                title="Klik untuk ubah status verifikasi"
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedTransaction.verified
                    ? 'bg-[#85f8c4] text-[#002114]'
                    : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {selectedTransaction.verified ? 'verified' : 'pending'}
                </span>
                <span>{selectedTransaction.statusText || (selectedTransaction.verified ? 'Terverifikasi Digital' : 'Menunggu Review')}</span>
              </button>
            </div>
          </div>

          {/* Catatan / Keterangan */}
          {selectedTransaction.notes && (
            <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#eaedff]">
              <span className="font-label-sm text-[10px] text-[#3d4a42] uppercase font-bold tracking-wider">
                Catatan / Keterangan
              </span>
              <p className="text-xs text-[#131b2e] mt-1 leading-relaxed">
                {selectedTransaction.notes}
              </p>
            </div>
          )}

          {/* Struk Bukti Lampiran */}
          {selectedTransaction.receiptImage ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] text-[#3d4a42] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#006948]">
                    image
                  </span>
                  Bukti Struk Pembayaran
                </span>
                <span className="text-[10px] text-[#006948] font-medium">Klik gambar untuk perbesar</span>
              </div>
              <div
                onClick={() =>
                  setLightboxImage({
                    url: selectedTransaction.receiptImage!,
                    title: selectedTransaction.title,
                  })
                }
                className="rounded-xl overflow-hidden border border-[#eaedff] bg-black/5 relative group max-h-48 cursor-pointer"
              >
                <img
                  src={selectedTransaction.receiptImage}
                  alt={selectedTransaction.receiptName || 'Bukti Struk'}
                  className="w-full h-full object-cover max-h-48 group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    Lihat Ukuran Penuh
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-[#3d4a42]">
                {selectedTransaction.receiptName} • {selectedTransaction.receiptSize}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-[#f2f3ff] rounded-xl text-center text-xs text-[#3d4a42]">
              E-Receipt Digital tercatat tanpa lampiran file foto fisik.
            </div>
          )}

          {/* Digital Signature Audit Hash */}
          <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#4b41e1]">
              lock
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[10px] text-[#4b41e1] font-bold">
                Ledger Abadi Divisi (SHA-256)
              </span>
              <span className="font-mono text-[9px] text-[#3d4a42] truncate">
                hash_b4c6f233_202505_{selectedTransaction.id}_ok
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#f2f3ff] border-t border-[#eaedff]">
          {isConfirmingDelete ? (
            <div className="flex items-center justify-between gap-2 p-1">
              <span className="text-xs text-[#ba1a1a] font-semibold">
                Yakin hapus transaksi ini?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-3 py-1.5 rounded-lg bg-white text-[#3d4a42] text-xs font-semibold border border-[#eaedff] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => deleteTransaction(selectedTransaction.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#ba1a1a] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="h-10 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] font-label-md text-[12px] font-semibold flex items-center justify-center gap-1 hover:bg-[#eaedff] cursor-pointer active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                Bagikan
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="h-10 rounded-xl bg-[#006948] text-white font-label-md text-[12px] font-semibold flex items-center justify-center gap-1 hover:bg-[#00855d] cursor-pointer active:scale-95 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Cetak
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] font-label-md text-[12px] font-semibold flex items-center justify-center gap-1 hover:bg-[#ffb3ad] cursor-pointer active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

