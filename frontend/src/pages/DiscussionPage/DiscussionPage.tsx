import { CommentList } from "@shared/ui/commentList/CommentList";
import styles from "./discussionPage.module.scss";

export const DiscussionPage = () => {
  return (
    <section className={styles.discussionPage}>
      <h1 className={styles.discussionPage__title}>Discussion Page</h1>

      <div className={styles.discussionPage__wrapper}>
        <CommentList comments={[]} />
      </div>
    </section>
  );
};
