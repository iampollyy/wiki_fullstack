import { FilePreview } from "./FilePreview";
import styles from "./filePreviewList.module.scss";

interface FilePreviewListProps {
  files: string[];
  onRemove?: (index: number) => void;
  mode?: "view" | "edit";
}

export const FilePreviewList = ({
  files,
  onRemove,
  mode,
}: FilePreviewListProps) => {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className={styles.list}>
      {files.map((url, index) => (
        <FilePreview
          key={`${index}`}
          url={url}
          onRemove={onRemove ? () => onRemove(index) : undefined}
          mode={mode}
        />
      ))}
    </div>
  );
};

