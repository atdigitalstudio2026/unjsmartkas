import React from 'react';
import { useApp } from '../context/AppContext';
import { NOTIFICATIONS_DATA } from '../data/mockData';

export const NotificationModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, showToast } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-[#eaedff]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948] text-[22px]">
              notifications
            </span>
            <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
              Notifikasi Keuangan
            </span>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6d7a72] hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto divide-y divide-[#f2f3ff] space-y-2">
          {NOTIFICATIONS_DATA.map((item) => (
            <div key={item.id} className="pt-2 pb-2 flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === 'success'
                    ? 'bg-[#85f8c4]/40 text-[#006948]'
                    : item.type === 'warning'
                    ? 'bg-[#ffdad7] text-[#b61722]'
                    : 'bg-[#e2e7ff] text-[#4b41e1]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.type === 'success'
                    ? 'payments'
                    : item.type === 'warning'
                    ? 'hourglass_bottom'
                    : 'info'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#131b2e]">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-[#3d4a42]">{item.time}</span>
                </div>
                <p className="text-xs text-[#3d4a42] mt-0.5 leading-snug">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#f2f3ff] border-t border-[#eaedff] flex justify-end">
          <button
            onClick={() => {
              showToast('Semua notifikasi ditandai telah dibaca.', 'done_all', 'info');
              setIsNotificationsOpen(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#006948] text-white text-xs font-semibold hover:bg-[#00855d] cursor-pointer"
          >
            Tandai Telah Dibaca
          </button>
        </div>
      </div>
    </div>
  );
};
