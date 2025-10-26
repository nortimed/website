import { useEffect, useState } from "react";

interface LoginConfig {
  enabled: boolean;
  username: string;
  password: string;
}

export default function StaticLoginGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLogin, setShowLogin] = useState(false);
  const [config, setConfig] = useState<LoginConfig | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/login-config.json")
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((cfg: LoginConfig) => {
        setConfig(cfg);
        setShowLogin(
          cfg.enabled && !localStorage.getItem("static-login-authed"),
        );
        setAuthed(!!localStorage.getItem("static-login-authed"));
      })
      .catch(() => {
        // If config is missing, skip login and show website
        setConfig({ enabled: false, username: "", password: "" });
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    if (username === config.username && password === config.password) {
      localStorage.setItem("static-login-authed", "1");
      setShowLogin(false);
      setAuthed(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  if (!config) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#fff",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }
  if (!config.enabled || authed) return <>{children}</>;
  if (!showLogin) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          minWidth: 320,
          padding: 32,
          border: "1px solid #ccc",
          borderRadius: 8,
          background: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Login Required</h2>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="static-login-username">Username</label>
          <input
            id="static-login-username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="static-login-password">Password</label>
          <input
            id="static-login-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
