import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, User, Mail, Lock, ArrowRight } from "lucide-react";
import "./Auth.css";

function Signup() {
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
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

if (form.name.trim().length < 2) {
  setError("Name must contain at least 2 characters.");
  return;
}

if (form.password.length < 8) {
  setError("Password must contain at least 8 characters.");
  return;
}

try {
  setLoading(true);

  const response = await fetch(
    "http://localhost:5000/api/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed.");
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

    <h1>Create your account</h1>
    <p className="auth-subtitle">
      Start building your personal AI knowledge space.
    </p>

    {error && <div className="auth-error">{error}</div>}

    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Full name</label>
      <div className="auth-input-wrap">
        <User size={19} />
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />
      </div>

      <label htmlFor="signup-email">Email address</label>
      <div className="auth-input-wrap">
        <Mail size={19} />
        <input
          id="signup-email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </div>

      <label htmlFor="signup-password">Password</label>
      <div className="auth-input-wrap">
        <Lock size={19} />
        <input
          id="signup-password"
          type="password"
          name="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <button
        type="submit"
        className="auth-submit"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
        {!loading && <ArrowRight size={19} />}
      </button>
    </form>

    <p className="auth-switch">
      Already have an account? <Link to="/login">Login</Link>
    </p>

    <p className="auth-security">
      Your account is protected by password hashing and authentication.
    </p>
  </div>

  <p className="auth-footer">
    AI Second Brain · Your knowledge, organized.
  </p>
</div>

);
}

export default Signup;