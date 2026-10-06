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
    const fetchEssays = async () => {
      try {
        const res = await fetch('/api/essays');
        if (res.ok) {
          const data = await res.json();
          // If empty and we want to fallback to mock (for fresh installs)
          if (data.length === 0) {
            setEssays(MOCK_ESSAYS);
            // Optionally save mock to remote, but let's just use it locally
          } else {
            setEssays(data);
          }
        } else {
          setEssays(MOCK_ESSAYS);
        }
      } catch (err) {
        console.error(err);
        setEssays(MOCK_ESSAYS);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchEssays();
  }, []);

  const saveFeedback = async (essayId: string, feedback: TeacherFeedback) => {
    const updated = essays.map(e => e.id === essayId ? { ...e, teacherFeedback: feedback } : e);
    setEssays(updated);
    
    try {
      await fetch('/api/essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_feedback', essayId, feedback })
      });
    } catch (e) { console.error(e); }
  };

  const addEssay = async (essay: Omit<GlobalEssay, 'id'>) => {
    const newEssay = { ...essay, id: Date.now().toString() };
    const updated = [newEssay, ...essays];
    setEssays(updated);
    
    try {
      await fetch('/api/essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', essay: newEssay })
      });
    } catch (e) { console.error(e); }
    
    return newEssay;
  };

  const deleteEssay = async (essayId: string) => {
    const updated = essays.filter(e => e.id !== essayId);
    setEssays(updated);
    
    try {
      await fetch('/api/essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', essayId })
      });
    } catch (e) { console.error(e); }
  };

  return { essays, isLoaded, saveFeedback, addEssay, deleteEssay };
}
