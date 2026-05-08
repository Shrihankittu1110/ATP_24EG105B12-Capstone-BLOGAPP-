import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Store/authStore";
import api from "../api/axios";

import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  articleStatusActive,
  articleStatusDeleted,
  cardClass,
  bodyText,
  pageTitleClass,
  tagClass,
} from "../styles/common";
import { FaPenNib, FaChartLine, FaRegClock } from "react-icons/fa6";

function AuthorArticles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!user) return;

    const getAuthorArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        let res = await api.get("/author-api/articles");
        if (res.status === 200) {
          setArticles(res.data.payload || []);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const stats = useMemo(() => {
    const active = articles.filter((article) => article.isArticleActive).length;
    const drafts = articles.filter((article) => article.status === "draft").length;
    const scheduled = articles.filter((article) => article.status === "scheduled").length;
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);

    return [
      { label: "Published", value: active, icon: FaPenNib },
      { label: "Drafts", value: drafts, icon: FaRegClock },
      { label: "Views", value: totalViews, icon: FaChartLine },
      { label: "Scheduled", value: scheduled, icon: FaRegClock },
    ];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const search = query.trim().toLowerCase();

    return articles.filter((article) => {
      const currentStatus = article.status === "draft" ? "draft" : article.status === "scheduled" ? "scheduled" : article.isArticleActive ? "active" : "deleted";

      if (statusFilter !== "all" && currentStatus !== statusFilter) return false;

      if (!search) return true;

      return (
        article.title?.toLowerCase().includes(search) ||
        article.category?.toLowerCase().includes(search) ||
        article.content?.toLowerCase().includes(search)
      );
    });
  }, [articles, query, statusFilter]);

  const featuredArticle = filteredArticles[0] || articles[0] || null;

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  const hasArticles = articles.length > 0;
  const hasMatches = filteredArticles.length > 0;

  if (!hasArticles) {
    return (
      <div className="rounded-4xl border border-dashed border-[#d2d2d7] bg-white/85 backdrop-blur-xl px-6 py-14 text-center shadow-sm">
        <p className="inline-flex items-center rounded-full border border-[#0ea5e9]/15 bg-[#0ea5e9]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f766e]">
          No stories yet
        </p>
        <p className="mt-4 text-2xl font-bold text-[#0f172a]">Build your first article</p>
        <p className="text-sm text-[#64748b] mt-2 max-w-xl mx-auto">
          Start with one clear idea, draft it in the editor, and publish when it feels ready.
        </p>
        <button className="mt-6 bg-linear-to-r from-[#0ea5e9] to-[#f97316] text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-[0_16px_35px_rgba(14,165,233,0.28)] transition-colors" onClick={() => navigate("/author-profile/write-article")}>
          Write Article
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.9fr] gap-5">
        <div className={`${cardClass} cursor-default relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_30%)] pointer-events-none" />
          <div className="relative">
            <p className={tagClass}>Author dashboard</p>
            <h3 className={`${pageTitleClass} mt-2 text-4xl`}>Your publishing board</h3>
            <p className={`${bodyText} mt-3 max-w-2xl`}>
              Keep an eye on your latest stories, track momentum, and jump straight back into writing.
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/80 px-4 py-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#64748b]">{stat.label}</p>
                      <Icon className="text-[#0ea5e9]" />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-[#0f172a]">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`${cardClass} cursor-default`}>
          <p className={tagClass}>Featured</p>
          {featuredArticle ? (
            <div className="mt-3 flex flex-col h-full">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#0ea5e9]/10 text-[#0f766e] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  {featuredArticle.status === "draft" ? "Draft" : featuredArticle.status === "scheduled" ? "Scheduled" : "Live"}
                </span>
                <span className="text-xs text-[#64748b]">{featuredArticle.category}</span>
              </div>

              <h4 className="mt-4 text-2xl font-bold text-[#0f172a] leading-tight">{featuredArticle.title}</h4>
              <p className="mt-3 text-sm text-[#475569] leading-relaxed">
                {featuredArticle.content?.slice(0, 150)}...
              </p>

              <div className="mt-5 flex items-center gap-4 text-xs text-[#64748b]">
                <span>Views {featuredArticle.views || 0}</span>
                <span>Comments {featuredArticle.comments?.length || 0}</span>
                <span>{featuredArticle.isArticleActive ? "Active" : "Hidden"}</span>
              </div>

              <button type="button" onClick={() => openArticle(featuredArticle)} className="mt-auto inline-flex w-fit items-center rounded-full bg-linear-to-r from-[#0ea5e9] to-[#f97316] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5">
                Open feature
              </button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#64748b]">No featured article available.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <p className={tagClass}>Your articles</p>
          <h3 className="text-2xl font-bold text-[#0f172a] mt-2">Published work, drafts, and scheduled posts</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, category, or content"
            className="w-full sm:w-80 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-[#0f172a] shadow-sm focus:outline-none focus:border-[#0ea5e9]"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full sm:w-44 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-[#0f172a] shadow-sm focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </section>

      {!hasMatches ? (
        <div className="rounded-4xl border border-dashed border-[#d2d2d7] bg-white/85 backdrop-blur-xl px-6 py-14 text-center shadow-sm">
          <p className="inline-flex items-center rounded-full border border-[#0ea5e9]/15 bg-[#0ea5e9]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f766e]">
            No results
          </p>
          <p className="mt-4 text-2xl font-bold text-[#0f172a]">Nothing matches your filters</p>
          <p className="text-sm text-[#64748b] mt-2 max-w-xl mx-auto">
            Try a broader search or switch back to all statuses to see your full library.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
            }}
            className="mt-6 bg-linear-to-r from-[#0ea5e9] to-[#f97316] text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-[0_16px_35px_rgba(14,165,233,0.28)] transition-colors"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <button
              key={article._id}
              type="button"
              onClick={() => openArticle(article)}
              className={`${articleCardClass} relative flex flex-col text-left rounded-[1.85rem] border border-transparent hover:border-[#d2d2d7]`}
            >
              <span className={article.isArticleActive ? articleStatusActive : articleStatusDeleted}>
                {article.status === "draft" ? "DRAFT" : article.status === "scheduled" ? "SCHEDULED" : article.isArticleActive ? "ACTIVE" : "DELETED"}
              </span>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3 pr-14">
                  <p className={articleMeta}>{article.category}</p>
                  <p className={articleMeta}>{article.publishAt && article.status === "scheduled" ? new Date(article.publishAt).toLocaleDateString("en-IN") : ""}</p>
                </div>

                <p className={`${articleTitle} text-[1.05rem]`}>{article.title}</p>

                <p className={`${articleExcerpt} min-h-14`}>{article.content.slice(0, 90)}...</p>
                <p className={articleMeta}>Views: {article.views || 0} · Comments: {article.comments?.length || 0}</p>
              </div>

              <span className={`${ghostBtn} mt-auto pt-4 inline-flex items-center gap-2`}>Read Article →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuthorArticles;