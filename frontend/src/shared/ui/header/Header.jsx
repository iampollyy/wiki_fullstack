import { useState } from "react";
import { Button } from "../button/Button";
import styles from "./header.module.scss";
import { Link } from "react-router-dom";
import { QuillEditor } from "@features/createArticle/QuillEditor";
export const Header = () => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <header className={styles.header}>
      <Link
        to="/"
        aria-label="Navigate to home page"
        className={styles.logoLink}
      >
        <img className={styles.Logo} src="/src/assets/icons/logo.svg" alt="" />
      </Link>

      <Button size="sm" onClick={() => setShowEditor(true)}>
        +
      </Button>

      {showEditor && (
        <div className={styles.editor__modal}>
          <div className={styles.editor__wrapper}>
            <Button
              size="sm"
              variant="tertiary"
              aria-label="Close editor"
              onClick={() => setShowEditor(false)}
              className={styles.closeButton}
            >
              ✕
            </Button>
            <QuillEditor mode="create" />
          </div>
        </div>
      )}
    </header>
  );
};
