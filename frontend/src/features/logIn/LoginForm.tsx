import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./logInForm.module.scss";
import { Button } from "@shared/ui/button/Button";
import { loginSuccess } from "@core/store/slices/auth/authSlice";
import { useToast } from "@shared/ui/toast/ToastContext";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.showWarning("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      dispatch(loginSuccess({ token: data.token, user: data.user }));
      toast.showSuccess("Login successful!");
      navigate("/");
    } catch (err: any) {
      console.error("Error logging in:", err);
      toast.showError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginform}>
      <div className={styles.loginform__container}>
        <h1 className={styles.loginform__heading}>Sign In</h1>

        <form className={styles.loginform__form} onSubmit={handleSubmit}>
          <label className={styles.loginform__field}>
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={styles.loginform__input}
              required
            />
          </label>

          <label className={styles.loginform__field}>
            Password
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.loginform__input}
              required
            />
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
