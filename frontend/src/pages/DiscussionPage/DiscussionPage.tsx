import { CommentList } from "@shared/ui/commentList/CommentList";
import styles from "./discussionPage.module.scss";
import { CommentForm } from "@features/createComment/CommentForm";
import { useEffect, useState } from "react";
import { IComment } from "@entities/comment/model/IComment";
import { useParams } from "react-router-dom";

export const DiscussionPage = () => {
  const { id } = useParams();
  const [comments, setComments] = useState<IComment[]>([]);
  useEffect(() => {
    fetch(`http://localhost:5000/comments/article/${id}`)
      .then((response) => response.json())
      .then((data) => setComments(data));
  });
  return (
    <section className={styles.discussionPage}>
      <h1 className={styles.discussionPage__title}>Discussion Page</h1>
      <CommentForm />

      <div className={styles.discussionPage__wrapper}>
        <CommentList comments={comments} />
      </div>
    </section>
  );
};
