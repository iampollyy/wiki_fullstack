import { Link } from "react-router-dom";
import styles from "./ArticleCard.module.scss";
import { IArticle } from "./model/TArticle";

export const ArticleCard = ({ article }: { article: IArticle }) => {
  const id = article.id;

  return (
    <section className={styles.listing}>
      <div className={styles.text}>
        <h3 className={styles.listingHeading}>
          <Link to={`/articles/${id}`} aria-describedby={`desc-${id}`}>
            {article.title}
          </Link>
        </h3>
        <p
          className={styles.contentDescription}
          dangerouslySetInnerHTML={{
            __html: article.content.slice(0, 200) + "...",
          }}
        >
        </p>
      </div>
    </section>
  );
};
