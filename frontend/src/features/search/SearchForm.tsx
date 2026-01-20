import { useState } from "react";
import styles from "./searchForm.module.scss";
import { Button } from "@shared/ui/button/Button";

export const SearchForm = () => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onClear = () => setQuery("");

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <span className={styles.iconSearch} aria-hidden>
        <img src="src/assets/icons/search.svg" />
      </span>
      <input
        type="text"
        name="q"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchForm__input}
        aria-label="Search articles"
      />
      {query ? (
        <Button
          variant="tertiary"
          type="button"
          onClick={onClear}
          className={styles.iconClear}
          aria-label="Clear search"
        >
          <img src="src/assets/icons/clear.svg" />
        </Button>
      ) : null}
    </form>
  );
};
