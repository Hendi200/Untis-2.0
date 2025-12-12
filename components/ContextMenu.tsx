import React, { useEffect, useRef } from 'react';
import { Trash2, RefreshCw, AlertCircle, ArrowRightLeft, BookOpen } from 'lucide-react';
import { SlotType } from '../types';

interface ContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: 'cancel' | 'uncancel' | 'convert_lb' | 'delete' | 'info') => void;
  slotType: SlotType;
  isCancelled?: boolean;
  subjectName?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, onAction, slotType, isCancelled, subjectName }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position if close to screen edge
  const style: React.CSSProperties = {
    top: position.y,
    left: position.x,
  };

  return (
    <div 
      ref={menuRef}
      style={style}
      className="fixed z-50 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-left"
    >
      <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {subjectName || 'Freie Zeit'}
        </span>
      </div>

      {/* Actions based on state */}
      
      {slotType === SlotType.FIXED && !isCancelled && (
        <>
          <button 
            onClick={() => onAction('cancel')}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            Als Entfall markieren
          </button>
          <button 
            onClick={() => onAction('convert_lb')}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            In Lernbüro umwandeln
          </button>
          <button 
            onClick={() => onAction('info')}
            className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Lern-Infos anzeigen
          </button>
        </>
      )}

      {slotType === SlotType.FIXED && isCancelled && (
        <button 
          onClick={() => onAction('uncancel')}
          className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Entfall aufheben
        </button>
      )}

      {(slotType === SlotType.LERNBUERO || (slotType === SlotType.FIXED && isCancelled)) && (
        <button 
          onClick={() => onAction('delete')} // In cancelled fixed slots, this effectively just clears the override if any, or prompts modal
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          {slotType === SlotType.FIXED ? 'Vertretung löschen' : 'Stunde leeren'}
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {slotType === SlotType.EMPTY && (
        <div className="px-4 py-2 text-sm text-gray-400 italic text-center">
          Tippe zum Hinzufügen
        </div>
      )}

    </div>
  );
};

export default ContextMenu;