"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Step =
  | "intro"
  | "academic"
  | "vibes"
  | "interests"
  | "intents"
  | "personal"
  | "done";

const STEPS: Step[] = ["academic", "vibes", "interests", "intents", "personal"];

const GRAD_YEARS = ["'26", "'27", "'28", "'29", "Grad student", "Other"];

const MAJORS = [
  "CS",
  "Business",
  "Engineering",
  "Bio / Pre-med",
  "Psych",
  "Econ",
  "Comms / Media",
  "Art & Design",
  "Poli Sci",
  "English / Writing",
  "Math",
  "Nursing",
  "Education",
  "Music",
  "Undeclared",
];

const VIBES = [
  "chill",
  "chatty",
  "quiet",
  "curious",
  "creative",
  "competitive",
  "athletic",
  "bookish",
  "nightowl",
  "earlybird",
  "spontaneous",
  "planner",
  "homebody",
  "explorer",
  "introvert",
  "extrovert",
  "ambivert",
  "goofy",
];

const INTERESTS = [
  "gym",
  "running",
  "climbing",
  "basketball",
  "soccer",
  "skating",
  "music",
  "producing",
  "dj'ing",
  "concerts",
  "gaming",
  "anime",
  "film",
  "reading",
  "writing",
  "art",
  "photography",
  "cooking",
  "coffee",
  "thrifting",
  "startups",
  "research",
  "volunteering",
  "faith",
];

const INTENTS = [
  "study buddies",
  "gym partners",
  "someone to walk to class with",
  "project / research collabs",
  "clubs to try",
  "events this week",
  "open mic / art stuff",
  "food recs",
  "quiet study spots",
  "coffee runs",
  "intramural teams",
  "faith communities",
  "just meeting new people",
  "nothing in particular — just looking around",
];

const PRONOUNS = [
  "she/her",
  "he/him",
  "they/them",
  "she/they",
  "he/they",
  "custom",
  "prefer not to say",
];

const RELATIONSHIP = [
  "single",
  "in a relationship",
  "it's complicated",
  "prefer not to say",
];

export default function ImpulseOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("intro");

  // Academic
  const [gradYear, setGradYear] = useState<string | null>(null);
  const [major, setMajor] = useState<string | null>(null);
  const [customMajor, setCustomMajor] = useState("");
  const [majorSearch, setMajorSearch] = useState("");

  // Vibes
  const [vibes, setVibes] = useState<string[]>([]);

  // Interests
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [customInterestInput, setCustomInterestInput] = useState("");

  // Intents
  const [intents, setIntents] = useState<string[]>([]);

  // Personal
  const [pronouns, setPronouns] = useState<string | null>(null);
  const [customPronouns, setCustomPronouns] = useState("");
  const [relationship, setRelationship] = useState<string>("prefer not to say");

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }
      setLoading(false);
    }
    init();
  }, [router]);

  function toggle(arr: string[], value: string, max?: number) {
    if (arr.includes(value)) return arr.filter((v) => v !== value);
    if (max && arr.length >= max) return arr;
    return [...arr, value];
  }

  function addCustomInterest() {
    const v = customInterestInput.trim();
    if (!v || customInterests.length >= 2 || customInterests.includes(v)) return;
    setCustomInterests([...customInterests, v]);
    setCustomInterestInput("");
  }

  function removeCustomInterest(v: string) {
    setCustomInterests(customInterests.filter((i) => i !== v));
  }

  const filteredMajors = MAJORS.filter((m) =>
    m.toLowerCase().includes(majorSearch.toLowerCase())
  );

  async function submitImpulse(skip = false) {
    setSaving(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/");
      return;
    }

    const finalMajor = major === "Other" ? customMajor.trim() : major;
    const finalPronouns =
      pronouns === "custom" ? customPronouns.trim() : pronouns;

    const payload = skip
      ? {
          grad_year: null,
          major: null,
          vibes: [],
          interests: [],
          custom_interests: [],
          intents: [],
          pronouns: null,
          relationship_status: null,
          custom_note: null,
        }
      : {
          grad_year: gradYear,
          major: finalMajor,
          vibes,
          interests,
          custom_interests: customInterests,
          intents,
          pronouns: finalPronouns,
          relationship_status:
            relationship === "prefer not to say" ? null : relationship,
          custom_note: null,
        };

    try {
      const res = await fetch("/api/impulse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : "Failed to save");
      return;
    }

    setSaving(false);
    setStep("done");

    // Check for pending RSVP flow — route back to event page
    const pendingRsvp =
      typeof window !== "undefined"
        ? sessionStorage.getItem("pending-rsvp")
        : null;

    if (pendingRsvp) {
      setTimeout(() => {
        router.push(`/events/${pendingRsvp}`);
      }, 1200);
      return;
    }

    // Fetch the user's handle and redirect to their profile
    const { data: profile } = await supabase
      .from("users")
      .select("handle")
      .eq("id", session.user.id)
      .single();

    setTimeout(() => {
      router.push(profile?.handle ? `/${profile.handle}` : "/");
    }, 1200);
  }

  if (loading) return null;

  const stepIndex = STEPS.indexOf(step as Step);

  return (
    <div className="onboarding impulse-onboarding">
      {step === "intro" && (
        <div className="impulse-intro">
          <Image
            src="/impulse.png"
            alt="Impulse"
            width={96}
            height={96}
            className="impulse-intro-logo"
          />
          <h1 className="onboarding-title impulse-title">Setup Impulse</h1>
          <p className="onboarding-subtitle impulse-sub">
            One minute, and Moments starts showing you the right people.
          </p>
          <button
            className="onboarding-submit"
            onClick={() => setStep("academic")}
          >
            GET STARTED
          </button>
          <button
            className="onboarding-back impulse-skip"
            onClick={() => submitImpulse(true)}
            disabled={saving}
          >
            Skip for now
          </button>
        </div>
      )}

      {step !== "intro" && step !== "done" && (
        <div className="onboarding-progress">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`progress-dot ${
                stepIndex === i
                  ? "active"
                  : stepIndex > i
                  ? "complete"
                  : ""
              }`}
            />
          ))}
        </div>
      )}

      {step === "academic" && (
        <div className="onboarding-form onboarding-form-wide">
          <h1 className="onboarding-title">When do you graduate?</h1>
          <div className="chip-grid">
            {GRAD_YEARS.map((y) => (
              <button
                key={y}
                type="button"
                className={`chip ${gradYear === y ? "selected" : ""}`}
                onClick={() => setGradYear(y)}
              >
                {y}
              </button>
            ))}
          </div>

          <h2 className="onboarding-subtitle impulse-section-label">
            What do you study?
          </h2>
          <input
            type="text"
            className="onboarding-input chip-search"
            placeholder="Search majors..."
            value={majorSearch}
            onChange={(e) => setMajorSearch(e.target.value)}
          />
          <div className="chip-grid scrollable-chip-grid">
            {filteredMajors.map((m) => (
              <button
                key={m}
                type="button"
                className={`chip ${major === m ? "selected" : ""}`}
                onClick={() => setMajor(m)}
              >
                {m}
              </button>
            ))}
            <button
              type="button"
              className={`chip ${major === "Other" ? "selected" : ""}`}
              onClick={() => setMajor("Other")}
            >
              Other
            </button>
          </div>
          {major === "Other" && (
            <input
              type="text"
              className="onboarding-input"
              placeholder="Type your major"
              value={customMajor}
              onChange={(e) => setCustomMajor(e.target.value)}
              maxLength={40}
            />
          )}

          <button
            type="button"
            className="onboarding-submit"
            disabled={!gradYear || !major || (major === "Other" && !customMajor.trim())}
            onClick={() => setStep("vibes")}
          >
            CONTINUE
          </button>
          <button
            type="button"
            className="onboarding-back"
            onClick={() => setStep("intro")}
          >
            Back
          </button>
        </div>
      )}

      {step === "vibes" && (
        <div className="onboarding-form onboarding-form-wide">
          <h1 className="onboarding-title">Pick 3 that feel like you</h1>
          <p className="onboarding-subtitle">
            {vibes.length}/3 selected
          </p>
          <div className="chip-grid">
            {VIBES.map((v) => (
              <button
                key={v}
                type="button"
                className={`chip ${vibes.includes(v) ? "selected" : ""}`}
                onClick={() => setVibes(toggle(vibes, v, 3))}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="onboarding-submit"
            disabled={vibes.length !== 3}
            onClick={() => setStep("interests")}
          >
            CONTINUE
          </button>
          <button
            type="button"
            className="onboarding-back"
            onClick={() => setStep("academic")}
          >
            Back
          </button>
        </div>
      )}

      {step === "interests" && (
        <div className="onboarding-form onboarding-form-wide">
          <h1 className="onboarding-title">Tap 3–6 things you actually do</h1>
          <p className="onboarding-subtitle">
            {interests.length + customInterests.length}/6 selected
          </p>
          <div className="chip-grid">
            {INTERESTS.map((i) => (
              <button
                key={i}
                type="button"
                className={`chip ${interests.includes(i) ? "selected" : ""}`}
                onClick={() =>
                  setInterests(
                    toggle(interests, i, 6 - customInterests.length)
                  )
                }
              >
                {i}
              </button>
            ))}
            {customInterests.map((i) => (
              <button
                key={i}
                type="button"
                className="chip selected custom"
                onClick={() => removeCustomInterest(i)}
              >
                {i} ×
              </button>
            ))}
          </div>
          {customInterests.length < 2 && (
            <div className="custom-interest-row">
              <input
                type="text"
                className="onboarding-input"
                placeholder="Add your own..."
                value={customInterestInput}
                onChange={(e) => setCustomInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomInterest();
                  }
                }}
                maxLength={20}
              />
              <button
                type="button"
                className="custom-add-btn"
                onClick={addCustomInterest}
                disabled={!customInterestInput.trim()}
              >
                +
              </button>
            </div>
          )}
          <button
            type="button"
            className="onboarding-submit"
            disabled={interests.length + customInterests.length < 3}
            onClick={() => setStep("intents")}
          >
            CONTINUE
          </button>
          <button
            type="button"
            className="onboarding-back"
            onClick={() => setStep("vibes")}
          >
            Back
          </button>
        </div>
      )}

      {step === "intents" && (
        <div className="onboarding-form onboarding-form-wide">
          <h1 className="onboarding-title">What would you like to find?</h1>
          <p className="onboarding-subtitle">
            Pick any that apply
          </p>
          <div className="chip-grid">
            {INTENTS.map((i) => (
              <button
                key={i}
                type="button"
                className={`chip ${intents.includes(i) ? "selected" : ""}`}
                onClick={() => setIntents(toggle(intents, i))}
              >
                {i}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="onboarding-submit"
            onClick={() => setStep("personal")}
          >
            CONTINUE
          </button>
          <button
            type="button"
            className="onboarding-back"
            onClick={() => setStep("interests")}
          >
            Back
          </button>
        </div>
      )}

      {step === "personal" && (
        <div className="onboarding-form onboarding-form-wide">
          <h1 className="onboarding-title">Last thing</h1>
          <p className="onboarding-subtitle">
            A few details that help Moments show you the right stuff.
          </p>

          <div className="impulse-row">
            <h3 className="impulse-row-label">Pronouns</h3>
            <div className="chip-grid">
              {PRONOUNS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`chip ${pronouns === p ? "selected" : ""}`}
                  onClick={() => setPronouns(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            {pronouns === "custom" && (
              <input
                type="text"
                className="onboarding-input"
                placeholder="Type your pronouns"
                value={customPronouns}
                onChange={(e) => setCustomPronouns(e.target.value)}
                maxLength={20}
              />
            )}
          </div>

          <div className="impulse-row">
            <h3 className="impulse-row-label">Relationship status</h3>
            <p className="impulse-row-helper">
              Helps us avoid awkward suggestions.
            </p>
            <div className="chip-grid">
              {RELATIONSHIP.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`chip ${relationship === r ? "selected" : ""}`}
                  onClick={() => setRelationship(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <button
            type="button"
            className="onboarding-submit"
            onClick={() => submitImpulse(false)}
            disabled={saving || !pronouns}
          >
            {saving ? "SAVING..." : "DONE"}
          </button>
          <button
            type="button"
            className="onboarding-back"
            onClick={() => setStep("intents")}
          >
            Back
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="onboarding-form impulse-done">
          <Image
            src="/impulse.png"
            alt="Impulse"
            width={72}
            height={72}
            className="impulse-intro-logo"
          />
          <h1 className="onboarding-title">Impulse is ready</h1>
          <p className="onboarding-subtitle">
            Moments will start showing you the right people.
          </p>
        </div>
      )}
    </div>
  );
}
