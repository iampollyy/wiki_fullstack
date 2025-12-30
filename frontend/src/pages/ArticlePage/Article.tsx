import { IArticle } from "@shared/ui/articleCard/model/TArticle";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./article.module.scss";
import { Button } from "@shared/ui/button/Button";
import { TextEditor } from "@features/createArticle/TextEditor";
import { FilePreviewList } from "@shared/ui/preview/FilePreviewList";
import { VersionSubmenu } from "@shared/ui/versionSubmenu/versionSubmenu";
import { apiFetch } from "@shared/utils/fetch";

export const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<IArticle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const loadArticle = async () => {
      try {
        const response = await apiFetch(`articles/${id}`);
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error("Failed to load article:", error);
      }
    };

    loadArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!article && !id) return;
    const articleId = article?.id ?? id;

    try {
      await apiFetch(`articles/${articleId}`, {
        method: "DELETE",
      });

      setArticle(null);
      navigate("/articles", { replace: true });
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveSuccess = (updatedArticle: IArticle) => {
    setArticle(updatedArticle);
    setIsEditing(false);
  };

  if (!article) return <p>Loading...</p>;

  return (
    <section className={styles.article__content}>
      {isEditing ? (
        <TextEditor
          mode="edit"
          articleId={id}
          initialData={article}
          onSubmitSuccess={handleSaveSuccess}
          isBeingEdited={isEditing}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <h1 className={styles.article__title}>{article.title}</h1>

          <div className={styles.article__actions}>
            <div className={styles.article__actionsLeft}>
              <Link
                to={`/articles/${article.id}/discussion`}
                className={styles.article__discussionLink}
              >
                Discussion
              </Link>

              <VersionSubmenu articleId={article.id} />
            </div>
            <div className={styles.article__actionsRight}>
              <Button variant="tertiary" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="tertiary" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>

          <FilePreviewList
            files={article.attachments || []}
            onRemove={() => {}}
          />

          <div
            className={styles.article__description}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </>
      )}
    </section>
  );
};
