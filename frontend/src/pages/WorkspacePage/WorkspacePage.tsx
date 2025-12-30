import { ArticleCard } from "@shared/ui/articleCard/ArticleCard";
import styles from "./WorkspacePage.module.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { apiFetch } from "@shared/utils/fetch";

export const WorkspacePage = () => {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadWorkspace = async () => {
      try {
        const response = await apiFetch(`workspaces/slug/${slug}`);
        const data = await response.json();

        const filteredArticles = data.articles.filter(
          (article: any) => article.workspaceId
        );

        setWorkspace({
          ...data,
          articles: filteredArticles,
        });
      } catch (error) {
        console.error("Failed to load workspace:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspace();
  }, [slug]);

  if (loading) return <h2>Loading...</h2>;

  if (!workspace) return <h2>No workspace found</h2>;

  return (
    <section>
      <h1 className={styles.workspaceTitle}>{workspace.name}</h1>

      <ul className={styles.workspacePage}>
        {workspace.articles.length === 0 && (
          <p className={styles.workspacePage__emptyList}>No articles yet</p>
        )}

        {workspace.articles.map((article: any) => (
          <li key={article.id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  );
};
