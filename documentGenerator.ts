import { FormatTemplate, ApplicationFormData } from '../types';
import { toBanglaDate, calculateBanglaDuration } from './banglaUtils';

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

/**
 * Generates structured document sections for live preview, print, copy, and PDF export
 */
export function generateDocumentContent(
  template: FormatTemplate,
  formData: ApplicationFormData
): DocumentSection {
  const isEmployee = template.category === 'employee';
  const effectiveRecipient = formData.customRecipient || formData.recipient || template.defaultRecipient;
  const effectiveDesignation = formData.customDesignation || formData.designation;

  // Recipient lines
  const recipientLines: string[] = [
    `বরাবর,`,
    effectiveRecipient,
    formData.organization || (isEmployee ? 'উপজেলা শিক্ষা অফিস' : 'বিদ্যালয়'),
    `${formData.upazilaOrArea || ''}, ${formData.district || ''}`.replace(/^,\s*|,\s*$/g, ''),
  ].filter(Boolean);

  // Through line
  const throughLine = formData.through && formData.through !== 'সরাসরি' 
    ? `মাধ্যম: ${formData.through}।`
    : undefined;

  // Subject line
  const subject = formData.subject || template.defaultSubject;
  const salutation = formData.salutation || 'মহোদয়,';

  // Body text calculation
  let bodyParagraphs: string[] = [];

  const startBanglaDate = formData.leaveStartDate ? toBanglaDate(formData.leaveStartDate) : '';
  const endBanglaDate = formData.leaveEndDate ? toBanglaDate(formData.leaveEndDate) : '';
  const duration = calculateBanglaDuration(formData.leaveStartDate, formData.leaveEndDate);
  const durationText = formData.totalDays || duration.text;

  // If user provided a fully custom override body
  if (formData.customBodyText && formData.customBodyText.trim() !== '') {
    bodyParagraphs = formData.customBodyText.split('\n\n').filter(p => p.trim() !== '');
  } else {
    // Generate authentic domain body paragraphs based on template ID
    switch (template.id) {
      case 'casual_leave':
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি আপনার নিয়ন্ত্রণাধীন ${formData.workplace}-এ ${effectiveDesignation} হিসেবে কর্মরত আছি। ${formData.leaveReason || 'জরুরি পারিবারিক প্রয়োজনের কারণে'} আমার পক্ষে আগামী ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} কর্মস্থলে উপস্থিত থাকা সম্ভব হবে না।`,
          `অতএব, বিনীত প্রার্থনা এই যে, উপর্যুক্ত বিষয়টি মানবিক দৃষ্টিতে বিবেচনাপূর্বক আমাকে উক্ত ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} নৈমিত্তিক ছুটি মঞ্জুর করতে মহোদয়ের সদয় মর্জি হয়।`
        ];
        break;

      case 'medical_leave':
        bodyParagraphs = [
          `যথাবিহিত সম্মান প্রদর্শনপূর্বক বিনীত নিবেদন এই যে, আমি আপনার নিয়ন্ত্রণাধীন ${formData.workplace}-এ ${effectiveDesignation} হিসেবে নিষ্ঠার সাথে দায়িত্ব পালন করে আসছি। আমি হঠাৎ ${formData.leaveReason || 'তীব্র শারীরিক অসুস্থতায়'} আক্রান্ত হয়ে চিকিৎসাধীন রয়েছি। কর্তব্যরত রেজিস্টার্ড চিকিৎসক আমাকে জরুরি চিকিৎসা ও সম্পূর্ণ শারীরিক বিশ্রামে থাকার পরামর্শ প্রদান করেছেন। উক্ত কারণে আগামী ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} কর্মস্থলে উপস্থিত থাকা আমার পক্ষে একেবারেই অসম্ভব।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, অসুস্থতার বিষয়টি সদয় বিবেচনা করে এবং সংযুক্ত চিকিৎসকের প্রত্যয়নপত্রের আলোকে আমাকে উক্ত ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} চিকিৎসা ছুটি মঞ্জুর করতে মহোদয়ের সদয় মর্জি হয়।`
        ];
        break;

      case 'maternity_leave':
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি ${formData.workplace}-এ ${effectiveDesignation} হিসেবে দায়িত্ব পালন করে আসছি। আমি সন্তানসম্ভবা এবং বিশেষজ্ঞ চিকিৎসকের প্রত্যয়নপত্র ও আল্ট্রাসনোগ্রাম রিপোর্ট অনুযায়ী আমার সম্ভাব্য প্রসবকাল অতি সন্নিকটে। শারীরিক সুস্থতা ও নবজাতকের সুরক্ষার স্বার্থে সরকারি চাকরি বিধিমালা অনুযায়ী আমার পূর্ণ বেতনসহ ৬ (ছয়) মাস মেয়াদি ${formData.leaveReason || 'মাতৃত্বকালীন ছুটি'} প্রয়োজন।`,
          `অতএব, মহোদয়ের নিকট আকুল প্রার্থনা, সরকারি বিধি মোতাবেক সংযুক্ত মেডিকেল সনদের আলোকে আগামী ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} পূর্ণ বেতনসহ মাতৃত্বকালীন ছুটি মঞ্জুর করতে মহোদয়ের সদয় মর্জি হয়।`
        ];
        break;

      case 'joining_letter':
        const joiningTypeTitle = formData.joiningType || 'ছুটি';
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি আপনার আওতাধীন ${formData.workplace}-এ ${effectiveDesignation} পদে কর্মরত আছি। আপনার কার্যালয়ের অনুমোদিত ছুটি আদেশ অনুযায়ী ${formData.previousLeaveOrderNo ? `(যার স্মারক নম্বর: ${formData.previousLeaveOrderNo})` : ''} আমার মঞ্জুরিকৃত ${joiningTypeTitle}-এর মেয়াদ সন্তোষজনকভাবে সমাপ্ত হয়েছে।`,
          `এমতাবস্থায়, আজ ${toBanglaDate(formData.joiningDate || formData.date)} তারিখ ${formData.joiningTimeSession || 'পূর্বাহ্ণ'} হতে আমি আমার পূর্ব পদে ও কর্মস্থলে পুনরায় শুভাগমন করে নিয়মিত দায়িত্বভার গ্রহণ করছি।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, উক্ত ${joiningTypeTitle} শেষে আমার এই যোগদানপত্রটি সদয় গ্রহণ ও নথিজাত করার প্রয়োজনীয় ব্যবস্থা গ্রহণে মহোদয়ের মর্জি হয়।`
        ];
        break;

      case 'prl_pension':
        bodyParagraphs = [
          `যথাবিহিত সম্মান প্রদর্শনপূর্বক বিনীত নিবেদন এই যে, আমি আপনার অধীনস্থ ${formData.workplace}-এ ${effectiveDesignation} পদে দীর্ঘকাল যাবত নিষ্ঠার সাথে দায়িত্ব পালন করে আসছি। সরকারি চাকরি আইন অনুযায়ী আগামী ${startBanglaDate} তারিখে আমার বয়স ৫৯ (ঊনষাট) বছর পূর্ণ হবে। বিধায়, আগামী ${startBanglaDate} তারিখ হতে ${endBanglaDate} তারিখ পর্যন্ত ০১ (এক) বছর মেয়াদে অবসর প্রস্তুতিমূলক ছুটি (PRL) এবং পরবর্তীতে চূড়ান্ত পেনশন মঞ্জুরির আনুষ্ঠানিক প্রক্রিয়া শুরু করা আবশ্যক।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, আমার চাকরির যাবতীয় সন্তোষজনক রেকর্ড ও সার্ভিস বুক বিবেচনাপূর্বক উল্লিখিত তারিখ হতে এক বছরের পিআরএল ও অবসরোত্তর আর্থিক সুযোগ-সুবিধা মঞ্জুরের সদয় আদেশ প্রদানে আপনার মর্জি হয়।`
        ];
        break;

      case 'passport_noc':
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি ${formData.workplace}-এ ${effectiveDesignation} পদে সরকারি চাকুরিজীবী হিসেবে সততার সাথে দায়িত্ব পালন করে আসছি। ${formData.leaveReason || 'পবিত্র হজ্ব ও ওমরাহ পালনের উদ্দেশ্যে'} আমার একটি জরুরি আন্তর্জাতিক ই-পাসপোর্ট তৈরি করা প্রয়োজন। সরকারি বিধিমালা অনুযায়ী সরকারি কর্মচারীদের পাসপোর্ট আবেদনের জন্য বিভাগীয় অনাপত্তি সনদ (NOC) দাখিল করা বাধ্যতামূলক।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, আমার অনুকূলে আন্তর্জাতিক ই-পাসপোর্ট ইস্যু করার লক্ষ্যে প্রয়োজনীয় বিভাগীয় অনাপত্তি সনদ (NOC) প্রদানপূর্বক কৃতার্থ করতে মহোদয়ের সদয় মর্জি হয়।`
        ];
        break;

      case 'ex_bangladesh':
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি ${formData.workplace}-এ ${effectiveDesignation} হিসেবে কর্মরত আছি। ${formData.leaveReason || 'সৌদি আরবে পবিত্র হজ্বব্রত পালনের উদ্দেশ্যে'} আমার আগামী ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} বাংলাদেশে অবস্থান না করে বিদেশে অবস্থান করা একান্ত প্রয়োজন। উক্ত বিদেশ ভ্রমণে বাংলাদেশ সরকারের কোনো প্রকার আর্থিক সংশ্লিষ্টতা থাকবে না এবং সমস্ত ব্যয়ভার আমি ব্যক্তিগতভাবে বহন করব।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, উল্লিখিত কারণ ও শর্ত সাপেক্ষে আগামী ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} বহিঃবাংলাদেশ ছুটি ও কর্মস্থল ত্যাগের অনুমতি মঞ্জুর করতে মহোদয়ের সদয় মর্জি হয়।`
        ];
        break;

      case 'earned_leave':
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি আপনার নিয়ন্ত্রণাধীন ${formData.workplace}-এ ${effectiveDesignation} পদে কর্মরত আছি। আগামী ${startBanglaDate} তারিখে ${formData.leaveReason || 'আমার শুভ বিবাহ অনুষ্ঠান অনুষ্ঠিত হবে'}। এই সামাজিক ও পারিবারিক গুরুত্বপূর্ণ উপলক্ষ সম্পন্ন করার জন্য আমার আগামী ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} ছুটির প্রয়োজন।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, উপর্যুক্ত পারিবারিক বিষয়টি সহানুভূতির সাথে বিবেচনা করে আমার অর্জিত ছুটির পাওনা হতে উক্ত ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} অর্জিত ছুটি মঞ্জুর করতে আপনার সদয় মর্জি হয়।`
        ];
        break;

      // --- Student Formats ---
      case 'student_absence_leave':
        bodyParagraphs = [
          `সবিনয় নিবেদন এই যে, আমি আপনার বিদ্যালয়ের ${formData.studentClass || '১০ম শ্রেণি'}-এর একজন নিয়মিত শিক্ষার্থী। আমার রোল নম্বর ${formData.rollNumber || '০১'}। আমি গত ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} ${formData.leaveReason || 'তীব্র জ্বরে আক্রান্ত থাকার কারণে'} বিদ্যালয়ে উপস্থিত হতে পারিনি।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, উক্ত দিনগুলোর অনুপস্থিতি মার্জনা করে আমাকে ছুটি মঞ্জুর করতে আপনার সদয় মর্জি হয়।`
        ];
        break;

      case 'student_advance_leave':
        bodyParagraphs = [
          `সবিনয় নিবেদন এই যে, আমি আপনার প্রতিষ্ঠানের ${formData.studentClass || '৮ম শ্রেণি'}-এর একজন নিয়মিত শিক্ষার্থী। আমার রোল নম্বর ${formData.rollNumber || '০১'}। ${formData.leaveReason || 'আমার বড় বোনের শুভ বিবাহ উপলক্ষে গ্রামের বাড়ি যাওয়ার কারণে'} আগামী ${startBanglaDate} হতে ${endBanglaDate} তারিখ পর্যন্ত মোট ${durationText} আমার পক্ষে বিদ্যালয়ে উপস্থিত থাকা সম্ভব হবে না।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, আমার পারিবারিক পরিস্থিতির বিষয়টি বিবেচনাপূর্বক উক্ত দিনগুলোর জন্য আমাকে অগ্রিম ছুটি প্রদানে মহোদয়ের সদয় মর্জি হয়।`
        ];
        break;

      case 'student_fee_waiver':
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি আপনার বিদ্যালয়ের ${formData.studentClass || '৯ম শ্রেণি'}-এর একজন নিয়মিত ও মনোযোগী শিক্ষার্থী। আমার শ্রেণি রোল নম্বর ${formData.rollNumber || '০১'}। ${formData.familyMonthlyIncome || 'আমার পিতা একজন স্বল্প আয়ের ব্যক্তি এবং আমাদের পরিবারের সদস্য সংখ্যা অধিক'}। বর্তমানে সংসারের ব্যয়ভার মেটানোর পর আমার মাসিক বেতন ও পড়ালেখার যাবতীয় খরচ চালানো পিতার পক্ষে অত্যন্ত দুঃসাধ্য হয়ে পড়েছে। উল্লেখ্য যে, আমি বিগত সকল সাময়িক ও বার্ষিক পরীক্ষায় কৃতিত্বপূর্ণ ফলাফল অর্জন করেছি।`,
          `অতএব, জনাবের নিকট আকুল আবেদন, আমার পরিবারের অসচ্ছলতা ও পড়ালেখার প্রতি গভীর আগ্রহ বিবেচনা করে আমাকে অত্র বিদ্যালয়ে সম্পূর্ণ বিনা বেতনে অধ্যয়নের সুযোগ প্রদান করতে আপনার সদয় মর্জি হয়।`
        ];
        break;

      case 'student_poor_fund':
        bodyParagraphs = [
          `সবিনয় নিবেদন এই যে, আমি আপনার বিদ্যালয়ের ${formData.studentClass || '১০ম শ্রেণি'}-এর একজন নিয়মিত ছাত্র/ছাত্রী। আমার শ্রেণি রোল নম্বর ${formData.rollNumber || '০১'}। অত্যন্ত দুঃখের সাথে জানাচ্ছি যে, আমার পরিবারের চরম আর্থিক অনটনের কারণে ${formData.leaveReason || 'আসন্ন পরীক্ষার ফরম ফিলাপের ফি ও প্রয়োজনীয় পাঠ্যবই ক্রয়ের অর্থ'} জোগাড় করা সম্ভব হচ্ছে না। আর্থিক সাহায্য না পেলে আমার পড়ালেখা বন্ধ হওয়ার উপক্রম হবে।`,
          `অতএব, মহোদয়ের নিকট আকুল প্রার্থনা, আমার পড়ালেখা অব্যাহত রাখার স্বার্থে বিদ্যালয়ের দরিদ্র কল্যাণ তহবিল হতে আমাকে এককালীন আর্থিক অনুদান মঞ্জুর করতে মহোদয়ের সদয় মর্জি হয়।`
        ];
        break;

      case 'student_tc':
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি আপনার বিদ্যালয়ের ${formData.studentClass || '৭ম শ্রেণি'}-এর একজন নিয়মিত শিক্ষার্থী। আমার শ্রেণি রোল নম্বর ${formData.rollNumber || '০১'}। সম্প্রতি ${formData.tcReason || 'আমার পিতার সরকারি চাকরিজনিত বদলি হয়েছে'}। যার দরুন আমাদের সমগ্র পরিবারকে অত্র এলাকা ছেড়ে ${formData.newSchoolName ? `${formData.newSchoolName}-এর নিকটবর্তী এলাকায়` : 'নতুন কর্মস্থলে'} স্থায়ীভাবে চলে যেতে হচ্ছে। বিধায় অত্র বিদ্যালয়ে আমার পক্ষে পড়ালেখা চালিয়ে যাওয়া আর সম্ভব নয়।`,
          `অতএব, মহোদয়ের নিকট আকুল প্রার্থনা, আমার বিদ্যালয়ের যাবতীয় পাওনাদি ও ফি পরিশোধ সাপেক্ষে আমাকে একটি ছাড়পত্র (Transfer Certificate - TC) প্রদান করতে আপনার সদয় মর্জি হয়।`
        ];
        break;

      case 'student_testimonial':
        bodyParagraphs = [
          `সবিনয় নিবেদন এই যে, আমি আপনার ঐতিহ্যবাহী প্রতিষ্ঠান হতে ${formData.studentClass || 'এসএসসি পরীক্ষা'}-এ অংশগ্রহণ করে কৃতিত্বের সাথে উত্তীর্ণ হয়েছি। আমার ${formData.rollNumber || 'বোর্ড রোল: ২১৫৬৩৪'} এবং ${formData.passingYear || 'পাসের বছর: ২০২৫'}। এখন উচ্চশিক্ষা প্রতিষ্ঠানে ভর্তির আবেদন করার জন্য আমার একটি চারিত্রিক ও শিক্ষাগত প্রশংসাপত্র (Testimonial) প্রয়োজন। উল্লেখ্য যে, অত্র বিদ্যালয়ে অধ্যয়নকালীন আমি কোনো প্রকার শৃঙ্খলাবিরোধী কাজে জড়িত ছিলাম না।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, আমার অনুকূলে একটি প্রশংসাপত্র প্রদান করে আমাকে বাধিত করবেন।`
        ];
        break;

      case 'student_readmission':
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি আপনার বিদ্যালয়ের ${formData.studentClass || '৬ষ্ঠ শ্রেণি'}-এর নিয়মিত শিক্ষার্থী ছিলাম। আমার রোল নম্বর ছিল ${formData.rollNumber || '০১'}। ${formData.leaveReason || 'দীর্ঘদিন যাবৎ জন্ডিস রোগে আক্রান্ত হয়ে চিকিৎসাধীন থাকার কারণে'} আমি যথাসময়ে বেতন পরিশোধ করতে পারিনি এবং ক্লাসে উপস্থিত হতে না পারায় আমার নাম হাজিরা খাতা হতে কর্তন করা হয়েছে। বর্তমানে আমি সম্পূর্ণ সুস্থ এবং পড়ালেখা পুনরায় শুরু করতে অত্যন্ত আগ্রহী।`,
          `অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, আমার অতীত অসুস্থতার বিষয়টি সহানুভূতির সাথে বিবেচনা করে এবং প্রয়োজনীয় বিলম্ব ফিসমূহ গ্রহণপূর্বক আমাকে পুনরায় শ্রেণিতে ভর্তির সুযোগ প্রদানে আপনার সদয় মর্জি হয়।`
        ];
        break;

      default:
        bodyParagraphs = [
          `বিনীত নিবেদন এই যে, আমি আপনার আওতাধীন প্রতিষ্ঠানে কর্মরত/অধ্যয়নরত আছি। জরুরি প্রয়োজনে আমার উল্লিখিত বিষয়ের মঞ্জুরি একান্ত আবশ্যক।`,
          `অতএব, মহোদয়ের নিকট প্রার্থনা, বিষয়টি সদয় বিবেচনা করে আবেদন মঞ্জুর করতে আপনার মর্জি হয়।`
        ];
    }
  }

  // Signatory Lines
  const signatoryLines: string[] = isEmployee
    ? [
        `বিনীত নিবেদক,`,
        ` `,
        `(${formData.applicantName || 'স্বাক্ষরকারী'})`,
        `পদবি: ${effectiveDesignation}`,
        formData.employeeId ? `পরিচিতি/আইডি নম্বর: ${formData.employeeId}` : '',
        formData.workplace,
        `${formData.upazilaOrArea}, ${formData.district}`,
        formData.mobile ? `মোবাইল: ${formData.mobile}` : '',
      ].filter(Boolean)
    : [
        `বিনীত নিবেদক,`,
        ` `,
        `(${formData.applicantName || 'শিক্ষার্থী'})`,
        `শ্রেণি: ${formData.studentClass || '১০ম শ্রেণি'}`,
        `রোল নম্বর: ${formData.rollNumber || '০১'}`,
        formData.sectionOrGroup ? `শাখা/বিভাগ: ${formData.sectionOrGroup}` : '',
        formData.workplace,
        formData.mobile ? `মোবাইল: ${formData.mobile}` : '',
      ].filter(Boolean);

  // Attachment Lines
  const attachmentLines = formData.attachments && formData.attachments.length > 0 && formData.attachments[0]
    ? formData.attachments.filter(a => a.trim() !== '')
    : undefined;

  return {
    date: `তারিখ: ${formData.date || toBanglaDate(new Date())}`,
    recipientLines,
    throughLine,
    subject,
    salutation,
    bodyParagraphs,
    closing: 'বিনীত নিবেদক,',
    signatoryLines,
    attachmentLines,
  };
}

/**
 * Converts structured document content to formatted plain text for copying
 */
export function documentToPlainText(doc: DocumentSection): string {
  let text = `${doc.date}\n\n`;
  text += `${doc.recipientLines.join('\n')}\n\n`;
  if (doc.throughLine) {
    text += `${doc.throughLine}\n\n`;
  }
  text += `বিষয়: ${doc.subject}\n\n`;
  text += `${doc.salutation}\n\n`;
  text += `${doc.bodyParagraphs.join('\n\n')}\n\n`;
  text += `${doc.signatoryLines.join('\n')}\n`;

  if (doc.attachmentLines && doc.attachmentLines.length > 0) {
    text += `\nসংযুক্তি:\n`;
    doc.attachmentLines.forEach((att, idx) => {
      text += `${idx + 1}. ${att}\n`;
    });
  }

  return text;
}
