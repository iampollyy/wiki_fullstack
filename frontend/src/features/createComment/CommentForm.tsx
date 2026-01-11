import styles from "./commentForm.module.scss";
import { useState } from "react";
import { Button } from "@shared/ui/button/Button";
import { useParams } from "react-router-dom";
import { useToast } from "@shared/ui/toast/ToastContext";
import { apiFetch } from "@shared/utils/fetch";

interface CommentFormProps {
  onCommentAdded?: () => void;
}

export const CommentForm = ({ onCommentAdded }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const { id } = useParams();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.showError("Name and comment are required");
      return;
    }

    if (!id) {
      toast.showWarning("Article ID not found in URL");
      return;
    }

    try {
      await apiFetch(`comments/article/${id}`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      setContent("");
      toast.showSuccess("Comment added successfully!");
      onCommentAdded?.();
    } catch (error) {
      console.error("Failed to create comment:", error);
      toast.showError("Failed to create comment");
    }
  };

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <label>
        Comment:
        <textarea
          name="comment_text"
          placeholder="Type your comment here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <Button type="submit" size="sm">
        Comment
      </Button>
    </form>
  );
};
