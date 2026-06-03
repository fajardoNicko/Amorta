import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { installments, salary, healthScore, commitPercent } = await req.json()

    const prompt = `You are a friendly Filipino financial advisor. Analyze this user's installment data and give a short, practical, and encouraging insight in 3-4 sentences. Be direct and specific. Use simple language. Mention specific numbers from their data.

User's financial data:
- Monthly Salary: ₱${salary.toLocaleString()}
- Total Monthly Obligations: ₱${installments.reduce((s: number, i: { monthly_payment: number }) => s + i.monthly_payment, 0).toLocaleString()}
- Salary Committed: ${commitPercent.toFixed(1)}%
- Health Score: ${healthScore}/100
- Active Installments: ${installments.length}
- Installments: ${installments.map((i: { name: string; monthly_payment: number; duration_months: number }) => `${i.name} (₱${i.monthly_payment}/mo, ${i.duration_months} months)`).join(', ')}

Give actionable advice. If their situation is bad, be honest but kind. If it's good, affirm them and suggest how to stay on track.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const insight = data.content?.[0]?.text ?? 'Unable to generate insight at this time.'

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to generate insight.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})