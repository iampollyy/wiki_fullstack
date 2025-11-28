import { IComment } from "@entities/comment/model/IComment";

export interface IArticle {
  id: string | number;
  title: string;
  content: string;
  attachments?: string[];
  comments?: IComment[];
}
