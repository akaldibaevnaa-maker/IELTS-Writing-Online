"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import StepProgress from '@/components/layout/StepProgress';
import { AlertCircle, FileEdit, ArrowRight, BrainCircuit, Activity, BookOpen, PenTool, FileText, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useGlobalEssays } from '@/hooks/useGlobalEssays';

export default function AnalysisPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  
  const [essay, setEssay] = useState('');
  const [task, setTask] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [selectedError, setSelectedError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { addEssay } = useGlobalEssays();

  useEffect(() => {
    const fetchAnalysis = async () => {
      const storedEssay = localStorage.getItem('ielts_essay') || '';
      const storedTask = localStorage.getItem('ielts_task') || '';
      setEssay(storedEssay);
      setTask(storedTask);

      if (!storedEssay) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: storedTask, essay: storedEssay, locale })
        });
        const data = await response.json();
        setAnalysis(data);
        localStorage.setItem('ielts_analysis', JSON.stringify(data));
        
        // Save to global DB for the teacher only if not already saved for this specific essay text
        const essayHash = String(storedEssay.length) + storedEssay.substring(0, 10);
        if (localStorage.getItem('last_saved_essay_hash') !== essayHash) {
          const studentName = localStorage.getItem('ielts_user_name') || 'Anonymous Student';
          const group = localStorage.getItem('ielts_group') || 'Self-Study';
          const level = localStorage.getItem('ielts_level') || 'Intermediate';
          
          await addEssay({
            studentName,
            group,
            level,
            taskTopic: storedTask.substring(0, 50) + '...',
            type: data.detected_task_type || 'Task 2',
            version: 'V1',
            aiScore: {
              overall: data.band_scores.overall,
              tr: data.band_scores.task_response,
              cc: data.band_scores.coherence_cohesion,
              lr: data.band_scores.lexical_resource,
              gra: data.band_scores.grammatical_accuracy
            },
            teacherFeedback: null,
            submittedAt: new Date().toISOString(),
            text: storedEssay
          });
          
          localStorage.setItem('last_saved_essay_hash', essayHash);
        }
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [locale]);

  const renderEssayWithHighlights = () => {
    if (!analysis || !analysis.detailed_feedback) return <p className="whitespace-pre-wrap text-slate-300">{essay}</p>;

    let result = essay;
    analysis.detailed_feedback.forEach((feedback: any) => {
      const colors = {
        'GRA': 'border-red-500/50 bg-red-500/10 text-red-300',
        'LR': 'border-blue-500/50 bg-blue-500/10 text-blue-300',
        'CC': 'border-amber-500/50 bg-amber-500/10 text-amber-300',
        'TR': 'border-purple-500/50 bg-purple-500/10 text-purple-300'
      };
      
      const colorClass = colors[feedback.category as keyof typeof colors] || 'border-slate-500/50 bg-slate-500/10 text-slate-300';
      
      result = result.replace(
        feedback.original_text, 
        `<span class="border-b-2 border-dotted cursor-pointer transition-colors hover:bg-white/10 px-1 rounded ${colorClass}" data-id="${feedback.id}">${feedback.original_text}</span>`
      );
    });

    return (
      <div 
        className="whitespace-pre-wrap leading-loose text-lg text-slate-300" 
        dangerouslySetInnerHTML={{ __html: result }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'SPAN' && target.dataset.id) {
            const fb = analysis.detailed_feedback.find((f: any) => f.id === target.dataset.id);
            if (fb) setSelectedError(fb);
          } else {
            setSelectedError(null);
          }
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-[5px] border-primary border-t-transparent rounded-full animate-spin glow-primary" />
        <h2 className="text-2xl font-extrabold text-slate-900">AI is analyzing your essay...</h2>
        <p className="text-slate-500 font-bold">Checking vocabulary, grammar, coherence, and task response.</p>
      </div>
    );
  }

  if (!analysis) {
    return <div className="text-slate-900 font-bold text-center mt-20 text-xl">Error loading analysis. Please go back and try again.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-in fade-in">
      <StepProgress currentStep={3} />
      
      <div className="glass-panel bg-amber-50 border-amber-200 text-amber-700 px-6 py-5 rounded-2xl mb-8 flex items-start gap-4 shadow-sm">
        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-bold leading-relaxed">{t('Analysis.disclaimer')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group bg-white border-slate-200 shadow-sm">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-slate-500 text-xs font-black uppercase tracking-wider mb-2">Overall Band</span>
          <span className="text-6xl font-black text-primary drop-shadow-sm">{analysis.band_scores.overall}</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center bg-white border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600 text-sm font-bold flex items-center gap-2"><FileEdit className="w-5 h-5 text-purple-500"/> Task Response</span>
            <span className="text-xl font-black text-slate-900">{analysis.band_scores.task_response}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(analysis.band_scores.task_response / 9) * 100}%` }}/></div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center bg-white border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600 text-sm font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-amber-500"/> Coherence</span>
            <span className="text-xl font-black text-slate-900">{analysis.band_scores.coherence_cohesion}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(analysis.band_scores.coherence_cohesion / 9) * 100}%` }}/></div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center bg-white border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600 text-sm font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-500"/> Lexical</span>
            <span className="text-xl font-black text-slate-900">{analysis.band_scores.lexical_resource}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(analysis.band_scores.lexical_resource / 9) * 100}%` }}/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 lg:p-8 bg-white border-slate-200 shadow-sm">
          <h3 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Your Essay
          </h3>
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-lg font-medium">
            {renderEssayWithHighlights()}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {selectedError ? (
              <div className="glass-panel rounded-2xl p-6 animate-in slide-in-from-right-4 border border-primary/20 bg-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
                <div className="flex justify-between items-start mb-5 relative">
                  <span className={clsx(
                    "text-xs font-bold px-3 py-1.5 rounded-lg border",
                    selectedError.category === 'GRA' ? 'bg-red-50 text-red-600 border-red-200' :
                    selectedError.category === 'LR' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    selectedError.category === 'CC' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-purple-50 text-purple-600 border-purple-200'
                  )}>
                    {selectedError.category} Issue
                  </span>
                  <button onClick={() => setSelectedError(null)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors">×</button>
                </div>
                
                <div className="mb-5 relative">
                  <div className="text-xs text-slate-500 uppercase font-black tracking-wider mb-2">Original</div>
                  <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm line-through decoration-red-500/50 font-medium">{selectedError.original_text}</div>
                </div>
                
                <div className="mb-5 relative">
                  <div className="text-xs text-slate-500 uppercase font-black tracking-wider mb-2">Correction</div>
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-sm font-bold">{selectedError.corrected_text}</div>
                </div>

                <div className="relative">
                  <div className="text-xs text-slate-500 uppercase font-black tracking-wider mb-2">Explanation</div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedError.explanation}</p>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[350px] bg-white border-slate-200 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-primary">
                  <BrainCircuit className="w-10 h-10" />
                </div>
                <h4 className="font-extrabold text-slate-900 mb-3 text-xl">Interactive Feedback</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Click on any highlighted text in your essay to view detailed explanations and corrections.</p>
                
                <div className="mt-8 flex flex-wrap gap-2 justify-center">
                  <span className="text-xs font-bold px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg">Grammar (GRA)</span>
                  <span className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg">Vocabulary (LR)</span>
                  <span className="text-xs font-bold px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg">Coherence (CC)</span>
                  <span className="text-xs font-bold px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg">Task Resp. (TR)</span>
                </div>
              </div>
            )}

            <button 
              onClick={() => router.push(`/essay/${params.id}/practice`)}
              className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              <PenTool className="w-6 h-6" />
              Practice Drills
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
