// Vercel Node serverless function — lives outside src/ so it is NOT bundled
// into the client. Summarizes announcements via the Gemini REST API with a
// two-key fallback. API keys come only from env and never reach the client.

// Minimal request/response typings so this file needs no @vercel/node dep.
interface ApiRequest {
  method?: string
  body?: unknown
}
interface ApiResponse {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
}

type Mode = 'single' | 'digest'

const MAX_INPUT = 6000
const DEFAULT_MODEL = 'gemini-2.5-flash'
const TIMEOUT_MS = 8000

/** Model is overridable via env; defaults to a model with free-tier quota. */
function modelName(): string {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL
}

const INSTRUCTIONS: Record<Mode, string> = {
  single:
    'Summarize this company announcement in 2 concise sentences for an employee dashboard. Plain text only, no markdown, no preamble.',
  digest:
    'Summarize these company announcements into a brief daily digest of 3-4 bullet-like plain-text lines, most important first. No markdown symbols.',
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
}

/** Redact any key material that might surface in an error message before logging. */
function sanitize(err: unknown, keys: Array<string | undefined>): string {
  let message = err instanceof Error ? err.message : 'unknown error'
  for (const key of keys) {
    if (key) message = message.split(key).join('***')
  }
  return message
}

/** One Gemini call with an 8s abort budget. Throws on non-2xx / empty / timeout. */
async function callGemini(
  apiKey: string,
  instruction: string,
  text: string,
): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName()}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instruction }] },
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 200,
            // 2.5-flash is a thinking model; disable thinking so the token
            // budget goes to the answer and responses stay fast.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    )
    if (!res.ok) throw new Error(`gemini responded ${res.status}`)
    const data = (await res.json()) as GeminiResponse
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!summary) throw new Error('gemini returned no text')
    return summary
  } finally {
    clearTimeout(timer)
  }
}

export default async function handler(
  req: ApiRequest,
  res: ApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = (req.body ?? {}) as { text?: unknown; mode?: unknown }
  const text = typeof body.text === 'string' ? body.text.trim() : ''
  const mode: Mode = body.mode === 'digest' ? 'digest' : 'single'

  if (!text) {
    res.status(400).json({ error: 'Missing text' })
    return
  }
  if (text.length > MAX_INPUT) {
    res.status(413).json({ error: 'Text too long' })
    return
  }

  const instruction = INSTRUCTIONS[mode]
  const key1 = process.env.GEMINI_API_KEY
  const key2 = process.env.GEMINI_API_KEY_2
  const secrets = [key1, key2]

  // Primary key.
  if (key1) {
    try {
      const summary = await callGemini(key1, instruction, text)
      console.log('[summarize] served by key 1')
      res.status(200).json({ summary, keyUsed: 1 })
      return
    } catch (err) {
      console.warn('[summarize] key 1 failed:', sanitize(err, secrets))
    }
  } else {
    console.warn('[summarize] GEMINI_API_KEY is not set')
  }

  // Fallback key.
  if (key2) {
    try {
      const summary = await callGemini(key2, instruction, text)
      console.log('[summarize] served by key 2')
      res.status(200).json({ summary, keyUsed: 2 })
      return
    } catch (err) {
      console.error('[summarize] key 2 failed:', sanitize(err, secrets))
    }
  } else {
    console.warn('[summarize] GEMINI_API_KEY_2 is not set')
  }

  // Both keys exhausted — generic message only, no provider detail leaks out.
  res.status(502).json({ error: 'AI temporarily unavailable' })
}
