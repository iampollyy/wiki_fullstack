import { ArticleCard } from "@shared/ui/articleCard/ArticleCard";
import styles from "./WorkspacePage.module.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

export const WorkspacePage = () => {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:5000/workspaces/slug/${slug}`)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        const filteredArticles = data.articles.filter(
          (article: any) => article.workspaceId
        );
        setWorkspace({
          ...data,
          articles: filteredArticles,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <h2>Loading...</h2>;

  if (!workspace) return <h2>No workspace found</h2>;

  return (
    <section>
      <h1 className={styles.workspaceTitle}>{workspace.name}</h1>
      <ul className={styles.workspacePage}>
        {workspace.articles.length === 0 && <p className={styles.workspacePage__emptyList}>No articles yet</p>}

        {workspace.articles.map((article: any) => (
          <li key={article.id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  );
};
