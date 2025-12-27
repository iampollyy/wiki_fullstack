import { CommentList } from "@shared/ui/commentList/CommentList";
import styles from "./discussionPage.module.scss";
import { CommentForm } from "@features/createComment/CommentForm";
import { useEffect, useState } from "react";
import { IComment } from "@entities/comment/model/IComment";
import { useParams } from "react-router-dom";

export const DiscussionPage = () => {
  const { id } = useParams();
  const [comments, setComments] = useState<IComment[]>([]);

  const loadComments = () => {
    if (!id) return;
    fetch(`http://localhost:5000/comments/article/${id}`)
      .then((response) => response.json())
      .then((data) =>
        setComments(
          data.sort(
            (a: IComment, b: IComment) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      )
      .catch((error) => console.error("Failed to load comments:", error));
  };

  useEffect(() => {
    loadComments();
  }, [id]);

  return (
    <section className={styles.discussionPage}>
      <h1 className={styles.discussionPage__title}>Discussion Page</h1>
      <CommentForm onCommentAdded={loadComments} />

      <div className={styles.discussionPage__wrapper}>
        <CommentList comments={comments} onUpdate={loadComments} />
      </div>
    </section>
  );
};
