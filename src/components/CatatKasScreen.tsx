import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';
import { formatRupiah } from '../utils/formatters';

export const CatatKasScreen: React.FC = () => {
  const {
    catatKasInitialType,
    setCurrentScreen,
    addTransaction,
    totalSaldo,
    showToast,
  } = useApp();

  const [txType, setTxType] = useState<TransactionType>(catatKasInitialType);
  const [rawAmount, setRawAmount] = useState('150000');
  const [category, setCategory] = useState('Uang Kas Wajib Mahasiswa');
  const [txDate, setTxDate] = useState('Jumat, 16 Mei 2025');
  const [txTime, setTxTime] = useState('14:30 WIB');
  const [paymentMethod, setPaymentMethod] = useState<'Kas Tunai' | 'Bank Mandiri' | 'QRIS Kas'>('Kas Tunai');
  const [relatedPerson, setRelatedPerson] = useState('Rifqi Ahmad - Anggota Kominfo');
  const [notes, setNotes] = useState('Iuran kas wajib bulan Mei 2025 (Pelunasan termin 1)');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  // Receipt image attachment state
  const defaultReceipt =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjEieRa_CnTpKewHgB-uNzCf0BXPwRnOrvwwQOASy3puc534aHid3tC0Wub4y_3ZFXVtguTAja2Z9Au8-0eknFCu_tH6hWhuG-DJJMurlpQi0aBx7g4zWJsg2p2Jaa50VbYcZ_MkM9B0hnn6jxeTpy0BfTjLkfAn2IlqBTQnd53wHxMs_Nj1UTLBGmFJlmY-fE4MIfexygsCwYOekRxH19o6BV5GmNhH5gXnj5gatXoeyn9QnHDsfF';

  const [receiptFile, setReceiptFile] = useState<{
    name: string;
    size: string;
    url: string;
  } | null>({
    name: 'TRF_BCA_20250516_9942.jpg',
    size: '248 KB',
    url: defaultReceipt,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { label: 'Uang Kas Wajib Mahasiswa', icon: 'group' },
    { label: 'Dana Kegiatan / Proker', icon: 'event_note' },
    { label: 'Sponsorship & Donasi', icon: 'volunteer_activism' },
    { label: 'Konsumsi & Logistik', icon: 'restaurant' },
    { label: 'Lain-lain', icon: 'more_horiz' },
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setRawAmount(val);
  };

  const formattedDisplayAmount = rawAmount
    ? Number(rawAmount).toLocaleString('id-ID')
    : '0';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const sizeInKb = Math.round(file.size / 1024);
      setReceiptFile({
        name: file.name,
        size: `${sizeInKb} KB`,
        url: url,
      });
      showToast(`Bukti ${file.name} berhasil dilampirkan!`, 'attach_file', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(rawAmount) || 0;
    if (numericAmount <= 0) {
      showToast('Mohon masukkan nominal transaksi yang valid', 'error', 'error');
      return;
    }

    const newTx = {
      type: txType,
      title: notes.trim()
        ? notes.split('(')[0].trim()
        : `${txType === 'inflow' ? 'Pemasukan' : 'Pengeluaran'} ${category}`,
      amount: numericAmount,
      category,
      dateString: txDate,
      dateGroup: 'Hari Ini',
      timeString: txTime,
      paymentMethod,
      relatedPerson: relatedPerson || 'Anggota HIMA',
      nim: relatedPerson.includes('Kominfo') ? '220101032' : undefined,
      subDescription: `${relatedPerson} • ${paymentMethod}`,
      verified: true,
      statusText: txType === 'inflow' ? 'Terverifikasi' : 'Disetujui Bendum',
      referenceNumber: `Ref #KAS-${Math.floor(5800 + Math.random() * 200)}`,
      notes,
      receiptName: receiptFile?.name,
      receiptSize: receiptFile?.size,
      receiptImage: receiptFile?.url,
    };

    addTransaction(newTx);

    if (sendWhatsApp) {
      setTimeout(() => {
        showToast('Notifikasi otomatis diteruskan ke WhatsApp Grup BPH Kas!', 'send', 'info');
      }, 700);
    }

    setCurrentScreen('buku-kas');
  };

  return (
    <main className="flex-1 w-full bg-[#faf8ff] pt-16 pb-safe">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,.pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      <form onSubmit={handleSubmit} className="flex flex-col w-full px-4 max-w-md mx-auto pb-12 gap-5 pt-3">
        {/* Title & Context Intro */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex items-center gap-1.5 text-[#006948] font-label-md text-[12px] font-semibold">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Buku Kas Terdesentralisasi</span>
          </div>
          <h2 className="font-headline-md text-[22px] text-[#131b2e] font-bold">
            Catat Aliran Kas
          </h2>
          <p className="font-body-md text-[14px] text-[#3d4a42]">
            Dokumentasikan transaksi dengan bukti transparan secara instan.
          </p>
        </div>

        {/* Type Switcher (Pemasukan vs Pengeluaran) */}
        <div className="p-1 bg-[#eaedff] rounded-xl flex items-center justify-between shadow-xs">
          <button
            type="button"
            onClick={() => setTxType('inflow')}
            className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all font-label-lg text-[14px] cursor-pointer ${
              txType === 'inflow'
                ? 'bg-[#006948] text-white shadow-sm font-semibold'
                : 'text-[#3d4a42] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_downward_alt</span>
            <span>Pemasukan (+)</span>
          </button>
          <button
            type="button"
            onClick={() => setTxType('outflow')}
            className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all font-label-lg text-[14px] cursor-pointer ${
              txType === 'outflow'
                ? 'bg-[#b61722] text-white shadow-sm font-semibold'
                : 'text-[#3d4a42] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward_alt</span>
            <span>Pengeluaran (-)</span>
          </button>
        </div>

        {/* Big Hero Nominal Input Card */}
        <div className="bg-[#f2f3ff] p-4 rounded-2xl flex flex-col gap-1 shadow-xs border border-[#eaedff] transition-colors duration-200">
          <div className="flex items-center justify-between">
            <label
              htmlFor="nominal-input"
              className="font-label-md text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold"
            >
              Nominal Transaksi
            </label>
            <span
              className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${
                txType === 'inflow'
                  ? 'bg-[#00855d] text-white'
                  : 'bg-[#da3437] text-white'
              }`}
            >
              {txType === 'inflow' ? 'Kas Masuk' : 'Kas Keluar'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-md text-[22px] font-bold text-[#3d4a42]">
              Rp
            </span>
            <input
              id="nominal-input"
              type="text"
              inputMode="numeric"
              value={formattedDisplayAmount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full bg-transparent font-currency-display text-[28px] text-[#131b2e] focus:outline-none placeholder-[#6d7a72] font-bold tracking-tight"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[#006948] font-body-sm text-[12px] pt-1">
            <span className="material-symbols-outlined text-[16px]">
              account_balance_wallet
            </span>
            <span>
              Saldo kas aktif tersisa: <strong className="font-semibold">{formatRupiah(totalSaldo)}</strong>
            </span>
          </div>

          {/* Quick Denomination Chips */}
          <div className="flex items-center gap-1.5 pt-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            <button
              type="button"
              onClick={() => setRawAmount('50000')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#eaedff] text-[#006948] text-[11px] font-semibold border border-[#eaedff] shrink-0 cursor-pointer shadow-xs"
            >
              +50rb (Iuran)
            </button>
            <button
              type="button"
              onClick={() => setRawAmount('100000')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#eaedff] text-[#006948] text-[11px] font-semibold border border-[#eaedff] shrink-0 cursor-pointer shadow-xs"
            >
              +100rb
            </button>
            <button
              type="button"
              onClick={() => setRawAmount('250000')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#eaedff] text-[#006948] text-[11px] font-semibold border border-[#eaedff] shrink-0 cursor-pointer shadow-xs"
            >
              +250rb
            </button>
            <button
              type="button"
              onClick={() => setRawAmount('500000')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#eaedff] text-[#006948] text-[11px] font-semibold border border-[#eaedff] shrink-0 cursor-pointer shadow-xs"
            >
              +500rb
            </button>
            <button
              type="button"
              onClick={() => setRawAmount('')}
              className="px-2 py-1 rounded-lg bg-white hover:bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-semibold border border-[#eaedff] shrink-0 cursor-pointer shadow-xs"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Kategori / Pos Anggaran */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-label-lg text-[14px] text-[#131b2e] font-semibold">
              Pos Anggaran / Kategori
            </label>
            <span className="font-body-sm text-[12px] text-[#3d4a42]">Wajib dipilih</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = category === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  className={`px-3 py-2 rounded-xl text-left flex items-center gap-2 font-label-md text-[12px] shadow-xs transition-transform active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#006948] text-white shadow-sm font-semibold'
                      : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#e2e7ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tanggal & Waktu Transaksi */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#f2f3ff] p-3 rounded-xl flex flex-col gap-1 shadow-xs border border-[#eaedff]">
            <span className="font-label-sm text-[11px] text-[#3d4a42] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              Tanggal Transaksi
            </span>
            <input
              type="text"
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              className="bg-transparent font-label-md text-[13px] text-[#131b2e] font-semibold focus:outline-none"
            />
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-xl flex flex-col gap-1 shadow-xs border border-[#eaedff]">
            <span className="font-label-sm text-[11px] text-[#3d4a42] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Waktu
            </span>
            <input
              type="text"
              value={txTime}
              onChange={(e) => setTxTime(e.target.value)}
              className="bg-transparent font-label-md text-[13px] text-[#131b2e] font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Metode Transaksi & Sumber Kas */}
        <div className="flex flex-col gap-2">
          <label className="font-label-lg text-[14px] text-[#131b2e] font-semibold">
            Metode Transaksi &amp; Sumber Kas
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Kas Tunai', label: 'Kas Tunai', icon: 'payments' },
              { id: 'Bank Mandiri', label: 'Bank Mandiri', icon: 'account_balance' },
              { id: 'QRIS Kas', label: 'QRIS Kas', icon: 'qr_code_scanner' },
            ].map((m) => {
              const isActive = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl shadow-xs gap-1.5 text-center cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#e2e7ff] text-[#131b2e] border-2 border-[#006948]'
                      : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      isActive ? 'text-[#006948]' : 'text-[#3d4a42]'
                    }`}
                  >
                    {m.icon}
                  </span>
                  <span className="font-label-sm text-[11px] font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pihak Terkait (Anggota / Vendor) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="target-person"
            className="font-label-lg text-[14px] text-[#131b2e] font-semibold"
          >
            Pihak Terkait (Anggota / Vendor)
          </label>
          <div className="flex items-center gap-2 bg-[#f2f3ff] px-3 py-2.5 rounded-xl shadow-xs border border-[#eaedff]">
            <span className="material-symbols-outlined text-[#6d7a72] text-[20px]">
              person
            </span>
            <input
              id="target-person"
              type="text"
              value={relatedPerson}
              onChange={(e) => setRelatedPerson(e.target.value)}
              placeholder="Nama Pembayar / Penerima Dana"
              className="w-full bg-transparent font-body-md text-[13px] text-[#131b2e] focus:outline-none"
            />
            <span className="px-2.5 py-0.5 rounded-full bg-[#e2dfff] text-[#0f0069] font-label-sm text-[10px] font-semibold shrink-0">
              NIM Terdaftar
            </span>
          </div>
        </div>

        {/* Catatan / Keterangan */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tx-notes"
            className="font-label-lg text-[14px] text-[#131b2e] font-semibold"
          >
            Catatan / Keterangan
          </label>
          <textarea
            id="tx-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Iuran kas wajib bulan Mei 2025"
            className="w-full bg-[#f2f3ff] p-3 rounded-xl font-body-md text-[13px] text-[#131b2e] placeholder:text-[#6d7a72] focus:outline-none shadow-xs resize-none border border-[#eaedff]"
          ></textarea>
        </div>

        {/* Area Unggah Bukti Struk / Transfer */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-label-lg text-[14px] text-[#131b2e] font-semibold">
              Bukti Pembayaran / Struk Nota
            </label>
            <span className="font-label-sm text-[11px] text-[#006948] font-medium flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Tervalidasi Digital
            </span>
          </div>

          {/* Upload Dropper & Preview Container */}
          <div className="bg-[#f2f3ff] rounded-2xl p-4 flex flex-col gap-3 shadow-xs border border-[#eaedff]">
            {receiptFile ? (
              <div className="flex items-center justify-between gap-3">
                {/* Thumbnail Preview */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#dae2fd] flex-shrink-0 shadow-inner">
                  <img
                    src={receiptFile.url}
                    alt="Struk Transfer"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#006948]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[20px]">
                      task_alt
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-[13px] text-[#131b2e] truncate font-semibold">
                    {receiptFile.name}
                  </p>
                  <p className="font-body-sm text-[11px] text-[#3d4a42]">
                    {receiptFile.size} • Berhasil dilampirkan
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Hapus bukti"
                  onClick={() => setReceiptFile(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#6d7a72] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-[#bccac0] rounded-xl text-center">
                <span className="text-xs text-[#3d4a42]">
                  Belum ada bukti yang dilampirkan
                </span>
              </div>
            )}

            {/* Action Buttons for Upload */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="py-2.5 px-3 rounded-xl bg-[#eaedff] flex items-center justify-center gap-1.5 text-[#131b2e] font-label-md text-[12px] active:scale-95 transition-all cursor-pointer hover:bg-[#e2e7ff]"
              >
                <span className="material-symbols-outlined text-[#006948] text-[18px]">
                  photo_camera
                </span>
                <span>Buka Kamera</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-xl bg-[#eaedff] flex items-center justify-center gap-1.5 text-[#131b2e] font-label-md text-[12px] active:scale-95 transition-all cursor-pointer hover:bg-[#e2e7ff]"
              >
                <span className="material-symbols-outlined text-[#4b41e1] text-[18px]">
                  attach_file
                </span>
                <span>Ganti File</span>
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp Notification Switcher */}
        <label className="flex items-start gap-3 p-3 rounded-xl bg-[#f2f3ff] shadow-xs cursor-pointer select-none border border-[#eaedff]">
          <div className="relative flex items-center pt-0.5">
            <input
              type="checkbox"
              checked={sendWhatsApp}
              onChange={(e) => setSendWhatsApp(e.target.checked)}
              className="w-5 h-5 rounded accent-[#006948] cursor-pointer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-[13px] text-[#131b2e] font-semibold">
              Notifikasi Otomatis WhatsApp
            </span>
            <span className="font-body-sm text-[11px] text-[#3d4a42]">
              Kirimkan rekap kilat dan tautan bukti ke grup WhatsApp BPH Kas Kampus.
            </span>
          </div>
        </label>

        {/* Action CTA */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="submit"
            className={`w-full h-12 rounded-xl text-white font-label-lg text-[14px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer ${
              txType === 'inflow'
                ? 'bg-[#006948] hover:bg-[#00855d]'
                : 'bg-[#b61722] hover:bg-[#da3437]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Simpan ke Buku Kas</span>
          </button>
          <p className="text-center font-body-sm text-[11px] text-[#3d4a42]">
            Data yang disimpan tercatat di ledger abadi divisi.
          </p>
        </div>
      </form>
    </main>
  );
};
