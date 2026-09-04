import { useState, useRef, useEffect } from 'react';
import { sendChat, type ChatMessage } from '../api/assistantApi';

const WELCOME: ChatMessage = {
  role: 'assistant',
  text: "Hi! I'm the FoodShare donation assistant. Tell me what surplus food you have (and where), and I'll suggest where it can do the most good — people or animals, and which area needs it most.",
};

const SUGGESTIONS = [
  'I have 20 bread loaves in Colombo — where should they go?',
  'Should I give to people or animals?',
  'Which areas need donations most right now?',
];

export default function DonationAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next = [...messages, { role: 'user' as const, text: trimmed }];
    setMessages(next);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const reply = await sendChat(next);
      setMessages([...next, { role: 'assistant', text: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        className="assistant-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close donation assistant' : 'Open donation assistant'}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="assistant-panel" role="dialog" aria-label="Donation assistant">
          <header className="assistant-head">
            <span className="assistant-title">🤝 Donation Assistant</span>
            <span className="assistant-sub">Powered by Google Gemini</span>
          </header>

          <div className="assistant-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`assistant-msg assistant-msg-${m.role}`}>
                {m.text}
              </div>
            ))}

            {loading && <div className="assistant-msg assistant-msg-assistant assistant-typing">Thinking…</div>}
            {error && <div className="assistant-error">{error}</div>}

            {messages.length === 1 && !loading && (
              <div className="assistant-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="assistant-chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="assistant-inputbar"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              className="assistant-input"
              type="text"
              placeholder="Ask about where to donate…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="assistant-send" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
