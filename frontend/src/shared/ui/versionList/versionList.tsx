import { IArticleVersion } from "./model/IArticleVersion";
import styles from "./versionList.module.scss";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@shared/utils/fetch";

export const VersionList = ({ articleId }: { articleId: string | number }) => {
  const [versions, setVersions] = useState<IArticleVersion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId) return;

    const loadVersions = async () => {
      try {
        setError(null);

        const response = await apiFetch(`articles/${articleId}/versions`);
        const data = await response.json();

        setVersions(data);
      } catch (err) {
        console.error("Error fetching versions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load versions"
        );
      }
    };

    loadVersions();
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
          <Link
            to={`/articles/${articleId}/versions/id/${version.id}`}
            className={styles.fullLink}
          />

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
