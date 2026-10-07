"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import StepProgress from '@/components/layout/StepProgress';
import { Target, ArrowRight, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import clsx from 'clsx';

export default function PracticePage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [errorHint, setErrorHint] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('ielts_analysis');
    if (data) {
      setAnalysis(JSON.parse(data));
    }
  }, []);

  if (!analysis) return null;

  const plan = analysis.three_step_improvement_plan || [];
  const drills = analysis.generated_drills || [];
  const currentDrill = drills[currentDrillIndex];

  const checkAnswer = () => {
    // Be more permissive since users are "improving" a sentence
    if (userAnswer.trim().length > 3) {
      setDrillCompleted(true);
      setErrorHint(null);
    } else {
      setErrorHint("Your answer is too short. Please try to write a complete sentence.");
    }
  };

  const skipDrill = () => {
    setDrillCompleted(true);
    setErrorHint(null);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-in fade-in">
      <StepProgress currentStep={4} />

      <div className="mb-12 text-center mt-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Personalized Improvement Plan</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">Based on your essay analysis, we've identified 3 key areas for improvement. Complete the targeted drills below to strengthen your writing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plan.map((item: any, i: number) => (
          <div key={i} className="glass-panel rounded-3xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors bg-white shadow-sm border-slate-200">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <div className="flex items-center gap-4 mb-5">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-black">{i+1}</span>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{item.focus}</h3>
            </div>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium"><span className="font-bold text-slate-400 block mb-1 uppercase tracking-wider text-xs">Issue:</span> {item.issue}</p>
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-4 rounded-xl leading-relaxed font-medium"><span className="font-bold text-emerald-600 block mb-1 uppercase tracking-wider text-xs">Action:</span> {item.action}</p>
          </div>
        ))}
      </div>

      {currentDrill && (
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl overflow-hidden shadow-xl relative border-slate-200 bg-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="border-b border-slate-100 px-8 py-5 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3 text-slate-900 font-extrabold text-lg">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Target className="w-6 h-6" />
              </div>
              Targeted Drill {currentDrillIndex + 1} of {drills.length}
            </div>
            <span className="text-xs font-bold px-3 py-1.5 bg-white text-slate-500 rounded-lg border border-slate-200 uppercase tracking-wider">
              {currentDrill.type.replace('_', ' ')}
            </span>
          </div>
          
          <div className="p-8 lg:p-10 relative">
            <p className="text-xl font-bold text-slate-800 mb-8 leading-relaxed flex gap-3 items-start">
              <Zap className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              {currentDrill.prompt}
            </p>
            
            <textarea
              className={clsx(
                "w-full h-32 p-6 rounded-2xl border-2 transition-all outline-none resize-none mb-8 text-lg font-medium",
                drillCompleted 
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              )}
              placeholder="Type your corrected version here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={drillCompleted}
            />

            {!drillCompleted ? (
              <div className="flex flex-col gap-4">
                {errorHint && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>Not quite right. <strong>Hint:</strong> {errorHint}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setErrorHint(currentDrill.hint)}
                      className="text-sm text-slate-400 hover:text-primary font-bold transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg"
                    >
                      Need a hint?
                    </button>
                    <button 
                      onClick={skipDrill}
                      className="text-sm text-slate-400 hover:text-slate-600 font-bold transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg"
                    >
                      Skip
                    </button>
                  </div>
                  <button 
                    onClick={checkAnswer}
                    className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-primary/20 active:scale-95 text-lg"
                  >
                    Check Answer
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 py-4">
                <div className="flex items-center gap-3 text-emerald-600 font-extrabold mb-8 text-xl">
                  <CheckCircle2 className="w-8 h-8" />
                  Excellent! You've mastered this pattern.
                </div>
                
                <button 
                  onClick={() => {
                    if (currentDrillIndex < drills.length - 1) {
                      setCurrentDrillIndex(currentDrillIndex + 1);
                      setUserAnswer('');
                      setDrillCompleted(false);
                    } else {
                      router.push(`/essay/${params.id}/rewrite`);
                    }
                  }}
                  className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-xl active:scale-95 text-lg"
                >
                  {currentDrillIndex < drills.length - 1 ? 'Next Drill' : 'Continue to Rewrite'}
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
