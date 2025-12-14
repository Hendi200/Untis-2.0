import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Settings, Edit3, Plus, CheckCircle2, CalendarDays } from 'lucide-react';
import { DAYS, PERIODS, AVAILABLE_SUBJECTS, INITIAL_MASTER_SCHEDULE } from './constants';
import { ScheduleEntry, SlotType, MasterSlotConfig, SubjectOption } from './types';
import SelectionModal from './components/SelectionModal';
import SettingsModal from './components/SettingsModal';
import ConfigModal from './components/ConfigModal';

const App: React.FC = () => {
  // --- App State ---
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  
  // Initialize Master Schedule from LocalStorage OR Default Constant
  const [masterSchedule, setMasterSchedule] = useState<Record<string, MasterSlotConfig>>(() => {
    // Check local storage first (if user edited it locally)
    const masterData = localStorage.getItem('lb_planer_master_local_v4');
    if (masterData) {
      try {
        const parsed = JSON.parse(masterData);
        if (Object.keys(parsed).length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_MASTER_SCHEDULE;
  });

  // State for Active Subjects (User Preferences)
  const [activeSubjectIds, setActiveSubjectIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lb_planer_active_subjects_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return AVAILABLE_SUBJECTS.map(s => s.id);
  });
  
  const [selectedSlot, setSelectedSlot] = useState<{ dayId: string; periodId: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // --- Storage Helper ---
  const STORAGE_KEY_SCHEDULE = 'lb_planer_schedule_local_v4';
  const STORAGE_KEY_MASTER = 'lb_planer_master_local_v4';
  const STORAGE_KEY_SUBJECTS = 'lb_planer_active_subjects_v1';

  // --- Initialize User Schedule ---
  useEffect(() => {
    const loadInitial = async () => {
        // Fallback to local
        const scheduleData = localStorage.getItem(STORAGE_KEY_SCHEDULE);
        if (scheduleData) {
            try {
                setSchedule(JSON.parse(scheduleData));
            } catch (e) {
                setSchedule([]);
            }
        }
    };
    loadInitial();
  }, []); // Only run once on mount

  // --- Auto-Save Effects ---
  
  // Save Schedule Locally
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MASTER, JSON.stringify(masterSchedule));
  }, [masterSchedule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(activeSubjectIds));
  }, [activeSubjectIds]);


  const resetSchedule = () => {
    setSchedule([]);
  };

  const toggleSubject = (id: string) => {
    setActiveSubjectIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // --- Config Logic ---
  const handleConfigSave = (config: MasterSlotConfig) => {
    const key = `${config.dayId}-${config.periodId}`;
    setMasterSchedule(prev => ({ ...prev, [key]: config }));
  };

  // --- Helpers ---
  const getMasterSlot = (dayId: string, periodId: number): MasterSlotConfig | undefined => {
    return masterSchedule[`${dayId}-${periodId}`];
  };

  const getEntry = (dayId: string, periodId: number) => {
    return schedule.find(s => s.dayId === dayId && s.periodId === periodId);
  };

  const handleClick = (dayId: string, periodId: number) => {
    setSelectedSlot({ dayId, periodId });
    if (isEditMode) {
      setIsConfigModalOpen(true);
    } else {
      const master = getMasterSlot(dayId, periodId);
      if (master && master.type !== SlotType.EMPTY) {
        setIsModalOpen(true);
      }
    }
  };

  // --- Logic ---
  const handleSlotUpdate = (
    action: 'cancel' | 'set_subject' | 'restore' | 'delete', 
    subjectId?: string,
    room?: string,
    teacher?: string
  ) => {
    if (!selectedSlot) return;
    const { dayId, periodId } = selectedSlot;
    const masterSlot = getMasterSlot(dayId, periodId);

    setSchedule(prev => {
      const idx = prev.findIndex(s => s.dayId === dayId && s.periodId === periodId);
      const newSched = [...prev];

      if (idx >= 0) newSched.splice(idx, 1);
      if (action === 'delete') return newSched;

      const newEntry: ScheduleEntry = {
        dayId, 
        periodId,
        type: masterSlot?.type === SlotType.FIXED ? SlotType.FIXED : SlotType.LERNBUERO
      };

      if (action === 'cancel') {
        newEntry.isCancelled = true;
      } else if (action === 'restore') {
        newEntry.isCancelled = false;
      } else if (action === 'set_subject' && subjectId) {
        if (masterSlot?.type === SlotType.FIXED) {
             newEntry.isCancelled = true;
             newEntry.overrideSubjectId = subjectId;
             newEntry.selectedRoom = room;
             newEntry.selectedTeacher = teacher;
        } else {
             newEntry.subjectId = subjectId;
             newEntry.selectedRoom = room;
             newEntry.selectedTeacher = teacher;
        }
      }
      return [...newSched, newEntry];
    });

    setIsModalOpen(false);
  };

  // --- DATA ANALYSIS ---
  const offeredLernbueroSubjectIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(masterSchedule).forEach((slot: MasterSlotConfig) => {
        if (slot.lernbueroOptions) slot.lernbueroOptions.forEach(opt => ids.add(opt.subjectId));
        if (slot.allowedSubjectIds) slot.allowedSubjectIds.forEach(id => ids.add(id));
    });
    return Array.from(ids);
  }, [masterSchedule]);

  // --- Goals Calculation ---
  const goalStatus = useMemo(() => {
    const activeSubjects = AVAILABLE_SUBJECTS.filter(s => 
        offeredLernbueroSubjectIds.includes(s.id) && activeSubjectIds.includes(s.id)
    );

    return activeSubjects.map(gs => {
      const isDone = schedule.some(entry => {
        if (entry.type === SlotType.LERNBUERO && entry.subjectId === gs.id) return true;
        if (entry.type === SlotType.FIXED && entry.isCancelled && entry.overrideSubjectId === gs.id) return true;
        return false;
      });
      return { ...gs, isDone };
    });
  }, [schedule, activeSubjectIds, offeredLernbueroSubjectIds]);

  // --- Render Cell ---
  const renderCell = (dayId: string, periodId: number) => {
    const masterSlot = getMasterSlot(dayId, periodId);
    const userEntry = getEntry(dayId, periodId);

    // Edit Mode Visualization
    if (isEditMode) {
      if (!masterSlot || masterSlot.type === SlotType.EMPTY) {
        return (
          <div onClick={() => handleClick(dayId, periodId)} className="h-full w-full min-h-[3.8rem] md:min-h-[4.8rem] rounded md:rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-100">
             <Plus className="w-5 h-5 text-slate-300" />
          </div>
        );
      }
      if (masterSlot.type === SlotType.LERNBUERO) {
        const count = masterSlot.lernbueroOptions?.length || masterSlot.allowedSubjectIds?.length || 0;
        return (
          <div onClick={() => handleClick(dayId, periodId)} className="h-full w-full min-h-[3.8rem] md:min-h-[4.8rem] rounded md:rounded-lg border border-indigo-200 bg-indigo-50 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
             <span className="text-xs font-bold text-indigo-400 uppercase">Lernbüro</span>
             <span className="text-[10px] text-indigo-300">{count} Optionen</span>
             <div className="absolute top-1 right-1"><Edit3 className="w-3 h-3 text-indigo-400" /></div>
          </div>
        );
      }
      const template = AVAILABLE_SUBJECTS.find(s => s.id === masterSlot.fixedSubject?.colorId) || AVAILABLE_SUBJECTS[0];
      return (
         <div onClick={() => handleClick(dayId, periodId)} className={`h-full w-full min-h-[3.8rem] md:min-h-[4.8rem] rounded md:rounded-lg ${template.color} border border-slate-200 flex flex-col items-center justify-center cursor-pointer relative opacity-80`}>
             <span className={`font-bold ${template.textColor}`}>{masterSlot.fixedSubject?.short}</span>
             <div className="absolute top-1 right-1"><Edit3 className={`w-3 h-3 ${template.textColor}`} /></div>
         </div>
      );
    }

    // Normal Mode
    if (!masterSlot || masterSlot.type === SlotType.EMPTY) {
       return <div className="h-full w-full min-h-[3.8rem] md:min-h-[4.8rem] rounded md:rounded-lg bg-slate-100/50" />;
    }

    let subjectToRender: Partial<SubjectOption> | undefined;
    let isCancelled = false;
    let colorTemplate = AVAILABLE_SUBJECTS[0];
    let customTeacher: string | undefined;
    let customRoom: string | undefined;

    if (masterSlot.type === SlotType.FIXED) {
       isCancelled = userEntry?.isCancelled || false;
       if (isCancelled && userEntry?.overrideSubjectId) {
          const sub = AVAILABLE_SUBJECTS.find(s => s.id === userEntry.overrideSubjectId);
          if (sub) {
             subjectToRender = sub;
             colorTemplate = sub;
             customRoom = userEntry.selectedRoom || sub.room;
             customTeacher = userEntry.selectedTeacher || sub.teacher;
          }
       } else if (!isCancelled) {
          const fs = masterSlot.fixedSubject!;
          colorTemplate = AVAILABLE_SUBJECTS.find(s => s.id === fs.colorId) || AVAILABLE_SUBJECTS[0];
          subjectToRender = { name: fs.name, short: fs.short, room: fs.room, teacher: fs.teacher };
       }
    } else if (masterSlot.type === SlotType.LERNBUERO) {
       if (userEntry?.subjectId) {
          const picked = AVAILABLE_SUBJECTS.find(s => s.id === userEntry.subjectId);
          if (picked) {
             subjectToRender = picked;
             colorTemplate = picked;
             if (userEntry.selectedRoom || userEntry.selectedTeacher) {
                customRoom = userEntry.selectedRoom;
                customTeacher = userEntry.selectedTeacher;
             } else {
                let lbOpt = masterSlot.lernbueroOptions?.find(o => o.subjectId === picked.id);
                if (lbOpt) {
                  customRoom = lbOpt.customRoom;
                  customTeacher = lbOpt.customTeacher;
                }
             }
          }
       } else {
          return <div onClick={() => handleClick(dayId, periodId)} className="h-full w-full min-h-[3.8rem] md:min-h-[4.8rem] rounded md:rounded-lg bg-slate-100/50 cursor-pointer hover:bg-slate-200/50 transition-colors" />;
       }
    }

    if (!subjectToRender && isCancelled) {
       return (
         <div onClick={() => handleClick(dayId, periodId)} className="h-full w-full min-h-[3.8rem] md:min-h-[4.8rem] rounded md:rounded-lg bg-slate-100/50 border-2 border-dashed border-slate-200/50 cursor-pointer hover:bg-slate-200/50 hover:border-slate-300 transition-all flex flex-col items-center justify-center relative group">
             <span className="text-[9px] text-red-300 uppercase font-bold absolute bottom-1 opacity-60 group-hover:opacity-100 transition-opacity">Entfall</span>
         </div>
       );
    }
    
    if (!subjectToRender) return <div />;

    return (
      <div onClick={() => handleClick(dayId, periodId)} className={`relative overflow-hidden w-full min-h-[3.8rem] md:min-h-[4.8rem] p-0.5 md:p-1 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:brightness-95 rounded md:rounded-lg h-full border-l-[4px] md:border-l-[5px] ${colorTemplate.color}`}>
        <div className="flex flex-col gap-0.5 items-center justify-center w-full z-10 pointer-events-none">
            <span className={`font-black text-xs md:text-lg leading-none tracking-tight ${colorTemplate.textColor}`}>{subjectToRender.short}</span>
            <span className={`text-[9px] md:text-xs font-normal leading-none text-slate-600`}>{customTeacher || subjectToRender.teacher}</span>
            <span className={`text-[8px] md:text-[10px] leading-none mt-0.5 text-slate-500`}>{customRoom || subjectToRender.room}</span>
        </div>
      </div>
    );
  };

  const activeMasterSlot = selectedSlot ? getMasterSlot(selectedSlot.dayId, selectedSlot.periodId) : undefined;
  const activeUserEntry = selectedSlot ? getEntry(selectedSlot.dayId, selectedSlot.periodId) : undefined;
  
  let displayedSubjectId: string | undefined = undefined;
  let displayedRoom: string | undefined = undefined;
  let displayedTeacher: string | undefined = undefined;

  if (activeMasterSlot?.type === SlotType.FIXED) {
     if (activeUserEntry?.overrideSubjectId) {
        displayedSubjectId = activeUserEntry.overrideSubjectId;
        displayedRoom = activeUserEntry.selectedRoom;
        displayedTeacher = activeUserEntry.selectedTeacher;
     }
  } else if (activeMasterSlot?.type === SlotType.LERNBUERO) {
     if (activeUserEntry?.subjectId) {
        displayedSubjectId = activeUserEntry.subjectId;
        displayedRoom = activeUserEntry.selectedRoom;
        displayedTeacher = activeUserEntry.selectedTeacher;
     }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col h-screen overflow-hidden select-none transition-colors duration-300 ${isEditMode ? 'bg-[url("https://www.transparenttextures.com/patterns/graphy.png")]' : ''}`}>
        
        {/* Header */}
        <header className={`backdrop-blur-sm border-b shrink-0 z-50 transition-colors ${isEditMode ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/90 border-slate-200'}`}>
          <div className="w-full max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
             <div className="flex items-center gap-3 overflow-hidden flex-1 mr-2">
                <div className={`p-1.5 rounded-md shrink-0 flex items-center justify-center ${isEditMode ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                  {isEditMode ? <Edit3 className="w-5 h-5" /> : <CalendarDays className="w-5 h-5" />}
                </div>
                
                {/* Goal Tracker */}
                {!isEditMode && (
                   <div className="flex items-center gap-1.5 ml-2 border-l pl-3 border-slate-200 h-8 overflow-x-auto no-scrollbar mask-linear-fade flex-1">
                      {goalStatus.map(goal => (
                        <div key={goal.id} className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold border transition-all ${goal.isDone ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'}`} title={`Status: ${goal.name}`}>
                           {goal.isDone ? <CheckCircle2 className="w-4 h-4" /> : goal.short}
                        </div>
                      ))}
                   </div>
                )}
             </div>
             <button onClick={() => setIsSettingsOpen(true)} className={`p-2 shrink-0 transition-colors ${isEditMode ? 'text-indigo-200 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
               <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto transition-colors">
          <div className="w-full max-w-7xl mx-auto px-1 md:px-4 py-2 min-h-full">
            <div className="w-full">
              {/* Grid Header - Reverted text colors */}
              <div className={`grid grid-cols-[2.5rem_repeat(5,1fr)] md:grid-cols-[4rem_repeat(5,1fr)] gap-1 md:gap-3 mb-2 sticky top-0 z-40 pb-2 transition-colors ${isEditMode ? 'bg-transparent' : 'bg-slate-50/95 backdrop-blur'}`}>
                <div className="flex items-center justify-center"><Clock className="w-5 h-5 text-slate-300" /></div>
                {DAYS.map(day => (<div key={day.id} className="text-center"><span className="text-sm md:text-base font-bold text-slate-400 uppercase tracking-wider">{day.short}</span></div>))}
              </div>
              {/* Grid Body */}
              <div className="flex flex-col pb-10">
                {PERIODS.map((period) => (
                  <div key={period.id} className="grid grid-cols-[2.5rem_repeat(5,1fr)] md:grid-cols-[4rem_repeat(5,1fr)] gap-x-1 md:gap-x-3 mb-1 md:mb-3 items-stretch relative">
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 py-1">
                        <span className="text-[9px] md:text-[10px] leading-none opacity-80">{period.startTime}</span>
                        <span className="text-xl md:text-2xl font-bold leading-none my-1 md:my-1.5 text-slate-500">{period.id}</span>
                        <span className="text-[9px] md:text-[10px] leading-none opacity-80">{period.endTime}</span>
                    </div>
                    {DAYS.map(day => (<div key={`${day.id}-${period.id}`} className="relative h-full">{renderCell(day.id, period.id)}</div>))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Modals */}
        <SelectionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdateSlot={handleSlotUpdate}
          currentSubjectId={displayedSubjectId}
          currentRoom={displayedRoom}
          currentTeacher={displayedTeacher}
          masterSlot={activeMasterSlot}
          isCancelled={activeUserEntry?.isCancelled}
          activeSubjectIds={activeSubjectIds}
        />
        {selectedSlot && (
          <ConfigModal 
            isOpen={isConfigModalOpen}
            onClose={() => setIsConfigModalOpen(false)}
            onSave={handleConfigSave}
            currentConfig={activeMasterSlot}
            dayLabel={DAYS.find(d => d.id === selectedSlot.dayId)?.label || ''}
            periodLabel={String(selectedSlot.periodId)}
          />
        )}
        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onReset={resetSchedule}
          activeSubjectIds={activeSubjectIds}
          onToggleSubject={toggleSubject}
          availableForToggleIds={offeredLernbueroSubjectIds}
        />
      </div>
    </div>
  );
};

export default App;