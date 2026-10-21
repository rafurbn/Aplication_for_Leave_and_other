import { ApplicationFormData, FormatTemplate } from '../types';

const OTHER_RECIPIENT = 'অন্যান্য';

const DATE_RANGE_EXCLUDED: string[] = ['joining_letter', 'student_tc', 'student_testimonial'];

function isBlank(value?: string): boolean {
  return !value || value.trim() === '';
}

export function showsLeaveDateRange(template: FormatTemplate): boolean {
  return !DATE_RANGE_EXCLUDED.includes(template.id);
}

/**
 * Labels of every field the generated document cannot be printed without.
 */
export function getMissingRequiredFields(
  template: FormatTemplate,
  formData: ApplicationFormData,
): string[] {
  const isEmployee = template.category === 'employee';
  const missing: string[] = [];

  if (isBlank(formData.recipient) || (formData.recipient === OTHER_RECIPIENT && isBlank(formData.customRecipient))) {
    missing.push('বরাবর (প্রাপকের পদবি)');
  }
  if (isEmployee && isBlank(formData.organization)) {
    missing.push('কার্যালয় / অফিস');
  }
  if (isBlank(formData.workplace)) {
    missing.push('বিদ্যালয় / কর্মস্থলের নাম');
  }
  if (isBlank(formData.district)) {
    missing.push('জেলা');
  }
  if (isBlank(formData.applicantName)) {
    missing.push('আবেদনকারীর নাম');
  }
  if (isEmployee && (isBlank(formData.designation) || (formData.designation === OTHER_RECIPIENT && isBlank(formData.customDesignation)))) {
    missing.push('পদবি');
  }
  if (!isEmployee) {
    if (isBlank(formData.studentClass)) missing.push('শ্রেণি');
    if (isBlank(formData.rollNumber)) missing.push('শ্রেণি রোল নম্বর');
  }
  if (isBlank(formData.mobile)) {
    missing.push('মোবাইল নম্বর');
  }
  if (isBlank(formData.subject)) {
    missing.push('বিষয়');
  }
  if (showsLeaveDateRange(template)) {
    if (isBlank(formData.leaveStartDate)) missing.push('শুরুর তারিখ');
    if (isBlank(formData.leaveEndDate)) missing.push('শেষের তারিখ');
  }

  for (const field of template.fields) {
    if (!field.required) continue;
    const value = (formData as unknown as Record<string, unknown>)[field.key];
    if (typeof value === 'string' && isBlank(value)) {
      if (!missing.includes(field.label)) missing.push(field.label);
    }
  }

  return missing;
}
