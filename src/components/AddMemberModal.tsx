import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MemberDue } from '../types';

export const AddMemberModal: React.FC = () => {
  const { isAddMemberOpen, setIsAddMemberOpen, addMember, showToast } = useApp();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Dept. Kominfo');
  const [deptKey, setDeptKey] = useState<'bph' | 'kominfo' | 'acara' | 'psdm' | 'danus' | 'humas'>('kominfo');
  const [role, setRole] = useState('Staff');
  const [phone, setPhone] = useState('');
  const [dueAmount, setDueAmount] = useState('50000');
  const [initialStatus, setInitialStatus] = useState<'tunggakan' | 'lunas'>('tunggakan');

  if (!isAddMemberOpen) return null;

  const handleDeptChange = (val: string) => {
    setDepartment(val);
    if (val.includes('BPH')) setDeptKey('bph');
    else if (val.includes('Kominfo')) setDeptKey('kominfo');
    else if (val.includes('Acara')) setDeptKey('acara');
    else if (val.includes('PSDM') || val.includes('Riset')) setDeptKey('psdm');
    else if (val.includes('Danus')) setDeptKey('danus');
    else setDeptKey('humas');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama anggota wajib diisi!', 'warning', 'error');
      return;
    }

    const parsedDue = parseInt(dueAmount.replace(/\D/g, ''), 10) || 50000;
    const isPaid = initialStatus === 'lunas';

    const newMember: Omit<MemberDue, 'id'> = {
      name: name.trim(),
      initials: '',
      department,
      deptKey,
      role: role.trim() || 'Staff',
      status: initialStatus,
      amount: isPaid ? parsedDue : 0,
      dueAmount: parsedDue,
      lastPaidDate: isPaid ? 'Hari Ini' : undefined,
      monthsDue: isPaid ? undefined : 'Mei belum bayar',
      phone: phone.trim() ? phone.replace(/\D/g, '') : undefined,
    };

    addMember(newMember);
    setIsAddMemberOpen(false);
    setName('');
    setPhone('');
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
              person_add
            </span>
            <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Tambah Anggota Organisasi
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsAddMemberOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6d7a72] hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5">
          {/* Nama */}
          <div className="space-y-1">
            <label className="font-label-md text-[12px] font-semibold text-[#131b2e]">
              Nama Lengkap Mahasiswa / Pengurus <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Muhammad Farhan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#eaedff] bg-[#faf8ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006948]"
            />
          </div>

          {/* Divisi & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-label-md text-[12px] font-semibold text-[#131b2e]">
                Departemen / Divisi
              </label>
              <select
                value={department}
                onChange={(e) => handleDeptChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#eaedff] bg-[#faf8ff] text-[12px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006948]"
              >
                <option value="BPH Inti">BPH Inti</option>
                <option value="Dept. Kominfo">Dept. Kominfo</option>
                <option value="Dept. Acara">Dept. Acara</option>
                <option value="Dept. PSDM">Dept. PSDM</option>
                <option value="Dept. Danus">Dept. Danus</option>
                <option value="Dept. Humas">Dept. Humas</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-[12px] font-semibold text-[#131b2e]">
                Jabatan
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Staff / Koordinator"
                className="w-full px-3 py-2.5 rounded-xl border border-[#eaedff] bg-[#faf8ff] text-[12px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006948]"
              />
            </div>
          </div>

          {/* No WhatsApp */}
          <div className="space-y-1">
            <label className="font-label-md text-[12px] font-semibold text-[#131b2e]">
              Nomor WhatsApp (Untuk Reminder Otomatis)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-[#3d4a42] font-mono font-medium">
                +62
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="81234567890"
                className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-[#eaedff] bg-[#faf8ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006948]"
              />
            </div>
          </div>

          {/* Besaran Iuran Wajib */}
          <div className="space-y-1">
            <label className="font-label-md text-[12px] font-semibold text-[#131b2e]">
              Besaran Iuran Kas Wajib Bulanan
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-[#3d4a42] font-semibold">
                Rp
              </span>
              <input
                type="text"
                value={dueAmount}
                onChange={(e) => setDueAmount(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#eaedff] bg-[#faf8ff] text-[13px] font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006948]"
              />
            </div>
          </div>

          {/* Status Pembayaran Awal */}
          <div className="space-y-1 pt-1">
            <label className="font-label-md text-[12px] font-semibold text-[#131b2e]">
              Status Iuran Kas Bulan Berjalan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInitialStatus('tunggakan')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  initialStatus === 'tunggakan'
                    ? 'border-[#ba1a1a] bg-[#ffdad6]/40 text-[#93000a]'
                    : 'border-[#eaedff] text-[#3d4a42] hover:bg-[#faf8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                Tunggakan Aktif
              </button>
              <button
                type="button"
                onClick={() => setInitialStatus('lunas')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  initialStatus === 'lunas'
                    ? 'border-[#006948] bg-[#85f8c4]/30 text-[#006948]'
                    : 'border-[#eaedff] text-[#3d4a42] hover:bg-[#faf8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Sudah Lunas
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 bg-[#006948] hover:bg-[#00855d] text-white font-label-md text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Simpan Anggota Baru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
