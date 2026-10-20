import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'banner' | 'card' | 'inline';
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotId = 'ads-placeholder-1', format = 'banner' }) => {
  return (
    <div className="w-full my-6 no-print">
      <div className="border border-dashed border-slate-300 bg-slate-50/80 rounded-xl p-3 text-center transition-all hover:bg-slate-100/60">
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
          <span>বিজ্ঞাপন</span>
          <span className="text-[10px] text-slate-500">(Google AdSense Slot - Phase 2)</span>
        </div>
        <div className={`flex items-center justify-center ${format === 'banner' ? 'h-20 md:h-24' : 'h-32'} rounded-lg bg-white border border-slate-200 text-slate-500 text-xs shadow-inner`}>
          <div className="space-y-1">
            <p className="font-semibold text-slate-600">রেসপন্সিভ বিজ্ঞাপন স্লট ({slotId})</p>
            <p className="text-[11px] text-slate-500">পরবর্তী আপডেটে গুগল অ্যাডসেন্স কোড সক্রিয় হবে</p>
          </div>
        </div>
      </div>
    </div>
  );
};
