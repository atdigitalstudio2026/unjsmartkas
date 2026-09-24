import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatSignedRupiah } from '../utils/formatters';

export const BerandaScreen: React.FC = () => {
  const {
    totalSaldo,
    totalMasukBulanIni,
    totalKeluarBulanIni,
    isSaldoVisible,
    toggleSaldoVisibility,
    setCurrentScreen,
    setCatatKasInitialType,
    setTransparansiTab,
    transactions,
    setSelectedTransaction,
    showToast,
  } = useApp();

  const [activeWeekTooltip, setActiveWeekTooltip] = useState<string | null>(null);

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('13700987211');
    showToast('Nomor rekening Mandiri berhasil disalin!', 'content_copy', 'info');
  };

  // Recent 4 transactions
  const recentTransactions = transactions.slice(0, 4);

  // Weekly data for chart
  const weeklyData = [
    { label: 'Mgu 1', masuk: 1500000, keluar: 800000, heightMasuk: 55, heightKeluar: 32 },
    { label: 'Mgu 2', masuk: 800000, keluar: 1100000, heightMasuk: 35, heightKeluar: 48 },
    { label: 'Mgu 3', masuk: 3200000, keluar: 400000, heightMasuk: 85, heightKeluar: 20 },
    { label: 'Mgu 4', masuk: 700000, keluar: 150000, heightMasuk: 30, heightKeluar: 12 },
  ];

  return (
    <main className="flex-1 w-full bg-[#faf8ff] pt-16 pb-28">
      <div className="flex flex-col w-full px-4 max-w-md mx-auto space-y-5 pt-3">
        {/* Welcoming & Organization Context */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="font-headline-sm text-[20px] text-[#131b2e] font-bold">
                Halo, Citra Dewi!
              </h1>
              <span className="inline-block animate-bounce text-base">👋</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
              <p className="font-label-sm text-[12px] text-[#3d4a42]">
                Bendahara Umum HIMA ILKOM 2024/2025
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setTransparansiTab('lpj');
              setCurrentScreen('transparansi');
            }}
            title="Lembaga Kas"
            className="w-10 h-10 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#006948] shadow-sm hover:bg-[#dae2fd] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">account_balance</span>
          </button>
        </div>

        {/* Hero Card: Total Saldo Kas Utama */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#006948] via-[#006948] to-[#00855d] p-5 text-white shadow-xl shadow-[#006948]/20">
          {/* Subtle Ambient Graphic Lines */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-[#85f8c4]/15 blur-xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-md">
                <span className="material-symbols-outlined text-[15px] text-[#85f8c4]">
                  verified
                </span>
                <span className="font-label-sm text-[11px] text-white font-medium tracking-wide">
                  Kas Terverifikasi
                </span>
              </div>
              <button
                aria-label="Toggle Saldo Visibility"
                onClick={toggleSaldoVisibility}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 active:scale-95 px-2.5 py-1 rounded-full text-white transition-all backdrop-blur-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isSaldoVisible ? 'visibility' : 'visibility_off'}
                </span>
                <span className="font-label-sm text-[11px]">Rincian</span>
              </button>
            </div>

            <div>
              <p className="font-label-md text-[13px] text-white/80">Total Saldo Kas Aktif</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-currency-display text-[28px] font-bold tracking-tight text-white">
                  {isSaldoVisible ? formatRupiah(totalSaldo) : 'Rp ••••••••'}
                </span>
              </div>
            </div>

            {/* Rekapitulasi Bulan Ini Box */}
            <div className="grid grid-cols-2 gap-2 bg-white/10 rounded-xl p-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#85f8c4]/25 flex items-center justify-center text-[#85f8c4]">
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-[11px] text-white/75 truncate">
                    Masuk Bulan Ini
                  </span>
                  <span className="font-label-md text-[13px] text-[#85f8c4] font-semibold tracking-tight truncate">
                    {isSaldoVisible
                      ? `+${formatRupiah(totalMasukBulanIni)}`
                      : '+Rp •••'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ffb3ad]/25 flex items-center justify-center text-[#ffb3ad]">
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-[11px] text-white/75 truncate">
                    Keluar Bulan Ini
                  </span>
                  <span className="font-label-md text-[13px] text-[#ffb3ad] font-semibold tracking-tight truncate">
                    {isSaldoVisible
                      ? `-${formatRupiah(totalKeluarBulanIni)}`
                      : '-Rp •••'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Info Row */}
            <div className="flex items-center justify-between pt-1 text-white/80">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[16px]">credit_card</span>
                <span className="font-label-sm text-[11px] truncate">
                  Bank Mandiri (Kas Utama) • 137-00-98721-1
                </span>
              </div>
              <button
                onClick={handleCopyAccount}
                className="text-white hover:text-[#85f8c4] transition-colors active:scale-90 p-1 cursor-pointer"
                title="Salin No Rekening"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col space-y-2">
          <span className="font-label-lg text-[14px] text-[#131b2e] font-semibold">
            Aksi Cepat
          </span>
          <div className="grid grid-cols-4 gap-2.5">
            {/* Catat Masuk */}
            <button
              onClick={() => {
                setCatatKasInitialType('inflow');
                setCurrentScreen('catat-kas');
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-95 transition-all shadow-sm group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center mb-1.5 group-hover:bg-[#006948] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">add_circle</span>
              </div>
              <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold text-center leading-tight">
                Catat Masuk
              </span>
            </button>

            {/* Catat Keluar */}
            <button
              onClick={() => {
                setCatatKasInitialType('outflow');
                setCurrentScreen('catat-kas');
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-95 transition-all shadow-sm group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-1.5 group-hover:bg-[#ba1a1a] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">remove_circle</span>
              </div>
              <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold text-center leading-tight">
                Catat Keluar
              </span>
            </button>

            {/* Tagih Kas */}
            <button
              onClick={() => {
                setTransparansiTab('iuran');
                setCurrentScreen('transparansi');
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-95 transition-all shadow-sm group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-[#645efb]/15 text-[#4b41e1] flex items-center justify-center mb-1.5 group-hover:bg-[#4b41e1] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">forward_to_inbox</span>
              </div>
              <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold text-center leading-tight">
                Tagih Kas
              </span>
            </button>

            {/* Kirim LPJ */}
            <button
              onClick={() => {
                setTransparansiTab('lpj');
                setCurrentScreen('transparansi');
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-95 transition-all shadow-sm group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-[#e2e7ff] text-[#3323cc] flex items-center justify-center mb-1.5 group-hover:bg-[#00855d] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
              </div>
              <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold text-center leading-tight">
                Kirim LPJ
              </span>
            </button>
          </div>
        </div>

        {/* Reminder Banner Card */}
        <div
          onClick={() => {
            setTransparansiTab('iuran');
            setCurrentScreen('transparansi');
          }}
          className="rounded-xl bg-[#dae2fd]/60 p-3.5 shadow-sm flex items-start gap-3 cursor-pointer hover:bg-[#dae2fd]/80 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-[#e2e7ff] text-[#4b41e1] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-label-md text-[13px] text-[#131b2e] font-bold">
                Batas Setor Iuran Mei
              </span>
              <span className="font-label-sm text-[10px] bg-[#ffdad7] text-[#410004] px-2 py-0.5 rounded-full font-semibold">
                Sisa 3 Hari
              </span>
            </div>
            <p className="font-body-sm text-[12px] text-[#3d4a42] mt-0.5">
              28 dari 40 pengurus telah menyelesaikan kas bulanan.
            </p>
            {/* Micro Progress Bar */}
            <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-[#006948] h-1.5 rounded-full transition-all duration-500"
                style={{ width: '70%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Mini Chart: Arus Kas 4 Minggu Terakhir */}
        <div className="rounded-2xl bg-white p-4 shadow-sm flex flex-col space-y-3 border border-[#eaedff]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-lg text-[14px] text-[#131b2e] font-semibold">
                Arus Kas Bulanan
              </span>
              <span className="font-body-sm text-[12px] text-[#3d4a42]">4 Minggu Terakhir</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006948]"></span>
                <span className="font-label-sm text-[11px] text-[#3d4a42]">Masuk</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#da3437]"></span>
                <span className="font-label-sm text-[11px] text-[#3d4a42]">Keluar</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Bar Chart Graphic */}
          <div className="w-full pt-2 relative">
            {activeWeekTooltip && (
              <div className="absolute top-0 right-2 bg-[#283044] text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none z-10 animate-fade-in">
                {activeWeekTooltip}
              </div>
            )}
            <svg
              className="w-full h-28 overflow-visible"
              viewBox="0 0 320 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Horizontal Guide Lines */}
              <line
                stroke="#bccac0"
                strokeDasharray="3 3"
                strokeOpacity="0.3"
                x1="0"
                x2="320"
                y1="10"
                y2="10"
              />
              <line
                stroke="#bccac0"
                strokeDasharray="3 3"
                strokeOpacity="0.3"
                x1="0"
                x2="320"
                y1="55"
                y2="55"
              />
              <line stroke="#bccac0" strokeOpacity="0.5" x1="0" x2="320" y1="100" y2="100" />

              {/* Bars for Week 1 to 4 */}
              {weeklyData.map((item, idx) => {
                const xBase = 25 + idx * 80;
                return (
                  <g
                    key={item.label}
                    className="cursor-pointer transition-all hover:opacity-80"
                    onMouseEnter={() =>
                      setActiveWeekTooltip(
                        `${item.label}: Masuk ${formatRupiah(item.masuk)} | Keluar ${formatRupiah(item.keluar)}`
                      )
                    }
                    onMouseLeave={() => setActiveWeekTooltip(null)}
                    onClick={() =>
                      setActiveWeekTooltip(
                        `${item.label}: Masuk ${formatRupiah(item.masuk)} | Keluar ${formatRupiah(item.keluar)}`
                      )
                    }
                  >
                    {/* Inflow bar */}
                    <rect
                      fill="#006948"
                      height={item.heightMasuk}
                      rx="4"
                      width="16"
                      x={xBase}
                      y={100 - item.heightMasuk}
                    />
                    {/* Outflow bar */}
                    <rect
                      fill="#da3437"
                      height={item.heightKeluar}
                      rx="4"
                      width="16"
                      x={xBase + 19}
                      y={100 - item.heightKeluar}
                    />
                    <text
                      className="font-label-sm text-[10px]"
                      fill="#3d4a42"
                      textAnchor="middle"
                      x={xBase + 17}
                      y="115"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-[18px] text-[#131b2e] font-bold">
              Transaksi Terakhir
            </span>
            <span className="font-label-sm text-[11px] text-[#006948] font-semibold bg-[#85f8c4]/30 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            {recentTransactions.map((tx) => {
              const isInflow = tx.type === 'inflow';
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white shadow-sm hover:bg-[#f2f3ff] transition-colors cursor-pointer border border-[#eaedff]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isInflow
                          ? 'bg-[#85f8c4]/40 text-[#006948]'
                          : 'bg-[#ffdad6]/60 text-[#ba1a1a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isInflow ? 'payments' : tx.category.includes('Konsumsi') ? 'local_cafe' : 'print'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md text-[13px] text-[#131b2e] font-semibold truncate">
                        {tx.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-[#3d4a42] font-body-sm text-[11px] mt-0.5">
                        <span className="bg-[#eaedff] px-1.5 py-0.2 rounded text-[10px] font-semibold text-[#006948]">
                          {tx.paymentMethod}
                        </span>
                        <span>•</span>
                        <span>{tx.timeString || 'Baru saja'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 ml-2">
                    <span
                      className={`font-numeral-table text-[13px] font-bold ${
                        isInflow ? 'text-[#006948]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {formatSignedRupiah(tx.amount, tx.type)}
                    </span>
                    <span
                      className={`font-label-sm text-[10px] px-1.5 rounded-full mt-0.5 ${
                        isInflow
                          ? 'text-[#006948] bg-[#006948]/10'
                          : 'text-[#ba1a1a] bg-[#ba1a1a]/10'
                      }`}
                    >
                      {isInflow ? 'Masuk' : 'Keluar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation Button to Buku Kas */}
          <button
            onClick={() => setCurrentScreen('buku-kas')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#eaedff] text-[#006948] hover:bg-[#e2e7ff] active:scale-98 transition-all font-label-md text-[13px] font-semibold mt-1 cursor-pointer"
          >
            <span>Lihat Semua di Buku Kas</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </main>
  );
};
