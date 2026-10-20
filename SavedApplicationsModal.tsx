import React from 'react';
import { SavedApplication } from '../types';
import { toBanglaDate } from '../utils/banglaUtils';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  X, 
  Calendar, 
  FileText,
  User,
  Building
} from 'lucide-react';

interface SavedApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedApps: SavedApplication[];
  onLoadApp: (app: SavedApplication) => void;
  onDeleteApp: (id: string) => void;
}

export const SavedApplicationsModal: React.FC<SavedApplicationsModalProps> = ({
  isOpen,
  onClose,
  savedApps,
  onLoadApp,
  onDeleteApp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print animate-fade-in">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                সংরক্ষিত দরখাস্তসমূহ (My Saved Applications)
              </h3>
              <p className="text-xs text-slate-500">
                আপনার ব্রাউজারের লোকাল স্টোরেজে মোট {savedApps.length} টি দরখাস্ত সংরক্ষিত রয়েছে
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal List Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedApps.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <FileText className="w-12 h-12 mx-auto stroke-[1.5] text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">কোনো সংরক্ষিত দরখাস্ত নেই</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                যেকোনো দরখাস্ত তৈরি করার সময় উপরের "সেভ করুন" বাটনে ক্লিক করলে তা এখানে দেখতে পাবেন।
              </p>
            </div>
          ) : (
            savedApps.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.formatTitle}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {toBanglaDate(new Date(item.createdAt))}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {item.subject}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.applicantName || 'আবেদনকারী'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {item.workplace || 'প্রতিষ্ঠান'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onLoadApp(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>লোড করুন</span>
                  </button>

                  <button
                    onClick={() => onDeleteApp(item.id)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
