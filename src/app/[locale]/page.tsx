"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { User, Shield, GraduationCap, Lock, ArrowRight, BookOpen } from 'lucide-react';
import clsx from 'clsx';

export default function HomePage() {
  const t = useTranslations('Login');
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

  // Student Form
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [level, setLevel] = useState('Intermediate B1');
  const [studentError, setStudentError] = useState(false);

  // Teacher Form
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const storedName = localStorage.getItem('ielts_user_name');
    const isAdmin = localStorage.getItem('ielts_admin');
    if (isAdmin === 'true') {
      router.push('/admin');
    } else if (storedName) {
      router.push('/new-essay/step-1');
    }
  }, [router]);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !group.trim()) {
      setStudentError(true);
      return;
    }
    
    localStorage.setItem('ielts_user_name', name.trim());
    localStorage.setItem('ielts_user_role', 'Студент / Student');
    localStorage.setItem('ielts_user_group', group.trim());
    localStorage.setItem('ielts_user_level', level);
    
    window.dispatchEvent(new Event('ielts_login'));
    router.push('/new-essay/step-1');
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '7890') {
      localStorage.setItem('ielts_admin', 'true');
      window.dispatchEvent(new Event('ielts_login'));
      router.push('/admin');
    } else {
      setPinError(true);
    }
  };

  const levels = [
    'Beginner A1-A2',
    'Intermediate B1',
    'Upper-Intermediate B2',
    'Advanced C1'
  ];

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 overflow-y-auto px-4 py-8">
      <div className="w-full max-w-6xl p-6 flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left Branding Panel */}
        <div className="lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary font-bold text-sm shadow-sm">
            <BookOpen className="w-4 h-4" />
            {t('badge')}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="logo-squircle scale-[1.5] origin-left shadow-2xl">
              <span className="logo-text">ielts</span>
              <div className="logo-underline" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight flex flex-col">
              IELTS <span className="text-primary font-black">Writing</span>
            </h1>
          </div>
          
          <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed mb-12">
            {t('description')}
          </p>
          
          <div className="glass-panel p-6 bg-white w-full max-w-md hidden lg:block border-slate-200 rounded-3xl shadow-sm">
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">{t('author')}</p>
            <p className="text-slate-900 font-black text-xl mb-1">{t('authorName')}</p>
            <p className="text-sm text-slate-500 font-medium">{t('authorTitle')}</p>
          </div>
        </div>

        {/* Right Login Panel */}
        <div className="lg:w-1/2 flex items-center justify-center w-full">
          <div className="glass-panel w-full max-w-md p-8 shadow-2xl bg-white relative overflow-hidden rounded-3xl border border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">{t('title')}</h2>
            
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200">
              <button 
                type="button"
                onClick={() => setActiveTab('student')}
                className={clsx(
                  "flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                  activeTab === 'student' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <GraduationCap className="w-5 h-5" />
                {t('studentBtn')}
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('teacher')}
                className={clsx(
                  "flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                  activeTab === 'teacher' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Shield className="w-5 h-5" />
                {t('teacherBtn')}
              </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {activeTab === 'student' ? (
                <form onSubmit={handleStudentLogin} className="space-y-5">
                  {studentError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold text-center mb-4">
                      {t('fillRequiredFields', { defaultMessage: 'Пожалуйста, заполните все поля' })}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('fullName')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        placeholder={t('namePlaceholder', { defaultMessage: 'Аты-жөніңізді енгізіңіз...' })}
                        value={name}
                        onChange={e => { setName(e.target.value); setStudentError(false); }}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('group')}</label>
                    <input 
                      type="text" 
                      required
                      placeholder={t('groupPlaceholder', { defaultMessage: 'Сыныпты көрсетіңіз...' })}
                      value={group}
                      onChange={e => { setGroup(e.target.value); setStudentError(false); }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('level')}</label>
                    <select 
                      value={level}
                      onChange={e => setLevel(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                    >
                      {levels.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 mt-8">
                    {t('enter')} <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleTeacherLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('pin')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••"
                        maxLength={4}
                        value={pin}
                        onChange={e => {
                          setPin(e.target.value);
                          setPinError(false);
                        }}
                        className={clsx(
                          "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-center text-2xl tracking-[0.5em] font-black outline-none focus:ring-2 transition-all",
                          pinError ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 text-red-600" : "border-slate-200 focus:border-primary focus:ring-primary/20 text-slate-900"
                        )}
                      />
                    </div>
                    {pinError && <p className="text-red-500 text-sm font-bold mt-2 text-center">{t('pinError')}</p>}
                  </div>
                  <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg mt-8">
                    {t('enter')} <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
