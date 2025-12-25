import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../button/Button";
import styles from "./header.module.scss";
import { Link } from "react-router-dom";
import { TextEditor } from "@features/createArticle/TextEditor";
import { logout } from "@core/store/slices/auth/authSlice";
import { RootState } from "@core/store/store";

export const Header = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <Link
        to="/"
        aria-label="Navigate to home page"
        className={styles.logoLink}
      >
        <img className={styles.Logo} src="/src/assets/icons/logo.svg" alt="" />
      </Link>

      <div className={styles.header__actions}>
        {token && (
          <Button size="sm" onClick={() => setShowEditor(true)}>
            +
          </Button>
        )}

        {token ? (
          <div className={styles.user__section}>
            {user && (
              <button
                className={styles.user__name}
                onClick={() => setShowLogOut(!showLogOut)}
              >
                {user.firstName.slice(0, 1).toUpperCase()}
                {user.lastName.slice(0, 1).toUpperCase()}
              </button>
            )}
            {showLogOut && (
              <div className={styles.user__actions}>
                <button
                  className={styles.user__actions__logOut}
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.loginLink}>
            Log In
          </Link>
        )}
      </div>

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
            <TextEditor mode="create" />
          </div>
        </div>
      )}
    </header>
  );
};
