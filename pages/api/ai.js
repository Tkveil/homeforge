// HomeForge AI assistant — server-side only, key never exposed to client
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { task, context } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });

  const systemPrompt = `You are HomeForge AI, an expert real estate transaction assistant for agents, transaction coordinators (TCs), mortgage loan officers (MLOs), and brokers. You help with:
- Drafting professional emails, offer letters, counter offers, and disclosures
- Summarizing transaction timelines and flagging risks
- Writing client communication and follow-ups
- Explaining contract terms and deadlines in plain language
- Generating task checklists for specific transaction stages
- Providing compliance guidance for real estate professionals

Be concise, professional, and action-oriented. Always prioritize protecting the client and the agent's fiduciary duty. Never provide legal advice — refer to legal counsel when appropriate.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: context ? `Context: ${context}\n\nTask: ${task}` : task }],
      }),
    });

    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('') || 'Something went wrong.';
    res.status(200).json({ text });
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'Error connecting to AI.' });
  }
}
