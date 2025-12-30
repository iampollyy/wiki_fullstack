import { Button } from "@shared/ui/button/Button";
import { FilePreviewList } from "@shared/ui/preview/FilePreviewList";
import { useToast } from "@shared/ui/toast/ToastContext";
import { useSelector } from "react-redux";
import { RootState } from "@core/store/store";
import { useMemo, useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./textEditor.module.scss";
import { apiFetch } from "@shared/utils/fetch";

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

  const handleAttachment = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("attachment", file);

    try {
      const response = await apiFetch("articles/upload-attachment", {
        method: "POST",
        body: formData,
      });

      const { url } = await response.json();

      setAttachments((prev) => [...prev, url]);
      toast.showSuccess("Attachment uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.showError(
        "Failed to upload attachment. Please check your file and try again."
      );
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
      attachments,
      workspaceSlug: workspaceSlug || null,
    };

    const isEdit = mode === "edit" && articleId;
    const url = isEdit ? `articles/${articleId}` : "articles";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(articleData),
      });

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
