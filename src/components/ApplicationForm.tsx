import React from 'react';
import { FormatTemplate, ApplicationFormData } from '../types';
import { calculateBanglaDuration, toBanglaDate } from '../utils/banglaUtils';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Send, 
  User, 
  Phone, 
  RotateCcw, 
  Wand2, 
  FileText, 
  Info,
  Clock
} from 'lucide-react';

interface ApplicationFormProps {
  template: FormatTemplate;
  formData: ApplicationFormData;
  onChange: (updated: Partial<ApplicationFormData>) => void;
  onReset: () => void;
  onFillSample: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  template,
  formData,
  onChange,
  onReset,
  onFillSample,
}) => {
  const isEmployee = template.category === 'employee';

  // Handle start/end date changes and auto-calculate Bengali duration
  const handleStartDateChange = (val: string) => {
    const end = formData.leaveEndDate && formData.leaveEndDate >= val ? formData.leaveEndDate : val;
    const dur = calculateBanglaDuration(val, end);
    onChange({
      leaveStartDate: val,
      leaveEndDate: end,
      totalDays: dur.text,
    });
  };

  const handleEndDateChange = (val: string) => {
    const start = formData.leaveStartDate || val;
    const dur = calculateBanglaDuration(start, val);
    onChange({
      leaveEndDate: val,
      totalDays: dur.text,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-6">
      
      {/* Header and Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {template.badge} • তথ্য পূরণ ফর্ম
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            {template.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFillSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
            title="দ্রুত প্রিভিউ দেখতে নমুনা তথ্য বসান"
          >
            <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>নমুনা তথ্য বসান</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
            title="ফর্ম রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট</span>
          </button>
        </div>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        {/* Recipient & Organization Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            ১. প্রাপক ও প্রতিষ্ঠান (বরাবর)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Recipient Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                বরাবর (প্রাপকের পদবি) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.recipient}
                onChange={(e) => onChange({ recipient: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                {template.recipientOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                <option value="অন্যান্য">অন্যান্য (নিজে লিখুন)</option>
              </select>
            </div>

            {/* Custom Recipient if selected */}
            {formData.recipient === 'অন্যান্য' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  কাস্টম প্রাপক লিখুন
                </label>
                <input
                  type="text"
                  value={formData.customRecipient || ''}
                  onChange={(e) => onChange({ customRecipient: e.target.value })}
                  placeholder="যেমন: বিভাগীয় উপপরিচালক"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            )}

            {/* Organization / Office Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isEmployee ? 'কার্যালয় / অফিস' : 'বিদ্যালয়ের নাম'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => onChange({ organization: e.target.value })}
                placeholder={isEmployee ? 'উপজেলা শিক্ষা অফিস' : 'মডেল উচ্চ বিদ্যালয়'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Through (মাধ্যম) Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                মাধ্যম (Through)
              </label>
              <select
                value={formData.through || 'সরাসরি'}
                onChange={(e) => onChange({ through: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                {template.throughOptions?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                )) || (
                  <>
                    <option value="যথাযথ কর্তৃপক্ষের মাধ্যমে">যথাযথ কর্তৃপক্ষের মাধ্যমে</option>
                    <option value="প্রধান শিক্ষকের মাধ্যমে">প্রধান শিক্ষকের মাধ্যমে</option>
                    <option value="সরাসরি">সরাসরি</option>
                  </>
                )}
              </select>
            </div>

            {/* Upazila / Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                উপজেলা / থানা
              </label>
              <input
                type="text"
                value={formData.upazilaOrArea}
                onChange={(e) => onChange({ upazilaOrArea: e.target.value })}
                placeholder="যেমন: বিয়ানীবাজার"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                জেলা <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => onChange({ district: e.target.value })}
                placeholder="যেমন: সিলেট"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Applicant Details Section */}
        <div className="space-y-4 pt-3 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            ২. আবেদনকারীর তথ্য
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Applicant Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                আবেদনকারীর নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => onChange({ applicantName: e.target.value })}
                placeholder="যেমন: মোছাঃ রোকেয়া খাতুন"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Designation / Role Selection */}
            {isEmployee ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পদবি নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => onChange({ designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  {template.designationOptions.map((desig) => (
                    <option key={desig} value={desig}>
                      {desig}
                    </option>
                  ))}
                  <option value="অন্যান্য">অন্যান্য (কাস্টম লিখুন)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  শ্রেণি <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.studentClass || '১০ম শ্রেণি'}
                  onChange={(e) => onChange({ studentClass: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  {template.fields.find(f => f.key === 'studentClass')?.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  )) || (
                    <>
                      <option value="১০ম শ্রেণি (এসএসসি পরীক্ষার্থী)">১০ম শ্রেণি (এসএসসি পরীক্ষার্থী)</option>
                      <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
                      <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                      <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                      <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                      <option value="৫ম শ্রেণি">৫ম শ্রেণি</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Custom designation if "অন্যান্য" */}
            {isEmployee && formData.designation === 'অন্যান্য' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  কাস্টম পদবি লিখুন
                </label>
                <input
                  type="text"
                  value={formData.customDesignation || ''}
                  onChange={(e) => onChange({ customDesignation: e.target.value })}
                  placeholder="যেমন: অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            )}

            {/* School / Institution Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isEmployee ? 'বিদ্যালয় / কর্মস্থলের নাম' : 'বিদ্যালয়ের নাম'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.workplace}
                onChange={(e) => onChange({ workplace: e.target.value })}
                placeholder="যেমন: ৫৮নং বৈরাগীবাজার সরকারি প্রাথমিক বিদ্যালয়"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Student Roll or Employee ID */}
            {isEmployee ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  শিক্ষক পরিচিতি / আইডি নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formData.employeeId || ''}
                  onChange={(e) => onChange({ employeeId: e.target.value })}
                  placeholder="যেমন: ৯১২০৮৫৭৪৬"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  শ্রেণি রোল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.rollNumber || ''}
                  onChange={(e) => onChange({ rollNumber: e.target.value })}
                  placeholder="যেমন: ০৫"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            )}

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                মোবাইল নম্বর <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => onChange({ mobile: e.target.value })}
                placeholder="যেমন: ০১৭১২-৩৪৫৬৭৮"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Specific Form Fields (Joining type, Leave Dates, Reasons, etc.) */}
        <div className="space-y-4 pt-3 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            ৩. আবেদনের বিষয়বস্তু ও বিবরণ
          </h4>

          {/* Joining Letter Special Dropdown */}
          {template.id === 'joining_letter' && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 space-y-3">
              <label className="block text-xs font-bold text-emerald-950">
                যোগদানের ক্যাটাগরি / ছুটির ধরন নির্বাচন করুন <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.joiningType || template.joiningTypeOptions?.[0]}
                onChange={(e) => onChange({ joiningType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-sm font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                {template.joiningTypeOptions?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    যোগদানের তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate || ''}
                    onChange={(e) => onChange({ joiningDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    যোগদানের সেশন
                  </label>
                  <select
                    value={formData.joiningTimeSession || 'পূর্বাহ্ণ'}
                    onChange={(e) => onChange({ joiningTimeSession: e.target.value as 'পূর্বাহ্ণ' | 'অপরাহ্ণ' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="পূর্বাহ্ণ">পূর্বাহ্ণ</option>
                    <option value="অপরাহ্ণ">অপরাহ্ণ</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Leave Dates (For templates with date-ranges) */}
          {template.id !== 'joining_letter' && template.id !== 'student_tc' && template.id !== 'student_testimonial' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  শুরুর তারিখ
                </label>
                <input
                  type="date"
                  value={formData.leaveStartDate || ''}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  শেষের তারিখ
                </label>
                <input
                  type="date"
                  value={formData.leaveEndDate || ''}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  স্বয়ংক্রিয় গণনা (মোট দিন)
                </label>
                <input
                  type="text"
                  value={formData.totalDays || ''}
                  onChange={(e) => onChange({ totalDays: e.target.value })}
                  placeholder="যেমন: ৩ (তিন) দিন"
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-sm font-semibold text-emerald-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Dynamic Template Fields */}
          {template.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>

              {field.type === 'select' && field.options ? (
                <select
                  value={(formData as any)[field.key] || field.defaultValue}
                  onChange={(e) => onChange({ [field.key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  rows={2}
                  value={(formData as any)[field.key] || ''}
                  onChange={(e) => onChange({ [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              ) : (
                <input
                  type="text"
                  value={(formData as any)[field.key] || ''}
                  onChange={(e) => onChange({ [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              )}

              {field.helperText && (
                <p className="mt-1 text-[11px] text-slate-500">{field.helperText}</p>
              )}
            </div>
          ))}

          {/* Subject Field (User can customize if desired) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              আবেদনপত্রের বিষয় (Subject)
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => onChange({ subject: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

        </div>

      </form>
    </div>
  );
};
