import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Store/authStore";
import api from "../api/axios";
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  loadingClass,
  errorClass,
  pageTitleClass,
  bodyText,
  tagClass,
} from "../styles/common";

function Articles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const apiPath = useMemo(() => {
    if (user?.role === "AUTHOR") return "/author-api/articles";
    if (user?.role === "ADMIN") return "/admin-api/articles";
    return "/user-api/articles";
  }, [user?.role]);

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = apiPath === "/user-api/articles" ? { q: query, category, sort } : {};
        const res = await api.get(apiPath, { params });
        setArticles(res.data?.payload || []);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || "Unable to load articles");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [apiPath, category, query, sort]);

  const openArticle = (articleObj) => {
    navigate(`/article/${articleObj._id}`, { state: articleObj });
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8">
        <p className={tagClass}>Article Feed</p>
        <h1 className={pageTitleClass}>View and open articles</h1>
        <p className={`${bodyText} mt-3 max-w-2xl`}>
          Pick an article to read the full page, then use comments to engage with other signed-in users.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] shadow-sm focus:outline-none focus:border-[#0ea5e9]"
          placeholder="Search title, content, category, or author"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-[#0f172a] shadow-sm focus:outline-none focus:border-[#0ea5e9]"
        >
          <option value="">All categories</option>
          <option value="technology">Technology</option>
          <option value="programming">Programming</option>
          <option value="ai">AI</option>
          <option value="web-development">Web Development</option>
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-[#0f172a] shadow-sm focus:outline-none focus:border-[#0ea5e9]"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="popular">Most viewed</option>
          <option value="comments">Most commented</option>
        </select>
      </div>

      {loading && <p className={loadingClass}>Loading articles...</p>}
      {error && <p className={errorClass}>{error}</p>}

      {!loading && !error && (
        <div className={articleGrid}>
          {articles.map((articleObj) => (
            <button
              key={articleObj._id}
              type="button"
              onClick={() => openArticle(articleObj)}
              className={`${articleCardClass} text-left rounded-3xl border border-transparent`}
            >
              <p className={tagClass}>{articleObj.category || "Article"}</p>
              <h2 className={articleTitle}>{articleObj.title}</h2>
              <p className={articleExcerpt}>{articleObj.content?.slice(0, 120)}...</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className={articleMeta}>
                  {articleObj.author?.firstName || articleObj.author?.email || "Community"}
                </span>
                <span className={articleMeta}>{formatDate(articleObj.createdAt)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Articles;