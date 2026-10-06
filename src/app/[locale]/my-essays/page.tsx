"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { FileText, Calendar, AlertCircle, Eye, PenTool, CheckCircle2, MessageSquare, X, Edit3, ArrowRight } from 'lucide-react';
import { useGlobalEssays, GlobalEssay } from '@/hooks/useGlobalEssays';
import clsx from 'clsx';

const DEMO_STUDENT = 'Aruzhan Serik';

export default function MyEssaysPage() {
  const t = useTranslations('MyEssays');
  const router = useRouter();
  
  const { essays, isLoaded } = useGlobalEssays();
  const [userName, setUserName] = useState('');
  const [viewingFeedback, setViewingFeedback] = useState<GlobalEssay | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem('ielts_user_name') || '');
  }, []);

  if (!isLoaded) return null;

  const myEssays = essays.filter(e => userName && e.studentName === userName);

  const renderEssayWithHighlights = (essay: GlobalEssay) => {
    if (!essay.teacherFeedback) return null;
    let result = essay.text;
    essay.teacherFeedback.inlineComments.forEach(c => {
      result = result.replace(
        c.originalText,
        `<span class="bg-amber-200/50 border-b-2 border-amber-500 cursor-help" title="${c.comment}">${c.originalText}</span>`
      );
    });
    return (
      <div 
        className="whitespace-pre-wrap leading-loose text-lg text-slate-800 font-medium" 
        dangerouslySetInnerHTML={{ __html: result }}
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-in fade-in">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 font-medium text-lg">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {myEssays.map((essay) => (
          <div key={essay.id} className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start md:items-center bg-white border-slate-200 shadow-sm relative overflow-hidden group">
            
            {essay.teacherFeedback?.status === 'graded' && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('teacherFeedbackAlert')}
              </div>
            )}

            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 font-bold">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(essay.submittedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 font-bold">
                  <FileText className="w-4 h-4" />
                  {essay.type}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-bold">
                  {essay.version}
                </span>
              </div>
              
              <h3 className="text-xl text-slate-900 font-extrabold leading-snug">
                "{essay.taskTopic}"
              </h3>
              
              <div className="flex flex-wrap items-center gap-2">
                {essay.teacherFeedback?.status === 'graded' ? (
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    Teacher Reviewed
                  </span>
                ) : (
                  <span className="text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    {t('pending')}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
              <div className="flex gap-6 w-full justify-center">
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">{t('aiScore')}</div>
                  <div className="text-3xl font-black text-slate-900">{essay.aiScore.overall}</div>
                </div>
                {essay.teacherFeedback && (
                  <div className="text-center">
                    <div className="text-xs text-emerald-500 font-black uppercase tracking-wider mb-1">{t('teacherScore')}</div>
                    <div className="text-3xl font-black text-emerald-600 drop-shadow-sm">{essay.teacherFeedback.overall}</div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                {essay.teacherFeedback ? (
                  <button 
                    onClick={() => setViewingFeedback(essay)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-white bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Eye className="w-4 h-4" />
                    {t('viewFeedback')}
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push(`/essay/${essay.id}/analysis`)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl font-bold transition-colors border border-blue-100"
                  >
                    <Eye className="w-4 h-4" />
                    {t('viewAnalysis')}
                  </button>
                )}
                
                <button 
                  onClick={() => router.push(`/new-essay/step-1`)}
                  className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 px-5 py-2.5 rounded-xl font-bold transition-colors border border-slate-200"
                >
                  <PenTool className="w-4 h-4" />
                  {t('rewrite')}
                </button>
              </div>
            </div>

          </div>
        ))}

        {myEssays.length === 0 && (
          <div className="glass-panel p-12 rounded-3xl text-center bg-white border-slate-200 shadow-sm">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl text-slate-900 font-extrabold mb-2">{t('noEssays')}</h3>
          </div>
        )}
      </div>

      {/* Teacher Feedback Viewer Modal */}
      {viewingFeedback && viewingFeedback.teacherFeedback && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 lg:p-6 animate-in fade-in backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                Teacher Feedback Report
              </h2>
              <button onClick={() => setViewingFeedback(null)} className="text-slate-400 hover:text-slate-900 transition-colors bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* Left: Highlighted Essay */}
              <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto border-r border-slate-100 bg-white">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Your Essay
                </h3>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  {renderEssayWithHighlights(viewingFeedback)}
                </div>
                {viewingFeedback.teacherFeedback.inlineComments.length > 0 && (
                  <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
                    <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Inline Comments
                    </h4>
                    <ul className="space-y-3">
                      {viewingFeedback.teacherFeedback.inlineComments.map(c => (
                        <li key={c.id} className="text-sm">
                          <span className="font-bold bg-amber-200/50 px-1 rounded">"{c.originalText}"</span> — <span className="text-slate-700 font-medium">{c.comment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right: Teacher Review */}
              <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto bg-slate-50">
                <div className="flex gap-4 mb-8">
                  <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 flex-1 shadow-sm text-center">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Teacher Score</div>
                    <div className="text-5xl font-black text-emerald-600">{viewingFeedback.teacherFeedback.overall}</div>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 flex-1 shadow-sm text-center">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">AI Score</div>
                    <div className="text-5xl font-black text-slate-900">{viewingFeedback.aiScore.overall}</div>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-primary" />
                  Detailed Feedback
                </h3>
                
                <div className="space-y-4">
                  {viewingFeedback.teacherFeedback.strengths && (
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                      <div className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-2">Strengths</div>
                      <p className="text-emerald-900 font-medium leading-relaxed">{viewingFeedback.teacherFeedback.strengths}</p>
                    </div>
                  )}
                  {viewingFeedback.teacherFeedback.weaknesses && (
                    <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
                      <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-2">Areas for Growth</div>
                      <p className="text-amber-900 font-medium leading-relaxed">{viewingFeedback.teacherFeedback.weaknesses}</p>
                    </div>
                  )}
                  {viewingFeedback.teacherFeedback.rewriteTask && (
                    <div className="bg-white border border-primary/20 p-5 rounded-2xl shadow-sm">
                      <div className="text-xs font-black text-primary uppercase tracking-wider mb-2">Rewrite Task</div>
                      <p className="text-slate-800 font-bold leading-relaxed">{viewingFeedback.teacherFeedback.rewriteTask}</p>
                      <button 
                        onClick={() => router.push('/new-essay/step-1')}
                        className="mt-4 w-full bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
                      >
                        Start Rewrite <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
