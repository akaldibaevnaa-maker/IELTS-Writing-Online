import { useState, useEffect } from 'react';

export interface InlineComment {
  id: string;
  originalText: string;
  comment: string;
}

export interface TeacherFeedback {
  tr: number;
  cc: number;
  lr: number;
  gra: number;
  overall: number;
  strengths: string;
  weaknesses: string;
  rewriteTask: string;
  inlineComments: InlineComment[];
  status: 'graded' | 'pending';
}

export interface GlobalEssay {
  id: string;
  studentName: string;
  group: string;
  level: string;
  taskTopic: string;
  type: string;
  version: 'V1' | 'V2';
  aiScore: {
    overall: number;
    tr: number;
    cc: number;
    lr: number;
    gra: number;
  };
  teacherFeedback: TeacherFeedback | null;
  submittedAt: string;
  text: string;
}

// Initial mock data if empty
const MOCK_ESSAYS: GlobalEssay[] = [
  {
    id: '1',
    studentName: 'Alikhan Zhumanov',
    group: '11 A',
    level: 'Upper-Intermediate',
    taskTopic: 'Technology in Education',
    type: 'Task 2',
    version: 'V1',
    aiScore: { overall: 7.0, tr: 7.0, cc: 6.5, lr: 7.0, gra: 7.5 },
    teacherFeedback: null,
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    text: "Technology has become an integral part of modern education..."
  },
  {
    id: '2',
    studentName: 'Aruzhan Serik',
    group: '10 B',
    level: 'Intermediate',
    taskTopic: 'Global Warming',
    type: 'Task 2',
    version: 'V2',
    aiScore: { overall: 6.5, tr: 6.5, cc: 6.0, lr: 6.5, gra: 6.5 },
    teacherFeedback: {
      tr: 6.5, cc: 6.5, lr: 7.0, gra: 6.5, overall: 6.5,
      strengths: 'Good structure',
      weaknesses: 'Some vocabulary repetitions',
      rewriteTask: 'Focus on synonyms',
      inlineComments: [],
      status: 'graded'
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    text: "Global warming is a serious issue that affects our planet..."
  },
  {
    id: '3',
    studentName: 'Dias Nurlanov',
    group: 'University',
    level: 'Advanced',
    taskTopic: 'Public Transport',
    type: 'Task 2',
    version: 'V1',
    aiScore: { overall: 8.0, tr: 8.0, cc: 8.0, lr: 8.5, gra: 8.0 },
    teacherFeedback: null,
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    text: "Public transportation systems are crucial for sustainable urban development..."
  }
];

export function useGlobalEssays() {
  const [essays, setEssays] = useState<GlobalEssay[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ielts_global_essays');
    if (stored) {
      setEssays(JSON.parse(stored));
    } else {
      setEssays(MOCK_ESSAYS);
      localStorage.setItem('ielts_global_essays', JSON.stringify(MOCK_ESSAYS));
    }
    setIsLoaded(true);
  }, []);

  const saveFeedback = (essayId: string, feedback: TeacherFeedback) => {
    const updated = essays.map(e => e.id === essayId ? { ...e, teacherFeedback: feedback } : e);
    setEssays(updated);
    localStorage.setItem('ielts_global_essays', JSON.stringify(updated));
  };

  const addEssay = (essay: Omit<GlobalEssay, 'id'>) => {
    const newEssay = { ...essay, id: Date.now().toString() };
    const updated = [newEssay, ...essays];
    setEssays(updated);
    localStorage.setItem('ielts_global_essays', JSON.stringify(updated));
    return newEssay;
  };

  const deleteEssay = (essayId: string) => {
    const updated = essays.filter(e => e.id !== essayId);
    setEssays(updated);
    localStorage.setItem('ielts_global_essays', JSON.stringify(updated));
  };

  return { essays, isLoaded, saveFeedback, addEssay, deleteEssay };
}
