import { useState, useEffect } from "react";
import { ArticleCard } from "@shared/ui/articleCard/ArticleCard";
import styles from "./articles.module.scss";

export const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:5000/articles");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section aria-labelledby="articlesListRes" className={styles.articlesPage}>
      <h2 className="sr-only" id="articlesListRes">
        Articles Results
      </h2>

      <ul className={styles.articlesList}>
        {articles
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
      </ul>
    </section>
  );
};
