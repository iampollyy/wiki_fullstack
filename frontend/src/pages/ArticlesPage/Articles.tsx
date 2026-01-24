import { useState, useEffect, useRef } from "react";
import { ArticleCard } from "@shared/ui/articleCard/ArticleCard";
import styles from "./articles.module.scss";
import { apiFetch } from "@shared/utils/fetch";
import { IArticle } from "@shared/ui/articleCard/model/TArticle";
import { SearchForm } from "@features/search/SearchForm";

const DEBOUNCE_MS = 300;

export const Articles = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    const delay = searchQuery.trim() ? DEBOUNCE_MS : 0;
    const tid = setTimeout(() => {
      (async () => {
        setLoading(true);
        try {
          const url = searchQuery.trim()
            ? `articles?search=${encodeURIComponent(searchQuery.trim())}`
            : "articles";
          const r = await apiFetch(url);
          if (cancelledRef.current) return;
          const data = await r.json();
          if (cancelledRef.current) return;
          setArticles(data);
          setError(null);
        } catch (e) {
          if (cancelledRef.current) return;
          setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
          if (!cancelledRef.current) setLoading(false);
        }
      })();
    }, delay);
    return () => {
      cancelledRef.current = true;
      clearTimeout(tid);
    };
  }, [searchQuery]);

  return (
    <section aria-labelledby="articlesListRes" className={styles.articlesPage}>
      <h2 className="sr-only" id="articlesListRes">
        Articles
      </h2>

      <SearchForm value={searchQuery} onChange={setSearchQuery} />

      {loading && articles.length === 0 ? (
        <p className={styles.articlesHint}>Loading…</p>
      ) : loading && articles.length > 0 ? (
        <p className={styles.articlesHint}>Updating results…</p>
      ) : error ? (
        <p className={styles.articlesEmpty}>Error: {error}</p>
      ) : null}

      <ul className={styles.articlesList}>
        {articles
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
      </ul>

      {!loading && !error && articles.length === 0 && (
        <p className={styles.articlesEmpty}>
          {searchQuery.trim()
            ? "No articles match your search."
            : "No articles yet."}
        </p>
      )}
    </section>
  );
};
