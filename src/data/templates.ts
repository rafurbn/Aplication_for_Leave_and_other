import { FormatTemplate, ApplicationFormData } from '../types';
import { toBanglaDate, getTodayISODate } from '../utils/banglaUtils';

export const TEACHER_DESIGNATIONS = [
  'সহকারী শিক্ষক',
  'প্রধান শিক্ষক',
  'প্রধান শিক্ষক (চ:দা:)',
  'ভারপ্রাপ্ত প্রধান শিক্ষক',
];

export const TEACHER_RECIPIENTS = [
  'উপজেলা শিক্ষা অফিসার (ইউইও)',
  'সহকারী উপজেলা শিক্ষা অফিসার (এটিইও)',
  'জেলা প্রাথমিক শিক্ষা অফিসার (ডিপিইও)',
  'বিভাগীয় উপপরিচালক (ডিডি)',
  'মহাপরিচালক (ডিজি), প্রাথমিক শিক্ষা অধিদপ্তর',
];

export const TEACHER_THROUGH_OPTIONS = [
  'যথাযথ কর্তৃপক্ষের মাধ্যমে',
  'প্রধান শিক্ষকের মাধ্যমে',
  'ভারপ্রাপ্ত প্রধান শিক্ষকের মাধ্যমে',
  'সরাসরি',
];

export const STUDENT_RECIPIENTS = [
  'প্রধান শিক্ষক',
  'অধ্যক্ষ',
  'উপাধ্যক্ষ',
  'প্রধান শিক্ষক / প্রধান শিক্ষিকা',
  'ভারপ্রাপ্ত অধ্যক্ষ',
];

export const STUDENT_CLASSES = [
  '১ম শ্রেণি',
  '২য় শ্রেণি',
  '৩য় শ্রেণি',
  '৪র্থ শ্রেণি',
  '৫ম শ্রেণি',
  '৬ষ্ঠ শ্রেণি',
  '৭ম শ্রেণি',
  '৮ম শ্রেণি',
  '৯ম শ্রেণি',
  '১০ম শ্রেণি (এসএসসি পরীক্ষার্থী)',
  'একাদশ শ্রেণি',
  'দ্বাদশ শ্রেণি (এইচএসসি পরীক্ষার্থী)',
  'ডিগ্রি / অনার্স',
];

export const JOINING_TYPES = [
  'চিকিৎসা ছুটি শেষে কর্মস্থলে যোগদানের আবেদন',
  '১ম মাতৃত্বকালীন ছুটি শেষে কর্মস্থলে যোগদানের আবেদন',
  '২য় মাতৃত্বকালীন ছুটি শেষে কর্মস্থলে যোগদানের আবেদন',
  'নৈমিত্তিক ছুটি শেষে কর্মস্থলে যোগদানের আবেদন',
  'অর্জিত ছুটি শেষে কর্মস্থলে যোগদানের আবেদন',
  'বহিঃবাংলাদেশ ছুটি শেষে কর্মস্থলে যোগদানের আবেদন',
];

export const ALL_TEMPLATES: FormatTemplate[] = [
  // --- PART 1: Govt Primary School / Employee Templates ---
  {
    id: 'casual_leave',
    title: 'নৈমিত্তিক ছুটির আবেদন (Casual Leave - CL)',
    shortTitle: 'নৈমিত্তিক ছুটি (CL)',
    category: 'employee',
    description: 'আকস্মিক অসুস্থতা, জরুরি পারিবারিক বা ব্যক্তিগত প্রয়োজনে ৩/৪ দিনের সাধারণ ছুটির অফিশিয়াল আবেদনপত্র।',
    badge: 'চাকরিজীবী',
    iconName: 'CalendarDays',
    defaultRecipient: 'উপজেলা শিক্ষা অফিসার (ইউইও)',
    defaultThrough: 'যথাযথ কর্তৃপক্ষের মাধ্যমে',
    defaultSubject: 'নৈমিত্তিক ছুটির জন্য আবেদন।',
    recipientOptions: TEACHER_RECIPIENTS,
    designationOptions: TEACHER_DESIGNATIONS,
    throughOptions: TEACHER_THROUGH_OPTIONS,
    fields: [
      { key: 'leaveReason', label: 'ছুটির কারণ', type: 'select', options: ['হঠাৎ অসুস্থতা ও শারীরিক দুর্বলতার কারণে', 'জরুরি পারিবারিক প্রয়োজনের কারণে', 'ব্যক্তিগত বিশেষ কাজের কারণে', 'নিকটাত্মীয়ের বিশেষ সামাজিক অনুষ্ঠানের কারণে'], defaultValue: 'জরুরি পারিবারিক প্রয়োজনের কারণে', required: true },
    ],
  },
  {
    id: 'medical_leave',
    title: 'চিকিৎসা ছুটির আবেদন (Medical Leave)',
    shortTitle: 'চিকিৎসা ছুটি',
    category: 'employee',
    description: 'অসুস্থতার কারণে চিকিৎসকের পরামর্শ অনুযায়ী নির্দিষ্ট মেয়াদের চিকিৎসা ছুটির আবেদন (মেডিকেল প্রত্যয়নপত্র সংযুক্তিসহ)।',
    badge: 'চাকরিজীবী',
    iconName: 'Activity',
    defaultRecipient: 'উপজেলা শিক্ষা অফিসার (ইউইও)',
    defaultThrough: 'যথাযথ কর্তৃপক্ষের মাধ্যমে',
    defaultSubject: 'অসুস্থতার জন্য চিকিৎসা ছুটির আবেদন।',
    recipientOptions: TEACHER_RECIPIENTS,
    designationOptions: TEACHER_DESIGNATIONS,
    throughOptions: TEACHER_THROUGH_OPTIONS,
    fields: [
      { key: 'leaveReason', label: 'অসুস্থতার বিবরণ', type: 'text', placeholder: 'যেমন: টাইফয়েড জ্বর ও তীব্র শারীরিক দুর্বলতা', defaultValue: 'তীব্র অসুস্থতা ও চিকিৎসকের বিশ্রামের পরামর্শের কারণে', required: true },
      { key: 'attachments', label: 'সংযুক্তি', type: 'text', defaultValue: 'রেজিস্টার্ড চিকিৎসকের ব্যবস্থাপত্র ও প্রত্যয়নপত্র', helperText: 'যেমন: চিকিৎসকের ব্যবস্থাপত্র ও প্রেসক্রিপশন' },
    ],
  },
  {
    id: 'maternity_leave',
    title: 'মাতৃত্বকালীন ছুটির আবেদন (Maternity Leave)',
    shortTitle: 'মাতৃত্বকালীন ছুটি',
    category: 'employee',
    description: 'নারী শিক্ষকদের জন্য সরকারি নিয়ম অনুযায়ী নির্দিষ্ট মেয়াদের পূর্ণ বেতনসহ ১ম বা ২য় মাতৃত্বকালীন ছুটির ফরম্যাট।',
    badge: 'চাকরিজীবী',
    iconName: 'HeartHandshake',
    defaultRecipient: 'উপজেলা শিক্ষা অফিসার (ইউইও)',
    defaultThrough: 'যথাযথ কর্তৃপক্ষের মাধ্যমে',
    defaultSubject: 'মাতৃত্বকালীন ছুটির মঞ্জুরির জন্য আবেদন।',
    recipientOptions: TEACHER_RECIPIENTS,
    designationOptions: TEACHER_DESIGNATIONS,
    throughOptions: TEACHER_THROUGH_OPTIONS,
    maternityTermOptions: ['১ম মাতৃত্বকালীন ছুটি (৬ মাস)', '২য় মাতৃত্বকালীন ছুটি (৬ মাস)'],
    fields: [
      { key: 'leaveReason', label: 'মাতৃত্বকালীন ছুটির পর্যায়', type: 'select', options: ['১ম মাতৃত্বকালীন ছুটির মঞ্জুরি প্রসঙ্গে', '২য় মাতৃত্বকালীন ছুটির মঞ্জুরি প্রসঙ্গে'], defaultValue: '১ম মাতৃত্বকালীন ছুটির মঞ্জুরি প্রসঙ্গে', required: true },
      { key: 'attachments', label: 'সংযুক্তি', type: 'text', defaultValue: 'আল্ট্রাসনোগ্রাম রিপোর্ট ও বিশেষজ্ঞ চিকিৎসকের প্রত্যাশিত প্রসবকালীন সম্ভাব্য তারিখের প্রত্যয়নপত্র' },
    ],
  },
  {
    id: 'joining_letter',
    title: 'ছুটি শেষে কর্মস্থলে যোগদানের আবেদন (Joining Letter)',
    shortTitle: 'যোগদানপত্র (Joining)',
    category: 'employee',
    description: 'চিকিৎসা ছুটি, ১ম মাতৃত্ব, ২য় মাতৃত্ব বা অর্জিত ছুটি সফলভাবে সমাপ্তির পর দায়িত্ব গ্রহণের অফিশিয়াল আবেদনপত্র।',
    badge: 'চাকরিজীবী',
    iconName: 'FileCheck',
    defaultRecipient: 'উপজেলা শিক্ষা অফিসার (ইউইও)',
    defaultThrough: 'যথাযথ কর্তৃপক্ষের মাধ্যমে',
    defaultSubject: 'ছুটি ভোগ শেষে কর্মস্থলে যোগদান প্রসঙ্গে।',
    recipientOptions: TEACHER_RECIPIENTS,
    designationOptions: TEACHER_DESIGNATIONS,
    throughOptions: TEACHER_THROUGH_OPTIONS,
    joiningTypeOptions: JOINING_TYPES,
    fields: [
      { key: 'previousLeaveOrderNo', label: 'পূর্বের ছুটির স্মারক নম্বর ও তারিখ (যদি থাকে)', type: 'text', placeholder: 'যেমন: উশিঅ/বিয়ানী/২০২৬/৪৫, তারিখ: ১০-০৫-২০২৬' },
    ],
  },
  {
    id: 'prl_pension',
    title: 'পিআরএল (PRL) ও পেনশনে গমনের আবেদন',
    shortTitle: 'পিআরএল ও পেনশন',
    category: 'employee',
    description: 'সরকারি চাকরির বয়স পূর্ণ হওয়ার প্রেক্ষিতে অবসর প্রস্তুতিমূলক ছুটি (PRL) এবং চূড়ান্ত পেনশন প্রক্রিয়া শুরুর আবেদন।',
    badge: 'চাকরিজীবী',
    iconName: 'Clock',
    defaultRecipient: 'জেলা প্রাথমিক শিক্ষা অফিসার (ডিপিইও)',
    defaultThrough: 'উপজেলা শিক্ষা অফিসারের মাধ্যমে',
    defaultSubject: 'অবসর প্রস্তুতিমূলক ছুটি (PRL) ও পেনশন মঞ্জুরির আবেদন।',
    recipientOptions: TEACHER_RECIPIENTS,
    designationOptions: TEACHER_DESIGNATIONS,
    throughOptions: TEACHER_THROUGH_OPTIONS,
    fields: [
      { key: 'leaveReason', label: 'আবেদনের কারণ', type: 'text', defaultValue: 'চাকরির বয়স ৫৯ বছর পূর্ণ হওয়া সাপেক্ষে অবসর প্রস্তুতিমূলক ছুটি ভোগ', required: true },
      { key: 'attachments', label: 'সংযুক্তি', type: 'text', defaultValue: 'সার্ভিস বুক, জাতীয় পরিচয়পত্রের কপি ও প্রথম যোগদানের প্রমাণপত্র' },
    ],
  },
  {
    id: 'passport_noc',
    title: 'পাসপোর্ট তৈরির অনুমতিপত্র (NOC Application)',
    shortTitle: 'পাসপোর্ট এনওসি (NOC)',
    category: 'employee',
    description: 'সরকারি কর্মকর্তা ও শিক্ষকদের আন্তর্জাতিক ই-পাসপোর্ট তৈরির জন্য বিভাগীয় অনাপত্তি সনদ (NOC) প্রাপ্তির আবেদন।',
    badge: 'চাকরিজীবী',
    iconName: 'ShieldCheck',
    defaultRecipient: 'জেলা প্রাথমিক শিক্ষা অফিসার (ডিপিইও)',
    defaultThrough: 'উপজেলা শিক্ষা অফিসারের মাধ্যমে',
    defaultSubject: 'আন্তর্জাতিক পাসপোর্ট ইস্যুর জন্য অনাপত্তি সনদ (NOC) পাওয়ার আবেদন।',
    recipientOptions: TEACHER_RECIPIENTS,
    designationOptions: TEACHER_DESIGNATIONS,
    throughOptions: TEACHER_THROUGH_OPTIONS,
    fields: [
      { key: 'leaveReason', label: 'পাসপোর্টের প্রয়োজনীয়তা', type: 'select', options: ['পবিত্র হজ্ব ও ওমরাহ পালনের উদ্দেশ্যে', 'উন্নত চিকিৎসার উদ্দেশ্যে বিদেশ গমনের লক্ষ্যে', 'আন্তর্জাতিক ভ্রমণ ও দর্শনীয় স্থান পরিদর্শনের উদ্দেশ্যে'], defaultValue: 'পবিত্র হজ্ব ও ওমরাহ পালনের উদ্দেশ্যে', required: true },
      { key: 'attachments', label: 'সংযুক্তি', type: 'text', defaultValue: 'জাতীয় পরিচয়পত্র, প্রথম নিয়োগপত্র ও ছবি' },
    ],
  },
  {
    id: 'ex_bangladesh',
    title: 'বহিঃবাংলাদেশ ছুটির আবেদন (Ex-Bangladesh Leave)',
    shortTitle: 'বহিঃবাংলাদেশ ছুটি',
    category: 'employee',
    description: 'চিকিৎসা, হজ্ব/ওমরাহ বা আত্মীয়ের সাথে সাক্ষাতের জন্য সরকারি খরচে নয় এমন শর্তে বিদেশ যাওয়ার বিশেষ অনুমতির আবেদন।',
    badge: 'চাকরিজীবী',
    iconName: 'Plane',
    defaultRecipient: 'মহাপরিচালক (ডিজি), প্রাথমিক শিক্ষা অধিদপ্তর',
    defaultThrough: 'উপজেলা শিক্ষা অফিসার ও জেলা প্রাথমিক শিক্ষা অফিসারের মাধ্যমে',
    defaultSubject: 'পবিত্র হজ্ব/উন্নত চিকিৎসার জন্য বহিঃবাংলাদেশ ছুটির মঞ্জুরির আবেদন।',
    recipientOptions: TEACHER_RECIPIENTS,
    designationOptions: TEACHER_DESIGNATIONS,
    throughOptions: TEACHER_THROUGH_OPTIONS,
    fields: [
      { key: 'leaveReason', label: 'বিদেশ গমনের দেশ ও কারণ', type: 'text', placeholder: 'যেমন: সৌদি আরব (পবিত্র হজ্ব পালনের উদ্দেশ্যে)', defaultValue: 'সৌদি আরবে পবিত্র হজ্ব পালনের উদ্দেশ্যে', required: true },
      { key: 'attachments', label: 'সংযুক্তি', type: 'text', defaultValue: 'পাসপোর্টের সত্যায়িত কপি ও প্রয়োজনীয় ট্রাভেল সংক্রান্ত তথ্যাদি' },
    ],
  },
  {
    id: 'earned_leave',
    title: 'সাধারণ অর্জিত ছুটি বা বৈবাহিক ছুটির আবেদন (Earned Leave)',
    shortTitle: 'অর্জিত / বৈবাহিক ছুটি',
    category: 'employee',
    description: 'বিবাহ বন্ধনে আবদ্ধ হওয়া, পারিবারিক বা ব্যক্তিগত কারণে অর্জিত ছুটির অফিশিয়াল আবেদনপত্র।',
    badge: 'চাকরিজীবী',
    iconName: 'Award',
    defaultRecipient: 'জেলা প্রাথমিক শিক্ষা অফিসার (ডিপিইও)',
    defaultThrough: 'যথাযথ কর্তৃপক্ষের মাধ্যমে',
    defaultSubject: 'অর্জিত ছুটির মঞ্জুরির জন্য আবেদন।',
    recipientOptions: TEACHER_RECIPIENTS,
    designationOptions: TEACHER_DESIGNATIONS,
    throughOptions: TEACHER_THROUGH_OPTIONS,
    fields: [
      { key: 'leaveReason', label: 'ছুটির কারণ', type: 'select', options: ['শুভ বিবাহ বন্ধনে আবদ্ধ হওয়ার কারণে', 'পারিবারিক গৃহনির্মাণ কাজের তদারকির কারণে', 'জরুরি ব্যক্তিগত কাজে অংশগ্রহণের কারণে'], defaultValue: 'শুভ বিবাহ বন্ধনে আবদ্ধ হওয়ার কারণে', required: true },
      { key: 'attachments', label: 'সংযুক্তি', type: 'text', defaultValue: 'বিবাহের আমন্ত্রণপত্র / সংশ্লিষ্ট প্রাসঙ্গিক প্রমাণপত্র' },
    ],
  },

  // --- PART 2: Student Templates ---
  {
    id: 'student_absence_leave',
    title: 'অনুপস্থিতির জন্য ছুটির আবেদন',
    shortTitle: 'অনুপস্থিতির ছুটি',
    category: 'student',
    description: 'অসুস্থতা বা পারিবারিক সমস্যার কারণে অতীতে ক্লাসে অনুপস্থিত থাকার পর জরিমানা ছাড়া ছুটির মঞ্জুরি আবেদন।',
    badge: 'শিক্ষার্থী',
    iconName: 'GraduationCap',
    defaultRecipient: 'প্রধান শিক্ষক',
    defaultThrough: 'শ্রেণি শিক্ষকের মাধ্যমে',
    defaultSubject: 'অনুপস্থিতির জন্য ছুটি মঞ্জুরের আবেদন।',
    recipientOptions: STUDENT_RECIPIENTS,
    designationOptions: ['শিক্ষার্থী'],
    throughOptions: ['শ্রেণি শিক্ষকের মাধ্যমে', 'সরাসরি'],
    fields: [
      { key: 'studentClass', label: 'শ্রেণি', type: 'select', options: STUDENT_CLASSES, defaultValue: '১০ম শ্রেণি (এসএসসি পরীক্ষার্থী)', required: true },
      { key: 'rollNumber', label: 'রোল নম্বর', type: 'text', placeholder: 'যেমন: ১২', defaultValue: '০৫', required: true },
      { key: 'leaveReason', label: 'অনুপস্থিতির কারণ', type: 'select', options: ['হঠাৎ তীব্র জ্বরে আক্রান্ত হওয়ার কারণে', 'পারিবারিক জরুরি সমস্যার কারণে', 'চিকিৎসকের পরামর্শে বিশ্রামে থাকার কারণে'], defaultValue: 'হঠাৎ তীব্র জ্বরে আক্রান্ত হওয়ার কারণে', required: true },
    ],
  },
  {
    id: 'student_advance_leave',
    title: 'অগ্রিম ছুটির আবেদন',
    shortTitle: 'অগ্রিম ছুটি',
    category: 'student',
    description: 'ভবিষ্যতে কোনো নির্দিষ্ট দিনে জরুরি পারিবারিক কাজ বা অনুষ্ঠানে উপস্থিত থাকার জন্য আগে থেকেই ছুটির আবেদন।',
    badge: 'শিক্ষার্থী',
    iconName: 'CalendarCheck',
    defaultRecipient: 'প্রধান শিক্ষক',
    defaultThrough: 'শ্রেণি শিক্ষকের মাধ্যমে',
    defaultSubject: 'অগ্রিম ছুটির জন্য আবেদন।',
    recipientOptions: STUDENT_RECIPIENTS,
    designationOptions: ['শিক্ষার্থী'],
    throughOptions: ['শ্রেণি শিক্ষকের মাধ্যমে', 'সরাসরি'],
    fields: [
      { key: 'studentClass', label: 'শ্রেণি', type: 'select', options: STUDENT_CLASSES, defaultValue: '৮ম শ্রেণি', required: true },
      { key: 'rollNumber', label: 'রোল নম্বর', type: 'text', placeholder: 'যেমন: ১৮', defaultValue: '০২', required: true },
      { key: 'leaveReason', label: 'অগ্রিম ছুটির কারণ', type: 'select', options: ['বড় বোনের শুভ বিবাহ অনুষ্ঠানে যোগদানের কারণে', 'পারিবারিক জরুরি কাজে গ্রামের বাড়ি যাওয়ার কারণে', 'চিকিৎসার জন্য বিশেষজ্ঞ ডাক্তারের অ্যাপয়েন্টমেন্ট থাকায়'], defaultValue: 'বড় বোনের শুভ বিবাহ অনুষ্ঠানে যোগদানের কারণে', required: true },
    ],
  },
  {
    id: 'student_fee_waiver',
    title: 'বিনা বেতনে অধ্যয়নের আবেদন (Fee Waiver)',
    shortTitle: 'বিনা বেতনে অধ্যয়ন',
    category: 'student',
    description: 'দরিদ্রতা বা অর্থনৈতিক অসচ্ছলতার কারণে মাসিক বেতন ও টিউশন ফি সম্পূর্ণ বা আংশিক মওকুফের আবেদনপত্র।',
    badge: 'শিক্ষার্থী',
    iconName: 'BookOpen',
    defaultRecipient: 'প্রধান শিক্ষক',
    defaultThrough: 'শ্রেণি শিক্ষকের মাধ্যমে',
    defaultSubject: 'বিনা বেতনে অধ্যয়নের সুযোগ প্রদানের জন্য আবেদন।',
    recipientOptions: STUDENT_RECIPIENTS,
    designationOptions: ['শিক্ষার্থী'],
    throughOptions: ['শ্রেণি শিক্ষকের মাধ্যমে', 'সরাসরি'],
    fields: [
      { key: 'studentClass', label: 'শ্রেণি', type: 'select', options: STUDENT_CLASSES, defaultValue: '৯ম শ্রেণি', required: true },
      { key: 'rollNumber', label: 'রোল নম্বর', type: 'text', placeholder: 'যেমন: ০৭', defaultValue: '০৩', required: true },
      { key: 'fatherOrGuardianName', label: 'পিতা/অভিভাবকের নাম', type: 'text', placeholder: 'যেমন: মোঃ আব্দুল জলিল', required: true },
      { key: 'familyMonthlyIncome', label: 'পিতার পেশা ও পরিবারের অবস্থা', type: 'text', defaultValue: 'পিতা একজন স্বল্প আয়ের দিনমজুর, পরিবারে সদস্য সংখ্যা ৬ জন', required: true },
      { key: 'gpaOrLastExamResult', label: 'পূর্ববর্তী পরীক্ষার ফলাফল', type: 'text', defaultValue: 'পূর্ববর্তী বার্ষিক পরীক্ষায় জিপিএ ৫.০০ (১ম স্থান)', required: true },
    ],
  },
  {
    id: 'student_poor_fund',
    title: 'দরিদ্র তহবিল থেকে সাহায্যের আবেদন (Poor Fund)',
    shortTitle: 'দরিদ্র তহবিল সাহায্য',
    category: 'student',
    description: 'বই-খাতা কেনা, পরীক্ষার ফরম ফিলাপ বা অন্যান্য ফি পরিশোধের জন্য বিদ্যালয়ের দরিদ্র কল্যাণ তহবিল থেকে আর্থিক অনুদানের আবেদন।',
    badge: 'শিক্ষার্থী',
    iconName: 'Gift',
    defaultRecipient: 'প্রধান শিক্ষক',
    defaultThrough: 'শ্রেণি শিক্ষকের মাধ্যমে',
    defaultSubject: 'বিদ্যালয়ের দরিদ্র তহবিল থেকে এককালীন আর্থিক সাহায্যের আবেদন।',
    recipientOptions: STUDENT_RECIPIENTS,
    designationOptions: ['শিক্ষার্থী'],
    throughOptions: ['শ্রেণি শিক্ষকের মাধ্যমে', 'সরাসরি'],
    fields: [
      { key: 'studentClass', label: 'শ্রেণি', type: 'select', options: STUDENT_CLASSES, defaultValue: '১০ম শ্রেণি (এসএসসি পরীক্ষার্থী)', required: true },
      { key: 'rollNumber', label: 'রোল নম্বর', type: 'text', defaultValue: '০৮', required: true },
      { key: 'fatherOrGuardianName', label: 'পিতা/অভিভাবকের নাম', type: 'text', placeholder: 'যেমন: মোঃ আব্দুল জলিল', required: true },
      { key: 'leaveReason', label: 'সাহায্যের প্রয়োজনীয়তা', type: 'select', options: ['এসএসসি পরীক্ষার ফরম ফিলাপের ফি পরিশোধের জন্য', 'নতুন শিক্ষাবর্ষের পাঠ্যবই ও সহায়ক উপকরণ ক্রয়ের জন্য', 'ত্রৈমাসিক পরীক্ষার ফি প্রদানের জন্য'], defaultValue: 'এসএসসি পরীক্ষার ফরম ফিলাপের ফি পরিশোধের জন্য', required: true },
    ],
  },
  {
    id: 'student_tc',
    title: 'ছাড়পত্র (TC) পাওয়ার আবেদন (Transfer Certificate)',
    shortTitle: 'ছাড়পত্র (TC)',
    category: 'student',
    description: 'পিতার কর্মস্থল পরিবর্তন, পরিবারের স্থানান্তর বা দূরত্বের কারণে ছাড়পত্র (টিসি) প্রাপ্তির আবেদনপত্র।',
    badge: 'শিক্ষার্থী',
    iconName: 'ArrowRightLeft',
    defaultRecipient: 'প্রধান শিক্ষক',
    defaultThrough: 'শ্রেণি শিক্ষকের মাধ্যমে',
    defaultSubject: 'বিদ্যালয় হতে ছাড়পত্র (TC) পাওয়ার জন্য আবেদন।',
    recipientOptions: STUDENT_RECIPIENTS,
    designationOptions: ['শিক্ষার্থী'],
    throughOptions: ['শ্রেণি শিক্ষকের মাধ্যমে', 'সরাসরি'],
    fields: [
      { key: 'studentClass', label: 'শ্রেণি', type: 'select', options: STUDENT_CLASSES, defaultValue: '৭ম শ্রেণি', required: true },
      { key: 'rollNumber', label: 'রোল নম্বর', type: 'text', defaultValue: '১১', required: true },
      { key: 'tcReason', label: 'ছাড়পত্র গ্রহণের কারণ', type: 'select', options: ['পিতার সরকারি চাকরিজনিত কারণে নতুন কর্মস্থলে বদলি', 'পারিবারিক কারণে অন্য জেলায় স্থায়ীভাবে স্থানান্তর', 'বাসা পরিবর্তনজনিত কারণে দূরত্বের সমস্যা'], defaultValue: 'পিতার সরকারি চাকরিজনিত কারণে নতুন কর্মস্থলে বদলি', required: true },
      { key: 'newSchoolName', label: 'নতুন বিদ্যালয়ের নাম ও এলাকা', type: 'text', placeholder: 'যেমন: সিলেট সরকারি পাইলট উচ্চ বিদ্যালয়', defaultValue: 'সিলেট সরকারি উচ্চ বিদ্যালয়' },
    ],
  },
  {
    id: 'student_testimonial',
    title: 'প্রশংসাপত্র (Testimonial) পাওয়ার আবেদন',
    shortTitle: 'প্রশংসাপত্র (Testimonial)',
    category: 'student',
    description: 'উত্তীর্ণ হওয়ার পর উচ্চশিক্ষায় ভর্তি বা চাকরির প্রয়োজনে প্রতিষ্ঠান প্রধানের নিকট থেকে চারিত্রিক ও শিক্ষাগত প্রশংসাপত্রের আবেদন।',
    badge: 'শিক্ষার্থী',
    iconName: 'BadgeCheck',
    defaultRecipient: 'অধ্যক্ষ',
    defaultThrough: 'সরাসরি',
    defaultSubject: 'চারিত্রিক ও শিক্ষাগত প্রশংসাপত্র প্রদানের জন্য আবেদন।',
    recipientOptions: STUDENT_RECIPIENTS,
    designationOptions: ['শিক্ষার্থী'],
    throughOptions: ['সরাসরি', 'বিভাগীয় প্রধানের মাধ্যমে'],
    fields: [
      { key: 'studentClass', label: 'উত্তীর্ণ শ্রেণি/পরীক্ষা', type: 'select', options: ['এসএসসি পরীক্ষা', 'এইচএসসি পরীক্ষা', 'ডিগ্রি (পাস) পরীক্ষা', 'স্নাতক (সম্মান) পরীক্ষা'], defaultValue: 'এসএসসি পরীক্ষা', required: true },
      { key: 'rollNumber', label: 'বোর্ড রোল ও রেজিস্ট্রেশন নম্বর', type: 'text', placeholder: 'যেমন: ২১৫৬৩৪ (রেজি: ১৮১২৩৪৫৬৭৮)', defaultValue: '২১৫৬৩৪ (রেজি: ১৮১২৩৪৫৬৭৮)', required: true },
      { key: 'passingYear', label: 'পাসের বছর ও জিপিএ', type: 'text', placeholder: 'যেমন: ২০২৫, জিপিএ: ৫.০০', defaultValue: '২০২৫, জিপিএ: ৫.০০', required: true },
    ],
  },
  {
    id: 'student_readmission',
    title: 'পুনঃভর্তির আবেদন (Re-admission)',
    shortTitle: 'পুনঃভর্তি',
    category: 'student',
    description: 'দীর্ঘ অসুস্থতা বা বিলম্বের কারণে নাম কর্তন হয়ে থাকলে পুনরায় ক্লাসে ভর্তির আনুষ্ঠানিক আবেদনপত্র।',
    badge: 'শিক্ষার্থী',
    iconName: 'UserCheck',
    defaultRecipient: 'প্রধান শিক্ষক',
    defaultThrough: 'শ্রেণি শিক্ষকের মাধ্যমে',
    defaultSubject: 'বিদ্যালয়ে পুনরায় ভর্তির অনুমতি প্রার্থনার আবেদন।',
    recipientOptions: STUDENT_RECIPIENTS,
    designationOptions: ['শিক্ষার্থী'],
    throughOptions: ['শ্রেণি শিক্ষকের মাধ্যমে', 'সরাসরি'],
    fields: [
      { key: 'studentClass', label: 'শ্রেণি', type: 'select', options: STUDENT_CLASSES, defaultValue: '৬ষ্ঠ শ্রেণি', required: true },
      { key: 'rollNumber', label: 'পূর্বের রোল নম্বর', type: 'text', defaultValue: '০৯', required: true },
      { key: 'leaveReason', label: 'নাম কর্তন বা অনুপস্থিতির কারণ', type: 'text', defaultValue: 'দীর্ঘদিন জন্ডিসে আক্রান্ত হয়ে চিকিৎসাধীন থাকার কারণে', required: true },
    ],
  },
];

/**
 * A ready-to-read demo application: every template field carries its own official
 * wording, only the applicant identity and dates are invented.
 */
export function getSampleFormData(template: FormatTemplate): ApplicationFormData {
  const isEmployee = template.category === 'employee';
  const today = getTodayISODate();

  const sample: ApplicationFormData = {
    ...getDefaultFormData(template),
    date: toBanglaDate(today),
    applicantName: isEmployee ? 'মোছাঃ রোকেয়া খাতুন' : 'তাহমিদ আহমেদ',
    designation: isEmployee ? 'সহকারী শিক্ষক' : 'শিক্ষার্থী',
    employeeId: isEmployee ? '৯১২০৮৫৭৪৬' : '',
    organization: isEmployee ? 'উপজেলা শিক্ষা অফিস' : 'মডেল উচ্চ বিদ্যালয়',
    workplace: isEmployee
      ? '৫৮নং বৈরাগীবাজার সরকারি প্রাথমিক বিদ্যালয়'
      : 'বিয়ানীবাজার সরকারি পাইলট মডেল উচ্চ বিদ্যালয়',
    upazilaOrArea: 'বিয়ানীবাজার',
    district: 'সিলেট',
    mobile: '০১৭১২-৩৪৫৬৭৮',
    fatherOrGuardianName: 'মোঃ আব্দুল জলিল',
    leaveStartDate: today,
    leaveEndDate: today,
    totalDays: '১ (এক) দিন',
    previousLeaveOrderNo: 'উশিঅ/বিয়ানী/২০২৬/১১৮, তারিখ: ১৫-০৪-২০২৬',
    joiningDate: today,
  };

  for (const field of template.fields) {
    if (!field.defaultValue) continue;
    if (field.key === 'attachments') {
      sample.attachments = field.defaultValue;
      continue;
    }
    (sample as unknown as Record<string, string>)[field.key] = field.defaultValue;
  }

  return sample;
}

/**
 * Empty starting state. Only template-derived values (recipient, subject,
 * default medium, today) are prefilled - no applicant data is invented.
 */
export function getDefaultFormData(template: FormatTemplate): ApplicationFormData {
  const isEmployee = template.category === 'employee';
  const today = getTodayISODate();

  const base: ApplicationFormData = {
    date: toBanglaDate(today),
    recipient: template.defaultRecipient,
    customRecipient: '',
    organization: '',
    through: template.defaultThrough || (isEmployee ? 'যথাযথ কর্তৃপক্ষের মাধ্যমে' : 'শ্রেণি শিক্ষকের মাধ্যমে'),
    subject: template.defaultSubject,
    salutation: 'মহোদয়,',
    applicantName: '',
    designation: '',
    customDesignation: '',
    employeeId: '',
    workplace: '',
    upazilaOrArea: '',
    district: '',
    mobile: '',

    leaveStartDate: '',
    leaveEndDate: '',
    totalDays: '',
    leaveReason: '',

    joiningType: template.joiningTypeOptions ? template.joiningTypeOptions[0] : 'চিকিৎসা ছুটি শেষে কর্মস্থলে যোগদানের আবেদন',
    joiningTimeSession: 'পূর্বাহ্ণ',
    previousLeaveOrderNo: '',
    joiningDate: '',

    studentClass: '',
    rollNumber: '',
    fatherOrGuardianName: '',
    familyMonthlyIncome: '',
    gpaOrLastExamResult: '',
    tcReason: '',
    newSchoolName: '',
    passingYear: '',

    attachments: '',
    customBodyText: '',
  };

  for (const field of template.fields) {
    if (field.type !== 'select' || !field.defaultValue) continue;
    (base as unknown as Record<string, string>)[field.key] = field.defaultValue;
  }

  return base;
}
