import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { language } = req.body;

  if (!language || !['fr', 'en', 'es'].includes(language)) {
    return res.status(400).json({ error: 'Invalid language. Must be fr, en, or es.' });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' });
  }

  const languageInstructions: Record<'fr' | 'en' | 'es', string> = {
    fr: 'Génère un prompt de vidéo virale en français. Le prompt doit être créatif, accrocheur et conçu pour devenir viral sur TikTok, Instagram Reels ou YouTube Shorts.',
    en: 'Generate a viral video prompt in English. The prompt should be creative, catchy, and designed to go viral on TikTok, Instagram Reels, or YouTube Shorts.',
    es: 'Genera un prompt de video viral en español. El prompt debe ser creativo, llamativo y diseñado para volverse viral en TikTok, Instagram Reels o YouTube Shorts.',
  };

  const systemPrompts: Record<'fr' | 'en' | 'es', string> = {
    fr: 'Tu es un expert en création de contenu viral. Tu génères des prompts créatifs et accrocheurs pour des vidéos courtes qui ont le potentiel de devenir virales sur les réseaux sociaux.',
    en: 'You are a viral content expert. You generate creative and catchy prompts for short videos that have the potential to go viral on social media.',
    es: 'Eres un experto en creación de contenido viral. Generas prompts creativos y llamativos para videos cortos que tienen el potencial de volverse virales en las redes sociales.',
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompts[language as 'fr' | 'en' | 'es'],
          },
          {
            role: 'user',
            content: languageInstructions[language as 'fr' | 'en' | 'es'] + ' The prompt should be detailed, visual, and inspire engaging video content. Return only the prompt, no additional text.',
          },
        ],
        temperature: 0.9,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Failed to generate viral prompt. Please check your OpenAI API key.' 
      });
    }

    const data = await response.json();
    const generatedPrompt = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');

    return res.status(200).json({ prompt: generatedPrompt });
  } catch (error: any) {
    console.error('Error generating viral prompt:', error);
    return res.status(500).json({ 
      error: error.message || 'An error occurred while generating the viral prompt.' 
    });
  }
}

