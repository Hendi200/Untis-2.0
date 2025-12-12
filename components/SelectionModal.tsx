import React from 'react';
import { AVAILABLE_SUBJECTS } from '../constants';
import { X, AlertCircle, ChevronRight, Trash2, RotateCcw } from 'lucide-react';
import { MasterSlotConfig, SlotType, LernbueroOption } from '../types';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSlot: (action: 'cancel' | 'set_subject' | 'restore' | 'delete', subjectId?: string, room?: string, teacher?: string) => void;
  
  currentSubjectId?: string; // The subject currently shown
  currentRoom?: string;      // The specific room currently selected
  currentTeacher?: string;   // The specific teacher currently selected
  
  masterSlot?: MasterSlotConfig; // Configuration for this slot
  isCancelled?: boolean;
  
  activeSubjectIds?: string[]; // New: Filter available subjects based on settings
}

const SelectionModal: React.FC<SelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdateSlot, 
  currentSubjectId, 
  currentRoom,
  currentTeacher,
  masterSlot,
  isCancelled,
  activeSubjectIds
}) => {
  if (!isOpen) return null;

  const isFixedLesson = masterSlot?.type === SlotType.FIXED;
  
  // Construct a temporary subject object for Fixed lessons
  let currentSubject = AVAILABLE_SUBJECTS.find(s => s.id === currentSubjectId);
  if (isFixedLesson && masterSlot.fixedSubject && !currentSubject) {
      const template = AVAILABLE_SUBJECTS.find(s => s.id === masterSlot.fixedSubject?.colorId) || AVAILABLE_SUBJECTS[0];
      currentSubject = {
          ...template,
          id: 'fixed-slot',
          name: masterSlot.fixedSubject.name,
          short: masterSlot.fixedSubject.short,
          room: masterSlot.fixedSubject.room,
          teacher: masterSlot.fixedSubject.teacher,
      };
  }

  // --- MODE 1: Detail View (Fixed Lesson, NOT Cancelled) ---
  const showDetailView = isFixedLesson && !isCancelled && currentSubject;

  if (showDetailView && currentSubject) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={onClose}>
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
          
          <div className={`p-8 ${currentSubject.modalColor} flex flex-col items-center text-center`}>
            <h2 className="text-4xl font-bold mb-1 text-white tracking-tight">{currentSubject.short}</h2>
            <p className="text-lg font-medium text-white/90">{currentSubject.name}</p>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Lehrer</span>
                <span className="text-xl font-bold text-slate-700">{currentSubject.teacher || '-'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Raum</span>
                <span className="text-xl font-bold text-slate-700">{currentSubject.room || '-'}</span>
            </div>
          </div>

          <div className="p-6 pt-0 flex flex-col gap-3">
             <button 
               onClick={() => onUpdateSlot('cancel')}
               className="w-full py-4 rounded-xl bg-red-50 text-red-600 font-bold border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
             >
               <AlertCircle className="w-5 h-5" />
               Unterricht entfällt
             </button>
             
             <button onClick={onClose} className="w-full py-3 text-slate-400 font-medium hover:text-slate-600">
               Schließen
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MODE 2: Selection View (Lernbüro OR Cancelled Fixed Lesson) ---
  
  // Combine Template Data with Custom Room/Teacher from MasterSlot
  let selectionOptions: (LernbueroOption & { template: typeof AVAILABLE_SUBJECTS[0] })[] = [];

  // Prefer configured options (Lernbüro Options) if they exist
  // This now covers both Regular Lernbüro slots AND Fixed slots with substitution options
  if (masterSlot?.lernbueroOptions && masterSlot.lernbueroOptions.length > 0) {
      selectionOptions = masterSlot.lernbueroOptions.map(opt => ({
        ...opt,
        template: AVAILABLE_SUBJECTS.find(s => s.id === opt.subjectId) || AVAILABLE_SUBJECTS[0]
      }));
  } else if (masterSlot?.allowedSubjectIds) {
      // Legacy fallback
      selectionOptions = masterSlot.allowedSubjectIds.map(id => ({
        subjectId: id,
        customRoom: '',
        customTeacher: '',
        template: AVAILABLE_SUBJECTS.find(s => s.id === id) || AVAILABLE_SUBJECTS[0]
      }));
  } else if (isFixedLesson && isCancelled) {
     // ONLY if no specific substitution options were found, allow ALL subjects
     // (Note: With the current constants.ts, all days are covered, but this is a fallback)
     const LERNBUERO_IDS = AVAILABLE_SUBJECTS.map(s => s.id);
     selectionOptions = AVAILABLE_SUBJECTS
       .filter(s => LERNBUERO_IDS.includes(s.id))
       .map(s => ({
         subjectId: s.id,
         customRoom: '',
         customTeacher: '',
         template: s
       }));
  }

  // FILTER BY ACTIVE SUBJECTS (Settings)
  if (activeSubjectIds) {
      selectionOptions = selectionOptions.filter(opt => activeSubjectIds.includes(opt.template.id));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-sm h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200" onClick={e => e.stopPropagation()}>
        
        <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
          <h3 className="font-bold text-slate-700 text-lg">
             {isFixedLesson && isCancelled ? 'Vertretung wählen' : (currentSubjectId ? 'Ändern' : 'Wähle ein Fach')}
          </h3>
          <button onClick={onClose}><X className="w-6 h-6 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
            {/* LERNBUERO OPTIONS */}
            {selectionOptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                    <p>Keine Fächer verfügbar.</p>
                    <p className="text-xs mt-2">Überprüfe deine Fächer in den Einstellungen oder den Plan.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {selectionOptions.map((opt, index) => {
                        const subject = opt.template;
                        
                        const displayTeacher = opt.customTeacher || subject.teacher;
                        const displayRoom = opt.customRoom || subject.room;

                        // Selection check
                        const isSelected = 
                            subject.id === currentSubjectId &&
                            (!currentTeacher || displayTeacher === currentTeacher) &&
                            (!currentRoom || displayRoom === currentRoom);

                        const uniqueKey = `${subject.id}-${index}`;

                        return (
                            <button 
                                key={uniqueKey}
                                onClick={() => onUpdateSlot('set_subject', subject.id, displayRoom, displayTeacher)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all group text-left ${
                                    isSelected 
                                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' 
                                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-sm ${subject.modalColor}`}>
                                        {subject.short}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-700">{subject.name}</div>
                                        <div className="text-xs text-slate-400 flex gap-2">
                                        {displayTeacher && <span>{displayTeacher}</span>}
                                        {displayTeacher && displayRoom && <span>•</span>}
                                        {displayRoom && <span>{displayRoom}</span>}
                                        </div>
                                    </div>
                                </div>
                                {isSelected ? (
                                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* --- ACTION BUTTONS AT BOTTOM --- */}

            {/* Case A: Fixed Lesson that is Cancelled -> Show RESET button */}
            {isFixedLesson && isCancelled && masterSlot?.fixedSubject && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <button 
                        onClick={() => onUpdateSlot('restore')}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                    >
                         <RotateCcw className="w-5 h-5" />
                         <span>Zurücksetzen</span>
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-2">
                      Setzt die Stunde auf {masterSlot.fixedSubject.name} zurück.
                    </p>
                </div>
            )}

            {/* Case B: Normal Lernbüro -> Show DELETE button */}
            {!isFixedLesson && currentSubjectId && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <button 
                        onClick={() => onUpdateSlot('delete')}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all text-left"
                    >
                         <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg bg-white`}>
                                   <Trash2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-bold">Stunde leeren</div>
                                    <div className="text-xs opacity-70">Auswahl entfernen</div>
                                </div>
                            </div>
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SelectionModal;