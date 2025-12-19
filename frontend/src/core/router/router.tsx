import { IRoute } from "./model/IRoute";
import { Home } from "@pages/HomePage/Home";
import { Articles } from "@pages/ArticlesPage/Articles";
import { Article } from "@pages/ArticlePage/Article";
import { DiscussionPage } from "@pages/DiscussionPage/DiscussionPage";
import { WorkspacePage } from "@pages/WorkspacePage/WorkspacePage";
import { ArticleVersion } from "@pages/ArticleVersionPage/ArticleVersion";

export const RoutesConfig: IRoute[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/articles",
    element: <Articles />,
  },
  {
    path: "/articles/:id/versions/id/:versionId",
    element: <ArticleVersion />,
  },
  {
    path: "/articles/:id/discussion",
    element: <DiscussionPage />,
  },
  {
    path: "/articles/:id",
    element: <Article />,
  },
  {
    path: "/workspace/:slug",
    element: <WorkspacePage />,
  },
];
