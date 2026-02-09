import React from 'react';

interface SponsorBrandBannerProps {
  sponsorName: string;
  sponsorLogoUrl?: string;
  sponsorColor?: string;
  variant: 'inline' | 'badge' | 'card';
  complianceText?: string;
  onClick?: () => void;
}

const SponsorBrandBanner: React.FC<SponsorBrandBannerProps> = ({
  sponsorName,
  sponsorLogoUrl,
  sponsorColor = '#6C5CE7',
  variant,
  complianceText,
  onClick
}) => {
  if (variant === 'badge') {
    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium cursor-default"
        style={{ backgroundColor: sponsorColor + '20', color: sponsorColor }}
        onClick={onClick}
      >
        {sponsorLogoUrl && (
          <img src={sponsorLogoUrl} alt={sponsorName} className="w-3 h-3 rounded-full object-cover" />
        )}
        <span>Sponsored by {sponsorName}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-1.5" onClick={onClick}>
        {sponsorLogoUrl && (
          <img src={sponsorLogoUrl} alt={sponsorName} className="w-6 h-6 rounded-full border-2 border-white/30 object-cover" />
        )}
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-gray-500">Sponsored by {sponsorName}</span>
          {complianceText && <span className="text-[8px] text-gray-400">{complianceText}</span>}
        </div>
      </div>
    );
  }

  // card variant
  return (
    <div
      className="rounded-lg p-3 flex items-center gap-3 cursor-default"
      style={{ backgroundColor: sponsorColor + '10', borderLeft: `3px solid ${sponsorColor}` }}
      onClick={onClick}
    >
      {sponsorLogoUrl && (
        <img src={sponsorLogoUrl} alt={sponsorName} className="w-8 h-8 rounded-lg object-cover shadow-sm" />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-800">{sponsorName}</div>
        <div className="text-[10px] text-gray-500">
          {complianceText || `Prizes guaranteed by ${sponsorName}`}
        </div>
      </div>
    </div>
  );
};

export default SponsorBrandBanner;
