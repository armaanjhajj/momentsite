"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Wrong password.");
      setPassword("");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-logo">
          <Logo color="white" size={36} strokeWidth={18} />
        </div>
        <h1 className="admin-login-title">Admin</h1>
        <p className="admin-login-sub">Enter the password to continue.</p>

        <input
          type="password"
          className="admin-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />

        {error && <p className="admin-login-error">{error}</p>}

        <button
          type="submit"
          className="admin-login-btn"
          disabled={!password || submitting}
        >
          {submitting ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
