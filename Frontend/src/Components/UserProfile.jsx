import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../Store/authStore.js";
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
  cardClass,
  headingClass,
  bodyText,
  inputClass,
  labelClass,
  submitBtn,
} from "../styles/common.js";

function UserProfile() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const currentUser = useAuth((state) => state.currentUser);
  const updateCurrentUser = useAuth((state) => state.updateCurrentUser);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [feedArticles, setFeedArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [profileDraft, setProfileDraft] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    bio: currentUser?.bio || "",
    website: currentUser?.website || "",
  });

  useEffect(() => {
    setProfileDraft({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      bio: currentUser?.bio || "",
      website: currentUser?.website || "",
    });
  }, [currentUser]);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [feedRes, bookmarksRes, notificationsRes] = await Promise.all([
          api.get("/user-api/articles"),
          api.get("/user-api/bookmarks"),
          api.get("/user-api/notifications"),
        ]);

        const nextFeed = feedRes.data?.payload || [];
        const nextBookmarks = bookmarksRes.data?.payload || [];
        const nextNotifications = notificationsRes.data?.payload || [];

        setFeedArticles(nextFeed);
        setBookmarks(nextBookmarks);
        setNotifications(nextNotifications);
        updateCurrentUser({ notifications: nextNotifications, bookmarks: nextBookmarks, ...profileDraft });
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const formatDateIST = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, { state: articleObj });
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const res = await api.put("/auth/profile", profileDraft);
      if (res.status === 200) {
        updateCurrentUser(res.data?.payload);
        toast.success("Profile updated");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const res = await api.patch("/user-api/notifications/read-all");
      setNotifications(res.data?.payload || []);
      updateCurrentUser({ notifications: res.data?.payload || [] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update notifications");
    }
  };

  const activeList =
    activeTab === "bookmarks"
      ? bookmarks
      : activeTab === "notifications"
        ? notifications
        : feedArticles;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className={loadingClass}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {error && <p className={errorClass}>{error}</p>}

      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-5 sm:p-6 mb-8 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-center gap-4">
          {currentUser?.profileImageUrl ? (
            <img src={currentUser.profileImageUrl} className="w-16 h-16 rounded-full object-cover border" alt="profile" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-sm text-[#6e6e73]">Welcome back</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">{currentUser?.firstName}</h2>
            <p className="text-sm text-[#6e6e73]">{currentUser?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-[#f5f5f7] px-4 py-3">
            <p className="text-lg font-semibold text-[#1d1d1f]">{feedArticles.length}</p>
            <p className="text-xs text-[#6e6e73]">Articles</p>
          </div>
          <div className="rounded-2xl bg-[#f5f5f7] px-4 py-3">
            <p className="text-lg font-semibold text-[#1d1d1f]">{bookmarks.length}</p>
            <p className="text-xs text-[#6e6e73]">Bookmarks</p>
          </div>
          <div className="rounded-2xl bg-[#f5f5f7] px-4 py-3">
            <p className="text-lg font-semibold text-[#1d1d1f]">{notifications.filter((notification) => !notification.isRead).length}</p>
            <p className="text-xs text-[#6e6e73]">Unread</p>
          </div>
        </div>

        <button className="w-full lg:w-auto bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 mb-8">
        <form onSubmit={saveProfile} className={`${cardClass} cursor-default`}>
          <h3 className={headingClass}>Profile details</h3>
          <p className={`${bodyText} mt-2`}>Update your profile card and add a short bio for readers.</p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First name</label>
              <input className={inputClass} value={profileDraft.firstName} onChange={(event) => setProfileDraft((prev) => ({ ...prev, firstName: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Last name</label>
              <input className={inputClass} value={profileDraft.lastName} onChange={(event) => setProfileDraft((prev) => ({ ...prev, lastName: event.target.value }))} />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>Bio</label>
            <textarea rows="4" className={inputClass} value={profileDraft.bio} onChange={(event) => setProfileDraft((prev) => ({ ...prev, bio: event.target.value }))} placeholder="Tell readers what you like to read or write about" />
          </div>

          <div className="mt-4">
            <label className={labelClass}>Website</label>
            <input className={inputClass} value={profileDraft.website} onChange={(event) => setProfileDraft((prev) => ({ ...prev, website: event.target.value }))} placeholder="https://your-site.com" />
          </div>

          <button type="submit" className={`${submitBtn} mt-5`} disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>

        <div className={`${cardClass} cursor-default`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className={headingClass}>Activity</h3>
              <p className={`${bodyText} mt-2`}>Switch between your feed, saved articles, and notifications.</p>
            </div>

            {activeTab === "notifications" && notifications.some((notification) => !notification.isRead) && (
              <button type="button" onClick={markAllNotificationsRead} className="text-sm font-semibold text-[#0ea5e9] hover:text-[#f97316] transition-colors">
                Mark all read
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["feed", "Latest articles"],
              ["bookmarks", "Bookmarks"],
              ["notifications", "Notifications"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === key ? "bg-[#0066cc] text-white" : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab !== "notifications" && activeList.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#d2d2d7] bg-white px-6 py-12 text-center mt-5">
              <p className="text-[#1d1d1f] font-medium">No {activeTab} yet</p>
              <p className="text-sm text-[#6e6e73] mt-2">Check back later for fresh content.</p>
            </div>
          ) : activeTab === "notifications" ? (
            <div className="mt-5 space-y-3">
              {notifications.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#d2d2d7] bg-white px-6 py-12 text-center">
                  <p className="text-[#1d1d1f] font-medium">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification._id} className="rounded-2xl border border-[#e8e8ed] bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#1d1d1f]">{notification.message}</p>
                        <p className="text-xs text-[#6e6e73] mt-1">{notification.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${notification.isRead ? "bg-[#d1fae5] text-[#047857]" : "bg-[#dbeafe] text-[#1d4ed8]"}`}>
                        {notification.isRead ? "Read" : "New"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className={`${articleGrid} mt-5`}>
              {activeList.map((articleObj) => (
                <button
                  type="button"
                  className={`${articleCardClass} text-left rounded-3xl border border-transparent hover:border-[#d2d2d7]`}
                  key={articleObj._id}
                  onClick={() => navigateToArticleByID(articleObj)}
                >
                  <div className="flex flex-col h-full">
                    <div>
                      <p className={articleTitle}>{articleObj.title}</p>
                      <p className="text-sm text-[#6e6e73] mt-1">{articleObj.content?.slice(0, 80)}...</p>
                      <p className={`${timestampClass} mt-2`}>{formatDateIST(articleObj.createdAt)}</p>
                    </div>
                    <span className={`${ghostBtn} mt-auto pt-4 inline-block`}>Read Article →</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
