import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthHeader } from "./components/AuthHeader";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { GoogleLoginButton } from "./components/GoogleLoginButton";
import { useAuth } from "./hooks/useAuth";
import styles from "./Auth.module.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, login, loading, error, user, isAuthenticated } = useAuth();

  // Handle OAuth callback and check authentication status
  useEffect(() => {
    // Handle OAuth callback
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");
    const urlUser = params.get("user");
    const urlError = params.get("error");
    
    // Check if we were redirected from Gmail tracker
    const fromEmailTracker = location.state?.fromEmailTracker || false;

    if (urlToken && urlUser) {
      localStorage.setItem("access_token", urlToken);
      localStorage.setItem("user", decodeURIComponent(urlUser));
      window.history.replaceState({}, document.title, "/");
      
      // If coming from email tracker, redirect back there with success parameter
      if (fromEmailTracker) {
        navigate("/app/gmail-tracker?googleAuth=success", { replace: true });
      } else {
        navigate("/app/dashboard", { replace: true });
      }
      return;
    }

    if (urlError) {
      console.error("OAuth error:", urlError);
      return;
    }

    // If already authenticated, redirect to dashboard or back to Email Tracker
    const { authenticated } = isAuthenticated();
    if (authenticated || user) {
      if (fromEmailTracker) {
        navigate("/app/gmail-tracker?googleAuth=success", { replace: true });
      } else {
        const from = location.state?.from?.pathname || "/app/dashboard";
        navigate(from, { replace: true });
      }
    }
  }, [location, navigate, isAuthenticated, user]);

  // Handle form submissions
  const handleSubmit = async (data) => {
    try {
      if (isLogin) {
        const result = await login(data);
      } else {
        const result = await register(data);
      }
      
      // Check authentication immediately after login/register
      const authState = isAuthenticated();
      if (authState.authenticated) {
        const from = location.state?.from?.pathname || "/app/dashboard";
        navigate(from, { replace: true });
      } else {
        console.error("Still not authenticated after successful login/register");
      }
    } catch (err) {
      console.error("Authentication error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <AuthHeader />

        {isLogin ? (
          <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
        ) : (
          <RegisterForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <GoogleLoginButton />

        <div className={styles.toggleText}>
          {isLogin ? (
            <span>
              Don't have an account?{" "}
              <button
                className={styles.toggleButton}
                onClick={() => setIsLogin(false)}
                disabled={loading}
              >
                Create one
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                className={styles.toggleButton}
                onClick={() => setIsLogin(true)}
                disabled={loading}
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
