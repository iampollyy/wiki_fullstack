import { IArticleVersion } from "@shared/ui/versionList/model/IArticleVersion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./articleVersion.module.scss";
import { FilePreviewList } from "@shared/ui/preview/FilePreviewList";
import { VersionSubmenu } from "@shared/ui/versionSubmenu/versionSubmenu";
import { apiFetch } from "@shared/utils/fetch";

export const ArticleVersion = () => {
  const { id, versionId } = useParams();
  const [version, setVersion] = useState<IArticleVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !versionId) return;

    const loadVersion = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch(`articles/${id}/versions/${versionId}`);
        const data = await response.json();

        setVersion(data);
      } catch (err) {
        console.error("Failed to load version:", err);
        setError(err instanceof Error ? err.message : "Failed to load version");
      } finally {
        setLoading(false);
      }
    };

    loadVersion();
  }, [id, versionId]);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className={styles.articleVersion}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.articleVersion}>
        <div className={styles.error}>Error: {error}</div>
        <Link to={`/articles/${id}`} className={styles.backLink}>
          Back to current version
        </Link>
      </div>
    );
  }

  if (!version) {
    return <div className={styles.articleVersion}>Version not found</div>;
  }

  return (
    <section className={styles.articleVersion}>
      <div className={styles.versionBanner}>
        <div className={styles.versionBannerContent}>
          <span className={styles.versionBadge}>
            Version {version.versionNumber} (Historical)
          </span>
          <span className={styles.versionDate}>
            Created: {formatDate(version.createdAt)}
          </span>
        </div>
        <Link to={`/articles/${id}`} className={styles.currentVersionLink}>
          View current version →
        </Link>
      </div>

      <h1 className={styles.articleVersion__title}>{version.title}</h1>

      <div className={styles.articleVersion__actions}>
        <div className={styles.articleVersion__actionsLeft}>
          <Link
            to={`/articles/${id}/discussion`}
            className={styles.articleVersion__discussionLink}
          >
            Discussion
          </Link>
          <VersionSubmenu articleId={id!} />
        </div>
        <div className={styles.articleVersion__actionsRight}>
          <span className={styles.readOnlyNotice}>Read-only version</span>
        </div>
      </div>

      <FilePreviewList files={version.attachments || []} onRemove={() => {}} />

      <div
        className={styles.articleVersion__description}
        dangerouslySetInnerHTML={{ __html: version.content }}
      />
    </section>
  );
};
