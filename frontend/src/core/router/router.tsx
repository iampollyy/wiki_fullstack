import { IRoute } from "./model/IRoute";
import { Home } from "@pages/HomePage/Home";
import { Articles } from "@pages/ArticlesPage/Articles";
import { Article } from "@pages/ArticlePage/Article";
import { DiscussionPage } from "@pages/DiscussionPage/DiscussionPage";
import { WorkspacePage } from "@pages/WorkspacePage/WorkspacePage";
import { LoginForm } from "@features/login/LoginForm";
import { ArticleVersion } from "@pages/ArticleVersionPage/ArticleVersion";
import { SignUpForm } from "@features/signUp/SignupForm";

export const RoutesConfig: IRoute[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignUpForm />,
  },
  {
    path: "/articles",
    element: <Articles />,
    isPrivate: true,
  },
  {
    path: "/articles/:id",
    element: <Article />,
    isPrivate: true,
  },
  {
    path: "/articles/:id/versions/id/:versionId",
    element: <ArticleVersion />,
  },
  {
    path: "/articles/:id/discussion",
    element: <DiscussionPage />,
    isPrivate: true,
  },
  {
    path: "/workspace/:slug",
    element: <WorkspacePage />,
    isPrivate: true,
  },
];
