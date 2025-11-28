import styles from "./commentForm.module.scss";
import { useState } from "react";
import { Button } from "@shared/ui/button/Button";
import { useParams } from "react-router-dom";
import { useToast } from "@shared/ui/toast/ToastContext";

export const CommentForm = () => {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const { id } = useParams();
  const toast = useToast();

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
    fetch(`http://localhost:5000/comments/article/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ author: name, content }),
    })
      
      .then((response) => response.json())
      .then(() => setContent(""))
      .then(() => setName(""))
      .then(() => toast.showSuccess("Comment added successfully!"))
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
