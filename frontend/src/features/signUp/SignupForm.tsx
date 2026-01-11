import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import styles from "./signupForm.module.scss";
import { Button } from "@shared/ui/button/Button";
import { useToast } from "@shared/ui/toast/ToastContext";
import { apiFetch } from "@shared/utils/fetch";

export function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      toast.showWarning("Please fill in all fields");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      toast.showWarning("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.showWarning("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch("signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.error || "";
        
        if (errorMessage.includes("already in use") || errorMessage.includes("already exists")) {
          toast.showWarning("This email is already in use");
        } else if (errorMessage.includes("valid email") || errorMessage.includes("email")) {
          toast.showWarning("Please enter a valid email address");
        } else if (errorMessage.includes("password") || errorMessage.includes("Password")) {
          toast.showWarning("Password is too weak or invalid");
        } else if (
          errorMessage.includes("firstName") ||
          errorMessage.includes("First name") ||
          errorMessage.includes("lastName") ||
          errorMessage.includes("Last name")
        ) {
          toast.showWarning("Please provide a valid name and surname");
        } else {
          toast.showWarning(errorMessage || "Registration failed. Please check your input.");
        }
        return;
      }

      toast.showSuccess("Registration successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      console.error("Error registering user:", err);
      toast.showError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signup}>
      <div className={styles.signup__container}>
        <h1 className={styles.signup__heading}>Create an account</h1>

        <form
          className={styles.signup__form}
          onSubmit={handleSubmit}
          noValidate
        >
          <label className={styles.signup__field}>
            Name
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your name"
              className={styles.signup__input}
              required
            />
          </label>

          <label className={styles.signup__field}>
            Surname
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your surname"
              className={styles.signup__input}
              required
            />
          </label>

          <label className={styles.signup__field}>
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={styles.signup__input}
              required
            />
          </label>

          <label className={styles.signup__field}>
            Password
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create your password"
              className={styles.signup__input}
              required
              minLength={6}
            />
          </label>

          <Button
            type="submit"
            className={styles.signup__button}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>

          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
