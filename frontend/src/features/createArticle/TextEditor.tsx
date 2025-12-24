import { Button } from "@shared/ui/button/Button";
import { FilePreviewList } from "@shared/ui/preview/FilePreviewList";
import { useToast } from "@shared/ui/toast/ToastContext";
import { useSelector } from "react-redux";
import { RootState } from "@core/store/store";
import { useMemo, useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./textEditor.module.scss";

interface TextEditorProps {
  mode?: "create" | "edit";
  initialData?: any;
  articleId?: string | number;
  onSubmitSuccess?: (data: any) => void;
  onCancel?: () => void;
  isBeingEdited?: boolean;
}

const Quill = ReactQuill.Quill;

export function TextEditor({
  mode = "create",
  initialData = {},
  articleId,
  onSubmitSuccess,
  onCancel,
  isBeingEdited = false,
}: TextEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [workspaceSlug, setWorkspaceSlug] = useState(
    initialData?.workspace?.slug ?? ""
  );
  const [attachments, setAttachments] = useState<string[]>(
    initialData?.attachments ?? []
  );

  const toast = useToast();
  const token = useSelector((state: RootState) => state.auth.token);
  const quillRef = useRef<any>(null);
  const attachmentRef = useRef<HTMLInputElement | null>(null);

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
          ["link"],
          ["clean"],
        ],
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
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://localhost:5000/articles/upload-attachment",
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      if (!response.ok) {
        toast.showError(
          "Failed to upload attachment. Please check your file and try again."
        );
        throw new Error(`Upload failed (${response.status})`);
      }

      const { url } = await response.json();

      setAttachments((prev) => [...prev, url]);
      toast.showSuccess("Attachment uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
    }

    event.target.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.showWarning("Please enter a title and content for the article!");
      return;
    }

    const articleData = {
      title,
      content,
      attachments: attachments,
      workspaceSlug: workspaceSlug || null,
    };

    const isEdit = mode === "edit" && articleId;
    const url = isEdit
      ? `http://localhost:5000/articles/${articleId}`
      : "http://localhost:5000/articles";
    const method = isEdit ? "PUT" : "POST";

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
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
        setWorkspaceSlug("");
        setAttachments([]);
        toast.showSuccess("Article created successfully!");
      } else {
        toast.showSuccess("Article updated successfully!");
      }
    } catch (err) {
      console.error("Error saving article:", err);
      toast.showError("Failed to save article.");
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
      <input
        type="text"
        placeholder="Slug"
        value={workspaceSlug}
        onChange={(e) => setWorkspaceSlug(e.target.value)}
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

      <div className={styles.attachmentField}>
        <input
          id="attachment-input"
          type="file"
          ref={attachmentRef}
          className={styles.attachmentInputHidden}
          onChange={handleAttachment}
        />
        <Button
          size="sm"
          onClick={() => attachmentRef.current?.click()}
          className={styles.attachmentTrigger}
        >
          + Add attachment
        </Button>
      </div>
      <FilePreviewList
        files={attachments}
        onRemove={(index) => {
          setAttachments((prev) => prev.filter((_, i) => i !== index));
        }}
        mode={isBeingEdited ? "edit" : "view"}
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
