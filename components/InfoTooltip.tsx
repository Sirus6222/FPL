import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  text: string;
  details?: string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md';
  iconClassName?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  text,
  details,
  position = 'bottom',
  size = 'sm',
  iconClassName = 'text-gray-400'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2'
  };

  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <div className="relative inline-flex" ref={tooltipRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className={`${iconClassName} hover:text-pl-purple transition p-0.5 rounded-full hover:bg-gray-100`}
        aria-label={`Info: ${title}`}
      >
        <HelpCircle size={iconSize} />
      </button>

      {isOpen && (
        <div className={`absolute z-[90] ${positionClasses[position]} w-64 animate-in fade-in zoom-in-95 duration-150`}>
          <div className="bg-gray-900 text-white rounded-xl shadow-xl border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-gray-700/50">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <HelpCircle size={12} className="text-pl-green" />
                {title}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="text-gray-500 hover:text-white p-0.5"
              >
                <X size={12} />
              </button>
            </div>

            {/* Body */}
            <div className="px-3 py-2.5">
              <p className="text-[11px] text-gray-300 leading-relaxed">{text}</p>

              {details && details.length > 0 && (
                <div className="mt-2 space-y-1 border-t border-gray-700/50 pt-2">
                  {details.map((detail, i) => (
                    <div key={i} className="text-[10px] text-gray-400 flex items-start gap-1.5">
                      <span className="text-pl-green shrink-0 mt-0.5">•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
