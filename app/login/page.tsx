"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

type LoginResponse = {
  id_user?: number | string;
  nama?: string;
  username?: string;
  message?: string;
};

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      const result = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setErrorMessage(result.message ?? "Username atau password salah");
        return;
      }

      setSuccessMessage(
        `Login berhasil, selamat datang ${result.nama ?? ""}`.trim(),
      );
    } catch {
      setErrorMessage("Tidak dapat terhubung ke server. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <button className="back-button" type="button" aria-label="Kembali">
        <span className="arrow-glyph" aria-hidden="true" />
      </button>

      <section className="login-card" aria-label="Masuk Jago Bangun Persada">
        <section className="welcome-panel" aria-labelledby="welcome-title">
          <div className="brand-mark">
            <Image
              src="/login-mark.png"
              alt="Lambang Jago Bangun Persada"
              width={250}
              height={250}
            />
          </div>

          <div className="welcome-copy">
            <h2 id="welcome-title">Halo, Pengguna</h2>
            <p>Selamat datang kembali di PT Jago Bangun Persada</p>
          </div>

          <div className="signup-prompt">
            <p>Belum punya akun?</p>
            <button type="button">Daftar di sini</button>
          </div>
        </section>

        <section className="login-panel" aria-labelledby="login-title">
          <form className="login-content" onSubmit={handleSubmit}>
            <h1 id="login-title">
              Masukkan Nama Pengguna
              <br />&amp; Kata Sandi
            </h1>

            <div className="login-fields">
              <label className="visually-hidden" htmlFor="username">
                Nama pengguna
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Nama pengguna"
                autoComplete="username"
                required
              />
              <label className="visually-hidden" htmlFor="password">
                Kata sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Kata sandi"
                autoComplete="current-password"
                required
              />
            </div>

            <button className="recovery-action" type="button">
              Lupa kata sandi?
            </button>

            <div
              className={`auth-feedback${errorMessage ? " auth-feedback--error" : " auth-feedback--success"}`}
              aria-live="polite"
            >
              {errorMessage || successMessage}
            </div>

            <div className="login-actions">
              <button className="crew-action" type="button">
                Masuk Sebagai Kru
              </button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Memeriksa..." : "Masuk"}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}