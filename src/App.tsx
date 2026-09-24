import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { BerandaScreen } from './components/BerandaScreen';
import { BukuKasScreen } from './components/BukuKasScreen';
import { CatatKasScreen } from './components/CatatKasScreen';
import { TransparansiScreen } from './components/TransparansiScreen';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { WhatsAppBroadcastModal } from './components/WhatsAppBroadcastModal';
import { TagihModal } from './components/TagihModal';
import { NotificationModal } from './components/NotificationModal';
import { ProfileModal } from './components/ProfileModal';
import { LpjPdfModal } from './components/LpjPdfModal';
import { AddMemberModal } from './components/AddMemberModal';
import { ProkerDetailModal } from './components/ProkerDetailModal';
import { ReceiptLightboxModal } from './components/ReceiptLightboxModal';

const MainLayout: React.FC = () => {
  const { currentScreen, toast } = useApp();
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  return (
    <div className={`min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col items-center selection:bg-[#85f8c4] selection:text-[#002114]`}>
      {/* Desktop Shell Mode Toggle */}
      <div className="hidden md:flex fixed top-3 right-4 z-50 items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-[#eaedff] text-xs">
        <span className="text-[#3d4a42] font-medium">Mode Tampilan:</span>
        <button
          onClick={() => setIsPhoneFrame(false)}
          className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
            !isPhoneFrame
              ? 'bg-[#006948] text-white shadow-xs'
              : 'text-[#3d4a42] hover:bg-[#eaedff]'
          }`}
        >
          Fluid Layar
        </button>
        <button
          onClick={() => setIsPhoneFrame(true)}
          className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
            isPhoneFrame
              ? 'bg-[#006948] text-white shadow-xs'
              : 'text-[#3d4a42] hover:bg-[#eaedff]'
          }`}
        >
          Frame Mobile (390px)
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full min-h-screen flex flex-col relative transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] my-6 rounded-3xl shadow-2xl overflow-hidden border-8 border-[#283044] bg-[#faf8ff]'
            : 'max-w-md bg-[#faf8ff]'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* Screens */}
        {currentScreen === 'beranda' && <BerandaScreen />}
        {currentScreen === 'buku-kas' && <BukuKasScreen />}
        {currentScreen === 'catat-kas' && <CatatKasScreen />}
        {currentScreen === 'transparansi' && <TransparansiScreen />}

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Global Modals */}
        <TransactionDetailModal />
        <WhatsAppBroadcastModal />
        <TagihModal />
        <NotificationModal />
        <ProfileModal />
        <LpjPdfModal />
        <AddMemberModal />
        <ProkerDetailModal />
        <ReceiptLightboxModal />

        {/* Notification Toast Container */}
        {toast && (
          <div className="fixed bottom-20 left-4 right-4 z-50 pointer-events-none flex flex-col items-center">
            <div className="pointer-events-auto bg-[#283044] text-[#eef0ff] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 max-w-sm w-full animate-bounce duration-300 mb-2 border border-[#eaedff]/20">
              <span className="material-symbols-outlined text-[20px] text-[#85f8c4]">
                {toast.icon || 'notifications_active'}
              </span>
              <span className="font-body-sm text-[12px] leading-tight flex-1">
                {toast.message}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
