"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { TastePicker, TasteItem } from "@/components/TastePicker";
import { ImpulseModal } from "@/components/ImpulseModal";

type User = {
  id: string;
  name: string;
  handle: string;
  photo_url: string | null;
  headline: string | null;
  school: string | null;
  location: string | null;
  website: string | null;
  birthday: string | null;
};

type TasteRow = {
  id: string;
  category: string;
  item_type: string;
  external_id: string;
  title: string;
  subtitle: string | null;
  cover_url: string | null;
  position: number;
};

function shapeClass(type: string) {
  if (type === "song") return "taste-shape-circle";
  if (type === "album") return "taste-shape-square";
  return "taste-shape-rect";
}

function tasteRowToItem(row: TasteRow): TasteItem {
  return {
    id: row.external_id,
    title: row.title,
    subtitle: row.subtitle || "",
    cover: row.cover_url || "",
    item_type: row.item_type as TasteItem["item_type"],
  };
}

export function ProfileView({
  user,
  taste,
  hasImpulse: serverHasImpulse,
}: {
  user: User;
  taste: TasteRow[];
  hasImpulse?: boolean;
}) {
  const { session, profile, signOut } = useAuth();
  const isOwner = session?.user.id === user.id;
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [impulseOpen, setImpulseOpen] = useState(false);
  const hasImpulse = serverHasImpulse ?? false;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState(user.name);
  const [headline, setHeadline] = useState(user.headline || "");

  const initialMusic = taste
    .filter((t) => t.category === "music")
    .map(tasteRowToItem);
  const initialFilm = taste
    .filter((t) => t.category === "film")
    .map(tasteRowToItem);
  const initialLit = taste
    .filter((t) => t.category === "literature")
    .map(tasteRowToItem);

  const [music, setMusic] = useState<TasteItem[]>(initialMusic);
  const [film, setFilm] = useState<TasteItem[]>(initialFilm);
  const [literature, setLiterature] = useState<TasteItem[]>(initialLit);

  // Reset on user change
  useEffect(() => {
    setName(user.name);
    setHeadline(user.headline || "");
  }, [user]);

  async function handleSave() {
    if (!session) return;
    setSaving(true);
    setError("");

    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: name.trim(),
        headline: headline.trim() || null,
      })
      .eq("id", session.user.id);

    if (updateError) {
      setSaving(false);
      setError(updateError.message);
      return;
    }

    // Replace taste
    await supabase.from("user_taste").delete().eq("user_id", session.user.id);

    const rows = [
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

    if (rows.length > 0) {
      const { error: tasteError } = await supabase.from("user_taste").insert(rows);
      if (tasteError) {
        setSaving(false);
        setError(tasteError.message);
        return;
      }
    }

    setSaving(false);
    setEditing(false);
    window.location.reload();
  }

  function handleCancel() {
    setName(user.name);
    setHeadline(user.headline || "");
    setMusic(initialMusic);
    setFilm(initialFilm);
    setLiterature(initialLit);
    setEditing(false);
    setError("");
  }

  const initial = user.name.charAt(0).toUpperCase();
  const displayMusic = editing ? music : initialMusic;
  const displayFilm = editing ? film : initialFilm;
  const displayLit = editing ? literature : initialLit;

  return (
    <div className="profile-page public">
      <div className="profile-avatar-large">
        {user.photo_url ? (
          <img src={user.photo_url} alt={user.name} />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {editing ? (
        <>
          <input
            className="onboarding-input profile-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            maxLength={50}
          />
          <p className="public-profile-handle">@{user.handle}</p>
          <textarea
            className="onboarding-input onboarding-textarea"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="About you"
            maxLength={200}
            rows={3}
          />
        </>
      ) : (
        <>
          <h1 className="public-profile-name">{user.name}</h1>
          <p className="public-profile-handle">@{user.handle}</p>
          {user.headline && (
            <p className="public-profile-headline">{user.headline}</p>
          )}
        </>
      )}

      {!editing && (
        <div className="profile-actions">
          <button
            type="button"
            className="profile-pill-btn impulse"
            onClick={() => {
              if (isOwner && !hasImpulse) {
                window.location.href = "/impulse";
              } else {
                setImpulseOpen(true);
              }
            }}
          >
            <img src="/impulse.png" alt="" className="impulse-icon" />
            IMPULSE
          </button>
          {isOwner && (
            <button
              className="profile-pill-btn edit"
              onClick={() => setEditing(true)}
            >
              EDIT
            </button>
          )}
        </div>
      )}

      <ImpulseModal
        open={impulseOpen}
        onClose={() => setImpulseOpen(false)}
        userId={user.id}
        userName={user.name}
      />

      {editing && (
        <>
          <div className="profile-actions">
            <button
              className="profile-pill-btn edit"
              onClick={handleCancel}
              disabled={saving}
            >
              CANCEL
            </button>
            <button
              className="profile-pill-btn save"
              onClick={handleSave}
              disabled={saving || !name.trim()}
            >
              {saving ? "SAVING..." : "SAVE"}
            </button>
          </div>
          <div className="profile-danger-row">
            <button
              type="button"
              className="profile-text-btn"
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
            >
              Sign Out
            </button>
            <span className="profile-text-divider">·</span>
            {!confirmDelete ? (
              <button
                type="button"
                className="profile-text-btn danger"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Account
              </button>
            ) : (
              <span className="profile-confirm-row">
                <span className="profile-confirm-text">Are you sure?</span>
                <button
                  type="button"
                  className="profile-text-btn danger"
                  disabled={deleting}
                  onClick={async () => {
                    if (!session) return;
                    setDeleting(true);
                    try {
                      const res = await fetch("/api/delete-account", {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${session.access_token}`,
                        },
                      });
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.error || "Failed to delete");
                      }
                    } catch (err) {
                      setError(
                        err instanceof Error ? err.message : "Failed to delete"
                      );
                      setDeleting(false);
                      return;
                    }
                    await signOut();
                    window.location.href = "/";
                  }}
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  type="button"
                  className="profile-text-btn"
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </span>
            )}
          </div>
        </>
      )}

      {!editing && (
        <div className="public-profile-meta">
          {user.school && (
            <div className="public-meta-item">
              <span className="public-meta-label">SCHOOL</span>
              <span className="public-meta-value">{user.school}</span>
            </div>
          )}
          {user.location && (
            <div className="public-meta-item">
              <span className="public-meta-label">LOCATION</span>
              <span className="public-meta-value">{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="public-meta-item">
              <span className="public-meta-label">WEBSITE</span>
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="public-meta-value public-meta-link"
              >
                {user.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      )}

      {error && <p className="modal-error">{error}</p>}

      {/* Editing mode: full taste pickers by category */}
      {editing && (
        <>
          <div className="taste-section">
            <h3 className="taste-section-title">MUSIC</h3>
            <TastePicker category="music" items={music} onChange={setMusic} />
          </div>
          <div className="taste-section">
            <h3 className="taste-section-title">FILM & TV</h3>
            <TastePicker category="film" items={film} onChange={setFilm} />
          </div>
          <div className="taste-section">
            <h3 className="taste-section-title">LITERATURE</h3>
            <TastePicker category="literature" items={literature} onChange={setLiterature} />
          </div>
        </>
      )}

      {/* View mode: 3 stacked category cards */}
      {!editing && (
        <div className="taste-grid">
          <TasteCategoryCard label="Music" items={displayMusic} />
          <TasteCategoryCard label="Film" items={displayFilm} />
          <TasteCategoryCard label="Literature" items={displayLit} />
        </div>
      )}
    </div>
  );

  // silence unused warning
  void profile;
}

function shapeForItem(type: string): "circle" | "square" | "rect" {
  if (type === "song") return "circle";
  if (type === "album") return "square";
  return "rect";
}

function TasteCategoryCard({
  label,
  items,
}: {
  label: string;
  items: TasteItem[];
}) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const previewItems = items.slice(0, 3);

  return (
    <>
      <button
        type="button"
        className="taste-card"
        onClick={() => setExpanded(true)}
      >
        <span className="taste-card-label">{label}</span>
        <div className="taste-card-stack">
          {previewItems.map((item, i) => {
            const shape = shapeForItem(item.item_type);
            const offsets = [
              { x: -18, y: 0, r: -8 },
              { x: 0, y: -4, r: 0 },
              { x: 18, y: 2, r: 8 },
            ];
            const o = offsets[i];
            return (
              <img
                key={item.id}
                src={item.cover}
                alt={item.title}
                referrerPolicy="no-referrer"
                className={`taste-card-img shape-${shape}`}
                style={{
                  zIndex: previewItems.length - i,
                  transform: `translate(calc(-50% + ${o.x}px), calc(-50% + ${o.y}px)) rotate(${o.r}deg)`,
                }}
              />
            );
          })}
        </div>
      </button>

      {expanded && (
        <div className="taste-expand-overlay" onClick={() => setExpanded(false)}>
          <div className="taste-expand-modal" onClick={(e) => e.stopPropagation()}>
            <div className="taste-expand-header">
              <h3>{label}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setExpanded(false)}
              >
                &times;
              </button>
            </div>
            <div className="taste-expand-grid">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`taste-item taste-shape-${shapeForItem(item.item_type)}`}
                >
                  <img src={item.cover} alt={item.title} referrerPolicy="no-referrer" />
                  <div className="taste-item-label">
                    <span className="taste-item-title">{item.title}</span>
                    <span className="taste-item-subtitle">{item.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
