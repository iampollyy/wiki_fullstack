import { Link } from "react-router-dom";
import styles from "./logInForm.module.scss";
import { Button } from "@shared/ui/button/Button";

export function LoginForm() {
  return (
    <div className={styles.loginform}>
      <div className={styles.loginform__container}>
        <h1 className={styles.loginform__heading}>Sign In</h1>

        <form className={styles.loginform__form}>
          <label className={styles.loginform__field}>
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={styles.loginform__input}
            />
          </label>

          <label className={styles.loginform__field}>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className={styles.loginform__input}
            />
          </label>

          <Button className={styles.loginform__button}>Sign in</Button>
          <p>
            Don't have an account yet? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
