import styles from "./signupForm.module.scss";
import { Button } from "@shared/ui/button/Button";

export function SignUpForm() {
  return (
    <div className={styles.signup}>
      <div className={styles.signup__container}>
        <h1 className={styles.signup__heading}>Create an account</h1>

        <form className={styles.signup__form}>
          <label className={styles.signup__field}>
            Name
            <input
              type="text"
              name="firstName"
              placeholder="Enter your name"
              className={styles.signup__input}
            />
          </label>

          <label className={styles.signup__field}>
            Surname
            <input
              type="text"
              name="surname"
              placeholder="Enter your surname"
              className={styles.signup__input}
            />
          </label>

          <label className={styles.signup__field}>
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className={styles.signup__input}
            />
          </label>

          <label className={styles.signup__field}>
            Password
            <input
              type="password"
              name="password"
              placeholder="Create your password"
              className={styles.signup__input}
            />
          </label>

          <Button className={styles.signup__button}>Sign up</Button>
        </form>
      </div>
    </div>
  );
}
