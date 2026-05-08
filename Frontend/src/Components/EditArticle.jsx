import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import api from "../api/axios";
import { useMemo } from "react";
import { renderMarkdown } from "../utils/markdown";


import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
} from "../styles/common";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();

  const article = location.state;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const status = watch("status", article?.status || "published");
  const content = watch("content", article?.content || "");
  const previewHtml = useMemo(() => renderMarkdown(content), [content]);

  // prefill form
  useEffect(() => {
    if (!article) return;

     setValue("title", article.title);
     setValue("category", article.category);
     setValue("content", article.content);
      setValue("status", article.status || "published");
      setValue("publishAt", article.publishAt ? String(article.publishAt).slice(0, 16) : "");
  }, [article, setValue]);

  const updateArticle = async (modifiedArticle) => {
  
    //add articleId to modified article
    modifiedArticle.articleId=article._id;
    if (modifiedArticle.status === "draft") {
      modifiedArticle.publishAt = null;
    }
    //make PUT req to update article
    let res=await api.put("/author-api/articles",
      modifiedArticle,
      )
    //naviagte to articleById component
   if(res.status===200){
    navigate(`/article/${article._id}`,{state:res.data.payload})
   }
  };

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={formGroup}>
            <label className={labelClass}>Publish mode</label>
            <select className={inputClass} {...register("status")}>
              <option value="published">Publish now</option>
              <option value="draft">Save as draft</option>
              <option value="scheduled">Schedule publish</option>
            </select>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Publish at</label>
            <input className={inputClass} type="datetime-local" disabled={status === "draft"} {...register("publishAt")} />
          </div>
        </div>

        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input className={inputClass} {...register("title", { required: "Title required" })} />

          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <select className={inputClass} {...register("category", { required: "Category required" })}>
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

          <textarea rows="14" className={inputClass} {...register("content", { required: "Content required" })} />

          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-semibold text-[#0f172a]">Live preview</h3>
            <p className="text-xs text-[#64748b]">Markdown supported</p>
          </div>
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>

        <button className={submitBtn}>Update Article</button>
      </form>
    </div>
  );
}

export default EditArticle;