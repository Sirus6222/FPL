import React, { useState } from 'react';
import { Upload, Image, CheckCircle2, Clock, XCircle, Filter } from 'lucide-react';
import { SponsorAsset, AssetType, UserRole, ROLE_PERMISSIONS } from '../types';

interface SponsorAssetLibraryProps {
  assets: SponsorAsset[];
  userRole: UserRole;
  sponsorColor?: string;
}

const TYPE_LABELS: Record<AssetType, string> = {
  logo: 'Logo',
  banner: 'Banner',
  icon: 'Icon',
  video_thumbnail: 'Video Thumb',
  splash_screen: 'Splash Screen'
};

const SponsorAssetLibrary: React.FC<SponsorAssetLibraryProps> = ({ assets, userRole, sponsorColor = '#6C5CE7' }) => {
  const [filterType, setFilterType] = useState<AssetType | 'all'>('all');
  const canManage = ROLE_PERMISSIONS[userRole]?.includes('sponsor:manage_assets');

  const filtered = assets.filter(a => filterType === 'all' || a.type === filterType);
  const types: (AssetType | 'all')[] = ['all', 'logo', 'banner', 'icon', 'video_thumbnail', 'splash_screen'];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Assets ({assets.length})</h3>
        {canManage && (
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold" style={{ backgroundColor: sponsorColor }}>
            <Upload className="w-3 h-3" /> Upload
          </button>
        )}
      </div>

      {/* Type filter */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
              filterType === t ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t === 'all' ? 'All' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-8 text-xs text-gray-400">
            <Image className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No assets found
          </div>
        )}
        {filtered.map(asset => (
          <div key={asset.asset_id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="aspect-video bg-gray-100 relative">
              <img src={asset.url} alt={asset.alt_text} className="w-full h-full object-cover" />
              <div className="absolute top-1.5 right-1.5">
                {asset.is_approved ? (
                  <span className="flex items-center gap-0.5 bg-green-500 text-white px-1.5 py-0.5 rounded-full text-[8px] font-bold">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Approved
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 bg-yellow-500 text-white px-1.5 py-0.5 rounded-full text-[8px] font-bold">
                    <Clock className="w-2.5 h-2.5" /> Pending
                  </span>
                )}
              </div>
              <div className="absolute bottom-1.5 left-1.5">
                <span className="bg-black/60 text-white px-1.5 py-0.5 rounded text-[8px] font-medium">
                  {TYPE_LABELS[asset.type]}
                </span>
              </div>
            </div>
            <div className="p-2">
              <div className="text-[11px] font-semibold text-gray-800 truncate">{asset.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-gray-400">
                  {asset.file_size_kb ? `${asset.file_size_kb} KB` : '—'}
                </span>
                <span className="text-[9px] text-gray-400">
                  {new Date(asset.uploaded_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorAssetLibrary;
