import styles from "./searchForm.module.scss";
import searchIcon from "@assets/icons/search.svg";
import clearIcon from "@assets/icons/clear.svg";

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchForm = ({ value, onChange }: SearchFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <span className={styles.iconSearch} aria-hidden>
        <img src={searchIcon} alt="" />
      </span>
      <input
        type="text"
        name="search"
        placeholder="Search articles by title or content..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.searchForm__input}
        aria-label="Search articles by title or content"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className={styles.iconClear}
          aria-label="Clear search"
        >
          <img src={clearIcon} alt="" />
        </button>
      ) : null}
    </form>
  );
};
