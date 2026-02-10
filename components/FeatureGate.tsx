import React from 'react';
import { Lock } from 'lucide-react';
import type { FeatureStatus } from '../hooks/useFeatureAccess';

interface FeatureGateProps {
  status: FeatureStatus;
  children: React.ReactNode;
  /** 'hide' = render nothing; 'overlay' = blur + lock badge; 'disabled' = opacity + lock badge */
  variant?: 'hide' | 'overlay' | 'disabled';
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  status,
  children,
  variant = 'overlay',
}) => {
  // Accessible — render children as-is
  if (status.isAccessible) {
    return <>{children}</>;
  }

  // Not accessible — decide how to render locked state
  if (variant === 'hide') {
    return null;
  }

  // Admin killed the feature globally — show "Coming Soon"
  if (!status.isGloballyEnabled) {
    if (variant === 'disabled') {
      return (
        <div className="relative opacity-40 pointer-events-none select-none">
          {children}
          <span className="absolute top-1 right-1 text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 z-10">
            <Lock size={8} />
            Soon
          </span>
        </div>
      );
    }
    // overlay variant
    return (
      <div className="relative overflow-hidden rounded-xl">
        <div className="opacity-40 pointer-events-none select-none">{children}</div>
        <div className="absolute inset-0 bg-gray-100/40 backdrop-blur-[1px] z-20 flex items-center justify-center">
          <div className="bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-2">
            <Lock size={12} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-500">Coming Soon</span>
          </div>
        </div>
      </div>
    );
  }

  // Stage not reached — show unlock requirement
  if (variant === 'disabled') {
    return (
      <div className="relative opacity-60 pointer-events-none select-none">
        {children}
        <span className="absolute top-1 right-1 text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 z-10">
          <Lock size={8} />
          Stage {status.requiredStage}
        </span>
      </div>
    );
  }

  // overlay variant — blur with lock badge
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="opacity-50 pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 bg-gray-100/30 backdrop-blur-[1px] z-20 flex items-center justify-center">
        <div className="bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-2">
          <Lock size={12} className="text-orange-500" />
          <span className="text-xs font-bold text-gray-700">{status.lockMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default FeatureGate;
