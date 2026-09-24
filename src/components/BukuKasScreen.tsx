import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatSignedRupiah } from '../utils/formatters';
import { Transaction } from '../types';
import { parseIndonesianDate, formatIndonesianDate } from '../utils/dateHelpers';

export const BukuKasScreen: React.FC = () => {
  const {
    transactions,
    setSelectedTransaction,
    exportPdf,
    exportExcel,
    totalMasukBulanIni,
    totalKeluarBulanIni,
    selisihBersih,
    showToast,
  } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'inflow' | 'outflow'>('all');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Date Range Filtering States
  const [datePreset, setDatePreset] = useState<'all' | 'today' | '7days' | 'this_month' | 'custom'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const categories = [
    { label: 'Semua Pos', key: 'Semua' },
    { label: 'Uang Kas Rutin', key: 'Uang Kas' },
    { label: 'Dana Proker / Event', key: 'Dana Kegiatan' },
    { label: 'Sponsorship & Hibah', key: 'Sponsorship' },
    { label: 'Logistik & ATK', key: 'Logistik' },
    { label: 'Konsumsi', key: 'Konsumsi' },
  ];

  // Quick preset handlers for date range
  const handleSelectDatePreset = (preset: 'all' | 'today' | '7days' | 'this_month' | 'custom') => {
    setDatePreset(preset);
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'today') {
      // 16 Mei 2025 based on organization current cut-off
      setStartDate('2025-05-16');
      setEndDate('2025-05-16');
    } else if (preset === '7days') {
      setStartDate('2025-05-10');
      setEndDate('2025-05-16');
    } else if (preset === 'this_month') {
      setStartDate('2025-05-01');
      setEndDate('2025-05-31');
    }
  };

  const handleResetFilters = () => {
    setFilterType('all');
    setSelectedCategory('Semua');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    showToast('Semua filter berhasil diatur ulang.', 'restart_alt', 'info');
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const startObj = startDate ? parseIndonesianDate(startDate) : null;
    const endObj = endDate ? parseIndonesianDate(endDate) : null;
    if (endObj) {
      endObj.setHours(23, 59, 59, 999);
    }

    const filtered = transactions.filter((tx: Transaction) => {
      // 1. Kategori Aliran Kas (Pemasukan / Pengeluaran)
      if (filterType !== 'all' && tx.type !== filterType) {
        return false;
      }

      // 2. Search query (judul, orang/vendor, ref, catatan)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = tx.title.toLowerCase().includes(query);
        const matchPerson = tx.relatedPerson.toLowerCase().includes(query);
        const matchRef = tx.referenceNumber.toLowerCase().includes(query);
        const matchNotes = tx.notes?.toLowerCase().includes(query);
        if (!matchTitle && !matchPerson && !matchRef && !matchNotes) {
          return false;
        }
      }

      // 3. Pos Anggaran Spesifik
      if (selectedCategory !== 'Semua') {
        if (!tx.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // 4. Rentang Tanggal (Date Range)
      if (startObj || endObj) {
        const txDate = parseIndonesianDate(tx.dateString);
        if (txDate) {
          if (startObj && txDate < startObj) return false;
          if (endObj && txDate > endObj) return false;
        }
      }

      return true;
    });

    if (sortBy === 'oldest') {
      return [...filtered].reverse();
    } else if (sortBy === 'highest') {
      return [...filtered].sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'lowest') {
      return [...filtered].sort((a, b) => a.amount - b.amount);
    }
    return filtered;
  }, [transactions, searchQuery, selectedCategory, filterType, startDate, endDate, sortBy]);

  // Group by dateGroup (or single list when sorted by amount)
  const groupedTransactions = useMemo(() => {
    if (sortBy === 'highest' || sortBy === 'lowest') {
      const label = sortBy === 'highest' ? 'Diurutkan Nominal Tertinggi' : 'Diurutkan Nominal Terendah';
      return { [label]: filteredTransactions };
    }

    const groups: { [key: string]: Transaction[] } = {};
    filteredTransactions.forEach((tx: Transaction) => {
      const groupName = tx.dateGroup || 'Lainnya';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(tx);
    });
    return groups;
  }, [filteredTransactions, sortBy]);

  const groupKeys = Object.keys(groupedTransactions);

  // Active filter counters & metrics
  const totalInflowCount = transactions.filter((t: Transaction) => t.type === 'inflow').length;
  const totalOutflowCount = transactions.filter((t: Transaction) => t.type === 'outflow').length;

  const filteredInflow = useMemo(() => {
    return filteredTransactions
      .filter((t: Transaction) => t.type === 'inflow')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const filteredOutflow = useMemo(() => {
    return filteredTransactions
      .filter((t: Transaction) => t.type === 'outflow')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const filteredNet = filteredInflow - filteredOutflow;

  const isAnyFilterActive =
    filterType !== 'all' ||
    selectedCategory !== 'Semua' ||
    Boolean(startDate) ||
    Boolean(endDate) ||
    Boolean(searchQuery.trim());

  // Formatted date range label for chips
  const dateRangeLabel = useMemo(() => {
    if (startDate && endDate) {
      const s = parseIndonesianDate(startDate);
      const e = parseIndonesianDate(endDate);
      if (s && e) {
        if (startDate === endDate) return formatIndonesianDate(s);
        return `${formatIndonesianDate(s)} - ${formatIndonesianDate(e)}`;
      }
    } else if (startDate) {
      const s = parseIndonesianDate(startDate);
      if (s) return `Mulai: ${formatIndonesianDate(s)}`;
    } else if (endDate) {
      const e = parseIndonesianDate(endDate);
      if (e) return `Sampai: ${formatIndonesianDate(e)}`;
    }
    return null;
  }, [startDate, endDate]);

  return (
    <main className="flex-1 w-full bg-[#faf8ff] pt-16 pb-28">
      <div className="flex flex-col w-full px-4 max-w-md mx-auto pb-6 space-y-3.5">
        {/* Search and Advanced Filter Toggle */}
        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#3d4a42]/70">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, anggota, vendor..."
              className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#3d4a42]/60 font-body-md text-[13px] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006948] transition-all border border-transparent focus:border-[#006948]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4a42] hover:text-black cursor-pointer"
                aria-label="Hapus pencarian"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label="Filter Lanjutan"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`h-11 px-3 flex-shrink-0 flex items-center justify-center gap-1 rounded-xl transition-all cursor-pointer font-label-sm text-[12px] font-semibold ${
              isFilterOpen || isAnyFilterActive
                ? 'bg-[#006948] text-white shadow-sm ring-2 ring-[#85f8c4]'
                : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Filter</span>
            {isAnyFilterActive && (
              <span className="w-2 h-2 rounded-full bg-[#85f8c4] ml-0.5"></span>
            )}
          </button>
        </div>

        {/* 1. PRIMARY FILTER: Kategori (Pemasukan / Pengeluaran) Segmented Pill Bar */}
        <div className="w-full bg-[#e2e7ff] p-1 rounded-xl flex items-center justify-between shadow-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`flex-1 py-2 px-1 rounded-lg font-label-md text-[12px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-[#131b2e] shadow-sm font-bold'
                : 'text-[#3d4a42] hover:text-[#131b2e]'
            }`}
          >
            <span>Semua</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#eaedff] text-[#3d4a42] font-semibold">
              {transactions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('inflow')}
            className={`flex-1 py-2 px-1 rounded-lg font-label-md text-[12px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
              filterType === 'inflow'
                ? 'bg-white text-[#006948] shadow-sm font-bold'
                : 'text-[#3d4a42] hover:text-[#006948]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#006948]">
              arrow_circle_down
            </span>
            <span>Pemasukan</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#85f8c4]/40 text-[#006948] font-bold">
              {totalInflowCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('outflow')}
            className={`flex-1 py-2 px-1 rounded-lg font-label-md text-[12px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
              filterType === 'outflow'
                ? 'bg-white text-[#b61722] shadow-sm font-bold'
                : 'text-[#3d4a42] hover:text-[#b61722]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#b61722]">
              arrow_circle_up
            </span>
            <span>Pengeluaran</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#ffdad7] text-[#b61722] font-bold">
              {totalOutflowCount}
            </span>
          </button>
        </div>

        {/* 2. SECONDARY FILTER: Quick Rentang Tanggal Preset Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 -mx-4 px-4 no-scrollbar">
          <span className="text-[11px] font-semibold text-[#3d4a42] shrink-0 flex items-center gap-1 mr-1">
            <span className="material-symbols-outlined text-[15px] text-[#006948]">
              calendar_today
            </span>
            Periode:
          </span>

          <button
            type="button"
            onClick={() => handleSelectDatePreset('all')}
            className={`shrink-0 px-3 py-1 rounded-full font-label-md text-[11px] transition-all cursor-pointer ${
              datePreset === 'all' && !startDate && !endDate
                ? 'bg-[#006948] text-white shadow-xs font-semibold'
                : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#e2e7ff]'
            }`}
          >
            Semua Waktu
          </button>

          <button
            type="button"
            onClick={() => handleSelectDatePreset('this_month')}
            className={`shrink-0 px-3 py-1 rounded-full font-label-md text-[11px] transition-all cursor-pointer ${
              datePreset === 'this_month'
                ? 'bg-[#006948] text-white shadow-xs font-semibold'
                : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#e2e7ff]'
            }`}
          >
            Bulan Ini (Mei 2025)
          </button>

          <button
            type="button"
            onClick={() => handleSelectDatePreset('7days')}
            className={`shrink-0 px-3 py-1 rounded-full font-label-md text-[11px] transition-all cursor-pointer ${
              datePreset === '7days'
                ? 'bg-[#006948] text-white shadow-xs font-semibold'
                : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#e2e7ff]'
            }`}
          >
            7 Hari Terakhir
          </button>

          <button
            type="button"
            onClick={() => handleSelectDatePreset('today')}
            className={`shrink-0 px-3 py-1 rounded-full font-label-md text-[11px] transition-all cursor-pointer ${
              datePreset === 'today'
                ? 'bg-[#006948] text-white shadow-xs font-semibold'
                : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#e2e7ff]'
            }`}
          >
            Hari Ini
          </button>

          <button
            type="button"
            onClick={() => {
              setDatePreset('custom');
              setIsFilterOpen(true);
            }}
            className={`shrink-0 px-3 py-1 rounded-full font-label-md text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
              datePreset === 'custom' || (startDate && datePreset !== 'this_month' && datePreset !== '7days' && datePreset !== 'today')
                ? 'bg-[#006948] text-white shadow-xs font-semibold'
                : 'bg-[#eaedff] text-[#3d4a42] hover:bg-[#e2e7ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">date_range</span>
            <span>Rentang Kustom</span>
          </button>
        </div>

        {/* 3. EXPANDABLE ADVANCED FILTER PANEL */}
        {isFilterOpen && (
          <div className="bg-white p-4 rounded-2xl shadow-md border border-[#eaedff] space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006948] text-[20px]">
                  filter_alt
                </span>
                <span className="font-headline-sm text-[14px] font-bold text-[#131b2e]">
                  Filter Transaksi Buku Kas
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-7 h-7 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#283044] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Sub-Section: Kategori Aliran Kas */}
            <div className="space-y-1.5">
              <span className="font-label-sm text-[11px] font-bold text-[#3d4a42] block">
                Kategori Transaksi (Aliran Kas):
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`py-2 px-2 rounded-xl text-center font-label-md text-[11px] transition-all cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-[#283044] text-white font-bold'
                      : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('inflow')}
                  className={`py-2 px-2 rounded-xl text-center font-label-md text-[11px] transition-all cursor-pointer ${
                    filterType === 'inflow'
                      ? 'bg-[#006948] text-white font-bold'
                      : 'bg-[#f2f3ff] text-[#006948] hover:bg-[#85f8c4]/20'
                  }`}
                >
                  + Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('outflow')}
                  className={`py-2 px-2 rounded-xl text-center font-label-md text-[11px] transition-all cursor-pointer ${
                    filterType === 'outflow'
                      ? 'bg-[#b61722] text-white font-bold'
                      : 'bg-[#f2f3ff] text-[#b61722] hover:bg-[#ffdad7]'
                  }`}
                >
                  - Pengeluaran
                </button>
              </div>
            </div>

            {/* Sub-Section: Rentang Tanggal (Date Pickers) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] font-bold text-[#3d4a42]">
                  Rentang Tanggal Transaksi:
                </span>
                {(startDate || endDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                      setDatePreset('all');
                    }}
                    className="text-[11px] text-[#b61722] hover:underline font-semibold cursor-pointer"
                  >
                    Hapus Tanggal
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <label className="text-[10px] text-[#3d4a42] mb-1 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#006948]">
                      event
                    </span>
                    Dari Tanggal:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDatePreset('custom');
                    }}
                    className="h-10 px-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-medium text-[#131b2e] focus:outline-none focus:ring-1 focus:ring-[#006948]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] text-[#3d4a42] mb-1 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#006948]">
                      event_available
                    </span>
                    Sampai Tanggal:
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDatePreset('custom');
                    }}
                    className="h-10 px-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-medium text-[#131b2e] focus:outline-none focus:ring-1 focus:ring-[#006948]"
                  />
                </div>
              </div>

              {/* Quick presets shortcut within drawer */}
              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => handleSelectDatePreset('today')}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3d4a42] rounded-lg text-[10px] font-medium shrink-0 cursor-pointer"
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDatePreset('7days')}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3d4a42] rounded-lg text-[10px] font-medium shrink-0 cursor-pointer"
                >
                  7 Hari Terakhir
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDatePreset('this_month')}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3d4a42] rounded-lg text-[10px] font-medium shrink-0 cursor-pointer"
                >
                  Bulan Mei 2025
                </button>
              </div>
            </div>

            {/* Sub-Section: Pos Anggaran Spesifik */}
            <div className="space-y-1.5 pt-1">
              <span className="font-label-sm text-[11px] font-bold text-[#3d4a42] block">
                Pos Anggaran:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-3 py-1.5 rounded-lg font-label-md text-[11px] transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#006948] text-white font-semibold shadow-xs'
                          : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Section: Urutan Tampilan */}
            <div className="space-y-1.5 pt-1">
              <span className="font-label-sm text-[11px] font-bold text-[#3d4a42] block">
                Urutkan Transaksi:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    sortBy === 'newest'
                      ? 'bg-[#006948] text-white font-semibold'
                      : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>Terbaru (Default)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('oldest')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    sortBy === 'oldest'
                      ? 'bg-[#006948] text-white font-semibold'
                      : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">history</span>
                  <span>Terlama</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('highest')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    sortBy === 'highest'
                      ? 'bg-[#006948] text-white font-semibold'
                      : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>Nominal Terbesar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('lowest')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    sortBy === 'lowest'
                      ? 'bg-[#006948] text-white font-semibold'
                      : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">trending_down</span>
                  <span>Nominal Terkecil</span>
                </button>
              </div>
            </div>

            {/* Action Buttons in Filter Panel */}
            <div className="pt-2 border-t border-[#eaedff] flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 h-10 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#b61722] font-label-md text-[12px] font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset Filter</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsFilterOpen(false);
                  showToast(
                    `Filter diterapkan: ${filteredTransactions.length} transaksi ditemukan.`,
                    'filter_alt',
                    'success'
                  );
                }}
                className="flex-1 h-10 bg-[#006948] hover:bg-[#00855d] text-white font-label-md text-[12px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">done</span>
                <span>Terapkan ({filteredTransactions.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. ACTIVE FILTER CHIPS BAR */}
        {isAnyFilterActive && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5 animate-in fade-in duration-150">
            <span className="text-[11px] font-semibold text-[#3d4a42]">Filter:</span>

            {/* Filter Type Chip */}
            {filterType !== 'all' && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-2xs ${
                filterType === 'inflow'
                  ? 'bg-[#85f8c4] text-[#002114]'
                  : 'bg-[#ffdad7] text-[#93000a]'
              }`}>
                <span>{filterType === 'inflow' ? 'Kategori: Pemasukan (+)' : 'Kategori: Pengeluaran (-)'}</span>
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className="hover:opacity-75 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </span>
            )}

            {/* Date Range Chip */}
            {dateRangeLabel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-[11px] font-semibold shadow-2xs">
                <span className="material-symbols-outlined text-[13px]">date_range</span>
                <span>{dateRangeLabel}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setDatePreset('all');
                  }}
                  className="hover:opacity-75 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </span>
            )}

            {/* Pos Anggaran Chip */}
            {selectedCategory !== 'Semua' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#283044] text-[11px] font-semibold shadow-2xs">
                <span>Pos: {selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Semua')}
                  className="hover:opacity-75 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </span>
            )}

            {/* Search Query Chip */}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#3d4a42] text-[11px] font-semibold border border-[#eaedff]">
                <span>Kata kunci: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:opacity-75 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-[#b61722] hover:underline font-semibold ml-auto cursor-pointer"
            >
              Reset Semua
            </button>
          </div>
        )}

        {/* 5. DYNAMIC TREASURY / SUMMARY OVERVIEW */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#f2f3ff] to-[#eaedff] p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006948] text-[18px]">
                {isAnyFilterActive ? 'query_stats' : 'account_balance'}
              </span>
              <span className="font-label-md text-[12px] text-[#3d4a42] font-semibold">
                {isAnyFilterActive ? 'Rekap Hasil Filter' : 'Rekap Kas Buku Kas'}
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-label-sm text-[10px] font-semibold">
              {filteredTransactions.length} dari {transactions.length} Transaksi
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="flex flex-col bg-white p-2.5 rounded-xl shadow-xs border border-[#eaedff]/60">
              <div className="flex items-center gap-1 text-[#006948] mb-0.5">
                <span className="material-symbols-outlined text-[16px]">arrow_circle_down</span>
                <span className="font-label-sm text-[11px] font-medium">Masuk</span>
              </div>
              <span className="font-headline-sm text-[15px] sm:text-[17px] text-[#006948] font-bold tracking-tight">
                {formatRupiah(isAnyFilterActive ? filteredInflow : totalMasukBulanIni)}
              </span>
              <span className="font-body-sm text-[10px] text-[#3d4a42] truncate">
                {isAnyFilterActive ? `${filteredTransactions.filter((t: Transaction) => t.type === 'inflow').length} Transaksi` : 'Bulan Mei 2025'}
              </span>
            </div>

            <div className="flex flex-col bg-white p-2.5 rounded-xl shadow-xs border border-[#eaedff]/60">
              <div className="flex items-center gap-1 text-[#b61722] mb-0.5">
                <span className="material-symbols-outlined text-[16px]">arrow_circle_up</span>
                <span className="font-label-sm text-[11px] font-medium">Keluar</span>
              </div>
              <span className="font-headline-sm text-[15px] sm:text-[17px] text-[#b61722] font-bold tracking-tight">
                {formatRupiah(isAnyFilterActive ? filteredOutflow : totalKeluarBulanIni)}
              </span>
              <span className="font-body-sm text-[10px] text-[#3d4a42] truncate">
                {isAnyFilterActive ? `${filteredTransactions.filter((t: Transaction) => t.type === 'outflow').length} Transaksi` : 'Bulan Mei 2025'}
              </span>
            </div>

            <div className="flex flex-col bg-white p-2.5 rounded-xl shadow-xs border border-[#eaedff]/60">
              <div className="flex items-center gap-1 text-[#4b41e1] mb-0.5">
                <span className="material-symbols-outlined text-[16px]">balance</span>
                <span className="font-label-sm text-[11px] font-medium">Selisih</span>
              </div>
              <span className="font-headline-sm text-[15px] sm:text-[17px] text-[#4b41e1] font-bold tracking-tight">
                {isAnyFilterActive
                  ? (filteredNet >= 0 ? `+${formatRupiah(filteredNet)}` : formatRupiah(filteredNet))
                  : (selisihBersih >= 0 ? `+${formatRupiah(selisihBersih)}` : formatRupiah(selisihBersih))}
              </span>
              <span className="font-body-sm text-[10px] text-[#3d4a42] truncate">
                {isAnyFilterActive ? 'Netto Terfilter' : 'Netto Berjalan'}
              </span>
            </div>
          </div>
        </div>

        {/* 6. LEDGER TRANSACTION GROUPS OR EMPTY STATE */}
        {groupKeys.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#eaedff] shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#6d7a72] mx-auto">
              <span className="material-symbols-outlined text-[32px]">filter_alt_off</span>
            </div>
            <div>
              <p className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
                Tidak Ada Transaksi Sesuai Filter
              </p>
              <p className="font-body-sm text-[12px] text-[#3d4a42] mt-1 max-w-xs mx-auto">
                Tidak ditemukan mutasi kas untuk kategori{' '}
                <span className="font-semibold">
                  {filterType === 'inflow' ? 'Pemasukan' : filterType === 'outflow' ? 'Pengeluaran' : 'yang dipilih'}
                </span>
                {dateRangeLabel ? ` pada periode ${dateRangeLabel}` : ''}.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-10 px-4 bg-[#006948] hover:bg-[#00855d] text-white font-label-md text-[12px] font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Filter &amp; Tampilkan Semua</span>
            </button>
          </div>
        ) : (
          groupKeys.map((group) => {
            const txs = groupedTransactions[group];
            return (
              <div key={group} className="flex flex-col gap-2.5 mt-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    {group === 'Hari Ini' && (
                      <div className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></div>
                    )}
                    <span className="font-headline-sm text-[15px] text-[#131b2e] font-bold">
                      {group}
                    </span>
                    <span className="font-label-sm text-[11px] text-[#3d4a42]">
                      {txs[0]?.dateString || ''}
                    </span>
                  </div>
                  <span className="font-label-sm text-[11px] text-[#3d4a42]">
                    {txs.length} Transaksi
                  </span>
                </div>

                {txs.map((tx: Transaction) => {
                  const isInflow = tx.type === 'inflow';
                  const isPending = tx.isPendingReview;

                  // Icon logic
                  let iconName = isInflow ? 'south_west' : 'north_east';
                  let iconBg = isInflow ? 'bg-[#85f8c4] text-[#006948]' : 'bg-[#ffdad7] text-[#b61722]';

                  if (tx.category.includes('Konsumsi')) {
                    iconName = 'restaurant';
                  } else if (tx.category.includes('Sponsorship')) {
                    iconName = 'assured_workload';
                  } else if (tx.title.includes('Sound System')) {
                    iconName = 'volume_up';
                  } else if (tx.title.includes('Makrab')) {
                    iconName = 'assignment_return';
                    iconBg = 'bg-[#e2dfff] text-[#4b41e1]';
                  }

                  return (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTransaction(tx)}
                      className="flex flex-col p-3.5 rounded-2xl bg-white shadow-xs hover:shadow transition-shadow border border-[#eaedff] cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
                          >
                            <span className="material-symbols-outlined text-[22px]">
                              {iconName}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-lg text-[14px] text-[#131b2e] font-semibold truncate leading-tight">
                              {tx.title}
                            </span>
                            <span className="font-body-sm text-[12px] text-[#3d4a42] truncate mt-0.5">
                              {tx.subDescription}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end flex-shrink-0">
                          <span
                            className={`font-headline-sm text-[15px] font-bold tracking-tight ${
                              isInflow ? 'text-[#006948]' : 'text-[#b61722]'
                            }`}
                          >
                            {formatSignedRupiah(tx.amount, tx.type)}
                          </span>
                          <span className="font-label-sm text-[11px] text-[#3d4a42]">
                            {tx.timeString}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#f2f3ff]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {tx.verified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-label-sm text-[11px] font-semibold">
                              <span className="material-symbols-outlined text-[14px]">
                                check_circle
                              </span>
                              {tx.statusText || 'Terverifikasi'}
                            </span>
                          )}

                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#3d4a42] font-label-sm text-[11px] font-semibold">
                              <span className="material-symbols-outlined text-[14px] text-amber-500">
                                hourglass_top
                              </span>
                              Verifikasi Pending
                            </span>
                          )}

                          {tx.referenceNumber && (
                            <span className="font-label-sm text-[10px] text-[#3d4a42] px-2 py-0.5 rounded-md bg-[#f2f3ff]">
                              {tx.referenceNumber}
                            </span>
                          )}

                          {tx.contractNumber && (
                            <span className="font-label-sm text-[10px] text-[#3d4a42] px-2 py-0.5 rounded-md bg-[#f2f3ff]">
                              {tx.contractNumber}
                            </span>
                          )}

                          {tx.receiptName && !tx.verified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#3d4a42] font-label-sm text-[10px] font-medium">
                              <span className="material-symbols-outlined text-[13px]">
                                attach_file
                              </span>
                              Ada Bukti
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransaction(tx);
                          }}
                          className="flex items-center gap-0.5 font-label-sm text-[12px] text-[#006948] hover:underline font-semibold cursor-pointer"
                        >
                          {isPending ? 'Review' : tx.receiptName ? 'Lihat Struk' : 'Detail'}
                          <span className="material-symbols-outlined text-[14px]">
                            {isPending ? 'arrow_forward' : 'chevron_right'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}

        {/* End of Feed State with Friendly Campus Vibe */}
        {groupKeys.length > 0 && (
          <div className="my-6 flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-[#f2f3ff] border border-[#eaedff]">
            <div className="w-11 h-11 rounded-full bg-[#85f8c4] flex items-center justify-center text-[#006948] mb-2">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Buku Kas Terfilter Sesuai
            </span>
            <p className="font-body-sm text-[12px] text-[#3d4a42] max-w-xs mt-0.5">
              Menampilkan {filteredTransactions.length} transaksi yang memenuhi kriteria pencarian dan rentang tanggal.
            </p>
          </div>
        )}

        {/* Floating / Bottom Export Action Bar */}
        <div className="sticky bottom-20 z-30 flex items-center justify-center w-full px-2 mt-auto">
          <div className="flex items-center justify-between w-full max-w-sm px-4 py-2.5 rounded-2xl bg-[#283044] text-[#eef0ff] shadow-xl shadow-black/10 backdrop-blur-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#006948] flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">download</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-[13px] font-bold truncate text-white leading-tight">
                  Rekapitulasi Kas
                </span>
                <span className="font-body-sm text-[11px] text-[#eef0ff]/70 truncate">
                  {dateRangeLabel || 'Periode Mei 2025'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => exportPdf()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#006948] text-white font-label-md text-[12px] font-semibold hover:bg-[#00855d] active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                PDF
              </button>
              <button
                type="button"
                onClick={exportExcel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#e2e7ff] text-[#131b2e] font-label-md text-[12px] font-semibold hover:bg-[#dae2fd] active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">table_view</span>
                Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
