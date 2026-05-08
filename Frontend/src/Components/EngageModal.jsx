import { useEffect, useMemo, useState } from "react";
import ModalShell from "./ModalShell";

const CHANNELS = [
  {
    id: "community",
    label: "Community",
    title: "Community Chat",
    description: "Talk with readers and authors in one shared space.",
  },
  {
    id: "authors",
    label: "Authors",
    title: "Author Lounge",
    description: "Ask writers about ideas, drafts, and publishing.",
  },
  {
    id: "readers",
    label: "Readers",
    title: "Reader Corner",
    description: "Exchange recommendations and article reactions.",
  },
];

const DEFAULT_MESSAGES = {
  community: [
    { sender: "Ava", role: "AUTHOR", message: "I just posted a new article on clean UI patterns.", time: "Just now" },
    { sender: "Noah", role: "USER", message: "Reading it now. The layout examples are helpful.", time: "2 min ago" },
  ],
  authors: [
    { sender: "Maya", role: "AUTHOR", message: "Any tips for writing stronger openings?", time: "5 min ago" },
    { sender: "Ethan", role: "AUTHOR", message: "Lead with a clear promise and a sharp example.", time: "1 min ago" },
  ],
  readers: [
    { sender: "Lia", role: "USER", message: "Can we get more posts about design and workflow?", time: "8 min ago" },
    { sender: "Zion", role: "USER", message: "Yes, especially short practical guides.", time: "3 min ago" },
  ],
};

function EngageModal({ isOpen, user, onClose }) {
  const [activeChannel, setActiveChannel] = useState("community");
  const [draft, setDraft] = useState("");
  const [messagesByChannel, setMessagesByChannel] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_MESSAGES;

    try {
      const stored = window.localStorage.getItem("myblog-engage-messages");
      return stored ? { ...DEFAULT_MESSAGES, ...JSON.parse(stored) } : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  });

  const activeMeta = useMemo(
    () => CHANNELS.find((channel) => channel.id === activeChannel) || CHANNELS[0],
    [activeChannel],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("myblog-engage-messages", JSON.stringify(messagesByChannel));
  }, [messagesByChannel]);

  if (!isOpen) return null;

  const displayName = user ? `${user.firstName || "You"}${user.role ? ` (${user.role})` : ""}` : "Guest";
  const canChat = Boolean(user);

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    if (!user) {
      setDraft("");
      return;
    }

    const nextMessage = {
      sender: displayName,
      role: user.role,
      message: trimmed,
      time: "Now",
    };

    setMessagesByChannel((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), nextMessage],
    }));
    setDraft("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} ariaLabel="Engage chat popup" maxWidthClass="max-w-5xl">
        <div className="bg-linear-to-r from-[#0ea5e9]/18 via-[#14b8a6]/18 to-[#f97316]/18 px-6 py-6 sm:px-8 sm:py-7 border-b border-white/70">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#0f766e]">Engage</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[#0f172a]">Chat with readers and authors</h2>
              <p className="mt-2 text-sm sm:text-base text-[#475569] max-w-2xl">{activeMeta.description}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-white/80 text-[#0f172a] hover:bg-white transition shadow-sm"
              aria-label="Close engage popup"
            >
              ×
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] min-h-130">
          <aside className="border-b lg:border-b-0 lg:border-r border-white/70 bg-slate-50/80 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">Channels</p>
            <div className="mt-4 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-1 lg:pb-0">
              {CHANNELS.map((channel) => {
                const isActive = channel.id === activeChannel;

                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setActiveChannel(channel.id)}
                    className={`min-w-37.5 lg:min-w-0 rounded-2xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? "border-[#0ea5e9]/30 bg-white shadow-[0_12px_28px_rgba(14,165,233,0.12)]"
                        : "border-white/70 bg-white/60 hover:bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#0f172a]">{channel.label}</p>
                    <p className="mt-1 text-xs text-[#64748b]">{channel.title}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl bg-white/80 border border-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">You are here as</p>
              <p className="mt-2 text-sm font-semibold text-[#0f172a]">{displayName}</p>
              <p className="mt-1 text-xs text-[#64748b]">
                {canChat
                  ? "Send messages instantly to the selected channel."
                  : "Sign in to send messages and join live discussion."}
              </p>
            </div>
          </aside>

          <section className="flex flex-col bg-white/90">
            <div className="px-5 sm:px-6 py-4 border-b border-white/70 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0f172a]">{activeMeta.title}</h3>
                <p className="text-sm text-[#64748b]">Live discussion powered by your current login</p>
              </div>

              <span className="inline-flex items-center rounded-full border border-[#0ea5e9]/15 bg-[#0ea5e9]/10 px-3 py-1 text-xs font-semibold text-[#0f766e]">
                Active now
              </span>
            </div>

            <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.06),transparent_30%),linear-gradient(to_bottom,#ffffff,#f8fbff)]">
              {(messagesByChannel[activeChannel] || []).map((message, index) => (
                <div
                  key={`${message.sender}-${index}`}
                  className="max-w-3xl rounded-3xl border border-white/80 bg-white/85 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{message.sender}</p>
                      <p className="text-xs text-[#64748b]">{message.role}</p>
                    </div>
                    <p className="text-xs text-[#64748b]">{message.time}</p>
                  </div>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#334155]">{message.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/70 bg-white/95 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={!canChat}
                  placeholder={canChat ? `Message ${activeMeta.label.toLowerCase()}...` : "Sign in to start chatting"}
                  className="flex-1 rounded-full border border-[#cbd5e1] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/15 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
                <button
                  type="submit"
                  className="rounded-full bg-linear-to-r from-[#0ea5e9] to-[#f97316] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!canChat}
                >
                  Send
                </button>
              </div>
            </form>
          </section>
        </div>
    </ModalShell>
  );
}

export default EngageModal;