import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Mail, Lock, ArrowRight } from "lucide-react";
import "./Auth.css";

function Login() {
const navigate = useNavigate();

const [form, setForm] = useState({
email: "",
password: "",
});

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");

try {
  setLoading(true);

  const response = await fetch(
    "http://localhost:5000/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email.trim(),
        password: form.password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }

  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("user", JSON.stringify(data.user));

  navigate("/dashboard");
} catch (err) {
  setError(
    err.message === "Failed to fetch"
      ? "Backend is not running. Please start the backend server."
      : err.message
  );
} finally {
  setLoading(false);
}

};

return (
<div className="auth-page">
<Link to="/" className="auth-brand">
<span className="auth-brand-icon">
<Brain size={25} />
</span>
<span>Second<span className="brand-highlight">Brain</span></span>
</Link>

  <div className="auth-card">
    <div className="auth-icon">
      <Brain size={30} />
    </div>

    <h1>Welcome back</h1>
    <p className="auth-subtitle">
      Login to continue exploring your knowledge.
    </p>

    {error && <div className="auth-error">{error}</div>}

    <form onSubmit={handleSubmit}>
      <label htmlFor="login-email">Email address</label>
      <div className="auth-input-wrap">
        <Mail size={19} />
        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </div>

      <label htmlFor="login-password">Password</label>
      <div className="auth-input-wrap">
        <Lock size={19} />
        <input
          id="login-password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
      </div>

      <button
        type="submit"
        className="auth-submit"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
        {!loading && <ArrowRight size={19} />}
      </button>
    </form>

    <p className="auth-switch">
      Don't have an account? <Link to="/signup">Sign up</Link>
    </p>

    <p className="auth-security">
      Login securely to access your personal AI workspace.
    </p>
  </div>

  <p className="auth-footer">
    AI Second Brain · Your knowledge, organized.
  </p>
</div>

);
}

export default Login;