import React from 'react';
import { X, Bell, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
        case 'deadline': return <AlertCircle size={18} className="text-red-500" />;
        case 'prize': return <CheckCircle size={18} className="text-green-500" />;
        default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-xs rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2"><Bell size={16}/> Notifications</h3>
            <button onClick={onClose}><X size={16} className="text-gray-500" /></button>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">No new notifications</div>
            ) : (
                notifications.map(notif => (
                    <div key={notif.notification_id} className="p-3 border-b border-gray-100 hover:bg-gray-50 transition">
                        <div className="flex gap-3">
                            <div className="mt-1">{getIcon(notif.type)}</div>
                            <div>
                                <div className="text-xs font-bold text-gray-800">{notif.title}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{notif.message}</div>
                                <div className="text-[9px] text-gray-400 mt-1">{notif.created_at}</div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;