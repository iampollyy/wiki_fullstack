import { Button } from "@shared/ui/button/Button";
import styles from "./comment.module.scss";
import { IComment } from "./model/IComment";
import delete_icon from "@assets/icons/delete_icon.svg";
import edit_icon from "@assets/icons/edit_icon.svg";
import { useToast } from "@shared/ui/toast/ToastContext";
import { useState } from "react";
import { EditCommentForm } from "@features/editComment/EditCommentForm";

interface CommentProps {
  comment: IComment;
  onUpdate?: () => void;
}

export const Comment = ({ comment, onUpdate }: CommentProps) => {
  const toast = useToast();
  const [isEditingComment, setIsEditingComment] = useState(false);

  const handleDeleteComment = () => {
    if (!comment.id) return;

    fetch(`http://localhost:5000/comments/${comment.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete comment");
        }
      })
      .then(() => {
        toast.showSuccess("Comment deleted successfully");
        if (onUpdate) {
          onUpdate();
        }
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
        toast.showError("Failed to delete comment");
      });
  };

  const handleEditComment = () => {
    setIsEditingComment(true);
  };

  const handleSaveSuccess = () => {
    setIsEditingComment(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleCancelEdit = () => {
    setIsEditingComment(false);
  };

  return isEditingComment ? (
    <div className={styles.comment}>
      <EditCommentForm
        commentId={comment.id}
        initialContent={comment.content}
        onSave={handleSaveSuccess}
        onCancel={handleCancelEdit}
      />
    </div>
  ) : (
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
            <Button variant="tertiary" onClick={handleEditComment}>
              <img src={edit_icon} alt="Edit" />
            </Button>
            <Button variant="tertiary" onClick={handleDeleteComment}>
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
