export type OperatingHours = {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
};

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export function getTodayHours(hours: OperatingHours | null | undefined): string | null {
  if (!hours) return null;
  const today = daysOfWeek[new Date().getDay()];
  const todayHours = hours[today];
  
  if (!todayHours || todayHours.trim() === '') {
    return 'Closed Today';
  }
  return todayHours;
}

export function formatHoursForDisplay(hours: OperatingHours | null | undefined): string {
  const todayHours = getTodayHours(hours);
  if (!todayHours) return '';
  if (todayHours === 'Closed Today') return 'Closed Today';
  return `Usually Open: ${todayHours}`;
}
