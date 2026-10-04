"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

const tasks = [
  {
    id: 1,
    title: 'Kyz-Zhibek',
    type: 'Opinion Essay',
    image: '/images/extra-tasks/kyz-zhibek.jpg'
  },
  {
    id: 2,
    title: 'The Lost City',
    type: 'Problem and Solution Essay',
    image: '/images/extra-tasks/lost-city.jpg'
  },
  {
    id: 3,
    title: 'Journey to the Centre of the Earth',
    type: 'Problem and Solution Essay',
    image: '/images/extra-tasks/journey-earth.jpg'
  },
  {
    id: 4,
    title: 'The Mausoleum of Aisha Bibi',
    type: 'Discussion Essay',
    image: '/images/extra-tasks/aisha-bibi.jpg'
  },
  {
    id: 5,
    title: 'The Promised Land',
    type: 'For and Against Essay',
    image: '/images/extra-tasks/promised-land.jpg'
  },
  {
    id: 6,
    title: 'The War of the Worlds',
    type: 'For and Against Essay',
    image: '/images/extra-tasks/war-of-worlds.jpg'
  },
  {
    id: 7,
    title: 'The Worth of Wealth',
    type: 'For and Against Essay',
    image: '/images/extra-tasks/worth-of-wealth.jpg'
  },
  {
    id: 8,
    title: 'The Ruined House',
    type: 'For and Against Essay',
    image: '/images/extra-tasks/ruined-house.jpg'
  },
  {
    id: 9,
    title: 'The Last Leaf',
    type: 'A Story-Based Writing Task',
    image: '/images/extra-tasks/last-leaf.jpg'
  },
  {
    id: 10,
    title: 'To the Sea',
    type: 'Opinion Essay',
    image: '/images/extra-tasks/to-the-sea.jpg'
  },
  {
    id: 11,
    title: 'Thermal Energy Storage',
    type: 'For and Against Essay',
    image: '/images/extra-tasks/thermal-energy-storage.jpg'
  }
];

export default function ExtraTasksPage() {
  const t = useTranslations('ExtraTasks');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-in fade-in">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          {t('title', { defaultMessage: 'Extra Tasks' })}
        </h1>
        <p className="text-slate-500 font-medium text-lg">{t('subtitle', { defaultMessage: 'Additional reading and writing assignments.' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {tasks.map((task) => (
          <div key={task.id} className="glass-panel bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div 
              className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-slate-100"
              onClick={() => setSelectedImage(task.image)}
            >
              <Image 
                src={task.image} 
                alt={task.title} 
                fill 
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur text-slate-900 font-bold px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                  {t('viewTask', { defaultMessage: 'View Task' })}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">{task.title}</h3>
              <p className="text-primary font-bold text-sm uppercase tracking-wider">{task.type}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
          <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
              <h3 className="font-bold text-slate-800">{t('title', { defaultMessage: 'Extra Tasks' })}</h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative flex-1 bg-slate-100 overflow-y-auto p-4 flex justify-center">
              <Image 
                src={selectedImage} 
                alt="Task Full View" 
                width={1200}
                height={1600}
                className="object-contain w-full h-auto max-w-4xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
