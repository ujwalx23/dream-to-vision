import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dream } = await req.json();
    
    if (!dream) {
      return new Response(
        JSON.stringify({ error: 'Dream text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating roadmap for dream:', dream);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a dream visualization expert. Given a user's dream or life goal, break it down into a realistic, actionable roadmap with specific milestones and steps. 

Format your response as a JSON object with this structure:
{
  "title": "Brief inspiring title for the journey",
  "description": "One sentence overview",
  "totalTimeEstimate": "Overall time needed (e.g., '2 years', '6 months')",
  "milestones": [
    {
      "title": "Milestone name",
      "description": "What this milestone achieves",
      "timeEstimate": "Time to complete this milestone",
      "steps": [
        "Specific action 1",
        "Specific action 2",
        "Specific action 3"
      ],
      "imagePrompt": "Descriptive prompt for generating an inspiring image representing this milestone"
    }
  ]
}

Create 3-5 milestones. Be specific and actionable. Make it inspiring but realistic.`
          },
          {
            role: 'user',
            content: dream
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const roadmap = JSON.parse(data.choices[0].message.content);

    console.log('Generated roadmap:', roadmap);

    return new Response(
      JSON.stringify(roadmap),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating roadmap:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate roadmap';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
