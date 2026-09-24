import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_LPJ } from '../data/mockData';
import { formatRupiah } from '../utils/formatters';
import { generateOfficialLpjPdf, downloadLpjPdfFile } from '../utils/pdfGenerator';

export const LpjPdfModal: React.FC = () => {
  const {
    isLpjPdfModalOpen,
    setIsLpjPdfModalOpen,
    transactions,
    members,
    showToast,
  } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('Semester Ganjil 2024/2025');
  const [includeTransactions, setIncludeTransactions] = useState<boolean>(true);
  const [includeMemberDues, setIncludeMemberDues] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isLpjPdfModalOpen) return null;

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      downloadLpjPdfFile(MOCK_LPJ, transactions, members, {
        periodName: selectedPeriod,
        includeTransactions,
        includeMemberDues,
      });
      showToast('Dokumen PDF LPJ Resmi berhasil diunduh ke perangkat!', 'check_circle', 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Gagal memproses file PDF. Coba kembali.', 'error', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewInNewTab = () => {
    try {
      const doc = generateOfficialLpjPdf(MOCK_LPJ, transactions, members, {
        periodName: selectedPeriod,
        includeTransactions,
        includeMemberDues,
      });
      const blobUrl = doc.output('bloburl');
      window.open(blobUrl, '_blank');
      showToast('Membuka pratinjau PDF di tab baru...', 'visibility', 'info');
    } catch (err) {
      console.error('Error previewing PDF:', err);
      showToast('Gagal membuka pratinjau. Silakan unduh langsung.', 'error', 'error');
    }
  };

  const handleShareToWhatsApp = () => {
    const text = encodeURIComponent(
      `*LAPORAN PERTANGGUNGJAWABAN (LPJ) KEUANGAN RESMI*\n` +
      `*Himpunan Mahasiswa Ilmu Komputer (HIMA ILKOM)*\n\n` +
      `📄 *No. Dokumen:* LPJ-KEU/HIMA-ILKOM/V/2025/082\n` +
      `📅 *Periode:* ${selectedPeriod}\n` +
      `🛡️ *Status Audit:* DISAHKAN & DIVERIFIKASI PENUH\n\n` +
      `📊 *Ringkasan Neraca Saldo:*\n` +
      `• Total Pemasukan: ${formatRupiah(MOCK_LPJ.totalInflow)}\n` +
      `• Total Pengeluaran: ${formatRupiah(MOCK_LPJ.totalOutflow)}\n` +
      `• Sisa Saldo Kas: ${formatRupiah(MOCK_LPJ.verifiedBalance)}\n` +
      `• Kepatuhan Iuran: 70% (28/40 Anggota Lunas)\n\n` +
      `🔐 *Hash SHA-256:* ${MOCK_LPJ.verificationHash.slice(0, 24)}...\n` +
      `👤 *Disahkan oleh:* Bendahara Umum, Ketum HIMA, & Dosen Pembina.\n\n` +
      `_Laporan lengkap format PDF telah dirilis oleh BPH Keuangan untuk seluruh anggota._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    showToast('Teks pengumuman LPJ disiapkan untuk WhatsApp Grup!', 'share', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#131b2e]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#eaedff] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lpj-modal-title"
      >
        {/* Header Modal */}
        <div className="px-5 pt-4 pb-3.5 border-b border-[#eaedff] flex items-center justify-between bg-gradient-to-r from-[#f2f3ff] via-white to-[#006948]/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#da3437]/10 flex items-center justify-center text-[#da3437] shrink-0 border border-[#da3437]/20">
              <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
            </div>
            <div>
              <h2 id="lpj-modal-title" className="font-headline-sm text-[16px] font-bold text-[#131b2e] leading-tight">
                Unduh LPJ Keuangan Resmi
              </h2>
              <p className="font-label-sm text-[11px] text-[#3d4a42]">
                Format Dokumen PDF Standar Organisasi Mahasiswa
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsLpjPdfModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#e2e7ff]/70 hover:bg-[#d5dcfa] text-[#283044] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-[#131b2e]">
          {/* Certificate / Verification Banner */}
          <div className="bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] border border-[#a5d6a7] p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#006948] text-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[12px] font-bold text-[#006948]">
                  LPJ Tervalidasi &amp; Sah
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-mono text-[#006948] font-semibold border border-[#006948]/20">
                  SHA-256 OK
                </span>
              </div>
              <p className="font-body-sm text-[11px] text-[#2e5b3b] mt-0.5 leading-relaxed">
                Dokumen dilengkapi Kop Surat Resmi, Neraca Saldo, Tabel Realisasi Proker, Rekap Iuran, serta tanda tangan digital 3 pihak.
              </p>
            </div>
          </div>

          {/* Document Preview Snapshot Card */}
          <div className="border border-[#eaedff] rounded-xl p-3.5 bg-[#faf8ff] space-y-3">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-2">
              <span className="font-label-sm text-[11px] text-[#3d4a42] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#006948]">
                  menu_book
                </span>
                Pratinjau Lembar Neraca LPJ
              </span>
              <span className="text-[10px] text-[#556070] font-mono">
                No: LPJ-KEU/V/2025/082
              </span>
            </div>

            {/* Financial Totals Miniature */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-[#eaedff] shadow-2xs">
                <span className="block text-[10px] text-[#006948] font-bold uppercase">Pemasukan</span>
                <span className="font-bold text-[12px] text-[#006948] mt-0.5 block">
                  {formatRupiah(MOCK_LPJ.totalInflow)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#eaedff] shadow-2xs">
                <span className="block text-[10px] text-[#b61722] font-bold uppercase">Pengeluaran</span>
                <span className="font-bold text-[12px] text-[#b61722] mt-0.5 block">
                  {formatRupiah(MOCK_LPJ.totalOutflow)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#eaedff] shadow-2xs">
                <span className="block text-[10px] text-[#131b2e] font-bold uppercase">Sisa Saldo</span>
                <span className="font-bold text-[12px] text-[#006948] mt-0.5 block">
                  {formatRupiah(MOCK_LPJ.verifiedBalance)}
                </span>
              </div>
            </div>

            {/* Signatories Miniature */}
            <div className="bg-white p-2.5 rounded-lg border border-[#eaedff] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#006948]">draw</span>
                <span className="text-[#3d4a42]">Pengesahan 3 Pihak:</span>
              </div>
              <span className="font-semibold text-[#131b2e]">
                Citra D. • Rendra P. • Prof. Wahyudi
              </span>
            </div>
          </div>

          {/* Export Configurations */}
          <div className="space-y-3 pt-1">
            <span className="font-label-sm text-[12px] text-[#131b2e] font-bold block">
              Pilihan Konfigurasi Ekspor Dokumen
            </span>

            {/* Period Selector */}
            <div>
              <label className="font-label-sm text-[11px] text-[#3d4a42] block mb-1">
                Pilih Periode LPJ
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full bg-[#f2f3ff] border border-[#eaedff] rounded-xl px-3 py-2 text-xs font-medium text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006948]"
              >
                <option value="Semester Ganjil 2024/2025">Semester Ganjil 2024/2025 (Resmi)</option>
                <option value="Bulan Mei 2025">Bulan Mei 2025 (Bulanan)</option>
                <option value="Tahun Anggaran 2024-2025">Tahun Anggaran Penuh 2024/2025</option>
              </select>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff] cursor-pointer hover:bg-[#eaedff]/60 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#006948]">
                    table_rows
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-[12px] font-semibold text-[#131b2e]">
                      Sertakan Mutasi Buku Kas Utama
                    </span>
                    <span className="text-[10px] text-[#3d4a42]">
                      Daftar rincian 12 transaksi terbaru &amp; bukti transaksi
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeTransactions}
                  onChange={(e) => setIncludeTransactions(e.target.checked)}
                  className="w-4 h-4 text-[#006948] rounded border-gray-300 focus:ring-[#006948] accent-[#006948]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff] cursor-pointer hover:bg-[#eaedff]/60 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#006948]">
                    group
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-[12px] font-semibold text-[#131b2e]">
                      Sertakan Rekap Kepatuhan Iuran Divisi
                    </span>
                    <span className="text-[10px] text-[#3d4a42]">
                      Statistik lunas/tunggakan per departemen himpunan
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeMemberDues}
                  onChange={(e) => setIncludeMemberDues(e.target.checked)}
                  className="w-4 h-4 text-[#006948] rounded border-gray-300 focus:ring-[#006948] accent-[#006948]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-[#eaedff] bg-white space-y-2">
          {/* Main Download Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="w-full h-12 bg-[#da3437] hover:bg-[#b61722] text-white font-label-md text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-70"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isGenerating ? 'refresh' : 'download'}
            </span>
            <span>
              {isGenerating ? 'Membuat File PDF...' : 'Unduh File PDF Resmi Sekarang'}
            </span>
          </button>

          {/* Secondary Options Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePreviewInNewTab}
              className="h-10 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#283044] font-label-md text-[12px] font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>Buka Pratinjau</span>
            </button>
            <button
              type="button"
              onClick={handleShareToWhatsApp}
              className="h-10 bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#075e54] font-label-md text-[12px] font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Kirim ke WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
