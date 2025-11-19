import { Button } from "@shared/ui/button/Button";
import { useEffect, useMemo, useRef, useState } from "react";
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

const Quill = ReactQuill.Quill;

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
  const [attachments, setAttachments] = useState<File[]>(
    initialData?.attachments ?? []
  );

  const quillRef = useRef<any>(null);
  const attachmentRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const icons = Quill.import("ui/icons") as any;
    icons.attachment = `
      <svg viewBox="0 0 18 18">
        <path d="M4.5,8.5 l4,-4 a2.5,2.5 0 0 1 3.5,3.5 l-4,4 a1.5,1.5 0 0 1-2,-2 l4,-4" fill="none" stroke="currentColor"/>
      </svg>
    `;
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "attachment"], // <- наша кнопка
          ["clean"],
        ],
        handlers: {
          attachment: () => attachmentRef!.current!.click(),
        },
      },
    }),
    []
  );

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
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
  ];

  const handleAttachment = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("attachment", file);

    try {
      const response = await fetch(
        "http://localhost:5000/articles/upload-attachment",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed (${response.status})`);
      }

      const { url } = await response.json();
      console.log("Uploaded URL:", url);

      setAttachments((prev) => [...prev, url]);
    } catch (error) {
      console.error("Upload error:", error);
    }

    event.target.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter a title and content for the article!");
      return;
    }
    let attachmentUrls: string[] = [];

    if (attachments.length) {
      const formData = new FormData();
      attachments.forEach((file) => formData.append("attachments", file));
      try {
        const uploadResp = await fetch(
          "http://localhost:5000/articles/upload-attachments",
          {
            method: "POST",
            body: formData,
          }
        );
        if (!uploadResp.ok) {
          throw new Error(`Upload failed (${uploadResp.status})`);
        }
        const uploadResult = await uploadResp.json();
        attachmentUrls = uploadResult.urls || [];
      } catch (err) {
        console.error("Error uploading attachments:", err);
        alert("Failed to upload attachments.");
        return;
      }
    }

    const articleData = {
      title,
      content,
      attachments: attachmentUrls,
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
      onSubmitSuccess?.(result);

      if (mode === "create") {
        setTitle("");
        setContent("");
        setAttachments([]);
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
        ref={quillRef}
      />

      <input
        type="file"
        ref={attachmentRef}
        style={{ display: "none" }}
        onChange={handleAttachment}
      />
      <div className={styles.editor__actions}>
        <Button size="sm" onClick={handleSubmit}>
          {mode === "edit" ? "Update" : "Add article"}
        </Button>

        {isBeingEdited && (
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </>
  );
}
