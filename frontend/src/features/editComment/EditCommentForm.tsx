import { useState } from "react";
import { Button } from "@shared/ui/button/Button";
import { useToast } from "@shared/ui/toast/ToastContext";
import styles from "./editCommentForm.module.scss";
import { apiFetch } from "@shared/utils/fetch";

interface EditCommentFormProps {
  commentId: string;
  initialContent: string;
  onSave: () => void;
  onCancel: () => void;
}

export const EditCommentForm = ({
  commentId,
  initialContent,
  onSave,
  onCancel,
}: EditCommentFormProps) => {
  const toast = useToast();
  const [content, setContent] = useState(initialContent);

  const handleUpdateComment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!content.trim()) {
      toast.showError("Comment content cannot be empty");
      return;
    }

    try {
      await apiFetch(`comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify({ content }),
      });

      toast.showSuccess("Comment updated successfully");
      onSave();
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.showError("Failed to update comment");
    }
  };

  return (
    <form onSubmit={handleUpdateComment}>
      <textarea
        name="edit_content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textarea_edit}
      />
      <div className={styles.buttonGroup}>
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="button" variant="tertiary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
