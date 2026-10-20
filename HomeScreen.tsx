import React, { useState } from 'react';
import { FormatTemplate, SubCategoryType } from '../types';
import { ALL_TEMPLATES } from '../data/templates';
import { 
  Briefcase, 
  GraduationCap, 
  Search, 
  Sparkles, 
  CalendarDays, 
  Activity, 
  HeartHandshake, 
  FileCheck, 
  Clock, 
  ShieldCheck, 
  Plane, 
  Award, 
  CalendarCheck, 
  BookOpen, 
  Gift, 
  ArrowRightLeft, 
  BadgeCheck, 
  UserCheck,
  ChevronRight,
  Zap,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { AdSlot } from './AdSlot';

interface HomeScreenProps {
  onSelectTemplate: (templateId: SubCategoryType) => void;
}

// Icon mapper helper
const getFormatIcon = (iconName: string) => {
  switch (iconName) {
    case 'CalendarDays': return <CalendarDays className="w-5 h-5 text-emerald-600" />;
    case 'Activity': return <Activity className="w-5 h-5 text-rose-600" />;
    case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-pink-600" />;
    case 'FileCheck': return <FileCheck className="w-5 h-5 text-blue-600" />;
    case 'Clock': return <Clock className="w-5 h-5 text-amber-600" />;
    case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
    case 'Plane': return <Plane className="w-5 h-5 text-cyan-600" />;
    case 'Award': return <Award className="w-5 h-5 text-purple-600" />;
    case 'CalendarCheck': return <CalendarCheck className="w-5 h-5 text-teal-600" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-600" />;
    case 'Gift': return <Gift className="w-5 h-5 text-emerald-600" />;
    case 'ArrowRightLeft': return <ArrowRightLeft className="w-5 h-5 text-orange-600" />;
    case 'BadgeCheck': return <BadgeCheck className="w-5 h-5 text-amber-600" />;
    case 'UserCheck': return <UserCheck className="w-5 h-5 text-violet-600" />;
    default: return <GraduationCap className="w-5 h-5 text-emerald-600" />;
  }
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectTemplate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'employee' | 'student'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const employeeTemplates = ALL_TEMPLATES.filter((t) => t.category === 'employee');
  const studentTemplates = ALL_TEMPLATES.filter((t) => t.category === 'student');

  const filterTemplate = (t: FormatTemplate) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.shortTitle.toLowerCase().includes(query) ||
      t.defaultSubject.toLowerCase().includes(query)
    );
  };

  const filteredEmployee = employeeTemplates.filter(filterTemplate);
  const filteredStudent = studentTemplates.filter(filterTemplate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white p-6 sm:p-10 shadow-xl shadow-emerald-950/20 mb-10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>স্বয়ংক্রিয় দরখাস্ত প্রস্তুতকারক • নো-লগইন • অফলাইন PWA</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
            মাত্র কয়েকটি ইনপুটে প্রস্তুত করুন নিখুঁত <span className="text-amber-300">অফিশিয়াল বাংলা দরখাস্ত</span>
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            সরকারি প্রাথমিক বিদ্যালয়ের সহকারী ও প্রধান শিক্ষকদের জন্য ৮টি বিশেষ সরকারি ফরম্যাট এবং স্কুল-কলেজের শিক্ষার্থীদের জন্য ৭টি প্রাতিষ্ঠানিক ফরম্যাট। সরাসরি প্রিন্ট ও PDF ডাউনলোড করুন।
          </p>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm text-emerald-100 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              সরকারি নিয়ম অনুযায়ী সঠিক ভাষা
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-300" />
              লাইভ প্রিভিউ ও ১-ক্লিকে PDF
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-300" />
              ডাটা থাকবে আপনার ডিভাইসেই
            </span>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none hidden md:block">
          <Briefcase className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Search & Category Filter Navigation */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Big Two-Part Selector Buttons */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/80 shadow-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সব ফরম্যাট ({ALL_TEMPLATES.length})
            </button>
            <button
              onClick={() => setActiveTab('employee')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'employee'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              ১. চাকরিজীবী পার্ট ({employeeTemplates.length})
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'student'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              ২. শিক্ষার্থী পার্ট ({studentTemplates.length})
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative min-w-[260px] sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="দরখাস্ত খুঁজুন (যেমন: ছুটি, পাসপোর্ট, টিসি)..."
              className="w-full pl-9.5 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                মুছুন
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid Sections */}
      <div className="space-y-12">
        
        {/* PART 1: Govt Primary School Teachers / Employee Section */}
        {(activeTab === 'all' || activeTab === 'employee') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    পার্ট ১: চাকরিজীবী (প্রাথমিক বিদ্যালয় স্পেশাল)
                  </h3>
                  <p className="text-xs text-slate-500">
                    সহকারী শিক্ষক, প্রধান শিক্ষক (চলতি দায়িত্বসহ) ও সরকারি কর্মকর্তা কর্মচারীদের জন্য নির্ধারিত ৮টি ফরম্যাট
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {filteredEmployee.length} টি ফরম্যাট
              </span>
            </div>

            {filteredEmployee.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                কোনো চাকরিজীবী ফরম্যাট খুঁজে পাওয়া যায়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredEmployee.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template.id)}
                    className="group relative flex flex-col justify-between bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                          {getFormatIcon(template.iconName)}
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {template.shortTitle}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {template.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                      <span>তৈরি করুন</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Phase 2 Middle Ad Banner Placeholder */}
        <AdSlot slotId="home-middle-slot" format="banner" />

        {/* PART 2: Student Section */}
        {(activeTab === 'all' || activeTab === 'student') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    পার্ট ২: শিক্ষার্থী (স্কুল, কলেজ ও বিশ্ববিদ্যালয়)
                  </h3>
                  <p className="text-xs text-slate-500">
                    প্রাতিষ্ঠানিক প্রধান (প্রধান শিক্ষক / অধ্যক্ষ) বরাবর আবেদনের জন্য ৭টি প্রয়োজনীয় ফরম্যাট
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {filteredStudent.length} টি ফরম্যাট
              </span>
            </div>

            {filteredStudent.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                কোনো শিক্ষার্থী ফরম্যাট খুঁজে পাওয়া যায়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredStudent.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template.id)}
                    className="group relative flex flex-col justify-between bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          {getFormatIcon(template.iconName)}
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {template.shortTitle}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                          {template.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-800">
                      <span>তৈরি করুন</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
};
