"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import StepProgress from '@/components/layout/StepProgress';
import { Sparkles, FileText, Upload, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
// @ts-ignore
import mammoth from 'mammoth/mammoth.browser';

export default function Step2Page() {
  const t = useTranslations();
  const router = useRouter();
  const [essayText, setEssayText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [taskContext, setTaskContext] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const task = localStorage.getItem('ielts_task');
    if (task) setTaskContext(task);
    
    const savedEssay = localStorage.getItem('ielts_essay');
    if (savedEssay) {
      setEssayText(savedEssay);
      updateWordCount(savedEssay);
    }
  }, []);

  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEssayText(text);
    updateWordCount(text);
    localStorage.setItem('ielts_essay', text);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.txt')) {
        const text = await file.text();
        setEssayText(text);
        updateWordCount(text);
        localStorage.setItem('ielts_essay', text);
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (result.value) {
          setEssayText(result.value);
          updateWordCount(result.value);
          localStorage.setItem('ielts_essay', result.value);
        } else {
          setErrorMsg('Could not extract text from this document.');
        }
      } else {
        setErrorMsg('Please upload a .txt or .docx file.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error parsing file. It might be corrupted.');
    }
    
    // Clear the input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      localStorage.setItem('ielts_essay', essayText);
      setTimeout(() => {
        router.push('/essay/demo-id/analysis');
      }, 1500);
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  const isWordCountSufficient = wordCount >= 250;
  const isAnalyzeReady = wordCount >= 50;

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <StepProgress currentStep={2} />
      
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{t('Step2.title')}</h2>
              <p className="text-slate-500 font-medium">{t('Step2.pasteOrUpload')}</p>
            </div>
            
            <input 
              type="file" 
              accept=".docx,.txt" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="glass-button flex items-center gap-2 text-sm text-primary hover:bg-primary/5 px-5 py-2.5 rounded-xl font-bold border-primary/20 bg-white"
            >
              <Upload className="w-5 h-5" />
              Upload .docx / .txt
            </button>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl flex items-center gap-3 font-bold shadow-sm">
              <AlertTriangle className="w-6 h-6" />
              {errorMsg}
            </div>
          )}

          <div className="glass-panel rounded-2xl p-2 focus-within:ring-4 focus-within:ring-primary/20 transition-all flex flex-col bg-white shadow-lg border-slate-200">
            <textarea 
              className="w-full min-h-[450px] p-6 bg-transparent resize-y outline-none text-slate-800 text-lg leading-relaxed font-medium placeholder:text-slate-300"
              placeholder="Write your essay here..."
              value={essayText}
              onChange={handleTextChange}
            />
            
            <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between rounded-b-xl">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-slate-500 uppercase tracking-wider">
                  <span>{wordCount}</span> <span>words</span>
                </span>
                
                {wordCount > 0 ? (
                  <div className={clsx(
                    "flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border",
                    isWordCountSufficient ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"
                  )}>
                    {isWordCountSufficient ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    
                    <span>
                      {isWordCountSufficient 
                        ? t('Step2.wordCountGood') 
                        : `Words: ${wordCount} / 250 (${t('Step2.wordCountWarning')})`}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button 
              onClick={() => router.push('/new-essay/step-1')}
              className="glass-button text-slate-600 hover:text-slate-900 bg-white px-6 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <button 
              onClick={handleAnalyze}
              disabled={!isAnalyzeReady || isAnalyzing}
              className="flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <span>{t('Common.analyze')}</span>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 hidden lg:block">
          <div className="glass-panel rounded-2xl p-8 bg-slate-50 sticky top-24 border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-primary font-extrabold mb-5 text-lg">
              <FileText className="w-6 h-6" />
              Your Task
            </div>
            {taskContext ? (
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-bold">
                "{taskContext}"
              </p>
            ) : (
              <p className="text-slate-400 text-sm italic font-medium">
                No task provided in Step 1.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
