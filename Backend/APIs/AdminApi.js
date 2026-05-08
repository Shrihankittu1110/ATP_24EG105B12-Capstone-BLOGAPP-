import exp from 'express'
import { verifyToken } from '../middleware/VerifyToken.js'
import { UserModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'

export const adminApp = exp.Router()

const populateArticle = [
  { path: 'author', select: 'firstName lastName email profileImageUrl bio website' },
  { path: 'comments.user', select: 'firstName lastName email profileImageUrl' },
  { path: 'reports.user', select: 'firstName lastName email' },
]

const isVisibleArticle = (article) => {
  if (!article?.isArticleActive) return false
  if (article.status === 'draft') return false
  if (article.status === 'scheduled') {
    return article.publishAt && new Date(article.publishAt).getTime() <= Date.now()
  }
  return true
}

//read emails of users and authors
adminApp.get('/users', verifyToken("ADMIN"), async (req, res) => {

  //get users and authors emails only
  const usersList = await UserModel.find(
    { role: { $in: ["USER", "AUTHOR"] } }, //filter roles
    { email: 1, role: 1, isUserActive: 1, _id: 0 } //show only needed fields
  )

  //send response
  res.status(200).json({message: "Users and authors details fetched successfully",payload: usersList})
})

//block or activate user or author
adminApp.patch('/user', verifyToken("ADMIN"), async (req, res) => {

  //get email and status from client
  const { email, isUserActive } = req.body

  //find user by email
  const user = await UserModel.findOne({ email: email })

  //check if user exists
  if (!user) {
    return res.status(404).json({message: "User not found"})
  }
  //update user status
  user.isUserActive = isUserActive
  await user.save()
  //send response
  res.status(200).json({message: "User status updated successfully",payload: user})
})

//read all articles for admin dashboard
adminApp.get('/articles', verifyToken("ADMIN"), async (req, res) => {
  const articlesList = await ArticleModel.find()
    .populate(populateArticle)
    .sort({ createdAt: -1 })

  res.status(200).json({ message: "Articles fetched successfully", payload: articlesList })
})

//block or activate article
adminApp.patch('/article', verifyToken("ADMIN"), async (req, res) => {
  const { articleId, isArticleActive } = req.body

  const article = await ArticleModel.findById(articleId)
  if (!article) {
    return res.status(404).json({ message: "Article not found" })
  }

  article.isArticleActive = isArticleActive
  await article.save()

  await UserModel.updateOne(
    { _id: article.author },
    {
      $push: {
        notifications: {
          type: 'moderation',
          message: `Your article "${article.title}" was ${isArticleActive ? 'restored' : 'hidden'} by admin`,
          entityType: 'article',
          entityId: article._id,
        },
      },
    },
  )

  res.status(200).json({ message: "Article status updated successfully", payload: article })
})

adminApp.get('/analytics', verifyToken('ADMIN'), async (req, res) => {
  const [users, articles] = await Promise.all([
    UserModel.find({ role: { $in: ['USER', 'AUTHOR'] } }),
    ArticleModel.find().populate(populateArticle),
  ])

  const activeUsers = users.filter((user) => user.isUserActive).length
  const blockedUsers = users.length - activeUsers
  const authors = users.filter((user) => user.role === 'AUTHOR').length
  const readers = users.filter((user) => user.role === 'USER').length

  const activeArticles = articles.filter((article) => article.isArticleActive).length
  const visibleArticles = articles.filter(isVisibleArticle)
  const draftArticles = articles.filter((article) => article.status === 'draft').length
  const scheduledArticles = articles.filter((article) => article.status === 'scheduled').length
  const totalReports = articles.reduce((total, article) => total + (article.reportCount || 0), 0)
  const totalViews = articles.reduce((total, article) => total + (article.views || 0), 0)
  const totalBookmarks = users.reduce((total, user) => total + (user.bookmarks?.length || 0), 0)

  const categoryMap = new Map()
  const authorMap = new Map()

  articles.forEach((article) => {
    categoryMap.set(article.category, (categoryMap.get(article.category) || 0) + 1)
    const authorName = `${article.author?.firstName || 'Unknown'} ${article.author?.lastName || ''}`.trim() || 'Unknown'
    authorMap.set(authorName, (authorMap.get(authorName) || 0) + 1)
  })

  const topCategories = [...categoryMap.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const topAuthors = [...authorMap.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const mostViewed = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((article) => ({
      _id: article._id,
      title: article.title,
      views: article.views || 0,
      comments: article.comments?.length || 0,
      reportCount: article.reportCount || 0,
    }))

  res.status(200).json({
    message: 'Analytics fetched successfully',
    payload: {
      summary: {
        totalUsers: users.length,
        activeUsers,
        blockedUsers,
        totalAuthors: authors,
        totalReaders: readers,
        totalArticles: articles.length,
        activeArticles,
        visibleArticles: visibleArticles.length,
        draftArticles,
        scheduledArticles,
        totalReports,
        totalViews,
        totalBookmarks,
      },
      topCategories,
      topAuthors,
      mostViewed,
    },
  })
})