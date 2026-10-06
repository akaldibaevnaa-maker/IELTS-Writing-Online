import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock' });

export async function POST(request: Request) {
  try {
    const { task, essay, locale } = await request.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock') {
      // DYNAMIC MOCK ANALYZER (Rule-based)
      // Generates distinct results based on the actual essay content.
      
      const wordCount = essay.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
      
      // Calculate TR based on word count
      let trScore = 6.0;
      if (wordCount >= 250) trScore += 1.0;
      if (wordCount > 300) trScore += 0.5;
      if (wordCount < 150) trScore -= 2.0;
      if (wordCount >= 150 && wordCount < 250) trScore -= 1.0;

      // Calculate CC based on linking words
      const linkingWords = ['firstly', 'secondly', 'moreover', 'furthermore', 'in addition', 'however', 'on the other hand', 'in conclusion', 'to sum up', 'therefore', 'consequently'];
      const essayLower = essay.toLowerCase();
      let linkingCount = 0;
      linkingWords.forEach(word => { if (essayLower.includes(word)) linkingCount++; });
      
      let ccScore = 5.5;
      if (linkingCount >= 3) ccScore += 1.0;
      if (linkingCount >= 6) ccScore += 0.5;
      if (essay.split('\n\n').length >= 4) ccScore += 0.5; // Good paragraphing

      // Calculate LR based on average word length and unique words
      const words = essayLower.match(/\b\w+\b/g) || [];
      const uniqueWords = new Set(words).size;
      const avgWordLength = words.length ? words.reduce((acc: number, w: string) => acc + w.length, 0) / words.length : 0;
      
      let lrScore = 5.5;
      if (uniqueWords > 100) lrScore += 1.0;
      if (uniqueWords > 150) lrScore += 0.5;
      if (avgWordLength > 5) lrScore += 0.5;
      if (avgWordLength > 6) lrScore += 0.5;

      // Calculate GRA based on sentence length and commas (complex sentences proxy)
      const sentences = essay.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
      const avgSentenceLength = sentences.length ? wordCount / sentences.length : 0;
      const commaCount = (essay.match(/,/g) || []).length;
      
      let graScore = 5.5;
      if (avgSentenceLength > 12) graScore += 0.5;
      if (avgSentenceLength > 15) graScore += 0.5;
      if (commaCount >= sentences.length) graScore += 0.5; // proxy for complex sentences

      // Cap scores at 9.0 and floor at 1.0, round to nearest 0.5
      const cap = (score: number) => Math.min(9.0, Math.max(1.0, Math.round(score * 2) / 2));
      trScore = cap(trScore);
      ccScore = cap(ccScore);
      lrScore = cap(lrScore);
      graScore = cap(graScore);
      
      const overall = cap((trScore + ccScore + lrScore + graScore) / 4);

      // Generate dynamic feedback
      const feedback = [];
      const plans = [];
      const drills = [];

      // Add TR feedback
      if (wordCount < 250) {
        feedback.push({
          id: 'fb_tr_1', category: 'TR',
          original_text: essay.substring(0, Math.min(30, essay.length)) + '...',
          corrected_text: 'Add more arguments to reach 250 words.',
          explanation: locale === 'ru' ? 'Ваше эссе слишком короткое.' : (locale === 'kk' ? 'Эссе тым қысқа.' : 'Your essay is under the 250-word limit.'),
          pattern: 'word_count'
        });
        plans.push({ focus: 'Task Response', issue: 'Under length', action: 'Write at least 250 words.' });
      } else {
        plans.push({ focus: 'Task Response', issue: 'Good length', action: 'Ensure all parts of the prompt are fully covered.' });
      }

      // Find a sentence for grammar feedback
      const sampleSentence = sentences.length > 2 ? sentences[2].trim() : (sentences[0] ? sentences[0].trim() : 'Sample text');
      if (sampleSentence && sampleSentence.length > 10) {
        feedback.push({
          id: 'fb_gra_1', category: 'GRA',
          original_text: sampleSentence,
          corrected_text: sampleSentence + ' (Corrected version)',
          explanation: locale === 'ru' ? 'Обратите внимание на структуру этого предложения.' : (locale === 'kk' ? 'Осы сөйлемнің құрылымына назар аударыңыз.' : 'Check the grammatical structure of this sentence.'),
          pattern: 'grammar_check'
        });
        drills.push({ type: 'grammar', prompt: 'Improve this sentence:', target: sampleSentence, hint: 'Make it more complex.' });
      }

      // Add CC feedback
      if (linkingCount < 3) {
        plans.push({ focus: 'Coherence', issue: 'Lack of cohesive devices', action: 'Use more linking words (e.g., however, furthermore).' });
      } else {
        plans.push({ focus: 'Coherence', issue: 'Good flow', action: 'Try to use less common linking phrases for a higher score.' });
      }

      return NextResponse.json({
        band_scores: { overall, task_response: trScore, coherence_cohesion: ccScore, lexical_resource: lrScore, grammatical_accuracy: graScore },
        detected_task_type: 'IELTS Writing Task 2',
        word_count: wordCount,
        detailed_feedback: feedback,
        three_step_improvement_plan: plans,
        generated_drills: drills
      });
    }

    // AI API Logc (if key exists)
    const systemInstruction = `You are a senior certified IELTS Examiner and master writing coach. Analyze the candidate's IELTS Writing Task 2 essay strictly according to the public IELTS Band Descriptors across TR, CC, LR, and GRA. Deliver all instructional explanations, error diagnoses, and remediation plans in the user's selected language: ${locale}. Do not rewrite the whole essay. Focus on diagnostic feedback and personalized practice drill generation.`;
    
    // ... rest of AI logic omitted for brevity, but I must keep it intact
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Task: ${task}\n\nEssay:\n${essay}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
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
                  category: { type: Type.STRING },
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
                properties: { focus: { type: Type.STRING }, issue: { type: Type.STRING }, action: { type: Type.STRING } },
                required: ['focus', 'issue', 'action']
              }
            },
            generated_drills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { type: { type: Type.STRING }, prompt: { type: Type.STRING }, target: { type: Type.STRING }, hint: { type: Type.STRING } },
                required: ['type', 'prompt', 'target', 'hint']
              }
            }
          },
          required: ['band_scores', 'detected_task_type', 'word_count', 'detailed_feedback', 'three_step_improvement_plan', 'generated_drills']
        },
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
