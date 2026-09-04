const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

// Send the conversation to the backend AI assistant and get the reply text.
export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(`${API_BASE}/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'The assistant is unavailable right now.');
  }

  return json.reply as string;
}
