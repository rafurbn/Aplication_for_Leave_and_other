import React from 'react';

export const AdSlot: React.FC<{ slotId?: string; format?: 'banner' | 'card' | 'inline' }> = ({ slotId = 'ads-placeholder-1' }) => (
  <div className="my-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500 no-print">
    বিজ্ঞাপন স্লট: {slotId}
  </div>
);
