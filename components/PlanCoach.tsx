import React, { useState } from 'react';
import { Loader2, Sparkles, X, BookOpen } from 'lucide-react';
import { SubjectOption } from '../types';

interface PlanCoachProps {
  subject: SubjectOption;
  onClose: () => void;
}

const STATIC_TIPS: Record<string, string> = {
  'mat': `**Mathematik-Fokus:**
1. **Theorie verstehen (10 min):** Lies dir die Merksätze im Buch durch oder schaue ein Erklärvideo.
2. **Üben (25 min):** Bearbeite 3 Aufgaben mit steigendem Schwierigkeitsgrad.
   - Aufgabe 1: Grundlagen
   - Aufgabe 2: Anwendung
   - Aufgabe 3: Textaufgabe
3. **Check (10 min):** Vergleiche deine Ergebnisse mit den Lösungen.`,

  'deu': `**Deutsch-Fokus:**
1. **Lesen (10 min):** Lies den Textabschnitt sorgfältig und markiere Schlüsselwörter.
2. **Schreiben (25 min):**
   - Formuliere eine Einleitung.
   - Arbeite die Hauptargumente heraus.
   - Achte auf Rechtschreibung und Zeichensetzung.
3. **Überarbeiten (10 min):** Lies deinen Text laut vor, um Stolpersteine zu finden.`,

  'eng': `**Englisch-Fokus:**
1. **Vokabeln (10 min):** Wiederhole die Vokabeln der aktuellen Unit (Karteikarten oder App).
2. **Grammatik & Text (25 min):**
   - Schreibe 5 Sätze mit der neuen Grammatikregel.
   - Lies einen kurzen englischen Text und fasse ihn mündlich zusammen.
3. **Hören (10 min):** Höre einen englischen Podcast oder Song und achte auf die Aussprache.`,

  'spa': `**Spanisch-Fokus:**
1. **Wortschatz (10 min):** Wiederhole laut die Vokabeln der letzten Lektion.
2. **Verben (15 min):** Konjugiere 3 wichtige Verben in verschiedenen Zeiten.
3. **Textproduktion (20 min):** Schreibe einen kurzen Dialog über deinen Alltag.`,

  'default': `**Allgemeiner Lernplan:**
1. **Vorbereitung (5 min):** Lege alle Materialien bereit und schalte Ablenkungen aus.
2. **Arbeitsphase (30 min):**
   - Arbeite konzentriert an deiner Wochenplan-Aufgabe.
   - Wenn du nicht weiterkommst, notiere deine Frage für die Lehrkraft.
   - Mache dir Notizen zu wichtigen Punkten.
3. **Reflexion (10 min):** Was hast du geschafft? Was nimmst du dir für das nächste Mal vor?`
};

const PlanCoach: React.FC<PlanCoachProps> = ({ subject, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const showPlan = () => {
    setLoading(true);
    // Simulate a short delay for better UX
    setTimeout(() => {
      const tip = STATIC_TIPS[subject.id] || STATIC_TIPS['default'];
      setAdvice(tip);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-4 ${subject.color} flex justify-between items-center`}>
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${subject.textColor}`} />
            <h3 className={`font-bold text-lg ${subject.textColor}`}>Lern-Hilfe: {subject.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/50 rounded-full transition-colors">
            <X className={`w-5 h-5 ${subject.textColor}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!advice && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6">
                Möchtest du eine Struktur für deine {subject.name}-Stunde sehen?
              </p>
              <button
                onClick={showPlan}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Lernplan anzeigen
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 animate-pulse">Lade Lernplan...</p>
            </div>
          )}

          {advice && (
            <div className="prose prose-sm prose-indigo max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {advice.split('\n').map((line, i) => (
                   <p key={i} className="mb-2 last:mb-0">
                     {line.split('**').map((part, j) => 
                       j % 2 === 1 ? <strong key={j} className="text-indigo-900">{part}</strong> : part
                     )}
                   </p>
                ))}
              </div>
              <div className="mt-6 text-center">
                 <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800 underline">
                    Schließen
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCoach;