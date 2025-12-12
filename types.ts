
export enum SlotType {
  FIXED = 'FIXED',       // Fixed class (Fachunterricht)
  LERNBUERO = 'LERNBUERO', // Flexible slot
  EMPTY = 'EMPTY'        // Free period
}

export interface SubjectOption {
  id: string;
  name: string;
  short: string;
  room: string;
  teacher: string;
  color: string;      // Used for the card (border-l-..., bg-...)
  modalColor: string; // Used for the modal header background
  textColor: string;  // Used for text
  borderColor: string; // Used for the border in 'flat' mode
}

export interface LernbueroOption {
  subjectId: string; // References the template (e.g., 'yellow' for Math)
  customRoom?: string; // Specific room for this slot
  customTeacher?: string; // Specific teacher for this slot
}

// Defines the STRUCTURE of the week (The "Master Plan")
export interface MasterSlotConfig {
  dayId: string;
  periodId: number;
  type: SlotType;
  
  // If FIXED:
  fixedSubject?: {
    name: string;
    short: string;
    room: string;
    teacher: string;
    colorId: string; // References a color template
  };

  // If LERNBUERO:
  // Now stores detailed options instead of just IDs
  lernbueroOptions?: LernbueroOption[]; 
  // Legacy support for migration (optional)
  allowedSubjectIds?: string[]; 
}

// Defines the USER CHOICES for the week
export interface ScheduleEntry {
  dayId: string; // 'mon', 'tue', etc.
  periodId: number; // 1, 2, 3...
  type: SlotType;
  subjectId?: string; // Links to SubjectOption
  isCancelled?: boolean; // Only for FIXED
  overrideSubjectId?: string; // If cancelled, what was picked instead?
  
  // Specific details for the chosen option (important if same subject is offered by multiple teachers)
  selectedRoom?: string;
  selectedTeacher?: string;
}

export interface TimePeriod {
  id: number;
  startTime: string;
  endTime: string;
}

export interface Day {
  id: string;
  label: string;
  short: string;
}