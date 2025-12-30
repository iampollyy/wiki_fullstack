import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./logInForm.module.scss";
import { Button } from "@shared/ui/button/Button";
import { loginSuccess } from "@core/store/slices/auth/authSlice";
import { useToast } from "@shared/ui/toast/ToastContext";
import { apiFetch } from "@shared/utils/fetch";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    let hasError = false;

    if (!trimmedEmail) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!emailPattern.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!trimmedPassword) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await apiFetch("login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.error?.includes("email")) {
          setEmailError("Please enter a valid email address");
        } else if (
          data?.error?.includes("password") ||
          data?.error?.includes("Invalid")
        ) {
          setPasswordError("Incorrect password. Please try again");
        } else {
          toast.showWarning("Login failed. Please check your credentials");
        }
        return;
      }

      dispatch(loginSuccess({ token: data.token, user: data.user }));
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.showWarning("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(null);
  };

  return (
    <div className={styles.loginform}>
      <div className={styles.loginform__container}>
        <h1 className={styles.loginform__heading}>Sign In</h1>

        <form
          className={styles.loginform__form}
          onSubmit={handleSubmit}
          noValidate
        >
          <label className={styles.loginform__field}>
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={styles.loginform__input}
              required
            />
            {emailError && (
              <span className={styles.loginform__error}>{emailError}</span>
            )}
          </label>

          <label className={styles.loginform__field}>
            Password
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className={styles.loginform__input}
              required
            />
            {passwordError && (
              <span className={styles.loginform__error}>{passwordError}</span>
            )}
          </label>

          <Button
            type="submit"
            className={styles.loginform__button}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <p>
            Don't have an account yet? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
