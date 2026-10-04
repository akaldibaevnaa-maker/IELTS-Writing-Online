"use client";

import { useTranslations } from 'next-intl';
import { User, Award, LogOut, Shield, Users, BookOpen, FileCheck, CheckCircle2, Key } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGlobalEssays } from '@/hooks/useGlobalEssays';

export default function AccountPage() {
  const t = useTranslations('Account');
  const { essays, isLoaded } = useGlobalEssays();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Student Name',
    role: 'Студент',
    group: '',
    level: 'Intermediate B1',
  });

  useEffect(() => {
    const adminFlag = localStorage.getItem('ielts_admin') === 'true';
    setIsAdmin(adminFlag);
    
    if (!adminFlag) {
      setUserProfile({
        name: localStorage.getItem('ielts_user_name') || 'Student Name',
        role: localStorage.getItem('ielts_user_role') || 'Студент',
        group: localStorage.getItem('ielts_user_group') || '',
        level: localStorage.getItem('ielts_user_level') || 'Intermediate B1',
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ielts_user_name');
    localStorage.removeItem('ielts_user_role');
    localStorage.removeItem('ielts_user_group');
    localStorage.removeItem('ielts_user_level');
    localStorage.removeItem('ielts_admin');
    window.location.reload();
  };

  const handlePinChange = () => {
    alert("Pin change functionality would go here.");
  };

  if (!isLoaded) return null;

  // Teacher Stats
  const totalGraded = essays.filter(e => e.teacherFeedback?.status === 'graded').length;
  const avgScore = totalGraded > 0 
    ? (essays.filter(e => e.teacherFeedback).reduce((acc, e) => acc + (e.teacherFeedback?.overall || 0), 0) / totalGraded).toFixed(1)
    : '0.0';

  if (isAdmin) {
    return (
      <div className="max-w-5xl mx-auto pb-24 animate-in fade-in">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Жеке кабинет / Профиль</h1>
          <p className="text-slate-500 font-medium text-lg">Параметрлерді басқару / Управление профилем</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 glass-panel rounded-3xl p-6 text-center relative overflow-hidden bg-white border-slate-200 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-hover rounded-full mx-auto mb-4 p-1 shadow-lg shadow-primary/20">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Жаналыкова Назерке Талгатовна</h2>
            <p className="text-primary text-sm font-bold mb-6 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Тексеруші / Эксперт-педагог
            </p>

            <button 
              onClick={handlePinChange}
              className="w-full mb-3 glass-button text-slate-700 bg-slate-50 hover:bg-slate-100 px-4 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm border border-slate-200"
            >
              <Key className="w-5 h-5" />
              Пин-кодты өзгерту (7890)
            </button>

            <button 
              onClick={handleLogout}
              className="w-full glass-button text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-200 px-4 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              Жүйеден шығу (Log out)
            </button>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="glass-panel p-8 rounded-3xl bg-white border-slate-200 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" /> Ақпарат / Информация
              </h3>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Лауазымы мен санаты</label>
                  <div className="glass-input bg-slate-50 px-5 py-4 rounded-xl flex items-center gap-3 border-slate-200">
                    <Award className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-800">Педагог-сарапшы, педагогика ғылымдарының магистрі</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Организация/Мектеп</label>
                  <div className="glass-input bg-slate-50 px-5 py-4 rounded-xl flex items-center gap-3 border-slate-200">
                    <BookOpen className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-800">Инновациялық білім беру кешені / IELTS Writing зертханасы</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-3xl bg-white border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">{totalGraded}</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Тексерілген эсселер</div>
              </div>
              <div className="glass-panel p-6 rounded-3xl bg-white border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">{avgScore}</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Сыныптың орташа балы</div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl bg-white border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <h4 className="font-bold text-slate-800">Жетекшілік ететін топтар</h4>
              </div>
              <p className="text-slate-500 font-medium">10 «А», 11 «Б», Студенттер тобы</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Profile
  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('title', { defaultMessage: 'Менің кабинетім' })}</h1>
        <p className="text-slate-500 font-medium text-lg">{t('subtitle', { defaultMessage: 'Профильді басқару' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 glass-panel rounded-3xl p-6 text-center relative overflow-hidden bg-white border-slate-200 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-hover rounded-full mx-auto mb-4 p-1 shadow-lg shadow-primary/20">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-slate-300" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{userProfile.name}</h2>
          <p className="text-primary text-sm font-bold mb-6 flex items-center justify-center gap-1">
            <Shield className="w-4 h-4" /> {userProfile.role.split('/')[0].trim()}
          </p>

          <button 
            onClick={handleLogout}
            className="w-full glass-button text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-200 px-4 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            {t('logout', { defaultMessage: 'Шығу / Выйти' })}
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-3xl bg-white border-slate-200 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-primary" /> Profile Details
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-500 uppercase tracking-wider font-bold">ФИО / Name</label>
                <div className="glass-input bg-slate-50 px-5 py-4 rounded-xl flex items-center gap-3 border-slate-200">
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="font-bold text-slate-800">{userProfile.name}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Сынып / Класс</label>
                <div className="glass-input bg-slate-50 px-5 py-4 rounded-xl flex items-center gap-3 border-slate-200">
                  <Users className="w-5 h-5 text-slate-400" />
                  <span className="font-bold text-slate-800">{userProfile.group || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl flex items-center gap-5 relative overflow-hidden bg-white border-slate-200 shadow-sm">
            <div className="absolute left-0 bottom-0 w-48 h-48 bg-emerald-50 blur-3xl rounded-full pointer-events-none" />
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-center relative z-10">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="relative z-10">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Деңгей / Уровень</div>
              <div className="text-2xl font-extrabold text-slate-900">{userProfile.level}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
