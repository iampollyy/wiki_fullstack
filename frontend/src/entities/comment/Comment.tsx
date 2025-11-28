import styles from './comment.module.scss';
import { IComment } from './model/IComment';

export const Comment = ({ comment }: { comment: IComment }) => {
  return (
    <div className={styles.comment}>
      <div className={styles.comment__wrapper}>
       <div className={styles.comment__header}>
        <p className={styles.comment__author}>
          {comment.author || "John Doe"}
          </p>
          <p className={styles.comment__date}>
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className={styles.comment__content}>
         <p>{comment.content}</p>
        </div>
      </div>
    </div>
   
  );
}