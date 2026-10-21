import React, { useState } from 'react';
import { FormatTemplate, ApplicationFormData } from '../types';
import { generateDocumentContent, documentToPlainText } from '../utils/documentGenerator';
import { getMissingRequiredFields } from '../utils/validation';
import { Bookmark, Check, Copy, Edit3, Printer, ZoomIn, ZoomOut } from 'lucide-react';

interface DocumentPreviewProps {
  template: FormatTemplate;
  formData: ApplicationFormData;
  onSave: () => void;
  onLogGeneration: () => void;
  onBodyChange?: (newBody: string) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  template,
  formData,
  onSave,
  onLogGeneration,
  onBodyChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copyFailed, setCopyFailed] = useState(false);

  const doc = generateDocumentContent(template, formData);

  const handleCopy = async () => {
    const plainText = documentToPlainText(doc);
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2500);
      onLogGeneration();
    } catch {
      setCopyFailed(true);
    }
  };

  const missing = getMissingRequiredFields(template, formData);
  const [showMissingWarning, setShowMissingWarning] = useState(false);

  const handlePrintDocument = () => {
    if (missing.length > 0) {
      setShowMissingWarning(true);
      return;
    }
    setShowMissingWarning(false);
    onLogGeneration();
    window.print();
  };

  const handleSaveClick = () => {
    onSave();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">
              লাইভ A4 প্রিভিউ
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (প্রিন্ট ও PDF রেডি)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              title="সম্পূর্ণ দরখাস্ত কপি করুন"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : copyFailed ? 'কপি করা যায়নি' : 'কপি করুন'}</span>
            </button>

            {/* Save Application Button */}
            <button
              onClick={handleSaveClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              title="ডিভাইসে সেভ করে রাখুন"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-emerald-700" />}
              <span>{savedSuccess ? 'সংরক্ষিত!' : 'সেভ করুন'}</span>
            </button>

            {/* Print & PDF - the browser dialog offers both, no raster library needed */}
            <button
              onClick={handlePrintDocument}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              title="প্রিন্ট ও পিডিএফ"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট ও পিডিএফ</span>
            </button>
          </div>

        </div>

        {/* Second bar: Zoom and direct text edit toggle */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingCustom(!isEditingCustom)}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingCustom ? 'লাইভ প্রিভিউতে ফিরুন' : 'মূল ভাষা কাস্টমাইজ করুন'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span>জুম:</span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
              className="p-1 rounded hover:bg-slate-100 text-slate-600"
              title="জুম আউট"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] min-w-[32px] text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
              className="p-1 rounded hover:bg-slate-100 text-slate-600"
              title="জুম ইন"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 text-[10px]"
              title="রিসেট জুম"
            >
              ১০০%
            </button>
          </div>
        </div>
      </div>

      {showMissingWarning && missing.length > 0 && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs sm:text-sm text-rose-900 no-print">
          <span className="font-bold">প্রয়োজনীয় তথ্য পূরণ করুন: </span>
          {missing.join(', ')}
        </div>
      )}

      {/* Custom Body Editor Panel if toggled */}
      {isEditingCustom && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2 no-print animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">
              মূল দরখাস্তের প্যারাগ্রাফ সরাসরি সম্পাদনা
            </span>
            <button
              onClick={() => onBodyChange && onBodyChange('')}
              className="text-[11px] text-amber-700 hover:underline"
            >
              ডিফল্ট ভাষায় ফিরুন
            </button>
          </div>
          <textarea
            rows={5}
            value={formData.customBodyText || doc.bodyParagraphs.join('\n\n')}
            onChange={(e) => onBodyChange && onBodyChange(e.target.value)}
            className="w-full p-3 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            placeholder="এখানে দরখাস্তের ভেতরের প্যারাগ্রাফ কাস্টমাইজ করে লিখে নিতে পারেন..."
          />
          <p className="text-[11px] text-amber-800">
            * প্যারাগ্রাফ আলাদা করতে ডাবল এন্টার (Enter) ব্যবহার করুন।
          </p>
        </div>
      )}

      {/* Realistic Official A4 Paper Container */}
      <div className="a4-preview-shell overflow-x-auto flex justify-center py-2 bg-slate-100/60 rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <div
          id="printable-a4-document"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="a4-document-container w-full max-w-[800px] min-h-[1050px] bg-white text-slate-900 p-8 sm:p-14 shadow-lg rounded-sm border border-slate-200 transition-transform duration-150 select-text flex flex-col justify-between"
        >
          
          {/* Document Content */}
          <div className="space-y-5 sm:space-y-6 text-sm sm:text-base leading-relaxed text-slate-900">
            
            {/* Date line */}
            <div className="text-right font-medium text-slate-800">
              {doc.date}
            </div>

            {/* Recipient lines */}
            <div className="space-y-1 font-medium text-slate-900">
              {doc.recipientLines.map((line, idx) => (
                <div key={idx} className={idx === 1 ? 'font-bold' : ''}>
                  {line}
                </div>
              ))}
            </div>

            {/* Through line if present */}
            {doc.throughLine && (
              <div className="font-semibold text-slate-800 pl-4 border-l-2 border-slate-300">
                {doc.throughLine}
              </div>
            )}

            {/* Subject */}
            <div className="pt-1 pb-1">
              <span className="font-bold underline decoration-slate-900 underline-offset-4">
                বিষয়: {doc.subject}
              </span>
            </div>

            {/* Salutation */}
            <div className="font-semibold text-slate-900 pt-1">
              {doc.salutation}
            </div>

            {/* Body Paragraphs */}
            <div className="space-y-4 text-justify leading-relaxed">
              {doc.bodyParagraphs.map((paragraph, idx) => (
                <p key={idx} className="indent-8 sm:indent-12">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Signatory / Applicant block */}
            <div className="pt-8 flex justify-end">
              <div className="w-72 sm:w-80 text-left space-y-1 text-sm sm:text-base">
                <div className="font-semibold">{doc.closing}</div>
                <div className="h-10 border-b border-dashed border-slate-400 my-2 flex items-end">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider pb-0.5">
                    (আবেদনকারীর স্বাক্ষর ও সিল)
                  </span>
                </div>
                <div className="font-bold text-slate-900">
                  {formData.applicantName}
                </div>
                {(formData.customDesignation || formData.designation) && (
                  <div className="text-slate-800">
                    পদবি: {formData.customDesignation || formData.designation}
                  </div>
                )}
                {formData.employeeId && (
                  <div className="text-xs text-slate-700">
                    পরিচিতি নম্বর: {formData.employeeId}
                  </div>
                )}
                {formData.studentClass && !template.category.includes('employee') && (
                  <div className="text-slate-800">
                    শ্রেণি: {formData.studentClass}, রোল: {formData.rollNumber}
                  </div>
                )}
                {formData.workplace && (
                  <div className="text-slate-800">
                    {formData.workplace}
                  </div>
                )}
                {(formData.upazilaOrArea || formData.district) && (
                  <div className="text-slate-700 text-xs sm:text-sm">
                    {[formData.upazilaOrArea, formData.district].filter(Boolean).join(', ')}
                  </div>
                )}
                {formData.mobile && (
                  <div className="text-slate-700 text-xs sm:text-sm">
                    মোবাইল: {formData.mobile}
                  </div>
                )}
              </div>
            </div>

            {/* Attachments if any */}
            {doc.attachmentLines && doc.attachmentLines.length > 0 && (
              <div className="pt-6 border-t border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1">
                <div className="font-bold text-slate-900">সংযুক্তি:</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  {doc.attachmentLines.map((att, i) => (
                    <li key={i}>{att}</li>
                  ))}
                </ol>
              </div>
            )}

          </div>

          {/* Official Document Footer Stamp / Verification Watermark */}
          <div className="pt-8 mt-12 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 print:hidden">
            <span>স্বয়ংক্রিয় দরখাস্ত প্রস্তুতকারক PWA দ্বারা প্রস্তুতকৃত</span>
            <span>A4 Portrait • অফিশিয়াল স্ট্যান্ডার্ড</span>
          </div>

        </div>
      </div>

    </div>
  );
};
