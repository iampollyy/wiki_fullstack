import { useState, useRef, useEffect } from "react";
import { Button } from "../button/Button";
import { VersionList } from "../versionList/versionList";
import arrow_down from "@assets/icons/arrow_down.svg";
import arrow_up from "@assets/icons/arrow_up.svg";
import styles from "./versionSubmenu.module.scss";

export const VersionSubmenu = ({ articleId }: { articleId: string | number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={styles.versionSubmenu}>
      <Button variant="tertiary" onClick={handleToggle} className={styles.versionButton}>
        Versions
        <img 
          src={isOpen ? arrow_up : arrow_down} 
          className={styles.arrowIcon}
        />
      </Button>
      {isOpen && (
        <div className={styles.dropdown}>
          <VersionList articleId={articleId} />
        </div>
      )}
    </div>
  );
};
