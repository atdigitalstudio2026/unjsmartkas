import React, { useState } from 'react';

interface KasKampusLogoProps {
  className?: string;
  showText?: boolean;
  subtitle?: string;
}

export const KasKampusLogo: React.FC<KasKampusLogoProps> = ({
  className = 'h-8 w-auto',
  showText = false,
  subtitle,
}) => {
  const [imgError, setImgError] = useState(false);
  const primaryLogoUrl =
    'https://lh3.googleusercontent.com/aida/AEtjO1U7hskS-Mjhl1hLQ5t97gWTfPKzD8b1tnl8dQCCLzBsWg-TAWT3yB0ViHKxqRxt6AS5BAv2s3KboFPsg9HyhP99CeeLUGyw44WaCHf02KWP8RZBdOH4l7odmYTakDjO_5oOKha-sKnmlsUOmK4dIeTky0oZoKfYwWw-ZQB5XdZ0jquYQP-XqsO659r08pqL1_0KNthlaXKB_O0EyTb6qMtUKLIBJdb22HUUToz6-81gSjnuYmgMEy21RTk';

  return (
    <div className="flex items-center gap-2">
      {!imgError ? (
        <img
          src={primaryLogoUrl}
          alt="KasKampus Logo"
          className={`${className} object-contain`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-8 h-8 rounded-lg bg-[#006948] text-white flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[20px]">account_balance</span>
        </div>
      )}
      {showText && (
        <div className="flex flex-col">
          <span className="font-headline-sm text-[18px] font-bold text-[#006948] leading-tight tracking-tight">
            KasKampus
          </span>
          {subtitle && (
            <span className="font-label-sm text-[11px] text-[#3d4a42] font-medium tracking-wide">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
