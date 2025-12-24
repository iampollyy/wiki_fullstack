import styles from "./commentForm.module.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@core/store/store";
import { Button } from "@shared/ui/button/Button";
import { useParams } from "react-router-dom";
import { useToast } from "@shared/ui/toast/ToastContext";

interface CommentFormProps {
  onCommentAdded?: () => void;
}

export const CommentForm = ({ onCommentAdded }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const { id } = useParams();
  const toast = useToast();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.showError("Name and comment are required");
      return;
    }
    if (!id) {
      toast.showWarning("Article ID not found in URL");
      return;
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`http://localhost:5000/comments/article/${id}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ content }),
    })
      
      .then((response) => response.json())
      .then(() => {
        setContent("");
        setName("");
        toast.showSuccess("Comment added successfully!");
        if (onCommentAdded) {
          onCommentAdded();
        }
      })
      .catch((error) => console.error("Failed to create comment:", error));
  };

  return (
    <>
      <form className={styles.commentForm} onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
        </label>

        <label>
          Comment:
          <textarea
            name="comment_text"
            placeholder="Type your comment here..."
            value={content}
            onChange={handleContentChange}
          />
        </label>
        <Button type="submit" size="sm">
          Comment
        </Button>
      </form>
    </>
  );
};
