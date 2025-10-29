import { useState, useEffect } from "react";
import { ArticleCard } from "@shared/ui/articleCard/ArticleCard";
import styles from "./articles.module.scss";

export const Articles = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/articles")
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => setArticles(data))
      .catch((error) => console.error(error));
  }, []);

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
