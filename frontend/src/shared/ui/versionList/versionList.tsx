import { IArticleVersion } from "./model/IArticleVersion";
import styles from "./versionList.module.scss";
import { useState, useEffect } from "react";

export const VersionList = ({ articleId }: { articleId: string | number }) => {
  const [versions, setVersions] = useState<IArticleVersion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setError(null);
        const response = await fetch(
          `http://localhost:5000/articles/${articleId}/versions`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setVersions(data);
      } catch (err) {
        console.error("Error fetching versions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load versions"
        );
      }
    };

    if (articleId) {
      fetchVersions();
    }
  }, [articleId]);

  if (error) {
    return (
      <div className={styles.versionList}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className={styles.versionList}>
        <div className={styles.empty}>No versions available</div>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ul className={styles.versionList}>
      {versions.map((version: IArticleVersion) => (
        <li key={version.id} className={styles.versionItem}>
          <div className={styles.versionContent}>
            <span className={styles.versionNumber}>
              Version {version.versionNumber}
            </span>
            <span className={styles.versionDate}>
              {formatDate(version.createdAt)}
            </span>
          </div>
          {version.title && (
            <div className={styles.versionTitle}>{version.title}</div>
          )}
        </li>
      ))}
    </ul>
  );
};
