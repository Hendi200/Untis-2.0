import React, { useState, useEffect } from 'react';
import { X, RotateCcw, CheckSquare, Square } from 'lucide-react';
import { AVAILABLE_SUBJECTS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  activeSubjectIds?: string[];
  onToggleSubject?: (id: string) => void;
  availableForToggleIds?: string[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onReset, 
  activeSubjectIds,
  onToggleSubject,
  availableForToggleIds
}) => {
  const [confirmStep, setConfirmStep] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
        setConfirmStep(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subjectsToShow = availableForToggleIds 
    ? AVAILABLE_SUBJECTS.filter(s => availableForToggleIds.includes(s.id))
    : AVAILABLE_SUBJECTS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-sm h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 bg-white text-slate-900" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center border-slate-100 shrink-0 bg-white sticky top-0 z-10">
          <h2 className="font-bold text-lg">Einstellungen</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section: Subjects */}
          {activeSubjectIds && onToggleSubject && (
              <section>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Lernbüro Fächer</h3>
                     <span className="text-xs text-slate-400">{subjectsToShow.length} verfügbar</span>
                  </div>
                  
                  {subjectsToShow.length === 0 ? (
                    <div className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg">
                      Keine Lernbüro-Fächer gefunden.
                    </div>
                  ) : (
                    <div className="space-y-2">
                        {subjectsToShow.map(subject => {
                            const isActive = activeSubjectIds.includes(subject.id);
                            return (
                                <button
                                    key={subject.id}
                                    onClick={() => onToggleSubject(subject.id)}
                                    className={`w-full flex items-center p-3 rounded-xl border transition-all ${
                                        isActive 
                                        ? 'bg-white border-slate-200 shadow-sm' 
                                        : 'bg-slate-50 border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 mr-3 ${subject.modalColor}`}>
                                        {subject.short}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className={`font-bold text-sm ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>{subject.name}</div>
                                    </div>
                                    <div className={isActive ? 'text-indigo-600' : 'text-slate-300'}>
                                        {isActive ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                  )}
              </section>
          )}
          
          {/* Section: Reset */}
          <section className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Wochenplan</h3>
              {!confirmStep ? (
                <button 
                  onClick={() => setConfirmStep(true)}
                  className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Woche zurücksetzen
                </button>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 bg-red-50 p-4 rounded-xl border border-red-100">
                  <p className="text-center font-bold text-red-800 text-sm">
                    Wirklich alles zurücksetzen?
                  </p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setConfirmStep(false)}
                      className="flex-1 py-2 rounded-lg bg-white text-slate-600 font-bold hover:bg-slate-50 border border-slate-200 transition-colors text-sm"
                    >
                      Abbrechen
                    </button>
                    <button 
                      onClick={() => {
                        onReset();
                        setConfirmStep(false);
                      }}
                      className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-sm"
                    >
                      Zurücksetzen
                    </button>
                  </div>
                </div>
              )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;