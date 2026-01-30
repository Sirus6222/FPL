import React, { useState, useEffect } from 'react';
import { X, Smartphone, CreditCard, CheckCircle, Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../constants';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
  initialMode?: 'deposit' | 'withdraw';
  balance: number;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onTransaction, initialMode = 'deposit', balance }) => {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>(initialMode);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    setMode(initialMode);
    setStep(1);
    setAmount('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleAction = () => {
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
            <div className="flex p-2 bg-gray-50 border-b border-gray-100">
                <button 
                    onClick={() => setMode('deposit')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition ${mode === 'deposit' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                >
                    <ArrowDownCircle size={16} /> Deposit
                </button>
                <button 
                    onClick={() => setMode('withdraw')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition ${mode === 'withdraw' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
                >
                    <ArrowUpCircle size={16} /> Withdraw
                </button>
            </div>
        )}

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
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