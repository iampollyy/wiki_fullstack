import { IArticle } from "@shared/ui/articleCard/model/TArticle";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./article.module.scss";
import { Button } from "@shared/ui/button/Button";
import { QuillEditor } from "@features/createArticle/QuillEditor";

export const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<IArticle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/articles/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        setArticle(data);
        console.log("Loaded article:", data);
      })
      .catch((error) => console.error("Failed to load article:", error));
  }, [id]);

  const handleDelete = () => {
    if (!article && !id) return;
    const articleId = article?.id ?? id;

    fetch(`http://localhost:5000/articles/${articleId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(() => {
        setArticle(null);
        navigate("/articles", { replace: true });
      })
      .catch((error) => console.error("Failed to delete article:", error));
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
        <>
          <QuillEditor
            mode="edit"
            articleId={id}
            initialData={article}
            onSubmitSuccess={handleSaveSuccess}
            isBeingEdited={isEditing}
            onCancel={() => setIsEditing(false)}
          />
        </>
      ) : (
        <>
          <h1 className={styles.article__title}>{article.title}</h1>

          <div className={styles.article__actions}>
            <Button variant="tertiary" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="tertiary" onClick={handleDelete}>
              Delete
            </Button>
          </div>
          <div
            className={styles.article__description}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </>
      )}
    </section>
  );
};
