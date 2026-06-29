import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Calculator,
  Globe2,
  MapPin,
  MessageSquare,
  Minimize2,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const transport = new DefaultChatTransport({ api: "/api/chat" });

const SUGGESTIONS = [
  { icon: Calculator, label: "Estimate a 1,200 sqft loft conversion in London" },
  { icon: Globe2, label: "What's new in UK Part L 2026 regulations?" },
  { icon: Sparkles, label: "Walk me through your 5-step design process" },
  { icon: Phone, label: "Share your contact details and offices" },
];

const TOOL_META: Record<string, { label: string; icon: typeof Calculator }> = {
  "estimate project cost": { label: "Calculating UK estimate", icon: Calculator },
  "get contact info": { label: "Fetching studio details", icon: MapPin },
  "web search": { label: "Searching the live web", icon: Globe2 },
};

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="my-1.5 list-disc space-y-0.5 pl-4">{children}</ul>,
        ol: ({ children }) => <ol className="my-1.5 list-decimal space-y-0.5 pl-4">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        em: ({ children }) => <em className="text-neutral-200">{children}</em>,
        code: (props: ComponentProps<"code"> & { inline?: boolean }) => {
          const { inline, children, ...rest } = props;
          return inline ? (
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-primary" {...rest}>
              {children}
            </code>
          ) : (
            <pre className="my-2 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-[12px]">
              <code {...rest}>{children}</code>
            </pre>
          );
        },
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {children}
          </a>
        ),
        h1: ({ children }) => <h3 className="mt-2 text-sm font-semibold text-white">{children}</h3>,
        h2: ({ children }) => <h3 className="mt-2 text-sm font-semibold text-white">{children}</h3>,
        h3: ({ children }) => <h3 className="mt-2 text-sm font-semibold text-white">{children}</h3>,
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-left text-[12px]">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b border-white/10 bg-white/5 px-2 py-1.5 font-medium text-white">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="border-b border-white/5 px-2 py-1.5">{children}</td>,
        blockquote: ({ children }) => (
          <blockquote className="my-2 border-l-2 border-primary/60 pl-3 text-neutral-300">
            {children}
          </blockquote>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

function renderParts(message: UIMessage) {
  return message.parts.map((part, i) => {
    if (part.type === "text") {
      return (
        <div key={i} className="text-[13.5px]">
          <Markdown>{part.text}</Markdown>
        </div>
      );
    }
    if (part.type?.startsWith("tool-")) {
      const p = part as any;
      const rawName = part.type.replace("tool-", "").replace(/_/g, " ");
      const meta = TOOL_META[rawName] ?? { label: rawName, icon: Sparkles };
      const Icon = meta.icon;
      const done = p.state === "output-available" || p.output;
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-1.5 flex items-center gap-2 rounded-lg border border-primary/25 bg-gradient-to-r from-primary/10 to-transparent px-2.5 py-1.5 text-[11px] text-primary"
        >
          <Icon className="h-3 w-3 shrink-0" />
          <span className="font-medium tracking-wide">{meta.label}</span>
          {done ? (
            <span className="ml-auto text-[10px] text-primary/70">✓ done</span>
          ) : (
            <motion.span
              className="ml-auto h-1 w-1 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
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

  const { messages, sendMessage, status, error } = useChat({ transport });

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setShowPromo(true), 2500);
    const t2 = setTimeout(() => setShowPromo(false), 14000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
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
            onClick={() => {
              setOpen(true);
              setShowPromo(false);
            }}
            className="fixed bottom-24 right-6 z-[60] max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-left text-xs text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          >
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,80,0.25),transparent_55%)]" />
            <div className="relative flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3 w-3" /> Uppal Concierge · Live
            </div>
            <div className="relative mt-1 leading-snug text-neutral-200">
              Get an instant 2026 UK project estimate, or ask about Part L & planning →
            </div>
            <span className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 bg-neutral-900" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating launcher */}
      <motion.button
        onClick={() => {
          setOpen((o) => !o);
          setShowPromo(false);
        }}
        aria-label="Open Uppal Concierge"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
        className="fixed bottom-6 right-6 z-[60] grid h-14 w-14 place-items-center rounded-full bg-neutral-900 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-colors hover:bg-neutral-800"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(212,160,80,0.55),transparent_60%)]" />
        {!open && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-primary/50"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
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
            className="fixed bottom-24 right-6 z-[60] flex h-[640px] max-h-[85vh] w-[400px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="relative overflow-hidden border-b border-white/10 px-5 py-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,160,80,0.28),transparent_60%)]" />
              <motion.div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative flex items-center gap-3">
                <div className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-primary/5 ring-1 ring-primary/50">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-neutral-950" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold tracking-wide">
                    Uppal Concierge
                    <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-primary">
                      AI · 2026
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Online · UK architecture & BIM expert
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Minimise"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-5 text-[13.5px]"
            >
              {messages.length === 0 && (
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4"
                  >
                    <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-xl" />
                    <p className="relative text-sm leading-relaxed text-neutral-100">
                      Hello 👋 I'm the <span className="text-primary">Uppal Concierge</span>.
                      Ask about services, the design process, live 2026 UK planning &amp; Part L
                      info, or get an indicative project estimate.
                    </p>
                  </motion.div>
                  <div className="space-y-2">
                    <div className="px-1 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                      Try asking
                    </div>
                    {SUGGESTIONS.map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <motion.button
                          key={s.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          onClick={() => submit(s.label)}
                          className="group flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-left text-xs text-neutral-300 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-white"
                        >
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/5 text-primary transition-colors group-hover:bg-primary/15">
                            <Icon className="h-3 w-3" />
                          </span>
                          <span className="flex-1">{s.label}</span>
                          <span className="text-neutral-600 transition-colors group-hover:text-primary">→</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    m.role === "user"
                      ? "flex justify-end gap-2"
                      : "flex justify-start gap-2"
                  }
                >
                  {m.role !== "user" && (
                    <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-primary/5 ring-1 ring-primary/40">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-br from-primary to-primary/85 px-3.5 py-2.5 text-primary-foreground shadow-[0_4px_20px_rgba(212,160,80,0.25)]"
                        : "max-w-[85%] space-y-1 rounded-2xl rounded-bl-sm border border-white/5 bg-white/[0.04] px-3.5 py-2.5 text-neutral-100"
                    }
                  >
                    {renderParts(m)}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-primary/5 ring-1 ring-primary/40">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-white/5 bg-white/[0.04] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                      thinking
                    </span>
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
              <div className="relative flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 transition-colors focus-within:border-primary/60 focus-within:bg-white/[0.05]">
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
                  placeholder="Ask about 2026 pricing, planning, services…"
                  className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Send"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[0_4px_15px_rgba(212,160,80,0.35)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </motion.button>
              </div>
              <div className="mt-2 flex items-center justify-between px-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  AI · indicative GBP ex VAT
                </p>
                <p className="text-[10px] text-neutral-600">⏎ to send · ⇧⏎ new line</p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
