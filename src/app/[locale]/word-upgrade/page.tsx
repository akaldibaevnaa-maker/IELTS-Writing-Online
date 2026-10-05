"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ZoomIn, ZoomOut, Maximize, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function WordUpgradePage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const images = [
    '/word-upgrade/page-01.png',
    '/word-upgrade/page-02.png',
    '/word-upgrade/page-03.png',
    '/word-upgrade/page-04.png',
    '/word-upgrade/page-05.png',
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
      setZoomLevel(1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
      setZoomLevel(1);
    }
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const closeViewer = () => {
    setSelectedImage(null);
    setZoomLevel(1);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-in fade-in">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 text-primary">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          WORD UPGRADE
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          Ағылшын тілін жетілдіруге арналған оқу материалдары
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((src, index) => (
          <div 
            key={src} 
            className="glass-panel p-2 rounded-2xl bg-white shadow-sm cursor-pointer hover:shadow-lg transition-all group overflow-hidden border border-slate-200"
            onClick={() => setSelectedImage(index)}
          >
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-50">
              <Image 
                src={src} 
                alt={`Material ${index + 1}`} 
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 shadow-lg text-primary">
                  <Maximize className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="p-4 text-center">
              <p className="font-bold text-slate-800">Материал {index + 1}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md" onClick={closeViewer}>
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button onClick={handleZoomIn} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md">
              <ZoomIn className="w-6 h-6" />
            </button>
            <button onClick={handleZoomOut} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md">
              <ZoomOut className="w-6 h-6" />
            </button>
            <button onClick={closeViewer} className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {selectedImage > 0 && (
              <button onClick={handlePrev} className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md shadow-lg hidden sm:block">
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {selectedImage < images.length - 1 && (
              <button onClick={handleNext} className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md shadow-lg hidden sm:block">
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md text-white font-bold px-6 py-2 rounded-full border border-white/10 flex items-center gap-4">
            <button onClick={handlePrev} className="sm:hidden p-2 bg-white/10 rounded-full" disabled={selectedImage === 0}><ChevronLeft className="w-5 h-5"/></button>
            {selectedImage + 1} / {images.length}
            <button onClick={handleNext} className="sm:hidden p-2 bg-white/10 rounded-full" disabled={selectedImage === images.length - 1}><ChevronRight className="w-5 h-5"/></button>
          </div>

          <div 
            className="w-[95vw] h-[85vh] sm:h-[90vh] flex items-center justify-center overflow-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="relative transition-transform duration-200 origin-center flex items-center justify-center bg-white shadow-2xl"
              style={{ 
                transform: `scale(${zoomLevel})`, 
                width: '100%', 
                maxWidth: '800px', 
                height: 'auto',
                aspectRatio: '1/1.414', // approximate A4 ratio
              }}
            >
              <Image 
                src={images[selectedImage]} 
                alt={`Page ${selectedImage + 1}`} 
                fill
                className="object-contain"
                quality={100}
                unoptimized // So quality stays perfect
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
