import { IArticle } from "@shared/ui/articleCard/model/TArticle.ts";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./article.module.scss";
import { Button } from "@shared/ui/button/Button";
export const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<IArticle | null>(null);
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
        console.log(data);
      })
      .catch((error) => console.error("Failed to load article:", error));
  }, [id]);

  if (!article) return null;

  const handleEdit = () => {};
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

  return (
    <section className={styles.article__content}>
      <h1 className={styles.article__title}>{article.title}</h1>
      <div className={styles.article__actions}>
        <Button variant="tertiary" onClick={handleEdit}>
          Edit
        </Button>
        <Button variant="tertiary" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <h2 className={styles.article__subtitle}>Roles</h2>
      {article.knownFor.map((role, index) => (
        <p key={index} className={styles.article__text}>
          {role}
        </p>
      ))}

      <h2 className={styles.article__subtitle}>Birth info</h2>
      <p className={styles.article__text}>{article.birthYear}</p>

      <p
        className={styles.contentDescription}
        dangerouslySetInnerHTML={{
          __html: article.content,
        }}
      ></p>
    </section>
  );
};
