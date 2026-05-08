import { useEffect, useState } from "react";
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
} from "../styles/common";

function AdminAnalytics() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin-api/analytics");
      setAnalytics(res.data?.payload || null);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return <p className={loadingClass}>Loading analytics...</p>;

  const stats = analytics?.summary
    ? [
        { label: "Total Users", value: analytics.summary.totalUsers },
        { label: "Active Users", value: analytics.summary.activeUsers },
        { label: "Blocked Users", value: analytics.summary.blockedUsers },
        { label: "Authors", value: analytics.summary.totalAuthors },
        { label: "Readers", value: analytics.summary.totalReaders },
        { label: "Articles", value: analytics.summary.totalArticles },
        { label: "Active Articles", value: analytics.summary.activeArticles },
        { label: "Visible Articles", value: analytics.summary.visibleArticles },
        { label: "Draft Articles", value: analytics.summary.draftArticles },
        { label: "Scheduled Articles", value: analytics.summary.scheduledArticles },
        { label: "Reports", value: analytics.summary.totalReports },
        { label: "Views", value: analytics.summary.totalViews },
        { label: "Bookmarks", value: analytics.summary.totalBookmarks },
      ]
    : [];

  return (
    <div className={pageWrapper}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={headingClass}>Analytics</h1>
          <p className={bodyText}>Live overview of users, content, engagement, and moderation.</p>
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

      {error && <p className={errorClass}>{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div key={item.label} className={cardClass}>
            <p className={mutedText}>{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#1d1d1f]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-[#e8e8ed] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">Top Categories</h2>
          <div className="space-y-3">
            {analytics?.topCategories?.length ? analytics.topCategories.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl bg-[#f5f5f7] px-4 py-3">
                <span className="text-sm font-medium text-[#1d1d1f]">{item.label}</span>
                <span className="text-sm text-[#6e6e73]">{item.value}</span>
              </div>
            )) : <p className="text-sm text-[#6e6e73]">No category data available yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-[#e8e8ed] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">Top Authors</h2>
          <div className="space-y-3">
            {analytics?.topAuthors?.length ? analytics.topAuthors.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl bg-[#f5f5f7] px-4 py-3">
                <span className="text-sm font-medium text-[#1d1d1f]">{item.label}</span>
                <span className="text-sm text-[#6e6e73]">{item.value}</span>
              </div>
            )) : <p className="text-sm text-[#6e6e73]">No author data available yet.</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-[#e8e8ed] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">Most Viewed Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {analytics?.mostViewed?.length ? analytics.mostViewed.map((article) => (
            <div key={article._id} className="rounded-2xl bg-[#f5f5f7] p-4">
              <p className="text-sm font-semibold text-[#1d1d1f]">{article.title}</p>
              <p className="text-xs text-[#6e6e73] mt-2">Views: {article.views}</p>
              <p className="text-xs text-[#6e6e73]">Comments: {article.comments}</p>
              <p className="text-xs text-[#6e6e73]">Reports: {article.reportCount}</p>
            </div>
          )) : <p className="text-sm text-[#6e6e73]">No engagement data available yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
