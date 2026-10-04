"use client";

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ShieldAlert, Download, Search, User, FileText, TrendingUp, Users, Trash2, X, Save, Edit3, ArrowRight, Settings } from 'lucide-react';
import clsx from 'clsx';
import { useGlobalEssays, GlobalEssay, TeacherFeedback } from '@/hooks/useGlobalEssays';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Suspense } from 'react';

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  const t = useTranslations('Admin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState('All');
  
  const { essays, isLoaded, saveFeedback, deleteEssay } = useGlobalEssays();
  const [gradingEssay, setGradingEssay] = useState<GlobalEssay | null>(null);
  const [viewStudent, setViewStudent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Temporary state for the grading canvas
  const [feedback, setFeedback] = useState<TeacherFeedback>({
    tr: 0, cc: 0, lr: 0, gra: 0, overall: 0,
    strengths: '', weaknesses: '', rewriteTask: '',
    inlineComments: [], status: 'pending'
  });
  const [selectedText, setSelectedText] = useState('');
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('ielts_admin');
    if (isAdmin !== 'true') {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Hooks must be called before early returns
  const [classFilter, setClassFilter] = useState('All');

  if (!isAuthenticated || !isLoaded) return null;

  const uniqueClasses = ['All', ...Array.from(new Set(essays.map(e => e.group)))];

  const filteredEssays = essays.filter(e => {
    const matchSearch = e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        e.group.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    
    if (classFilter !== 'All' && e.group !== classFilter) return false;
    
    if (filter === 'All') return true;
    if (filter === 'Pending') return !e.teacherFeedback || e.teacherFeedback.status === 'pending';
    if (filter === 'Graded') return e.teacherFeedback?.status === 'graded';
    return true;
  });

  const handleOpenCanvas = (essay: GlobalEssay) => {
    setGradingEssay(essay);
    if (essay.teacherFeedback) {
      setFeedback(essay.teacherFeedback);
    } else {
      setFeedback({
        tr: essay.aiScore.tr, cc: essay.aiScore.cc, lr: essay.aiScore.lr, gra: essay.aiScore.gra, overall: essay.aiScore.overall,
        strengths: '', weaknesses: '', rewriteTask: '', inlineComments: [], status: 'pending'
      });
    }
  };

  const handleSaveFeedback = () => {
    if (!gradingEssay) return;
    
    // Calculate overall based on sliders (average of 4 criteria, rounded to nearest 0.5)
    const avg = (feedback.tr + feedback.cc + feedback.lr + feedback.gra) / 4;
    const overall = Math.round(avg * 2) / 2;
    
    const finalFeedback: TeacherFeedback = {
      ...feedback,
      overall,
      status: 'graded'
    };
    saveFeedback(gradingEssay.id, finalFeedback);
    setGradingEssay(null);
    alert(t('feedbackSent'));
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  const addInlineComment = () => {
    if (!selectedText || !commentInput) return;
    setFeedback(prev => ({
      ...prev,
      inlineComments: [...prev.inlineComments, {
        id: Date.now().toString(),
        originalText: selectedText,
        comment: commentInput
      }]
    }));
    setSelectedText('');
    setCommentInput('');
  };

  const renderEssayWithHighlights = () => {
    if (!gradingEssay) return null;
    let result = gradingEssay.text;
    feedback.inlineComments.forEach(c => {
      result = result.replace(
        c.originalText,
        `<span class="bg-amber-200/50 border-b-2 border-amber-500 cursor-help" title="${c.comment}">${c.originalText}</span>`
      );
    });
    return (
      <div 
        className="whitespace-pre-wrap leading-loose text-lg text-slate-800" 
        dangerouslySetInnerHTML={{ __html: result }}
        onMouseUp={handleTextSelection}
      />
    );
  };

  if (gradingEssay) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col animate-in fade-in">
        {/* Canvas Header */}
        <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{gradingEssay.studentName} — {gradingEssay.taskTopic}</h2>
            <p className="text-sm text-slate-500 font-medium">{gradingEssay.group} • {gradingEssay.level}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setGradingEssay(null)} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
              {t('close')}
            </button>
            <button onClick={handleSaveFeedback} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20">
              <Save className="w-5 h-5" />
              {t('sendFeedback')}
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Essay Text */}
          <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto border-r border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                {t('essayText')}
              </h3>
              <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                {gradingEssay.text.split(' ').length} {t('words')}
              </span>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[400px]">
              {renderEssayWithHighlights()}
            </div>

            {selectedText && (
              <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl animate-in slide-in-from-bottom-4 shadow-sm">
                <div className="text-xs font-black text-amber-700 uppercase mb-2">Adding Comment to:</div>
                <div className="text-sm font-medium text-slate-800 bg-white p-3 rounded-lg border border-amber-100 mb-3">"{selectedText}"</div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Type your comment..."
                    className="flex-1 bg-white border border-amber-200 rounded-xl px-4 py-2 outline-none focus:border-amber-400 font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && addInlineComment()}
                  />
                  <button onClick={addInlineComment} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl font-bold transition-colors">
                    Add
                  </button>
                  <button onClick={() => setSelectedText('')} className="bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            {!selectedText && (
              <p className="mt-4 text-sm text-slate-400 font-medium text-center">{t('highlightToComment')}</p>
            )}
          </div>

          {/* Right: Feedback Form */}
          <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto bg-slate-50">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
              <Edit3 className="w-5 h-5 text-primary" />
              {t('teacherFeedback')}
            </h3>

            {/* Scores */}
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-6">
                <div className="font-bold text-slate-700">Scores</div>
                <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  {t('aiScores')}: {gradingEssay.aiScore.overall}
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { key: 'tr', label: 'Task Response' },
                  { key: 'cc', label: 'Coherence & Cohesion' },
                  { key: 'lr', label: 'Lexical Resource' },
                  { key: 'gra', label: 'Grammar & Accuracy' }
                ].map(crit => (
                  <div key={crit.key}>
                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                      <span>{crit.label}</span>
                      <span className="text-slate-900">{feedback[crit.key as keyof TeacherFeedback] as number}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1.0" max="9.0" step="0.5" 
                      value={feedback[crit.key as keyof typeof feedback] as number}
                      onChange={(e) => setFeedback(prev => ({ ...prev, [crit.key]: parseFloat(e.target.value) }))}
                      className="w-full accent-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Textual Feedback */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-emerald-600 mb-2">{t('strengths')}</label>
                <textarea 
                  value={feedback.strengths}
                  onChange={e => setFeedback(prev => ({ ...prev, strengths: e.target.value }))}
                  className="w-full bg-white border border-emerald-200 rounded-xl p-4 outline-none focus:border-emerald-400 font-medium resize-none h-24 shadow-sm"
                  placeholder="What did the student do well?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-600 mb-2">{t('weaknesses')}</label>
                <textarea 
                  value={feedback.weaknesses}
                  onChange={e => setFeedback(prev => ({ ...prev, weaknesses: e.target.value }))}
                  className="w-full bg-white border border-amber-200 rounded-xl p-4 outline-none focus:border-amber-400 font-medium resize-none h-24 shadow-sm"
                  placeholder="What needs improvement?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">{t('rewriteTask')}</label>
                <textarea 
                  value={feedback.rewriteTask}
                  onChange={e => setFeedback(prev => ({ ...prev, rewriteTask: e.target.value }))}
                  className="w-full bg-white border border-primary/20 rounded-xl p-4 outline-none focus:border-primary/50 font-medium resize-none h-24 shadow-sm"
                  placeholder="Actionable advice for the next version..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Student Dynamic Card Modal ---
  if (viewStudent) {
    const studentEssays = essays.filter(e => e.studentName === viewStudent).sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    
    // Prepare chart data
    const chartData = studentEssays.map((e, i) => {
      const overall = e.teacherFeedback ? e.teacherFeedback.overall : e.aiScore.overall;
      return {
        name: `Essay ${i + 1}`,
        score: overall,
        date: new Date(e.submittedAt).toLocaleDateString()
      };
    });

    const currentScore = chartData[chartData.length - 1]?.score || 0;
    const previousScore = chartData.length > 1 ? chartData[chartData.length - 2].score : currentScore;
    const diff = currentScore - previousScore;
    
    return (
      <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-6 animate-in fade-in backdrop-blur-sm">
        <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-full">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              {viewStudent}'s Progress
            </h2>
            <button onClick={() => setViewStudent(null)} className="text-slate-400 hover:text-slate-900 transition-colors bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8 overflow-y-auto bg-white flex-1">
            <div className="flex items-center gap-6 mb-8">
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Current Band</div>
                <div className="text-4xl font-black text-slate-900">{currentScore}</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Recent Trend</div>
                <div className="text-4xl font-black flex items-center gap-2">
                  {diff > 0 ? <span className="text-emerald-500">+{diff} ↗</span> :
                   diff < 0 ? <span className="text-red-500">{diff} ↘</span> :
                   <span className="text-slate-400">=</span>}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Score Dynamics</h3>
            <div className="w-full h-[300px] bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} fontWeight="bold" />
                  <YAxis domain={[0, 9]} stroke="#94A3B8" fontSize={12} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#C8102E" strokeWidth={3} dot={{ r: 6, fill: '#C8102E', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Submission History</h3>
            <div className="space-y-3">
              {studentEssays.slice().reverse().map(e => (
                <div key={e.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{e.taskTopic}</div>
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                      <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-600">{e.version}</span>
                      {new Date(e.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xl font-black text-primary">
                    {e.teacherFeedback ? e.teacherFeedback.overall : e.aiScore.overall}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Table View ---

  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // UTF-8 BOM
    csvContent += "Student Name,Group,Level,Task Topic,Version,AI Score,Teacher Score,Status,Submitted Date\n";
    
    essays.forEach(e => {
      const teacherScore = e.teacherFeedback ? e.teacherFeedback.overall : 'Pending';
      const status = e.teacherFeedback?.status === 'graded' ? 'Graded' : 'Pending';
      const row = `"${e.studentName}","${e.group}","${e.level}","${e.taskTopic}","${e.version}",${e.aiScore.overall},"${teacherScore}","${status}","${new Date(e.submittedAt).toLocaleDateString()}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IELTS_Writing_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-primary" />
            {t('title')}
          </h1>
          <p className="text-slate-500 font-medium">{t('subtitle')}</p>
        </div>
        
        <button 
          onClick={handleExport}
          className="glass-button bg-primary/10 text-primary border-primary/20 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <Download className="w-5 h-5" />
          {t('export')}
        </button>
      </div>

      {tab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 bg-white border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">{new Set(essays.map(e => e.studentName)).size}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('totalStudents')}</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 bg-white border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">{essays.length}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('essaysAnalyzed')}</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 bg-white border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">
                {essays.length > 0 ? (essays.reduce((acc, curr) => acc + curr.aiScore.overall, 0) / essays.length).toFixed(1) : '0.0'}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('averageBand')}</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 bg-white border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">85%</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Оң динамика (Прогресс)</div>
            </div>
          </div>
        </div>
      )}

      {(tab === 'dashboard' || tab === 'essays' || tab === 'students') && (
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col bg-white border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
            <h2 className="text-xl font-extrabold text-slate-900">{t('liveLeaderboard')}</h2>
            
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            
            <select 
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-w-[140px]"
            >
              {uniqueClasses.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'Барлық сыныптар' : c}</option>
              ))}
            </select>
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl shrink-0">
              {[
                { id: 'All', label: t('filterAll') },
                { id: 'Pending', label: t('pending') },
                { id: 'Graded', label: t('graded') }
              ].map(f => (
                <button 
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    filter === f.id ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-5">{t('studentName')}</th>
                <th className="px-6 py-5">{t('topic')}</th>
                <th className="px-6 py-5">Динамика / Прогресс</th>
                <th className="px-6 py-5">{t('aiScores')}</th>
                <th className="px-6 py-5">{t('teacherFeedback')}</th>
                <th className="px-6 py-5">{t('date')}</th>
                <th className="px-6 py-5 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEssays.map(essay => (
                <tr key={essay.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div 
                      className="font-bold text-slate-900 flex items-center gap-3 cursor-pointer group-hover:text-primary transition-colors"
                      onClick={() => setViewStudent(essay.studentName)}
                      title="View Progress"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shrink-0 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                        <User className="w-5 h-5 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <div>{essay.studentName}</div>
                        <div className="text-xs text-slate-500">{essay.group} • {essay.level}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700 line-clamp-1">{essay.taskTopic}</div>
                    <div className="text-xs text-slate-500">{essay.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    {essay.version === 'V1' ? (
                      <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg border border-slate-200">
                        Бастапқы нұсқа (V1)
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200 flex items-center gap-1 w-max">
                        +0.5 Band ↗ (V2)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-black text-blue-600">{essay.aiScore.overall}</td>
                  <td className="px-6 py-4">
                    {essay.teacherFeedback ? (
                      <span className="text-lg font-black text-emerald-600">{essay.teacherFeedback.overall}</span>
                    ) : (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                        {t('pending')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {new Date(essay.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenCanvas(essay)}
                      className="text-sm text-primary font-bold hover:bg-primary hover:text-white transition-colors bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 whitespace-nowrap"
                    >
                      {t('checkAndEvaluate')}
                    </button>
                    <button 
                      onClick={() => deleteEssay(essay.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      title={t('delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEssays.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-medium">
                    No essays found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {tab === 'progress' && (
        <div className="glass-panel rounded-3xl p-8 bg-white border-slate-200 shadow-sm mt-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Мониторинг прогресса</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Jan', 'Aruzhan Serik': 6.0, 'Dias Nurlanov': 7.0 },
                { name: 'Feb', 'Aruzhan Serik': 6.5, 'Dias Nurlanov': 7.5 },
                { name: 'Mar', 'Aruzhan Serik': 6.5, 'Dias Nurlanov': 8.0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis domain={[5.0, 9.0]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dx={-10} />
                <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold'}} />
                <Line type="monotone" dataKey="Aruzhan Serik" stroke="#C8102E" strokeWidth={4} dot={{r: 6, fill: '#C8102E', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8}} />
                <Line type="monotone" dataKey="Dias Nurlanov" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="glass-panel rounded-3xl p-8 bg-white border-slate-200 shadow-sm mt-8 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Настройки платформы
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Шкала оценивания</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800">
                <option>Стандартная IELTS (1.0 - 9.0)</option>
                <option>Упрощенная (1 - 100%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Уведомления о новых эссе</label>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded" />
                <span className="text-slate-600 font-medium">Отправлять на Email</span>
              </div>
            </div>
            <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
              Сохранить настройки
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
      <AdminContent />
    </Suspense>
  );
}
