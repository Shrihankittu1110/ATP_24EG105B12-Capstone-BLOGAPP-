import exp from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { UserModel } from "../models/UserModel.js";

export const userApp = exp.Router();

const populateArticle = [
  { path: "author", select: "firstName lastName email profileImageUrl bio website" },
  { path: "comments.user", select: "firstName lastName email profileImageUrl" },
  { path: "reports.user", select: "firstName lastName email" },
];

const articleIsVisible = (article) => {
  if (!article?.isArticleActive) return false;

  if (article.status === "draft") return false;

  if (article.status === "scheduled") {
    if (!article.publishAt) return false;
    return new Date(article.publishAt).getTime() <= Date.now();
  }

  return true;
};

const matchesSearch = (article, searchText = "") => {
  if (!searchText) return true;

  const q = searchText.toLowerCase();
  const authorName = `${article.author?.firstName || ""} ${article.author?.lastName || ""}`.trim().toLowerCase();

  return [article.title, article.content, article.category, article.author?.email, authorName]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(q));
};

const sortArticles = (articlesList, sortKey) => {
  const list = [...articlesList];

  if (sortKey === "oldest") {
    return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (sortKey === "popular") {
    return list.sort((a, b) => (b.views || 0) - (a.views || 0) || (b.comments?.length || 0) - (a.comments?.length || 0));
  }

  if (sortKey === "comments") {
    return list.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
  }

  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const buildRecommendationFeed = (articlesList, userBookmarks) => {
  const bookmarkedCategories = new Map();

  for (const bookmarkedArticle of userBookmarks) {
    if (!bookmarkedArticle?.category) continue;
    bookmarkedCategories.set(
      bookmarkedArticle.category,
      (bookmarkedCategories.get(bookmarkedArticle.category) || 0) + 1,
    );
  }

  return articlesList
    .map((article) => {
      let score = 0;
      score += (bookmarkedCategories.get(article.category) || 0) * 4;
      score += Math.min(article.views || 0, 500) / 100;
      score += Math.min(article.comments?.length || 0, 40) * 0.75;
      score -= Math.min(article.reportCount || 0, 10) * 2;

      const ageInDays = (Date.now() - new Date(article.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 7 - ageInDays) * 0.5;

      return { article, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((entry) => ({
      ...(entry.article.toObject ? entry.article.toObject() : entry.article),
      recommendationScore: Number(entry.score.toFixed(2)),
    }));
};

//Read articles of all authors
userApp.get("/articles", verifyToken("USER"), async (req, res) => {
  const { q = "", category = "", sort = "newest" } = req.query;
  const articlesList = await ArticleModel.find({ isArticleActive: true }).populate(populateArticle);

  const visibleArticles = articlesList
    .filter(articleIsVisible)
    .filter((article) => {
      if (!category) return true;
      return String(article.category || "").toLowerCase() === String(category).toLowerCase();
    })
    .filter((article) => matchesSearch(article, q));

  const payload = sortArticles(visibleArticles, sort);

  res.status(200).json({ message: "artciles", payload });
});

userApp.get("/article/:id", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const article = await ArticleModel.findById(req.params.id).populate(populateArticle);

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  const ownerId = article.author?._id || article.author;
  const isOwner = String(ownerId) === String(req.user.id);
  const canView = req.user.role === "ADMIN" || isOwner || articleIsVisible(article);

  if (!canView) {
    return res.status(403).json({ message: "You are not authorized to view this article" });
  }

  await ArticleModel.updateOne({ _id: article._id }, { $inc: { views: 1 } });
  article.views += 1;

  const user = await UserModel.findById(req.user.id).select("bookmarks");
  const isBookmarked = user?.bookmarks?.some((bookmarkId) => String(bookmarkId) === String(article._id));

  res.status(200).json({ message: "article fetched", payload: { ...article.toObject(), isBookmarked } });
});

//Add comment to an article
userApp.put("/articles", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const { articleId, comment } = req.body;
  const articleDocument = await ArticleModel.findOne({ _id: articleId, isArticleActive: true }).populate(populateArticle);

  if (!articleDocument) {
    return res.status(404).json({ message: "Article not found" });
  }

  const userId = req.user?.id;
  articleDocument.comments.push({ user: userId, comment: comment });
  await articleDocument.save();

  const authorId = articleDocument.author?._id || articleDocument.author;
  await UserModel.updateOne(
    { _id: authorId },
    {
      $push: {
        notifications: {
          type: "comment",
          message: `${req.user.firstName || "A reader"} commented on ${articleDocument.title}`,
          entityType: "article",
          entityId: articleDocument._id,
        },
      },
    },
  );

  const refreshedArticle = await ArticleModel.findById(articleDocument._id).populate(populateArticle);
  res.status(200).json({ message: "Comment added successfully", payload: refreshedArticle });
});

userApp.post("/bookmarks", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const { articleId } = req.body;
  const article = await ArticleModel.findById(articleId);

  if (!article || (!articleIsVisible(article) && String(article.author) !== String(req.user.id) && req.user.role !== "ADMIN")) {
    return res.status(404).json({ message: "Article not found" });
  }

  const user = await UserModel.findById(req.user.id).select("bookmarks");
  const bookmarkExists = user.bookmarks.some((bookmarkId) => String(bookmarkId) === String(articleId));

  if (bookmarkExists) {
    user.bookmarks = user.bookmarks.filter((bookmarkId) => String(bookmarkId) !== String(articleId));
  } else {
    user.bookmarks.push(articleId);
  }

  await user.save();

  const bookmarksDoc = await UserModel.findById(req.user.id).populate({ path: "bookmarks", populate: populateArticle });

  return res.status(200).json({
    message: bookmarkExists ? "Bookmark removed" : "Bookmark added",
    payload: {
      bookmarked: !bookmarkExists,
      bookmarks: bookmarksDoc?.bookmarks || [],
    },
  });
});

userApp.get("/bookmarks", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate({ path: "bookmarks", populate: populateArticle });

  const bookmarks = (user?.bookmarks || [])
    .filter((article) => article && articleIsVisible(article))
    .map((article) => ({ ...article.toObject(), isBookmarked: true }));

  return res.status(200).json({ message: "bookmarks fetched", payload: bookmarks });
});

userApp.get("/notifications", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const user = await UserModel.findById(req.user.id).select("notifications");
  return res.status(200).json({ message: "notifications fetched", payload: user?.notifications || [] });
});

userApp.patch("/notifications/:notificationId/read", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const { notificationId } = req.params;

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: req.user.id, "notifications._id": notificationId },
    { $set: { "notifications.$.isRead": true } },
    { new: true },
  ).select("notifications");

  return res.status(200).json({ message: "notification updated", payload: updatedUser?.notifications || [] });
});

userApp.patch("/notifications/read-all", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    { $set: { "notifications.$[].isRead": true } },
    { new: true },
  ).select("notifications");

  return res.status(200).json({ message: "notifications updated", payload: updatedUser?.notifications || [] });
});

userApp.post("/articles/report", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const { articleId, reason } = req.body;
  const article = await ArticleModel.findById(articleId);

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  article.reports.push({ user: req.user.id, reason: reason || "Reported by user" });
  article.reportCount += 1;
  await article.save();

  await UserModel.updateMany(
    { role: "ADMIN" },
    {
      $push: {
        notifications: {
          type: "moderation",
          message: `Article ${article.title} was reported`,
          entityType: "article",
          entityId: article._id,
        },
      },
    },
  );

  return res.status(200).json({ message: "Article reported", payload: article });
});

userApp.get("/recommendations", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate({
    path: "bookmarks",
    populate: populateArticle,
  });

  const articlesList = await ArticleModel.find({ isArticleActive: true }).populate(populateArticle);
  const visibleArticles = articlesList.filter(articleIsVisible);
  const recommended = buildRecommendationFeed(visibleArticles, user?.bookmarks || []);

  return res.status(200).json({ message: "recommendations fetched", payload: recommended });
});