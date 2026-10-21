import type { ApplicationFormData, FormatTemplate, SubCategoryType } from '../types';
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

/** The values a format's standard wording can draw on. */
interface DocInputs {
  designation: string;
  workplace: string;
  reason: string;
  start: string;
  end: string;
  duration: string;
  joiningType: string;
  joiningDate: string;
  session: string;
  previousOrder: string;
  studentClass: string;
  roll: string;
  guardian: string;
  income: string;
  result: string;
  tcReason: string;
  newSchool: string;
  passingYear: string;
}

/** Keeps only the clauses that have data, so a half-filled form never prints a broken sentence. */
function join(...parts: Array<string | false | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim();
}

function employeeOpening(i: DocInputs): string {
  if (i.workplace && i.designation) return `আমি ${i.workplace}-এ ${i.designation} পদে যোগদান পূর্বক কর্মরত আছি।`;
  if (i.workplace) return `আমি ${i.workplace}-এ কর্মরত আছি।`;
  return 'আমি অত্র প্রতিষ্ঠানে কর্মরত আছি।';
}

function studentOpening(i: DocInputs): string {
  const school = i.workplace ? `${i.workplace}-এর` : 'অত্র প্রতিষ্ঠানের';
  if (i.studentClass && i.roll) return `আমি ${school} ${i.studentClass}-এর শিক্ষার্থী, রোল নম্বর ${i.roll}।`;
  if (i.studentClass) return `আমি ${school} ${i.studentClass}-এর শিক্ষার্থী।`;
  return `আমি ${school} শিক্ষার্থী।`;
}

function leavePeriod(i: DocInputs, leaveName: string): string {
  if (!i.start || !i.end) return `${leaveName} মঞ্জুর করিয়া দিতে বিনীত নিবেদন করিতেছি।`;
  const length = i.duration ? `মোট ${i.duration}` : 'উক্ত মেয়াদে';
  return `${i.start} হতে ${i.end} তারিখ পর্যন্ত ${length} ${leaveName} মঞ্জুর করিয়া দিতে বিনীত নিবেদন করিতেছি।`;
}

const EMPLOYEE_CLOSE = 'অতএব, বিষয়টি সদয় বিবেচনা করিয়া প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য বিনীত অনুরোধ করিতেছি।';
const STUDENT_CLOSE = 'অতএব, আবেদনটি মঞ্জুর করিলে আমি আপনার নিকট চিরকৃতজ্ঞ থাকিব।';

/**
 * Every format carries its own official wording - one shared paragraph would
 * print a joining report, an NOC and a fee-waiver request in the same sentence.
 */
const FORMAT_BODIES: Record<SubCategoryType, (i: DocInputs) => string[]> = {
  casual_leave: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      employeeOpening(i),
      i.reason && `${i.reason} নির্ধারিত তারিখে অত্র কার্যালয়ে উপস্থিত থাকা সম্ভব হইতেছে না; নৈমিত্তিক ছুটি ব্যতীত উক্ত প্রয়োজন মেটানোর অন্য পথ রহিল না।`,
      leavePeriod(i, 'নৈমিত্তিক ছুটি (CL)'),
      'ছুটিকালে আমার দায়িত্বপ্রাপ্ত শ্রেণিকাজ ও প্রতিষ্ঠানের অন্যান্য কর্মকাণ্ডে যেন বিঘ্ন না ঘটে, সে বিষয়ে প্রতিশ্রুতিবদ্ধ।',
    ),
    EMPLOYEE_CLOSE,
  ],
  medical_leave: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      employeeOpening(i),
      i.reason && `${i.reason} চিকিৎসাধীন আছি এবং কর্মে উপস্থিত হওয়া সম্ভব হইতেছে না।`,
      leavePeriod(i, 'চিকিৎসা ছুটি'),
      'সংযুক্তিতে রেজিস্টার্ড চিকিৎসকের প্রত্যয়নপত্র ও ব্যবস্থাপত্র প্রেরণ করা হইল।',
    ),
    EMPLOYEE_CLOSE,
  ],
  maternity_leave: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      employeeOpening(i),
      i.reason && `${i.reason} পূর্ণ বেতনসহ মাতৃত্বকালীন ছুটি ভোগ করিতে ইচ্ছা।`,
      'চিকিৎসকের প্রত্যয়নপত্র হইতে প্রসবের সম্ভাব্য তারিখ নিশ্চিতকরণ সংযুক্ত করা হইল।',
      leavePeriod(i, 'মাতৃত্বকালীন ছুটি'),
      'সরকারি বিধি অনুযায়ী উক্ত ছুটির মেয়াদ ও সুযোগ-সুবিধা প্রদানের ব্যবস্থা গ্রহণ করা হউক।',
    ),
    EMPLOYEE_CLOSE,
  ],
  earned_leave: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      employeeOpening(i),
      'আমার নামে সঞ্চিত অর্জিত ছুটির সমানুপাতিক অংশ এখনো অবশিষ্ট আছে।',
      i.reason && `${i.reason} উক্ত ছুটি ভোগ করিতে ইচ্ছা।`,
      leavePeriod(i, 'অর্জিত ছুটি (EL)'),
    ),
    EMPLOYEE_CLOSE,
  ],
  joining_letter: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      employeeOpening(i),
      i.joiningType && `${i.joiningType} - এই মর্মে জানাইতেছি যে উক্ত ছুটি নির্ধারিত মেয়াদ পূরণ করিয়া সমাপ্ত হইয়াছে।`,
      i.previousOrder && `পূর্ববর্তী ছুটির স্মারক নম্বর: ${i.previousOrder}।`,
      i.joiningDate
        ? `এমতাবস্থায়, ${i.joiningDate} তারিখ ${i.session ? `${i.session} কালীন` : ''} কর্মস্থলে যোগদান করিয়া দায়িত্ব পালন আরম্ভ করিতে ইচ্ছা।`
        : 'এমতাবস্থায়, যথাসময়ে কর্মস্থলে যোগদানের অনুমতি প্রার্থনা করিতেছি।',
    ),
    EMPLOYEE_CLOSE,
  ],
  prl_pension: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      employeeOpening(i),
      'সরকারি চাকরিতে যোগদানের তারিখ হইতে নির্ধারিত পেনশন বয়স পূর্ণ হওয়া অতি সমীপবর্তী।',
      i.reason && `${i.reason}- এই উদ্দেশ্যে`,
      leavePeriod(i, 'অবসর প্রস্তুতিমূলক ছুটি (PRL)'),
      'ছুটি মঞ্জুর করিয়া চূড়ান্ত পেনশন, গ্র্যাচুইটি ও অন্যান্য প্রাপ্য আর্থিক সুবিধার প্রক্রিয়া আরম্ভ করিয়া দিতে অনুরোধ করা হইল।',
    ),
    EMPLOYEE_CLOSE,
  ],
  passport_noc: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      employeeOpening(i),
      i.reason && `${i.reason} আন্তর্জাতিক ই-পাসপোর্ট প্রস্তুত করিতে ইচ্ছা।`,
      'ই-পাসপোর্ট ইস্যুর পর্বে বাংলাদেশ অভিবাসন ও পাসপোর্ট অধিদপ্তর সরকারি চাকরিজীবীর অনাপত্তি সনদ (NOC) প্রয়োজন হইবে মর্মে নির্দেশ দিয়াছে।',
      'এমতাবস্থায়, আমাকে অনাপত্তি সনদ প্রদান করিয়া সহায়তা করিতে বিনীত নিবেদন করিতেছি।',
    ),
    EMPLOYEE_CLOSE,
  ],
  ex_bangladesh: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      employeeOpening(i),
      i.reason && `${i.reason} বিদেশ গমন করিতে ইচ্ছা।`,
      'গমন ব্যয় সম্পূর্ণরূপে ব্যক্তিগত অর্থায়নে বহন করা হইবে জ্ঞাপনপূর্বক, অর্থাৎ "সরকারি খরচে নয় (Not on Government account)" - এই শর্তে',
      leavePeriod(i, 'বহিঃবাংলাদেশ ছুটি'),
      'ছুটিকালীন আমার শ্রেণিকাজের বিকল্প বন্দোবস্ত গ্রহণ করা হইবে।',
    ),
    EMPLOYEE_CLOSE,
  ],
  student_absence_leave: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      studentOpening(i),
      i.reason && `${i.reason}`,
      i.start && i.end && `গত ${i.start} হতে ${i.end} তারিখ পর্যন্ত`,
      i.duration && `মোট ${i.duration}`,
      'ক্লাসে অনুপস্থিত থাকিতে বাধ্য হইয়াছি। জরুরি প্রয়োজন ব্যতীত ইতোপূর্বে কখনো অনুপস্থিত থাকি নাই।',
      'অনুপস্থিতির জন্য জরিমানা আরোপ ব্যতীত উক্ত দিনগুলোর ছুটি মঞ্জুর করিয়া দিতে বিনীত নিবেদন করিতেছি।',
    ),
    STUDENT_CLOSE,
  ],
  student_advance_leave: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      studentOpening(i),
      i.reason && `${i.reason} আগামী কয়েকদিন ক্লাসে অনুপস্থিত থাকিতে হইবে।`,
      i.start && i.end
        ? `এমতাবস্থায়, ${i.start} হতে ${i.end} তারিখ পর্যন্ত ${i.duration ? `মোট ${i.duration}` : ''} অগ্রিম ছুটি মঞ্জুর করিয়া দিতে বিনীত নিবেদন করিতেছি।`
        : 'এমতাবস্থায়, নির্ধারিত দিনগুলোর অগ্রিম ছুটি মঞ্জুর করিয়া দিতে বিনীত নিবেদন করিতেছি।',
      'ছুটি শেষে যথাসময়ে ক্লাসে ফিরিয়া আসিব এবং বাদ পড়া পাঠ অগ্রবর্তী হইয়া পূরণ করিব।',
    ),
    STUDENT_CLOSE,
  ],
  student_fee_waiver: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      studentOpening(i),
      i.guardian && `আমার পিতা/অভিভাবকের নাম ${i.guardian}।`,
      i.income && `${i.income}; সেই আয়ে সংসার চালানোই কঠিন হইয়া পড়িয়াছে।`,
      'এমতাবস্থায় মাসিক বেতন ও অন্যান্য ফি প্রদান করিতে আমার পক্ষ হইতে অসমর্থ।',
      i.result && `তথাপি আমি মনোযোগ সহকারে পাঠে নিয়োজিত আছি - ${i.result}।`,
      'বিনা বেতনে অধ্যয়নের সুযোগ মঞ্জুর করিয়া দিতে বিনীত নিবেদন করিতেছি।',
    ),
    STUDENT_CLOSE,
  ],
  student_poor_fund: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      studentOpening(i),
      i.guardian && `আমার পিতা/অভিভাবকের নাম ${i.guardian}।`,
      i.income && `${i.income}।`,
      i.reason && `${i.reason} পরিবারের পক্ষে অর্থ জোগান সম্ভব হইতেছে না।`,
      'বিদ্যালয়ের দরিদ্র কল্যাণ তহবিল হইতে এককালীন আর্থিক অনুদান প্রদান করিয়া দিতে বিনীত নিবেদন করিতেছি।',
    ),
    STUDENT_CLOSE,
  ],
  student_tc: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      studentOpening(i),
      i.tcReason && `${i.tcReason} - এই কারণে অন্য প্রতিষ্ঠানে ভর্তি হওয়া আবশ্যক হইয়া পড়িয়াছে।`,
      i.newSchool && `ইতিমধ্যে ${i.newSchool}-এ ভর্তির ব্যবস্থা চলমান।`,
      'আমার বেতন ও অন্যান্য ফি পরিশোধিত আছে এবং লাইব্রেরির কোনো বকেয়া নাই।',
      'এমতাবস্থায় আমাকে ছাড়পত্র (Transfer Certificate) প্রদান করিয়া দিতে বিনীত নিবেদন করিতেছি।',
    ),
    STUDENT_CLOSE,
  ],
  student_testimonial: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      i.workplace ? `আমি ${i.workplace}-এর একজন উত্তীর্ণ শিক্ষার্থী।` : 'আমি অত্র প্রতিষ্ঠানের একজন উত্তীর্ণ শিক্ষার্থী।',
      i.studentClass && `আমি ${i.studentClass}${i.passingYear ? ` (${i.passingYear})` : ''}-এ উত্তীর্ণ হইয়াছি।`,
      i.roll && `আমার বোর্ড রোল ও রেজিস্ট্রেশন নম্বর: ${i.roll}।`,
      'উচ্চশিক্ষায় ভর্তি এবং চাকরির আবেদনের জন্য প্রতিষ্ঠান হইতে চারিত্রিক ও শিক্ষাগত প্রশংসাপত্র আবশ্যক।',
      'এমতাবস্থায় আমাকে প্রশংসাপত্র প্রদান করিয়া দিতে বিনীত নিবেদন করিতেছি।',
    ),
    STUDENT_CLOSE,
  ],
  student_readmission: (i) => [
    join(
      'বিনীত নিবেদন এই যে,',
      studentOpening(i),
      i.reason && `${i.reason} নির্ধারিত সময়ে নিয়মিত ক্লাসে অংশ গ্রহণ ও ফি পরিশোধ করিতে পারি নাই, ফলে আমার নাম কর্তন করা হইয়াছে।`,
      'সেই বাধা অতিক্রম করিয়া এখন নিয়মিত ক্লাসে অংশগ্রহণে সম্পূর্ণ সক্ষম আছি এবং পাঠ চালিয়ে যাওয়ার প্রবল আগ্রহ রহিয়াছে।',
      'এমতাবস্থায় বিদ্যালয়ে আমার পুনঃভর্তির অনুমতি প্রদান করিয়া দিতে বিনীত নিবেদন করিতেছি।',
    ),
    STUDENT_CLOSE,
  ],
};

export function generateDocumentContent(template: FormatTemplate, formData: ApplicationFormData): DocumentSection {
  const employee = template.category === 'employee';
  const recipient = formData.customRecipient || formData.recipient || template.defaultRecipient;
  const designation = formData.customDesignation || formData.designation;
  const start = formData.leaveStartDate ? toBanglaDate(formData.leaveStartDate) : '';
  const end = formData.leaveEndDate ? toBanglaDate(formData.leaveEndDate) : '';
  const hasPeriod = Boolean(start && end);
  const duration = hasPeriod ? formData.totalDays || calculateBanglaDuration(formData.leaveStartDate, formData.leaveEndDate).text : '';

  const inputs: DocInputs = {
    designation: employee ? designation : '',
    workplace: formData.workplace,
    reason: formData.leaveReason || '',
    start,
    end,
    duration,
    joiningType: formData.joiningType || '',
    joiningDate: formData.joiningDate ? toBanglaDate(formData.joiningDate) : '',
    session: formData.joiningTimeSession || '',
    previousOrder: formData.previousLeaveOrderNo || '',
    studentClass: formData.studentClass || '',
    roll: formData.rollNumber || '',
    guardian: formData.fatherOrGuardianName || '',
    income: formData.familyMonthlyIncome || '',
    result: formData.gpaOrLastExamResult || '',
    tcReason: formData.tcReason || '',
    newSchool: formData.newSchoolName || '',
    passingYear: formData.passingYear || '',
  };

  const built = FORMAT_BODIES[template.id]?.(inputs);
  const body = formData.customBodyText?.trim()
    ? formData.customBodyText.split(/\n\s*\n/).filter(Boolean)
    : built ?? [
        'বিনীত নিবেদন এই যে, এই আবেদনটি প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য উপস্থাপন করা হইল।',
        employee ? EMPLOYEE_CLOSE : STUDENT_CLOSE,
      ];

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
    attachmentLines: formData.attachments?.trim() ? [formData.attachments.trim()] : undefined,
  };
}

export function documentToPlainText(doc: DocumentSection): string {
  return [doc.date, doc.recipientLines.join('\n'), doc.throughLine, `বিষয়: ${doc.subject}`, doc.salutation, doc.bodyParagraphs.join('\n\n'), doc.signatoryLines.join('\n'), doc.attachmentLines?.length ? `সংযুক্তি:\n${doc.attachmentLines.join('\n')}` : ''].filter(Boolean).join('\n\n');
}
