import React, { useState, useEffect } from 'react';
import { X, Save, Check } from 'lucide-react';
import { AVAILABLE_SUBJECTS } from '../constants';
import { MasterSlotConfig, SlotType, LernbueroOption } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: MasterSlotConfig) => void;
  currentConfig?: MasterSlotConfig;
  dayLabel: string;
  periodLabel: string;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onSave, currentConfig, dayLabel, periodLabel }) => {
  const [type, setType] = useState<SlotType>(SlotType.EMPTY);
  
  // Fixed Lesson State
  const [fixedName, setFixedName] = useState('');
  const [fixedShort, setFixedShort] = useState('');
  const [fixedRoom, setFixedRoom] = useState('');
  const [fixedTeacher, setFixedTeacher] = useState('');
  const [fixedColorId, setFixedColorId] = useState('blue');

  // Flex Lesson State
  const [lbOptions, setLbOptions] = useState<LernbueroOption[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (currentConfig) {
        setType(currentConfig.type);
        
        // Load Fixed
        if (currentConfig.type === SlotType.FIXED && currentConfig.fixedSubject) {
          setFixedName(currentConfig.fixedSubject.name);
          setFixedShort(currentConfig.fixedSubject.short);
          setFixedRoom(currentConfig.fixedSubject.room);
          setFixedTeacher(currentConfig.fixedSubject.teacher);
          setFixedColorId(currentConfig.fixedSubject.colorId);
        }

        // Load Lernbüro
        if (currentConfig.type === SlotType.LERNBUERO) {
          if (currentConfig.lernbueroOptions) {
            setLbOptions(currentConfig.lernbueroOptions);
          } else if (currentConfig.allowedSubjectIds) {
            // Migration from old simple string array
            setLbOptions(currentConfig.allowedSubjectIds.map(id => ({ subjectId: id, customRoom: '', customTeacher: '' })));
          } else {
            setLbOptions([]);
          }
        }
      } else {
        // Defaults
        setType(SlotType.EMPTY);
        setFixedName('');
        setFixedShort('');
        setFixedRoom('');
        setFixedTeacher('');
        // Default: All Lernbüro Subjects (M, D, E, GE, IF, EK, KR, CH, NL)
        setLbOptions([
           { subjectId: 'yellow', customRoom: '', customTeacher: '' }, // M
           { subjectId: 'red', customRoom: '', customTeacher: '' },    // D
           { subjectId: 'blue', customRoom: '', customTeacher: '' },   // E
           { subjectId: 'teal', customRoom: '', customTeacher: '' },   // GE
           { subjectId: 'orange', customRoom: '', customTeacher: '' }, // IF
           { subjectId: 'green', customRoom: '', customTeacher: '' },  // EK
           { subjectId: 'purple', customRoom: '', customTeacher: '' }, // KR
           { subjectId: 'indigo', customRoom: '', customTeacher: '' }, // CH
           { subjectId: 'nl', customRoom: '', customTeacher: '' },     // NL
        ]);
      }
    }
  }, [isOpen, currentConfig]);

  const handleSave = () => {
    const config: MasterSlotConfig = {
      dayId: currentConfig?.dayId || '',
      periodId: currentConfig?.periodId || 0,
      type,
    };

    if (type === SlotType.FIXED) {
      config.fixedSubject = {
        name: fixedName,
        short: fixedShort,
        room: fixedRoom,
        teacher: fixedTeacher,
        colorId: fixedColorId,
      };
    } else if (type === SlotType.LERNBUERO) {
      config.lernbueroOptions = lbOptions;
    }

    onSave(config);
    onClose();
  };

  const toggleOption = (templateId: string) => {
    setLbOptions(prev => {
      const exists = prev.find(o => o.subjectId === templateId);
      if (exists) {
        return prev.filter(o => o.subjectId !== templateId);
      } else {
        return [...prev, { subjectId: templateId, customRoom: '', customTeacher: '' }];
      }
    });
  };

  const updateOptionDetails = (templateId: string, field: 'customRoom' | 'customTeacher', value: string) => {
    setLbOptions(prev => prev.map(o => 
      o.subjectId === templateId ? { ...o, [field]: value } : o
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
          <div>
            <h2 className="font-bold text-lg">Stunde konfigurieren</h2>
            <p className="text-xs text-indigo-100 opacity-80">{dayLabel}, {periodLabel}. Stunde</p>
          </div>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Type Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: SlotType.FIXED, label: 'Fest' },
              { id: SlotType.LERNBUERO, label: 'Lernbüro' },
              { id: SlotType.EMPTY, label: 'Frei' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setType(opt.id as SlotType)}
                className={`py-2 rounded-lg font-bold text-sm transition-all ${
                  type === opt.id 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* FIXED Config */}
          {type === SlotType.FIXED && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Farbe / Vorlage</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {AVAILABLE_SUBJECTS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setFixedColorId(s.id);
                        if (!fixedShort) setFixedShort(s.short);
                        if (!fixedName) setFixedName(s.name);
                      }}
                      className={`w-8 h-8 rounded-full shrink-0 border-2 transition-all ${s.modalColor} ${
                        fixedColorId === s.id ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent opacity-60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kürzel</label>
                  <input 
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={fixedShort}
                    onChange={e => setFixedShort(e.target.value)}
                    placeholder="M"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Raum</label>
                  <input 
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={fixedRoom}
                    onChange={e => setFixedRoom(e.target.value)}
                    placeholder="R101"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fach Name</label>
                <input 
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={fixedName}
                  onChange={e => setFixedName(e.target.value)}
                  placeholder="Mathematik"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lehrer</label>
                <input 
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={fixedTeacher}
                  onChange={e => setFixedTeacher(e.target.value)}
                  placeholder="MUSTER"
                />
              </div>
            </div>
          )}

          {/* LERNBUERO Config */}
          {type === SlotType.LERNBUERO && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <p className="text-sm text-slate-500 mb-3">Wähle Fächer und trage Raum/Lehrer für <span className="font-bold">diese Stunde</span> ein.</p>
              <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_SUBJECTS.map(s => {
                   const option = lbOptions.find(o => o.subjectId === s.id);
                   const isChecked = !!option;
                   
                   return (
                    <div key={s.id} className={`rounded-xl border transition-all overflow-hidden ${isChecked ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <button
                        onClick={() => toggleOption(s.id)}
                        className="w-full flex items-center p-2"
                      >
                        <div className={`w-8 h-8 rounded flex items-center justify-center mr-3 text-white text-xs font-bold ${s.modalColor}`}>
                           {s.short}
                        </div>
                        <span className={`flex-1 text-left font-medium ${isChecked ? 'text-indigo-900' : 'text-slate-600'}`}>
                          {s.name}
                        </span>
                        {isChecked ? <Check className="w-5 h-5 text-indigo-600" /> : <div className="w-5 h-5 rounded border border-slate-300"></div>}
                      </button>

                      {isChecked && (
                        <div className="px-2 pb-2 pt-0 grid grid-cols-2 gap-2 animate-in slide-in-from-top-1">
                          <input 
                            placeholder="Raum"
                            className="bg-white border border-indigo-100 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-400"
                            value={option?.customRoom || ''}
                            onChange={(e) => updateOptionDetails(s.id, 'customRoom', e.target.value)}
                          />
                          <input 
                             placeholder="Lehrer"
                             className="bg-white border border-indigo-100 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-400"
                             value={option?.customTeacher || ''}
                             onChange={(e) => updateOptionDetails(s.id, 'customTeacher', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                   );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
          >
            <Save className="w-5 h-5" />
            Speichern
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfigModal;