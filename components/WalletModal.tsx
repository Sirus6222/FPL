import React, { useState, useEffect } from 'react';
import { X, Smartphone, CreditCard, CheckCircle, Loader2, ArrowDownCircle, ArrowUpCircle, Coins, Sparkles } from 'lucide-react';
import { CURRENCY_SYMBOL, COIN_BUNDLES } from '../constants';

// Derive wallet coin packages from the canonical COIN_BUNDLES (first 4 tiers)
const COIN_PACKAGES = COIN_BUNDLES.slice(0, 4).map(b => ({
  id: b.bundle_id,
  coins: b.coins,
  price: b.price_etb,
  bonus: b.bonus_coins,
  label: b.name.replace(' Pack', '').replace(' Bundle', ''),
}));

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
  initialMode?: 'deposit' | 'withdraw' | 'coins';
  balance: number;
  coins?: number;
  onPurchaseCoins?: (coinsAmount: number, etbPrice: number) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onTransaction, initialMode = 'deposit', balance, coins = 0, onPurchaseCoins }) => {
  const [mode, setMode] = useState<'deposit' | 'withdraw' | 'coins'>(initialMode);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<typeof COIN_PACKAGES[0] | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setStep(1);
    setAmount('');
    setSelectedPackage(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleAction = () => {
    if (mode === 'coins') {
      if (!selectedPackage || !phone) return;
      if (selectedPackage.price > balance) {
        alert("Insufficient ETB balance! Please deposit first.");
        return;
      }
      setStep(2);
      setTimeout(() => {
        // Deduct ETB and add coins
        onTransaction(selectedPackage.price, 'withdraw');
        if (onPurchaseCoins) {
          onPurchaseCoins(selectedPackage.coins + selectedPackage.bonus, selectedPackage.price);
        }
        setStep(3);
      }, 2000);
      return;
    }

    if (!amount || !phone) return;
    const numAmount = Number(amount);

    if (mode === 'withdraw' && numAmount > balance) {
        alert("Insufficient balance!");
        return;
    }

    setStep(2); // Loading/Processing
    setTimeout(() => {
      onTransaction(numAmount, mode);
      setStep(3); // Success
    }, 2000);
  };

  const reset = () => {
    setStep(1);
    setAmount('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-white p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mode === 'deposit' ? 'bg-telebirr-bg' : 'bg-gray-800'}`}>
              <span className="text-white font-bold text-xs">tb</span>
            </div>
            <h2 className="font-bold text-gray-800">Telebirr {mode === 'deposit' ? 'Deposit' : 'Withdrawal'}</h2>
          </div>
          <button onClick={reset} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Mode Toggle */}
        {step === 1 && (
            <div className="flex p-2 bg-gray-50 border-b border-gray-100 gap-1">
                <button
                    onClick={() => setMode('deposit')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition ${mode === 'deposit' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                >
                    <ArrowDownCircle size={14} /> Deposit
                </button>
                <button
                    onClick={() => setMode('withdraw')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition ${mode === 'withdraw' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
                >
                    <ArrowUpCircle size={14} /> Withdraw
                </button>
                <button
                    onClick={() => setMode('coins')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition ${mode === 'coins' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-400'}`}
                >
                    <Coins size={14} /> Buy Coins
                </button>
            </div>
        )}

        {/* Content */}
        <div className="p-6">
          {step === 1 && mode !== 'coins' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({CURRENCY_SYMBOL})</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{CURRENCY_SYMBOL}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-telebirr-bg focus:border-transparent outline-none font-bold text-lg"
                    placeholder="100"
                  />
                </div>
                {mode === 'withdraw' && (
                    <div className="text-xs text-right mt-1 text-gray-500">Available: {balance} {CURRENCY_SYMBOL}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-telebirr-bg focus:border-transparent outline-none"
                    placeholder="+251 911 234 567"
                  />
                </div>
              </div>

              <button
                onClick={handleAction}
                disabled={!amount || !phone}
                className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${mode === 'deposit' ? 'bg-telebirr-bg hover:bg-opacity-90' : 'bg-gray-800 hover:bg-gray-900'}`}
              >
                {mode === 'deposit' ? 'Pay Now' : 'Withdraw Funds'}
              </button>
              <p className="text-xs text-center text-gray-400 mt-2">Secured by Ethio Telecom</p>
            </div>
          )}

          {step === 1 && mode === 'coins' && (
            <div className="space-y-4">
              {/* Current balance display */}
              <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Coins size={20} className="text-yellow-600" />
                  <span className="text-sm text-yellow-700">Your Coins</span>
                </div>
                <span className="font-bold text-yellow-700">{coins.toLocaleString()}</span>
              </div>

              {/* Coin packages */}
              <div className="grid grid-cols-2 gap-2">
                {COIN_PACKAGES.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-3 rounded-xl border-2 text-left transition ${
                      selectedPackage?.id === pkg.id
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    {pkg.bonus > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-yellow-600 font-bold mb-1">
                        <Sparkles size={10} />
                        +{pkg.bonus} BONUS
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Coins size={14} className="text-yellow-600" />
                      <span className="font-bold text-gray-800">{pkg.coins.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{CURRENCY_SYMBOL} {pkg.price}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{pkg.label}</div>
                  </button>
                ))}
              </div>

              {/* Phone input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (Telebirr)</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    placeholder="+251 911 234 567"
                  />
                </div>
                <div className="text-xs text-right mt-1 text-gray-500">ETB Balance: {balance} {CURRENCY_SYMBOL}</div>
              </div>

              <button
                onClick={handleAction}
                disabled={!selectedPackage || !phone || (selectedPackage && selectedPackage.price > balance)}
                className="w-full bg-yellow-500 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-yellow-600"
              >
                <Coins size={18} />
                {selectedPackage ? `Buy ${selectedPackage.coins + selectedPackage.bonus} Coins for ${CURRENCY_SYMBOL} ${selectedPackage.price}` : 'Select a Package'}
              </button>
              <p className="text-xs text-center text-gray-400">Coins are non-refundable virtual currency</p>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center py-8">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-telebirr-bg/30 border-t-telebirr-bg rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-telebirr-bg">tb</span>
                </div>
              </div>
              <h3 className="mt-4 font-semibold text-gray-800">Processing {mode === 'deposit' ? 'Payment' : 'Transfer'}...</h3>
              <p className="text-sm text-gray-500 text-center mt-2">Please check your phone for the USSD prompt.</p>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Transaction Successful!</h3>
              <p className="text-gray-500 mt-1 mb-6">{mode === 'deposit' ? 'Wallet topped up.' : 'Funds withdrawn to Telebirr.'}</p>
              <button 
                onClick={reset}
                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;