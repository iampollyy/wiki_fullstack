export interface IComment {
  id: string;
  articleId: string;
  author?: string;
  content: string;
  createdAt: string;
}