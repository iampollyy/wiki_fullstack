const Comment = require("../db/models/comment");
const Article = require("../db/models/article");
const User = require("../db/models/user");

const mapComment = (comment) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  authorId: comment.authorId,
  author: `${comment.author.firstName} ${comment.author.lastName}`,
});

const getCommentsByArticleId = async (articleId) => {
  const id = parseInt(articleId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid article ID");
  }

  const comments = await Comment.findAll({
    where: { articleId: id },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["firstName", "lastName"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return comments.map(mapComment);
};

const createComment = async ({ articleId, authorId, content }) => {
  const id = parseInt(articleId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid article ID");
  }

  const article = await Article.findByPk(id);
  if (!article) {
    throw new Error("Article not found");
  }

  const comment = await Comment.create({
    articleId: id,
    authorId,
    content,
  });

  const commentWithAuthor = await Comment.findByPk(comment.id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["firstName", "lastName"],
      },
    ],
  });

  return mapComment(commentWithAuthor);
};

const deleteComment = async (commentId, userId) => {
  const id = parseInt(commentId, 10);
  if (isNaN(id)) {
    return false;
  }

  const comment = await Comment.findByPk(id);
  if (!comment) {
    return false;
  }

  if (comment.authorId !== userId) {
    throw new Error("Access denied");
  }

  await comment.destroy();
  return true;
};

const updateComment = async (commentId, updatedData, userId) => {
  const id = parseInt(commentId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid comment ID");
  }

  const comment = await Comment.findByPk(id);
  if (!comment) {
    return null;
  }

  if (comment.authorId !== userId) {
    throw new Error("Access denied");
  }

  await comment.update(updatedData);

  const updatedComment = await Comment.findByPk(id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["firstName", "lastName"],
      },
    ],
  });

  return mapComment(updatedComment);
};

module.exports = {
  getCommentsByArticleId,
  createComment,
  deleteComment,
  updateComment,
};
