import type { FormatTemplate, ApplicationFormData } from '../types';
import { calculateBanglaDuration, toBanglaDate } from './banglaUtils';

export interface DocumentSection {
  date: string;
  recipientLines: string[];
  throughLine?: string;
  subject: string;
  salutation: string;
  bodyParagraphs: string[];
  closing: string;
  signatoryLines: string[];
  attachmentLines?: string[];
}

export function generateDocumentContent(template: FormatTemplate, formData: ApplicationFormData): DocumentSection {
  const employee = template.category === 'employee';
  const recipient = formData.customRecipient || formData.recipient || template.defaultRecipient;
  const designation = formData.customDesignation || formData.designation;
  const start = formData.leaveStartDate ? toBanglaDate(formData.leaveStartDate) : '';
  const end = formData.leaveEndDate ? toBanglaDate(formData.leaveEndDate) : '';
  const duration = formData.totalDays || calculateBanglaDuration(formData.leaveStartDate, formData.leaveEndDate).text;
  const body = formData.customBodyText?.trim()
    ? formData.customBodyText.split(/\n\s*\n/).filter(Boolean)
    : [`বিনীত নিবেদন এই যে, আমি ${formData.workplace || 'অত্র প্রতিষ্ঠানে'} ${designation || 'শিক্ষার্থী/কর্মচারী'} হিসেবে ${formData.leaveReason || 'জরুরি প্রয়োজনে'} এই আবেদন করছি।${start ? ` সময়কাল: ${start} হতে ${end} পর্যন্ত মোট ${duration}।` : ''}`, `অতএব, বিষয়টি সদয় বিবেচনা করে প্রয়োজনীয় অনুমতি প্রদানের জন্য বিনীত অনুরোধ করছি।`];
  const signatoryLines = employee
    ? [ 'বিনীত নিবেদক,', formData.applicantName, designation ? `পদবি: ${designation}` : '', formData.workplace, formData.mobile ? `মোবাইল: ${formData.mobile}` : '' ].filter(Boolean)
    : [ 'বিনীত নিবেদক,', formData.applicantName, formData.studentClass ? `শ্রেণি: ${formData.studentClass}` : '', formData.rollNumber ? `রোল: ${formData.rollNumber}` : '', formData.workplace ].filter(Boolean);
  return {
    date: `তারিখ: ${formData.date || toBanglaDate(new Date())}`,
    recipientLines: ['বরাবর,', recipient, formData.organization || formData.workplace, [formData.upazilaOrArea, formData.district].filter(Boolean).join(', ')].filter(Boolean),
    throughLine: formData.through && formData.through !== 'সরাসরি' ? `মাধ্যম: ${formData.through}।` : undefined,
    subject: formData.subject || template.defaultSubject,
    salutation: formData.salutation || 'মহোদয়,',
    bodyParagraphs: body,
    closing: 'বিনীত নিবেদক,',
    signatoryLines,
    attachmentLines: formData.attachments?.filter(Boolean),
  };
}

export function documentToPlainText(doc: DocumentSection): string {
  return [doc.date, doc.recipientLines.join('\n'), doc.throughLine, `বিষয়: ${doc.subject}`, doc.salutation, doc.bodyParagraphs.join('\n\n'), doc.signatoryLines.join('\n'), doc.attachmentLines?.length ? `সংযুক্তি:\n${doc.attachmentLines.join('\n')}` : ''].filter(Boolean).join('\n\n');
}
