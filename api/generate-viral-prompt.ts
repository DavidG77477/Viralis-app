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

  const systemPrompt = {
    role: "AI Video Trend Analyst & Viral Prompt Generator",
    objective: "Analyze current AI video trends on social media and generate optimized prompts with maximum viral potential",
    instructions: {
      step_1: {
        name: "Research Current Trends",
        tasks: [
          "Identify trending AI video styles on TikTok, Instagram Reels, and YouTube Shorts",
          "Analyze viral visual styles (transitions, 3D effects, morphing, artistic styles)",
          "Identify viral narrative formats (before/after, storytelling, transformations, challenges)",
          "Find engaging themes (nostalgia, emotions, humor, surprising revelations)",
          "Identify hooks that stop scrolling in first 3 seconds",
          "Determine optimal video duration",
          "Find trending music/sounds"
        ],
        data_recency: "Less than 2 weeks old"
      },
      step_2: {
        name: "Evaluate Viral Potential",
        criteria: [
          "Average engagement rate",
          "Ease of reproduction",
          "Originality vs market saturation",
          "Emotional potential (surprise, wonder, laughter, nostalgia)",
          "Shareability factor"
        ]
      },
      step_3: {
        name: "Generate Video Prompt",
        required_elements: [
          "concept",
          "hook_0_3_seconds",
          "visual_style",
          "narrative_structure",
          "transitions_effects",
          "call_to_action",
          "technical_prompt_for_ai_tool",
          "recommendations"
        ]
      }
    },
    output_format: {
      trend_identified: "string",
      viral_score: "number (1-10)",
      why_it_works: "string",
      video_prompt: {
        concept: "string",
        hook: "string (0-3 seconds description)",
        development: "string",
        visual_style: {
          colors: "string",
          lighting: "string",
          effects: "array of strings",
          artistic_style: "string"
        },
        technical_ai_prompt: "string (detailed prompt for Runway/Pika/Sora)",
        call_to_action: "string"
      },
      additional_tips: {
        ideal_duration_seconds: "number",
        music_type: "string",
        hashtags: "array of strings",
        best_posting_time: "string"
      }
    },
    critical_rules: [
      "Use only real and recent data (less than 2 weeks)",
      "Prioritize rising trends, not saturated ones",
      "Be specific and actionable, not vague",
      "Think 'scroll-stopper': what will make someone stop in 1 second?",
      "Focus on maximum viral potential"
    ]
  };

  const languageInstructions: Record<'fr' | 'en' | 'es', string> = {
    fr: 'Analyse les tendances actuelles de vidéos IA sur les réseaux sociaux et génère un prompt optimisé avec un potentiel viral maximum. Réponds en JSON avec le format spécifié, en français.',
    en: 'Analyze current AI video trends on social media and generate an optimized prompt with maximum viral potential. Respond in JSON with the specified format, in English.',
    es: 'Analiza las tendencias actuales de videos IA en redes sociales y genera un prompt optimizado con máximo potencial viral. Responde en JSON con el formato especificado, en español.',
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
            content: JSON.stringify(systemPrompt, null, 2) + '\n\nIMPORTANT: Respond ONLY with valid JSON matching the output_format structure. Do not include any text before or after the JSON. The JSON must be parseable and complete.',
          },
          {
            role: 'user',
            content: languageInstructions[language as 'fr' | 'en' | 'es'] + '\n\nRemember: Return ONLY valid JSON, no additional text or explanations.',
          },
        ],
        temperature: 0.9,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Failed to generate viral prompt. Please check your OpenAI API key.' 
      });
    }

    const data = await response.json();
    let responseContent = data.choices[0].message.content.trim();
    
    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = typeof responseContent === 'string' ? JSON.parse(responseContent) : responseContent;
    } catch (e) {
      // If not JSON, extract technical_ai_prompt if possible, otherwise use the whole response
      console.warn('Failed to parse JSON response, extracting text directly');
      parsedResponse = { video_prompt: { technical_ai_prompt: responseContent } };
    }
    
    // Extract the technical AI prompt for the video generation
    const technicalPrompt = parsedResponse?.video_prompt?.technical_ai_prompt || 
                           parsedResponse?.technical_ai_prompt ||
                           parsedResponse?.video_prompt ||
                           responseContent;
    
    // Return both the technical prompt (for the input field) and full analysis (for potential future use)
    return res.status(200).json({ 
      prompt: typeof technicalPrompt === 'string' ? technicalPrompt : JSON.stringify(technicalPrompt),
      analysis: parsedResponse // Return full analysis for potential future features
    });
  } catch (error: any) {
    console.error('Error generating viral prompt:', error);
    return res.status(500).json({ 
      error: error.message || 'An error occurred while generating the viral prompt.' 
    });
  }
}

