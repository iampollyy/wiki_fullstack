import { IArticle } from "@shared/ui/articleCard/model/TArticle.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from './article.module.scss';
export const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<IArticle | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/articles/${id}`)
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(data => setArticle(data))
      .catch(error => console.error('Failed to load article:', error));
  }, [id]);

    
  return (
    <section className={styles.article__content}>
      <h1 className={styles.article__title}>{article?.title}</h1>
      <h2 className={styles.article__subtitle}>Roles</h2>
      {
        article?.knownFor.map((role, index) => (
          <p key={index} className={styles.article__text}>{role}</p>
        ))
      }
        
    

      <h2 className={styles.article__subtitle}>Birth info</h2>
      <p className={styles.article__text}>{article?.birthYear}</p>

      <p className={styles.article__text}>{article?.content}</p>
    </section>
  );
};
