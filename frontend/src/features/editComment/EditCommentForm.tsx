import { useState } from "react";
import { Button } from "@shared/ui/button/Button";
import { useToast } from "@shared/ui/toast/ToastContext";
import styles from "./editCommentForm.module.scss";

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

  const handleUpdateComment = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!content.trim()) {
      toast.showError("Comment content cannot be empty");
      return;
    }

    fetch(`http://localhost:5000/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update comment");
        }
        return response.json();
      })
      .then(() => {
        toast.showSuccess("Comment updated successfully");
        onSave();
      })
      .catch((error) => {
        console.error("Error updating comment:", error);
        toast.showError("Failed to update comment");
      });
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
        <Button type="submit" size="sm">Save</Button>
        <Button type="button" variant="tertiary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
