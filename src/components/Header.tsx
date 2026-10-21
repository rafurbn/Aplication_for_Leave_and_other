import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { toBanglaNumber } from '../utils/banglaUtils';
import { 
  Download, 
  FileText, 
  Bookmark, 
  ShieldCheck, 
  WifiOff, 
  Share2, 
  Smartphone
} from 'lucide-react';

interface HeaderProps {
  onOpenSaved: () => void;
  onOpenAdmin: () => void;
  savedCount: number;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSaved,
  onOpenAdmin,
  savedCount,
  onGoHome,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSModal, setShowIOSModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Brand Logo & Title */}
            <div 
              onClick={onGoHome}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 transition-transform group-hover:scale-105">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight tracking-tight">
                    আবেদনপত্র প্রস্তুতকারক
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    PWA v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Automated Application Writer • প্রাথমিক বিদ্যালয় ও শিক্ষার্থী স্পেশাল
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Offline indicator if connection lost */}
              {!isOnline && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium border border-amber-300 animate-pulse">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">অফলাইন মোড</span>
                </div>
              )}

              {/* PWA Install Button */}
              {!isInstalled && isInstallable && (
                <button
                  onClick={install}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
                  title="হোম স্ক্রিনে অ্যাপ ইনস্টল করুন"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Install App</span>
                </button>
              )}

              {!isInstalled && isIOS && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">iOS ইনস্টল</span>
                </button>
              )}

              {/* My Saved Applications */}
              <button
                onClick={onOpenSaved}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
                title="সংরক্ষিত দরখাস্তসমূহ দেখুন"
              >
                <Bookmark className="w-4 h-4 text-emerald-700" />
                <span className="hidden md:inline">সংরক্ষিত দরখাস্ত</span>
                {savedCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-emerald-600 rounded-full">
                    {toBanglaNumber(savedCount)}
                  </span>
                )}
              </button>

              {/* Admin Panel Button */}
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs sm:text-sm font-medium transition-colors"
                title="অ্যাডমিন ড্যাশবোর্ড"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span className="hidden lg:inline">অ্যাডমিন</span>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* iOS Installation Instruction Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  iPhone / iPad এ অ্যাপ ইনস্টল করার নিয়ম
                </h3>
                <p className="text-xs text-slate-500">Safari ব্রাউজার দিয়ে অতি সহজেই যুক্ত করুন</p>
              </div>
            </div>

            <ol className="space-y-3 text-sm text-slate-700 my-4 pl-1">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center mt-0.5">
                  ১
                </span>
                <span>
                  Safari ব্রাউজারের নিচের টুলবারের <strong className="text-slate-900">Share</strong> (শেয়ার) বাটনে ট্যাপ করুন।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center mt-0.5">
                  ২
                </span>
                <span>
                  মেনু স্ক্রল করে <strong className="text-slate-900">"Add to Home Screen"</strong> অপশনটিতে ট্যাপ করুন।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center mt-0.5">
                  ৩
                </span>
                <span>
                  উপরে ডানপাশে <strong className="text-slate-900">"Add"</strong> বাটনে চাপ দিন। আপনার হোমস্ক্রিনে অ্যাপ আইকন তৈরি হয়ে যাবে!
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-2 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </>
  );
};
