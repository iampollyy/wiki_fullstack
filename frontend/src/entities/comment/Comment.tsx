import { Button } from "@shared/ui/button/Button";
import styles from "./comment.module.scss";
import { IComment } from "./model/IComment";
import delete_icon from "@assets/icons/delete_icon.svg";
import edit_icon from "@assets/icons/edit_icon.svg";

export const Comment = ({ comment }: { comment: IComment }) => {
  return (
    <div className={styles.comment}>
      <div className={styles.comment__wrapper}>
        <div className={styles.comment__header}>
          <div className={styles.comment__info}>
            <p className={styles.comment__author}>
              {comment.author || "John Doe"}
            </p>
            <p className={styles.comment__date}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className={styles.comment__actions}>
            <Button variant="tertiary">
              <img src={edit_icon} alt="Edit" />
            </Button>
            <Button variant="tertiary">
              <img src={delete_icon} alt="Delete" />
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.comment__content}>
        <p>{comment.content}</p>
      </div>
    </div>
  );
};
