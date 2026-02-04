import React, { useState } from 'react';
import { X, Coins, Gift, Star, Sparkles, CheckCircle, ChevronRight, CreditCard } from 'lucide-react';
import { CoinBundle } from '../types';

interface CoinShopProps {
  bundles: CoinBundle[];
  userCoins: number;
  onClose: () => void;
  onPurchase: (bundle: CoinBundle) => void;
}

const CoinShop: React.FC<CoinShopProps> = ({
  bundles,
  userCoins,
  onClose,
  onPurchase
}) => {
  const [selectedBundle, setSelectedBundle] = useState<CoinBundle | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePurchaseClick = (bundle: CoinBundle) => {
    setSelectedBundle(bundle);
    setShowConfirm(true);
  };

  const confirmPurchase = () => {
    if (selectedBundle) {
      onPurchase(selectedBundle);
      setShowConfirm(false);
      setSelectedBundle(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-gray-50 w-full sm:max-w-lg sm:rounded-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-4 text-white">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Coins size={20} />
                Coin Shop
              </h2>
              <p className="text-xs opacity-80">Buy coins to enter contests & unlock features</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current Balance */}
          <div className="bg-white/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase opacity-80">Your Balance</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Coins size={24} className="text-yellow-200" />
                {userCoins.toLocaleString()}
              </div>
            </div>
            <Sparkles size={32} className="text-white/30" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Gift size={18} className="text-blue-500 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-blue-800">What can you do with coins?</h3>
                <ul className="text-[10px] text-blue-700 mt-1 space-y-0.5">
                  <li>• Enter paid contests for bigger prizes</li>
                  <li>• Play premium mini-games</li>
                  <li>• Buy exclusive avatar items</li>
                  <li>• Unlock special features</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bundle Grid */}
          <div className="grid grid-cols-2 gap-3">
            {bundles.map(bundle => (
              <div
                key={bundle.bundle_id}
                onClick={() => handlePurchaseClick(bundle)}
                className={`relative bg-white rounded-xl border-2 p-3 cursor-pointer transition-all hover:shadow-md ${
                  bundle.is_popular
                    ? 'border-purple-400 shadow-purple-100'
                    : bundle.is_best_value
                    ? 'border-green-400 shadow-green-100'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Badge */}
                {bundle.is_popular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    POPULAR
                  </div>
                )}
                {bundle.is_best_value && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    BEST VALUE
                  </div>
                )}

                {/* Content */}
                <div className="text-center">
                  {/* Coin Icon */}
                  <div className="relative inline-block mb-2">
                    <Coins size={32} className="text-yellow-500" />
                    {bundle.bonus_coins > 0 && (
                      <Star size={14} className="absolute -top-1 -right-1 text-orange-500 fill-orange-500" />
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-lg font-bold text-gray-800">
                    {bundle.coins.toLocaleString()}
                  </div>
                  {bundle.bonus_coins > 0 && (
                    <div className="text-xs text-green-600 font-medium">
                      +{bundle.bonus_coins} bonus
                    </div>
                  )}

                  {/* Name */}
                  <div className="text-[10px] text-gray-500 mt-0.5">{bundle.name}</div>

                  {/* Price */}
                  <div className="mt-2 bg-gradient-to-r from-pl-purple to-indigo-500 text-white font-bold py-1.5 px-3 rounded-lg text-sm">
                    {bundle.price_display}
                  </div>

                  {/* Discount */}
                  {bundle.discount_percent > 0 && (
                    <div className="mt-1 text-[10px] text-green-600 font-medium">
                      Save {bundle.discount_percent}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl p-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Payment Methods</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-green-50 rounded-lg p-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">TB</div>
                <div>
                  <div className="text-xs font-bold text-gray-800">Telebirr</div>
                  <div className="text-[10px] text-gray-500">Mobile Money</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">CB</div>
                <div>
                  <div className="text-xs font-bold text-gray-800">CBE Birr</div>
                  <div className="text-[10px] text-gray-500">Bank Transfer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <p className="text-[9px] text-gray-400 text-center">
            By purchasing, you agree to our Terms of Service. Coins are non-refundable.
            All transactions are processed securely via Telebirr or CBE Birr.
          </p>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && selectedBundle && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-4 animate-scale-in">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3">
                  <Coins size={32} className="text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Confirm Purchase</h3>
                <p className="text-sm text-gray-500">{selectedBundle.name}</p>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Coins:</span>
                  <span className="font-bold">{selectedBundle.coins.toLocaleString()}</span>
                </div>
                {selectedBundle.bonus_coins > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bonus:</span>
                    <span className="font-bold text-green-600">+{selectedBundle.bonus_coins.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                  <span className="text-gray-500">Total Coins:</span>
                  <span className="font-bold text-lg">{(selectedBundle.coins + selectedBundle.bonus_coins).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-bold text-pl-purple">{selectedBundle.price_display}</span>
                </div>
              </div>

              {/* Payment Icon */}
              <div className="flex items-center justify-center gap-2 mb-4 text-gray-500 text-xs">
                <CreditCard size={14} />
                Pay with Telebirr or CBE Birr
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedBundle(null);
                  }}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-amber-600 transition flex items-center justify-center gap-1"
                >
                  <CheckCircle size={16} />
                  Purchase
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinShop;
