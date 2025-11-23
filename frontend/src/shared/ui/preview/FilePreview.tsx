import { useState } from "react";
import styles from "./filePreview.module.scss";
import pdf_icon from "@assets/icons/pdf_icon.svg";
import close_icon from "@assets/icons/close_icon.svg";
import file_icon from "@assets/icons/file_icon.svg";

interface FilePreviewProps {
  url: string;
  fileName?: string;
  onRemove?: () => void;
  mode?: "view" | "edit";
}

export const FilePreview = ({ url, fileName, onRemove, mode}: FilePreviewProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getFileType = (url: string): "image" | "pdf" | "other" => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.match(/\.(jpg|jpeg|png|svg|)$/)) {
      return "image";
    }
    if (lowerUrl.match(/\.pdf$/)) {
      return "pdf";
    }
    return "other";
  };

  const fileType = getFileType(url);
  const displayName = fileName || url.split("/").pop() || "File";

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.preview__remove}`)) {
      return;
    }

    const fileUrl = `http://localhost:5000${url}`;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={styles.preview}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className={styles.preview__thumbnail}>
        {fileType === "image" && !imageError ? (
          <img
            src={`http://localhost:5000${url}`}
            alt={displayName}
            className={styles.preview__image}
            onError={handleImageError}
          />
        ) : fileType === "pdf" ? (
          <div className={styles.preview__pdfIcon}>
            <img src={pdf_icon} alt="PDF Icon" />
          </div>
        ) : (
          <div className={styles.preview__fileIcon}>
            <img src={file_icon} alt="" />
          </div>
        )}
      </div>

      <div className={styles.preview__info}>
        <span className={styles.preview__name} title={displayName}>
          {displayName}
        </span>
      </div>

      {onRemove && mode === "edit" && (
        <button
          className={`${styles.preview__remove} ${
            isHovered ? styles.preview__remove_visible : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove file"
          type="button"
        >
          <img src={close_icon} alt="" />
        </button>
      )}
    </div>
  );
};
