// src/styles/common.js
// Theme: Vibrant Aurora — layered gradients, bold accents, soft glass surfaces

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_28%),linear-gradient(to_bottom,#f8fbff,#eef2ff_48%,#fff7ed)] text-[#0f172a]";
export const pageWrapper = "max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16";
export const section = "mb-14";

// ─── Cards ────────────────────────────────────────────
export const cardClass =
  "bg-white/78 backdrop-blur-xl border border-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)] rounded-[1.75rem] p-7 hover:-translate-y-1 hover:border-[#38bdf8]/35 hover:shadow-[0_28px_80px_rgba(14,165,233,0.16)] transition-all duration-300 cursor-pointer";

// ─── Typography ───────────────────────────────────────
export const pageTitleClass = "text-5xl font-bold text-[#0f172a] tracking-tight leading-[1.02] mb-2";
export const headingClass = "text-2xl font-bold text-[#0f172a] tracking-tight";
export const subHeadingClass = "text-lg font-semibold text-[#0f172a] tracking-tight";
export const bodyText = "text-[#475569] leading-relaxed";
export const mutedText = "text-sm text-[#64748b]";
export const linkClass = "text-[#0ea5e9] hover:text-[#f97316] transition-colors";

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
  "bg-gradient-to-r from-[#0ea5e9] to-[#f97316] text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-[0_16px_35px_rgba(14,165,233,0.28)] hover:-translate-y-0.5 transition-all cursor-pointer text-sm tracking-tight";
export const secondaryBtn =
  "border border-[#cbd5e1] bg-white/75 text-[#0f172a] font-medium px-5 py-2.5 rounded-full hover:bg-white hover:border-[#0ea5e9]/30 transition-all cursor-pointer text-sm";
export const ghostBtn = "text-[#0ea5e9] font-medium hover:text-[#f97316] transition-colors cursor-pointer text-sm";

// ─── Forms ────────────────────────────────────────────
export const formCard = "bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_22px_70px_rgba(15,23,42,0.10)] rounded-[2rem] p-8 sm:p-10 max-w-4xl mx-auto";
export const formTitle = "text-2xl font-bold text-[#1d1d1f] tracking-tight text-center mb-7";
export const labelClass = "text-xs font-medium text-[#475569] mb-1.5 block";
export const inputClass =
  "w-full bg-white/90 border border-[#cbd5e1] rounded-xl px-4 py-2.5 text-[#0f172a] text-sm placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/15 transition";
export const formGroup = "mb-4";
export const submitBtn =
  "w-full bg-gradient-to-r from-[#0ea5e9] to-[#f97316] text-white font-semibold py-2.5 rounded-full hover:shadow-[0_16px_35px_rgba(14,165,233,0.28)] hover:-translate-y-0.5 transition-all cursor-pointer mt-2 text-sm tracking-tight";

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
  "bg-white/78 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/70 px-4 sm:px-8 py-3.5 flex items-center sticky top-0 z-50 shadow-[0_8px_40px_rgba(15,23,42,0.05)]";
export const navContainerClass = "max-w-6xl mx-auto w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";
export const navBrandClass = "text-base font-semibold text-[#0f172a] tracking-tight flex items-center gap-2";
export const navLinksClass = "flex items-center gap-4 sm:gap-6 flex-wrap";
export const navLinkClass = "text-base sm:text-lg text-[#64748b] hover:text-[#0f172a] transition-colors font-normal";
export const navLinkActiveClass = "text-base sm:text-lg text-[#0f172a] font-medium px-3 py-1.5 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/15";

// ─── Article / Blog ───────────────────────────────────
//export const articleGrid        = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e8e8ed] border border-[#e8e8ed] rounded-2xl overflow-hidden"
export const articleGrid = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
export const articleCardClass =
  "bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-7 rounded-[1.75rem] hover:-translate-y-1 hover:border-[#f97316]/30 hover:shadow-[0_28px_80px_rgba(249,115,22,0.12)] transition-all duration-300 flex flex-col gap-2.5 cursor-pointer";
export const articleTitle = "text-base font-semibold text-[#0f172a] leading-snug tracking-tight";
export const articleExcerpt = "text-sm text-[#475569] leading-relaxed";
export const articleMeta = "text-xs text-[#64748b]";
export const articleBody = "text-[#334155] leading-[1.85] text-[0.95rem] max-w-2xl";
export const timestampClass = "text-xs text-[#64748b] flex items-center gap-1.5";
export const tagClass = "text-[0.65rem] font-semibold text-[#0ea5e9] uppercase tracking-widest w-fit";

// ─── Article Page ─────────────────────────────────────
export const articlePageWrapper = "max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-14";

export const articleHeader = "mb-10 flex flex-col gap-4";

export const articleCategory = "text-[0.7rem] font-semibold uppercase tracking-widest text-[#f97316]";

export const articleMainTitle = "text-4xl font-bold text-[#0f172a] leading-tight tracking-tight";

export const articleAuthorRow =
  "flex items-center justify-between border-t border-b border-white/60 py-4 text-sm text-[#475569]";

export const authorInfo = "flex items-center gap-2 font-medium text-[#0f172a]";

export const articleContent = "text-[#0f172a] leading-[1.9] text-[1rem] whitespace-pre-line mt-8";

export const articleFooter = "border-t border-white/60 mt-12 pt-6 text-sm text-[#64748b]";
// ─── Article Actions ─────────────────────────────
export const articleActions = "flex gap-3 mt-6";

export const editBtn = "bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] text-white text-sm px-4 py-2 rounded-full hover:shadow-[0_16px_35px_rgba(14,165,233,0.24)] transition-all";

export const deleteBtn = "bg-[#ef4444] text-white text-sm px-4 py-2 rounded-full hover:bg-[#dc2626] transition";

// ─── Article Status Badge ─────────────────────────
export const articleStatusActive =
  "absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-[#14b8a6]/15 text-[#0f766e]";

export const articleStatusDeleted =
  "absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-[#ef4444]/15 text-[#b91c1c]";

// ─── Feedback ─────────────────────────────────────────
export const errorClass =
  "bg-[#ef4444]/[0.08] text-[#b91c1c] border border-[#ef4444]/[0.18] rounded-xl px-4 py-3 text-sm";
export const successClass =
  "bg-[#14b8a6]/[0.08] text-[#0f766e] border border-[#14b8a6]/20 rounded-xl px-4 py-3 text-sm";
export const loadingClass = "text-[#0ea5e9]/70 text-sm animate-pulse text-center py-10";
export const emptyStateClass = "text-center text-[#64748b] py-16 text-sm";

// ─── Comments ───────────────────────────────────────
export const commentsWrapper = "mt-12 flex flex-col gap-6";

export const commentCard = "bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-[#0ea5e9]/20 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]";

export const commentHeader = "flex items-center justify-between mb-2";

export const commentUser = "text-sm font-semibold text-[#0f172a]";

export const commentTime = "text-xs text-[#64748b]";

export const commentText = "text-[#334155] text-sm leading-relaxed mt-1";

export const avatar =
  "w-9 h-9 rounded-full bg-gradient-to-br from-[#0ea5e9]/15 to-[#f97316]/15 text-[#0284c7] flex items-center justify-center text-sm font-semibold";

export const commentUserRow = "flex items-center gap-3";

// ─── Divider ──────────────────────────────────────────
export const divider = "border-t border-white/60 my-10";