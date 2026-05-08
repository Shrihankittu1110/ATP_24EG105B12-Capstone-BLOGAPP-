import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router";
import api from "../api/axios";
import { renderMarkdown } from "../utils/markdown";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";
import { useAuth } from "../Store/authStore";

function WriteArticles() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth((state) => state.currentUser);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const status = watch("status", "published");
  const content = watch("content", "");
  const previewHtml = useMemo(() => renderMarkdown(content), [content]);

  //save article
  const submitArticle = async (articleObj) => {
    setLoading(true);

    //add authorId to articleObj
    articleObj.author = currentUser?._id || currentUser?.id;
    if (articleObj.status === "draft") {
      articleObj.publishAt = null;
    }
    try {
      //set loading true
      setLoading(true);
      //make POST req to save new article
      let res = await api.post("/author-api/article", articleObj);
      //navigate to AuthorArticles
      if (res.status === 201) {
        toast.success("Article published successfully")
        navigate("../articles");
        // navigate("./author-profile/articles");
      }
    } catch (err) {
       toast.error(err.response?.data?.error || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={formCard}>
      <h2 className={formTitle}>Write New Article</h2>

      <form onSubmit={handleSubmit(submitArticle)}>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={formGroup}>
            <label className={labelClass}>Publish mode</label>
            <select
              className={inputClass}
              {...register("status", { required: true })}
              defaultValue="published"
            >
              <option value="published">Publish now</option>
              <option value="draft">Save as draft</option>
              <option value="scheduled">Schedule publish</option>
            </select>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Publish at</label>
            <input
              type="datetime-local"
              className={inputClass}
              disabled={status === "draft"}
              {...register("publishAt")}
            />
          </div>
        </div>

        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input
            type="text"
            className={inputClass}
            placeholder="Enter article title"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
          />

          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <select
            className={inputClass}
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>

          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>

          <textarea
            rows="8"
            className={inputClass}
            placeholder="Write your article content..."
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 50,
                message: "Content must be at least 50 characters",
              },
            })}
          />

          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-semibold text-[#0f172a]">Live preview</h3>
            <p className="text-xs text-[#64748b]">Markdown supported</p>
          </div>
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>

        {/* Submit */}
        <button className={submitBtn} type="submit" disabled={loading}>
          {loading ? "Saving..." : status === "draft" ? "Save Draft" : status === "scheduled" ? "Schedule Article" : "Publish Article"}
        </button>

        {loading && <p className={loadingClass}>Publishing article...</p>}
      </form>
    </div>
  );
}

export default WriteArticles;