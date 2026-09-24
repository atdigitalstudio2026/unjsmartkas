import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';

export const ProkerDetailModal: React.FC = () => {
  const { selectedProker, setSelectedProker } = useApp();

  if (!selectedProker) return null;

  const efficiency = Math.round(
    ((selectedProker.budget - selectedProker.realized) / selectedProker.budget) * 100
  );
  const isSurplus = selectedProker.budget >= selectedProker.realized;
  const difference = Math.abs(selectedProker.budget - selectedProker.realized);

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
              assignment_turned_in
            </span>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Audit Program Kerja (LPJ)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setSelectedProker(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6d7a72] hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#006948] font-bold">
                Program Kerja Tervalidasi
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-[11px] font-semibold">
                {selectedProker.status}
              </span>
            </div>
            <h2 className="font-headline-sm text-[18px] text-[#131b2e] font-bold mt-1">
              {selectedProker.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#3d4a42] mt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                {selectedProker.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Audit Sah DPO
              </span>
            </div>
          </div>

          {/* Metric Comparison Card */}
          <div className="bg-[#faf8ff] rounded-xl p-3.5 border border-[#eaedff] space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-label-sm text-[11px] text-[#3d4a42]">Pagu Anggaran Disetujui</span>
                <p className="font-label-lg text-[15px] font-bold text-[#131b2e] mt-0.5">
                  {formatRupiah(selectedProker.budget)}
                </p>
              </div>
              <div>
                <span className="font-label-sm text-[11px] text-[#3d4a42]">Realisasi Aktual SPJ</span>
                <p className="font-label-lg text-[15px] font-bold text-[#006948] mt-0.5">
                  {formatRupiah(selectedProker.realized)}
                </p>
              </div>
            </div>

            {/* Difference / Efficiency Progress */}
            <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006948]">
                  savings
                </span>
                <span className="font-label-md text-[12px] text-[#131b2e]">
                  {isSurplus ? 'Sisa / Efisiensi Anggaran:' : 'Defisit Anggaran:'}
                </span>
              </div>
              <span
                className={`font-label-md text-[12px] font-bold ${
                  isSurplus ? 'text-[#006948]' : 'text-[#ba1a1a]'
                }`}
              >
                {isSurplus ? `+${formatRupiah(difference)} (${efficiency}%)` : `-${formatRupiah(difference)}`}
              </span>
            </div>
          </div>

          {/* Pos Biaya Realisasi */}
          <div className="space-y-2">
            <span className="font-label-md text-[12px] font-semibold text-[#131b2e]">
              Rincian Alokasi Belanja &amp; Nota
            </span>
            <div className="bg-white rounded-xl border border-[#eaedff] divide-y divide-[#f2f3ff] text-xs">
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-[#3d4a42]">Sewa Tempat &amp; Sound System</span>
                <span className="font-semibold text-[#131b2e]">
                  {formatRupiah(Math.round(selectedProker.realized * 0.4))}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-[#3d4a42]">Konsumsi &amp; Air Mineral Peserta</span>
                <span className="font-semibold text-[#131b2e]">
                  {formatRupiah(Math.round(selectedProker.realized * 0.35))}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-[#3d4a42]">Honor Pemateri / Pembicara</span>
                <span className="font-semibold text-[#131b2e]">
                  {formatRupiah(Math.round(selectedProker.realized * 0.15))}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-[#3d4a42]">ATK, Cetak Banner &amp; Sertifikat</span>
                <span className="font-semibold text-[#131b2e]">
                  {formatRupiah(Math.round(selectedProker.realized * 0.1))}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="bg-[#85f8c4]/15 rounded-xl p-3 border border-[#85f8c4]/40 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#006948] text-[20px] shrink-0 mt-0.5">
              verified_user
            </span>
            <div className="flex flex-col text-xs">
              <span className="font-semibold text-[#006948]">
                Laporan Telah Ditandatangani 3 Pihak
              </span>
              <span className="text-[#3d4a42] text-[11px] mt-0.5 leading-relaxed">
                Berkas fisik kwitansi, nota kontan, dan daftar presensi disimpan di Arsip Sekretariat HIMA ILKOM.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f2f3ff] border-t border-[#eaedff] flex justify-end">
          <button
            type="button"
            onClick={() => setSelectedProker(null)}
            className="px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
