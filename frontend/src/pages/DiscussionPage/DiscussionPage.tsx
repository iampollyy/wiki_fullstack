import { CommentList } from "@shared/ui/commentList/CommentList";
import styles from "./discussionPage.module.scss";
import { CommentForm } from "@features/createComment/CommentForm";
import { useEffect, useState } from "react";
import { IComment } from "@entities/comment/model/IComment";
import { useParams } from "react-router-dom";
import { apiFetch } from "@shared/utils/fetch";

export const DiscussionPage = () => {
  const { id } = useParams();
  const [comments, setComments] = useState<IComment[]>([]);

  const loadComments = async () => {
    if (!id) return;

    try {
      const response = await apiFetch(`comments/article/${id}`);
      const data: IComment[] = await response.json();

      setComments(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
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
