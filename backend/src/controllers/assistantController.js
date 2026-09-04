const Listing = require('../models/Listing');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

// Build a compact snapshot of current need from the database so the AI gives
// advice grounded in real data instead of generic answers.
async function buildNeedSnapshot() {
  try {
    const available = await Listing.find({ status: 'available' }).lean();

    const byForWhom = { people: 0, animals: 0, both: 0 };
    const byLocation = {};
    for (const l of available) {
      if (byForWhom[l.forWhom] !== undefined) byForWhom[l.forWhom] += 1;
      byLocation[l.location] = (byLocation[l.location] || 0) + 1;
    }

    const topLocations = Object.entries(byLocation)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([loc, n]) => `${loc} (${n})`);

    return [
      `Total available (unclaimed) listings: ${available.length}`,
      `For people: ${byForWhom.people}, for animals: ${byForWhom.animals}, for both: ${byForWhom.both}`,
      `Areas with most available food: ${topLocations.join(', ') || 'n/a'}`,
    ].join('\n');
  } catch {
    return 'Live listing data is currently unavailable.';
  }
}

const SYSTEM_PROMPT = `You are the FoodShare LK Donation Assistant, a friendly helper on a Sri Lankan
surplus-food donation platform. Your job is to help donors decide where their surplus food
can do the most good — which beneficiary group (people vs animals) and which area to prioritize.

Guidelines:
- Be concise (2-4 short sentences or a tight bullet list). This is a chat box, not an essay.
- Use the "Current need snapshot" data provided to give specific, grounded advice
  (e.g. point to categories or areas with fewer available donations relative to others).
- Recipient types on the platform: individuals, NGOs, orphanages, elders' homes, and animal shelters.
- Never invent contact details, names, or specific organizations. Suggest categories, not fake entities.
- If asked something unrelated to food donation, gently steer back.
- Be warm and encouraging — every donation helps reduce food waste and hunger.`;

// @desc    Chat with the AI donation assistant
// @route   POST /api/v1/assistant
// @access  Public
// Body: { messages: [{ role: 'user'|'assistant', text: string }, ...] }
const chatWithAssistant = async (req, res, next) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: 'AI assistant is not configured. Set GEMINI_API_KEY in the server .env.',
      });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a non-empty messages array.',
      });
    }

    // Guard against oversized requests
    const trimmed = messages.slice(-12);

    const snapshot = await buildNeedSnapshot();

    // Map our messages to Gemini's format (roles: 'user' | 'model')
    const contents = trimmed.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.text || '').slice(0, 2000) }],
    }));

    const body = {
      systemInstruction: {
        parts: [{ text: `${SYSTEM_PROMPT}\n\nCurrent need snapshot:\n${snapshot}` }],
      },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    // Gemini occasionally returns 503/429/500 under load. Retry a few times
    // with backoff so transient spikes are invisible to the user.
    const RETRYABLE = new Set([429, 500, 503]);
    const MAX_ATTEMPTS = 4;
    let gRes;
    let lastErrText = '';

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      gRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (gRes.ok) break;

      lastErrText = await gRes.text();
      if (!RETRYABLE.has(gRes.status) || attempt === MAX_ATTEMPTS) break;

      const waitMs = 400 * 2 ** (attempt - 1); // 400, 800, 1600 ms
      console.warn(`[Assistant] Gemini ${gRes.status}, retry ${attempt}/${MAX_ATTEMPTS - 1} in ${waitMs}ms`);
      await new Promise((r) => setTimeout(r, waitMs));
    }

    if (!gRes.ok) {
      console.error(`[Assistant] Gemini error ${gRes.status}: ${lastErrText}`);
      return res.status(502).json({
        success: false,
        message: 'The AI assistant is busy right now. Please try again in a moment.',
      });
    }

    const data = await gRes.json();
    const reply =
      (data?.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text)
        .filter(Boolean)
        .join('')
        .trim() ||
      "Sorry, I couldn't come up with a suggestion just now.";

    return res.status(200).json({ success: true, reply });
  } catch (err) {
    return next(err);
  }
};

module.exports = { chatWithAssistant };
