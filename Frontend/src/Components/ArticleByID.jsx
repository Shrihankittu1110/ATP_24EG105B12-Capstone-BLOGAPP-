import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../Store/authStore.js";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { renderMarkdown } from "../utils/markdown.js";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  commentsWrapper,
  commentCard,
  commentHeader,
  commentUserRow,
  avatar,
  commentUser,
  commentTime,
  commentText,
} from "../styles/common.js";
import { useForm } from "react-hook-form";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const user = useAuth((state) => state.currentUser);
  const updateCurrentUser = useAuth((state) => state.updateCurrentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    //if aticle is transferred, then use it
    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/user-api/article/${id}`);

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || "Unable to load article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  useEffect(() => {
    const getRecommendations = async () => {
      if (!user) return;

      try {
        const res = await api.get("/user-api/recommendations");
        setRecommendations(res.data?.payload || []);
      } catch {
        setRecommendations([]);
      }
    };

    getRecommendations();
  }, [user]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const authorName = useMemo(() => {
    if (!article?.author) return "Community";
    return `${article.author.firstName || ""} ${article.author.lastName || ""}`.trim() || article.author.email || "Community";
  }, [article]);

  const toggleBookmark = async () => {
    try {
      const res = await api.post("/user-api/bookmarks", { articleId: article._id });
      const bookmarked = Boolean(res.data?.payload?.bookmarked);
      setArticle((prev) => (prev ? { ...prev, isBookmarked: bookmarked } : prev));

      const bookmarkList = res.data?.payload?.bookmarks || [];
      updateCurrentUser({ bookmarks: bookmarkList });
      toast.success(bookmarked ? "Added to bookmarks" : "Removed from bookmarks");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update bookmark");
    }
  };

  const reportArticle = async () => {
    const reason = window.prompt("Why are you reporting this article?");
    if (!reason?.trim()) return;

    try {
      await api.post("/user-api/articles/report", { articleId: article._id, reason });
      toast.success("Report submitted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to report article");
    }
  };

  // delete & restore article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.patch(
        "/author-api/articles",
        { articleId: article._id, isArticleActive: newStatus },
      );

      setArticle(res.data.payload);

      //  toast.success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message;

      if (err.response?.status === 400) {
        toast(msg); // already deleted/active case
      } else {
        setError(msg || "Operation failed");
      }
    }
  };

  //edit article
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  //post comment by user
  const addComment = async (commentObj) => {
    //{comment:"user comment"}
    //add artcileId
    commentObj.articleId = article._id;
    let res = await api.put("/user-api/articles", commentObj);
    if (res.status === 200) {
      setArticle(res.data.payload);
    }
  };

  const articleHtml = useMemo(() => renderMarkdown(article?.content || ""), [article?.content]);


  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>✍️ {authorName}</div>

          <div>{formatDate(article.createdAt)}</div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-[#64748b]">
          <span>Views: {article.views || 0}</span>
          <span>Comments: {article.comments?.length || 0}</span>
          <span>Status: {article.status || "published"}</span>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent} dangerouslySetInnerHTML={{ __html: articleHtml }} />

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <button className="bg-white/80 border border-[#cbd5e1] text-[#0f172a] text-sm px-4 py-2 rounded-full hover:border-[#0ea5e9]/30 transition" onClick={toggleBookmark}>
          {article.isBookmarked ? "Remove Bookmark" : "Bookmark Article"}
        </button>

        <button className="bg-white/80 border border-[#cbd5e1] text-[#0f172a] text-sm px-4 py-2 rounded-full hover:border-[#ef4444]/30 transition" onClick={reportArticle}>
          Report Article
        </button>
      </div>

      {/* form to add comment if role is USER */}
      {/* USER actions */}
      {user && (
        <div className={articleActions}>
          <form onSubmit={handleSubmit(addComment)}>
            <input
              type="text"
              {...register("comment")}
              className={inputClass}
              placeholder="Write your comment here..."
            />
            <button type="submit" className="bg-linear-to-r from-[#0ea5e9] to-[#f97316] text-white px-5 py-2 rounded-2xl mt-5">
              Add comment
            </button>
          </form>
        </div>
      )}

      {/* comments */}
      {/* Comments */}
      <div className={commentsWrapper}>
        {article.comments?.length === 0 && <p className="text-[#a1a1a6] text-sm text-center">No comments yet</p>}

        {article.comments?.map((commentObj, index) => {
          const name = commentObj.user?.email || "User";
          const firstLetter = name.charAt(0).toUpperCase();

          return (
            <div key={index} className={commentCard}>
              {/* Header */}
              <div className={commentHeader}>
                <div className={commentUserRow}>
                  <div className={avatar}>{firstLetter}</div>

                  <div>
                    <p className={commentUser}>{name}</p>
                    <p className={commentTime}>{formatDate(commentObj.createdAt || new Date())}</p>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className={commentText}>{commentObj.comment}</p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>

      {recommendations.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-[#0f172a] mb-4">Recommended for you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.map((item) => (
              <button
                key={item._id}
                type="button"
                className="text-left rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm hover:-translate-y-0.5 transition"
                onClick={() => navigate(`/article/${item._id}`, { state: item })}
              >
                <p className={articleCategory}>{item.category}</p>
                <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#475569]">{item.content?.slice(0, 90)}...</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleByID;

// {
//   "user":"6989799b7013502767d3f82b",
//   "articleId":"6989750220ce5bf826ec4f7e",
//   "comment":"good article"

// }