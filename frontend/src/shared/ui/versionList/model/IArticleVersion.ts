export interface IArticleVersion {
  id: number;
  articleId: number;
  versionNumber: number;

  title: string;
  content: string;

  attachments: any[] | null;

  workspaceId: number | null;

  createdAt: Date;
  updatedAt: Date;
}
