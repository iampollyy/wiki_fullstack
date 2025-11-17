import { Button } from "@shared/ui/button/Button";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./quillEditor.module.scss";

interface QuillEditorProps {
  mode?: "create" | "edit";
  initialData?: any;
  articleId?: string | number;
  onSubmitSuccess?: (data: any) => void;
  onCancel?: () => void;
  isBeingEdited?: boolean;
}

export function QuillEditor({
  mode = "create",
  initialData = {},
  articleId,
  onSubmitSuccess,
  onCancel,
  isBeingEdited = false,
}: QuillEditorProps) {
  
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter a title and content for the article!");
      return;
    }

    const articleData = {
      title,
      content,
    };

    const isEdit = mode === "edit" && articleId;
    const url = isEdit
      ? `http://localhost:5000/articles/${articleId}`
      : "http://localhost:5000/articles";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        throw new Error(`Error saving article (${response.status})`);
      }

      const result = await response.json();
      if (onSubmitSuccess) onSubmitSuccess(result);

      if (mode === "create") {
        setTitle("");
        setContent("");
      }
    } catch (err) {
      console.error("Error saving article:", err);
      alert("Failed to save article.");
    }
  };

  return (
    <>
      <h2 className={styles.article__title}>
        {mode === "edit" ? "Edit article" : "Create a new article"}
      </h2>

      <input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        className={`h-64 mb-6 ${styles.quillEditor}`}
      />

      <div className={styles.editor__actions}>
        <Button size="sm" onClick={handleSubmit}>
          {mode === "edit" ? "Update" : "Add article"}
        </Button>

        {isBeingEdited && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onCancel && onCancel()}
          >
            Cancel
          </Button>
        )}
      </div>
    </>
  );
}
