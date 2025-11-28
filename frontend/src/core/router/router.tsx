import { IRoute } from "./model/IRoute"
import {Home} from "@pages/HomePage/Home"
import {Articles} from "@pages/ArticlesPage/Articles"
import {Article} from "@pages/ArticlePage/Article"
import { DiscussionPage } from "@pages/DiscussionPage/DiscussionPage"

export const RoutesConfig: IRoute[] = [
  {
    path: '/',
    element: <Home/>,
  },
  {
    path: '/articles',
    element: <Articles/>,
  },
  {
    path: '/articles/:id',
    element: <Article/>,
  },
  {
    path: '/articles/:id/discussion',
    element: <DiscussionPage/>,
  },
]
