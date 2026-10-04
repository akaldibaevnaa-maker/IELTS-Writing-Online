import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock' });

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    band_scores: {
      type: Type.OBJECT,
      properties: {
        overall: { type: Type.NUMBER },
        task_response: { type: Type.NUMBER },
        coherence_cohesion: { type: Type.NUMBER },
        lexical_resource: { type: Type.NUMBER },
        grammatical_accuracy: { type: Type.NUMBER },
      },
      required: ['overall', 'task_response', 'coherence_cohesion', 'lexical_resource', 'grammatical_accuracy']
    },
    detected_task_type: { type: Type.STRING },
    word_count: { type: Type.INTEGER },
    detailed_feedback: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, description: 'One of TR, CC, LR, GRA' },
          original_text: { type: Type.STRING },
          corrected_text: { type: Type.STRING },
          explanation: { type: Type.STRING },
          pattern: { type: Type.STRING }
        },
        required: ['id', 'category', 'original_text', 'corrected_text', 'explanation', 'pattern']
      }
    },
    three_step_improvement_plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          focus: { type: Type.STRING },
          issue: { type: Type.STRING },
          action: { type: Type.STRING }
        },
        required: ['focus', 'issue', 'action']
      }
    },
    generated_drills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          prompt: { type: Type.STRING },
          target: { type: Type.STRING },
          hint: { type: Type.STRING }
        },
        required: ['type', 'prompt', 'target', 'hint']
      }
    }
  },
  required: ['band_scores', 'detected_task_type', 'word_count', 'detailed_feedback', 'three_step_improvement_plan', 'generated_drills']
};

export async function POST(request: Request) {
  try {
    const { task, essay, locale } = await request.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock') {
      // Return mock response for testing UI without API key
      return NextResponse.json({
        band_scores: { overall: 6.5, task_response: 6.5, coherence_cohesion: 6.0, lexical_resource: 6.5, grammatical_accuracy: 6.0 },
        detected_task_type: 'Discuss Both Views',
        word_count: 285,
        detailed_feedback: [
          {
            id: 'err_1',
            category: 'GRA',
            original_text: 'Many people believes',
            corrected_text: 'Many people believe',
            explanation: locale === 'ru' ? 'Подлежащее и сказуемое не согласуются.' : (locale === 'kk' ? 'Бастауыш пен баяндауыш келіспейді.' : 'Subject and verb do not agree.'),
            pattern: 'subject_verb_agreement'
          }
        ],
        three_step_improvement_plan: [
          { focus: 'Grammar', issue: 'Subject-verb agreement errors', action: 'Review present simple rules.' },
          { focus: 'Vocabulary', issue: 'Repetitive use of "good"', action: 'Use synonyms like "beneficial", "advantageous".' },
          { focus: 'Task Response', issue: 'Conclusion is too brief', action: 'Summarize main points clearly.' }
        ],
        generated_drills: [
          { type: 'grammar_correction', prompt: 'Fix the subject-verb agreement:', target: 'Many people believes', hint: 'Check if the subject is plural.' }
        ]
      });
    }

    const systemInstruction = `You are a senior certified IELTS Examiner and master writing coach. Analyze the candidate's IELTS Writing Task 2 essay strictly according to the public IELTS Band Descriptors across TR, CC, LR, and GRA. Deliver all instructional explanations, error diagnoses, and remediation plans in the user's selected language: ${locale}. Do not rewrite the whole essay. Focus on diagnostic feedback and personalized practice drill generation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Task: ${task}\n\nEssay:\n${essay}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: evaluationSchema,
        temperature: 0.2
      }
    });

    const data = JSON.parse(response.text || '{}');
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json({ error: 'Failed to analyze essay' }, { status: 500 });
  }
}
