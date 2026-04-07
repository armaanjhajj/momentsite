"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/Logo";
import { TastePicker, TasteItem } from "@/components/TastePicker";

type Step =
  | "photo"
  | "name"
  | "handle"
  | "birthday"
  | "about"
  | "music"
  | "film"
  | "literature"
  | "done";

const STEPS: Step[] = [
  "photo",
  "name",
  "handle",
  "birthday",
  "about",
  "music",
  "film",
  "literature",
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("photo");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [detectingFace, setDetectingFace] = useState(false);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [birthday, setBirthday] = useState("");
  const [about, setAbout] = useState("");
  const [music, setMusic] = useState<TasteItem[]>([]);
  const [film, setFilm] = useState<TasteItem[]>([]);
  const [literature, setLiterature] = useState<TasteItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }

      const { data: existing } = await supabase
        .from("users")
        .select("name, handle, photo_url")
        .eq("id", session.user.id)
        .maybeSingle();

      if (
        existing &&
        existing.name !== "New User" &&
        !existing.handle.startsWith("user_") &&
        existing.photo_url
      ) {
        router.push(`/${existing.handle}`);
        return;
      }

      setLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    if (!handle || handle.length < 3) {
      setHandleAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("handle", handle)
        .maybeSingle();
      setHandleAvailable(!data);
    }, 300);
    return () => clearTimeout(timer);
  }, [handle]);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }
    setError("");
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    setPhotoFile(null);
    setDetectingFace(true);

    try {
      const faceapi = await import("face-api.js");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

      const img = new window.Image();
      img.src = previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      const detection = await faceapi.detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 })
      );

      if (!detection) {
        setError("We couldn't find a face in that photo. Try a clearer picture.");
        setPhotoPreview(null);
        setDetectingFace(false);
        return;
      }

      setPhotoFile(file);
    } catch {
      // If face detection fails to load, accept the photo anyway
      setPhotoFile(file);
    } finally {
      setDetectingFace(false);
    }
  }

  function goNext(next: Step) {
    return (e: React.FormEvent) => {
      e.preventDefault();
      setStep(next);
    };
  }

  async function handleFinish(e: React.FormEvent) {
    e.preventDefault();
    if (!photoFile) return;

    setSaving(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/");
      return;
    }

    // Upload photo
    const ext = photoFile.name.split(".").pop() || "jpg";
    const path = `${session.user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, photoFile, { upsert: true, contentType: photoFile.type });

    if (uploadError) {
      setSaving(false);
      setError(uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    const finalHandle = handle.trim().toLowerCase();

    const { error: upsertError } = await supabase
      .from("users")
      .upsert(
        {
          id: session.user.id,
          phone: session.user.phone,
          name: name.trim(),
          handle: finalHandle,
          birthday,
          photo_url: publicUrl,
          headline: about.trim() || null,
        },
        { onConflict: "id" }
      );

    if (upsertError) {
      setSaving(false);
      setError(upsertError.message);
      return;
    }

    // Clear existing taste and insert new
    await supabase.from("user_taste").delete().eq("user_id", session.user.id);

    const tasteRows = [
      ...music.map((m, i) => ({
        user_id: session.user.id,
        category: "music",
        item_type: m.item_type,
        external_id: m.id,
        title: m.title,
        subtitle: m.subtitle,
        cover_url: m.cover,
        position: i,
      })),
      ...film.map((m, i) => ({
        user_id: session.user.id,
        category: "film",
        item_type: m.item_type,
        external_id: m.id,
        title: m.title,
        subtitle: m.subtitle,
        cover_url: m.cover,
        position: i,
      })),
      ...literature.map((m, i) => ({
        user_id: session.user.id,
        category: "literature",
        item_type: m.item_type,
        external_id: m.id,
        title: m.title,
        subtitle: m.subtitle,
        cover_url: m.cover,
        position: i,
      })),
    ];

    if (tasteRows.length > 0) {
      const { error: tasteError } = await supabase
        .from("user_taste")
        .insert(tasteRows);
      if (tasteError) {
        setSaving(false);
        setError(tasteError.message);
        return;
      }
    }

    setSaving(false);
    setStep("done");
    setTimeout(() => router.push("/impulse"), 1200);
  }

  if (loading) return null;

  const currentStepIndex = STEPS.indexOf(step);

  return (
    <div className="onboarding">
      <div className="onboarding-logo">
        <Logo color="white" size={36} strokeWidth={18} />
      </div>

      <div className="onboarding-progress">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`progress-dot ${
              step === s || (step === "done" && i < STEPS.length)
                ? "active"
                : currentStepIndex > i
                ? "complete"
                : ""
            }`}
          />
        ))}
      </div>

      {step === "photo" && (
        <form onSubmit={goNext("name")} className="onboarding-form">
          <h1 className="onboarding-title">Add a photo</h1>
          <p className="onboarding-subtitle">Choose a profile picture</p>

          <button
            type="button"
            className="photo-upload"
            onClick={() => fileInputRef.current?.click()}
            disabled={detectingFace}
          >
            {photoPreview ? (
              <>
                <img src={photoPreview} alt="Preview" />
                {detectingFace && (
                  <div className="photo-upload-overlay">
                    <div className="photo-spinner-logo">
                      <Logo color="white" size={42} strokeWidth={18} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            style={{ display: "none" }}
          />

          {detectingFace && (
            <p className="face-check-label">Checking image for face...</p>
          )}
          {error && <p className="modal-error">{error}</p>}

          <button type="submit" className="onboarding-submit" disabled={!photoFile || detectingFace}>
            {detectingFace ? "CHECKING..." : "CONTINUE"}
          </button>
        </form>
      )}

      {step === "name" && (
        <form onSubmit={goNext("handle")} className="onboarding-form">
          <h1 className="onboarding-title">What&apos;s your name?</h1>
          <p className="onboarding-subtitle">This is how people will know you</p>
          <input
            type="text"
            className="onboarding-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={50}
            required
          />
          <button type="submit" className="onboarding-submit" disabled={!name.trim()}>
            CONTINUE
          </button>
          <button type="button" className="onboarding-back" onClick={() => setStep("photo")}>
            Back
          </button>
        </form>
      )}

      {step === "handle" && (
        <form onSubmit={goNext("birthday")} className="onboarding-form">
          <h1 className="onboarding-title">Pick a handle</h1>
          <p className="onboarding-subtitle">Your unique username on Moments</p>
          <div className="handle-input-wrapper">
            <span className="handle-prefix">@</span>
            <input
              type="text"
              className="onboarding-input handle-input"
              placeholder="yourhandle"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              autoFocus
              maxLength={20}
              required
            />
            {handle.length >= 3 && handleAvailable === true && (
              <svg className="handle-check available" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {handle.length >= 3 && handleAvailable === false && (
              <svg className="handle-check taken" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </div>
          <button
            type="submit"
            className="onboarding-submit"
            disabled={handle.length < 3 || handleAvailable === false}
          >
            CONTINUE
          </button>
          <button type="button" className="onboarding-back" onClick={() => setStep("name")}>
            Back
          </button>
        </form>
      )}

      {step === "birthday" && (
        <form onSubmit={goNext("about")} className="onboarding-form">
          <h1 className="onboarding-title">When&apos;s your birthday?</h1>
          <p className="onboarding-subtitle">Helps us personalize your experience</p>
          <input
            type="date"
            className="onboarding-input date-input"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            required
          />
          <button type="submit" className="onboarding-submit" disabled={!birthday}>
            CONTINUE
          </button>
          <button type="button" className="onboarding-back" onClick={() => setStep("handle")}>
            Back
          </button>
        </form>
      )}

      {step === "about" && (
        <form onSubmit={goNext("music")} className="onboarding-form">
          <h1 className="onboarding-title">About you</h1>
          <p className="onboarding-subtitle">A short bio to tell your story</p>
          <textarea
            className="onboarding-input onboarding-textarea"
            placeholder="Tell us about yourself..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            maxLength={200}
            rows={4}
            required
          />
          <button type="submit" className="onboarding-submit" disabled={!about.trim()}>
            CONTINUE
          </button>
          <button type="button" className="onboarding-back" onClick={() => setStep("birthday")}>
            Back
          </button>
        </form>
      )}

      {step === "music" && (
        <form onSubmit={goNext("film")} className="onboarding-form onboarding-form-wide">
          <h1 className="onboarding-title">Your music</h1>
          <p className="onboarding-subtitle">Pick songs and albums you love</p>
          <TastePicker category="music" items={music} onChange={setMusic} />
          <button type="submit" className="onboarding-submit" disabled={music.length === 0}>
            CONTINUE
          </button>
          <button type="button" className="onboarding-back" onClick={() => setStep("about")}>
            Back
          </button>
        </form>
      )}

      {step === "film" && (
        <form onSubmit={goNext("literature")} className="onboarding-form onboarding-form-wide">
          <h1 className="onboarding-title">Your film & TV</h1>
          <p className="onboarding-subtitle">Pick movies and shows you love</p>
          <TastePicker category="film" items={film} onChange={setFilm} />
          <button type="submit" className="onboarding-submit" disabled={film.length === 0}>
            CONTINUE
          </button>
          <button type="button" className="onboarding-back" onClick={() => setStep("music")}>
            Back
          </button>
        </form>
      )}

      {step === "literature" && (
        <form onSubmit={handleFinish} className="onboarding-form onboarding-form-wide">
          <h1 className="onboarding-title">Your literature</h1>
          <p className="onboarding-subtitle">Pick books you love</p>
          <TastePicker category="literature" items={literature} onChange={setLiterature} />
          {error && <p className="modal-error">{error}</p>}
          <button
            type="submit"
            className="onboarding-submit"
            disabled={literature.length === 0 || saving}
          >
            {saving ? "SAVING..." : "FINISH"}
          </button>
          <button type="button" className="onboarding-back" onClick={() => setStep("film")}>
            Back
          </button>
        </form>
      )}

      {step === "done" && (
        <div className="onboarding-form">
          <h1 className="onboarding-title">Welcome to Moments</h1>
          <p className="onboarding-subtitle">You&apos;re all set, {name}</p>
        </div>
      )}
    </div>
  );
}
