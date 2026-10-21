export type CategoryType = 'employee' | 'student';

export type SubCategoryType = 
  | 'casual_leave'
  | 'medical_leave'
  | 'maternity_leave'
  | 'joining_letter'
  | 'prl_pension'
  | 'passport_noc'
  | 'ex_bangladesh'
  | 'earned_leave'
  | 'student_absence_leave'
  | 'student_advance_leave'
  | 'student_fee_waiver'
  | 'student_poor_fund'
  | 'student_tc'
  | 'student_testimonial'
  | 'student_readmission';

export interface FormatTemplate {
  id: SubCategoryType;
  title: string;
  shortTitle: string;
  category: CategoryType;
  description: string;
  badge: string;
  iconName: string;
  defaultRecipient: string;
  defaultThrough?: string;
  defaultSubject: string;
  recipientOptions: string[];
  designationOptions: string[];
  throughOptions?: string[];
  joiningTypeOptions?: string[]; // Specifically for joining letter sub-types
  maternityTermOptions?: string[]; // 1st or 2nd term
  fields: FormFieldConfig[];
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'date-range' | 'textarea' | 'number';
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  helperText?: string;
  required?: boolean;
}

export interface ApplicationFormData {
  recipient: string;
  customRecipient?: string;
  organization: string;
  through?: string;
  subject: string;
  salutation: string;
  applicantName: string;
  designation: string;
  customDesignation?: string;
  employeeId?: string;
  workplace: string; // স্কুল / কলেজের নাম
  upazilaOrArea: string;
  district: string;
  mobile: string;
  
  // Specific for leaves
  leaveStartDate?: string;
  leaveEndDate?: string;
  totalDays?: string;
  leaveReason?: string;
  
  // Specific for joining letter
  joiningType?: string; // চিকিৎসা ছুটি শেষে / ১ম মাতৃত্ব / ২য় মাতৃত্ব
  previousLeaveOrderNo?: string;
  joiningDate?: string;
  joiningTimeSession?: 'পূর্বাহ্ণ' | 'অপরাহ্ণ';

  // Specific for students
  studentClass?: string;
  rollNumber?: string;
  fatherOrGuardianName?: string;
  familyMonthlyIncome?: string;
  gpaOrLastExamResult?: string;
  tcReason?: string;
  newSchoolName?: string;
  passingYear?: string;
  
  // Attachments
  attachments?: string;
  customBodyText?: string;
  date: string;
}

export interface SavedApplication {
  id: string;
  formatId: SubCategoryType;
  formatTitle: string;
  category: CategoryType;
  applicantName: string;
  workplace: string;
  subject: string;
  createdAt: number;
  data: ApplicationFormData;
}

export interface AdminMetrics {
  activeUsers: number;
  dailyVisitors: number;
  totalGenerated: number;
  formatCounts: Record<string, number>;
  recentLogs: Array<{ id: string; format: string; timestamp: number }>;
}
