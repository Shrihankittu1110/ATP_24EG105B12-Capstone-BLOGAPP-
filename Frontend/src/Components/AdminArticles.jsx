import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../Store/authStore";
import api from "../api/axios";
import {
  pageWrapper,
  headingClass,
  bodyText,
  mutedText,
  cardClass,
  loadingClass,
  errorClass,
  primaryBtn,
  secondaryBtn,
  articleStatusActive,
  articleStatusDeleted,
} from "../styles/common";

function AdminArticles() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin-api/articles");
      setArticles(res.data?.payload || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (statusFilter && (article.status || "published") !== statusFilter) return false;
      if (!q) return true;
      return (
        article.title?.toLowerCase().includes(q) ||
        article.category?.toLowerCase().includes(q) ||
        article.author?.email?.toLowerCase().includes(q) ||
        article.author?.firstName?.toLowerCase().includes(q) ||
        article.author?.lastName?.toLowerCase().includes(q)
      );
    });
  }, [query, statusFilter, articles]);

  const toggleArticleStatus = async (articleId, currentStatus) => {
    try {
      const res = await api.patch(
        "/admin-api/article",
        { articleId, isArticleActive: !currentStatus },
      );
      toast.success(res.data?.message || "Article updated");
      setArticles((prev) => prev.map((article) => (article._id === articleId ? res.data.payload : article)));
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to update article");
    }
  };

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;

  return (
    <div className={pageWrapper}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={headingClass}>Manage Articles</h1>
          <p className={bodyText}>Review and control every article on the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className={secondaryBtn} onClick={() => navigate("/admin-profile")}>
            Back to Admin
          </button>
          <button className={primaryBtn} onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, category, or author email"
        className="w-full md:w-96 mb-6 bg-white border border-[#d2d2d7] rounded-xl px-4 py-3 text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/10 focus:border-[#0066cc]"
      />

      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
        className="w-full md:w-56 mb-6 ml-0 md:ml-3 bg-white border border-[#d2d2d7] rounded-xl px-4 py-3 text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/10 focus:border-[#0066cc]"
      >
        <option value="">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
      </select>

      {error && <p className={errorClass}>{error}</p>}

      <div className="grid gap-4">
        {filteredArticles.length === 0 ? (
          <p className="text-center text-[#a1a1a6] py-10">No articles found</p>
        ) : (
          filteredArticles.map((article) => (
            <div key={article._id} className={cardClass}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-[#1d1d1f]">{article.title}</p>
                    <p className={mutedText}>Category: {article.category}</p>
                    <p className={mutedText}>Author: {article.author?.email || "Unknown"}</p>
                    <p className={mutedText}>Views: {article.views || 0} | Comments: {article.comments?.length || 0} | Reports: {article.reportCount || 0}</p>
                    {article.publishAt && article.status === "scheduled" && <p className={mutedText}>Publishes at: {new Date(article.publishAt).toLocaleString("en-IN")}</p>}
                  </div>
                  <span className={article.isArticleActive ? articleStatusActive : articleStatusDeleted}>
                    {article.status === "draft" ? "DRAFT" : article.status === "scheduled" ? "SCHEDULED" : article.isArticleActive ? "ACTIVE" : "DELETED"}
                  </span>
                </div>
                <p className="text-sm text-[#6e6e73] line-clamp-2">{article.content}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => toggleArticleStatus(article._id, article.isArticleActive)}
                    className={article.isArticleActive ? "bg-[#ff3b30] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#d62c23] transition-colors" : "bg-[#34c759] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#248a3d] transition-colors"}
                  >
                    {article.isArticleActive ? "Delete" : "Restore"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminArticles;
