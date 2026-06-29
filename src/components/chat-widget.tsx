import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageSquare, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const transport = new DefaultChatTransport({ api: "/api/chat" });

const SUGGESTIONS = [
  "Estimate cost for a 1,200 sqft loft conversion in London",
  "What services do you offer?",
  "How does your 5-step process work?",
  "Share your contact details",
];

function renderParts(message: UIMessage) {
  return message.parts.map((part, i) => {
    if (part.type === "text") {
      return (
        <p key={i} className="whitespace-pre-wrap leading-relaxed">
          {part.text}
        </p>
      );
    }
    if (part.type?.startsWith("tool-")) {
      const p = part as any;
      const name = part.type.replace("tool-", "").replace(/_/g, " ");
      const done = p.state === "output-available" || p.output;
      return (
        <div
          key={i}
          className="my-1 flex items-center gap-2 rounded-md border border-primary/25 bg-primary/5 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-primary"
        >
          <Sparkles className="h-3 w-3" />
          <span>{done ? `${name} ✓` : `running ${name}…`}</span>
        </div>
      );
    }
    return null;
  });
}

export function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setShowPromo(true), 2500);
    const t2 = setTimeout(() => setShowPromo(false), 12000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  if (!mounted) return null;



  async function submit(text: string) {
    const value = text.trim();
    if (!value || isLoading) return;
    setInput("");
    await sendMessage({ text: value });
  }

  return (
    <>
      {/* Promo bubble */}
      <AnimatePresence>
        {showPromo && !open && (
          <motion.button
            initial={{ opacity: 0, y: 10, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => { setOpen(true); setShowPromo(false); }}
            className="fixed bottom-24 right-6 z-[60] max-w-[260px] rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-left text-xs text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3 w-3" /> Uppal Concierge
            </div>
            <div className="mt-1 leading-snug text-neutral-200">
              Get an instant UK project estimate or ask about our services →
            </div>
            <span className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 bg-neutral-900" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating launcher */}
      <motion.button
        onClick={() => { setOpen((o) => !o); setShowPromo(false); }}
        aria-label="Open Uppal Concierge"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 18 }}
        className="fixed bottom-6 right-6 z-[60] grid h-14 w-14 place-items-center rounded-full bg-neutral-900 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-colors hover:bg-neutral-800"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(212,160,80,0.55),transparent_60%)]" />
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-primary ring-2 ring-neutral-900" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed bottom-24 right-6 z-[60] flex h-[600px] max-h-[80vh] w-[380px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 text-neutral-100 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="relative overflow-hidden border-b border-white/10 px-5 py-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/40">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-wide">Uppal Concierge</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Online · UK design & build expert
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-5 py-5 text-[13.5px]"
            >
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm leading-relaxed text-neutral-200">
                      Hello 👋 I'm the <span className="text-primary">Uppal Concierge</span>.
                      Ask me about services, the design process, indicative project costs in the UK,
                      or how to reach the studio.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => submit(s)}
                        className="block w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-xs text-neutral-300 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-white"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-primary-foreground"
                        : "max-w-[90%] space-y-1.5 rounded-2xl rounded-bl-sm bg-white/[0.04] px-3.5 py-2.5 text-neutral-100 ring-1 ring-white/5"
                    }
                  >
                    {renderParts(m)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white/[0.04] px-4 py-3 ring-1 ring-white/5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  Something went wrong. Please try again.
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="border-t border-white/10 bg-neutral-950/80 p-3"
            >
              <div className="relative flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 focus-within:border-primary/50">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask about pricing, services, contact…"
                  className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 px-1 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                AI estimates are indicative · GBP ex VAT
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
