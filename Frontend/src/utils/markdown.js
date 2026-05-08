const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatInline = (value = "") =>
  value
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener" class="text-[#0ea5e9] underline">$1</a>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-[#0f172a]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

export const renderMarkdown = (content = "") => {
  const normalized = String(content).trim();

  if (!normalized) {
    return "<p class=\"text-[#64748b]\">No content yet.</p>";
  }

  const lines = normalized.split(/\n+/);
  const html = lines
    .map((line) => {
      const safeLine = escapeHtml(line).trim();

      if (!safeLine) {
        return "";
      }

      if (safeLine.startsWith("### ")) {
        return `<h3 class="text-2xl font-bold mt-6 mb-2 text-[#0f172a]">${formatInline(safeLine.slice(4))}</h3>`;
      }

      if (safeLine.startsWith("## ")) {
        return `<h2 class="text-3xl font-bold mt-8 mb-3 text-[#0f172a]">${formatInline(safeLine.slice(3))}</h2>`;
      }

      if (safeLine.startsWith("# ")) {
        return `<h1 class="text-4xl font-bold mt-8 mb-3 text-[#0f172a]">${formatInline(safeLine.slice(2))}</h1>`;
      }

      if (safeLine.startsWith("- ")) {
        return `<li class="ml-5 list-disc text-[#334155]">${formatInline(safeLine.slice(2))}</li>`;
      }

      return `<p class="mb-4 leading-8 text-[#0f172a]">${formatInline(safeLine)}</p>`;
    })
    .join("");

  return html;
};
