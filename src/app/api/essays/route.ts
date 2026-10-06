import { NextResponse } from 'next/server';

const GIST_ID = process.env.GIST_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function getGist() {
  if (!GIST_ID || !GITHUB_TOKEN) return { files: { 'essays.json': { content: '[]' } } };
  
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch gist');
  return res.json();
}

async function updateGist(content: string) {
  if (!GIST_ID || !GITHUB_TOKEN) return;
  
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        'essays.json': { content }
      }
    })
  });
  if (!res.ok) throw new Error('Failed to update gist');
}

export async function GET() {
  try {
    if (!GIST_ID || !GITHUB_TOKEN) {
      return NextResponse.json([]); // return empty if not configured
    }
    const gist = await getGist();
    const content = gist.files['essays.json']?.content || '[]';
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, essay, essayId, feedback } = await request.json();
    
    const gist = await getGist();
    let essays = JSON.parse(gist.files['essays.json']?.content || '[]');

    if (action === 'add') {
      essays = [essay, ...essays];
    } else if (action === 'update_feedback') {
      essays = essays.map((e: any) => e.id === essayId ? { ...e, teacherFeedback: feedback } : e);
    } else if (action === 'delete') {
      essays = essays.filter((e: any) => e.id !== essayId);
    }

    await updateGist(JSON.stringify(essays));
    
    return NextResponse.json({ success: true, essays });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
