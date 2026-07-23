import { supabaseAdmin } from "@/lib/supabase-admin";
import { LogoutButton } from "./LogoutButton";

// Always render fresh — this is a live dashboard of incoming data.
export const dynamic = "force-dynamic";

type WaitlistRow = { email: string; created_at: string };
type InquiryRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  created_at: string;
};
type SurveyRow = {
  id: string;
  find_people: string | null;
  openness: string | null;
  would_go: number | null;
  spot: string | null;
  email: string | null;
  created_at: string;
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function countSince(rows: { created_at: string }[], sinceMs: number): number {
  return rows.filter((r) => new Date(r.created_at).getTime() >= sinceMs).length;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminDashboard() {
  const [waitlistRes, inquiriesRes, surveyRes] = await Promise.all([
    supabaseAdmin
      .from("waitlist")
      .select("email, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("inquiries")
      .select("id, name, email, phone, message, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("survey_responses")
      .select(
        "id, find_people, openness, would_go, spot, email, created_at"
      )
      .order("created_at", { ascending: false }),
  ]);

  const waitlist = (waitlistRes.data ?? []) as WaitlistRow[];
  const inquiries = (inquiriesRes.data ?? []) as InquiryRow[];
  const survey = (surveyRes.data ?? []) as SurveyRow[];
  const loadError =
    waitlistRes.error?.message ||
    inquiriesRes.error?.message ||
    surveyRes.error?.message;

  const rated = survey.filter((r) => r.would_go != null);
  const avgGo = rated.length
    ? (rated.reduce((s, r) => s + (r.would_go ?? 0), 0) / rated.length).toFixed(1)
    : "—";

  const weekAgo = Date.now() - WEEK_MS;
  const metrics = [
    { label: "Waitlist", value: waitlist.length, sub: `+${countSince(waitlist, weekAgo)} this week` },
    { label: "Inquiries", value: inquiries.length, sub: `+${countSince(inquiries, weekAgo)} this week` },
    { label: "Survey", value: survey.length, sub: `avg ${avgGo}/5 · +${countSince(survey, weekAgo)} this week` },
  ];

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1 className="admin-title">Dashboard</h1>
        <LogoutButton />
      </header>

      {loadError && (
        <p className="admin-load-error">Couldn&apos;t load data: {loadError}</p>
      )}

      <section className="admin-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="admin-metric">
            <span className="admin-metric-value">{m.value}</span>
            <span className="admin-metric-label">{m.label}</span>
            <span className="admin-metric-sub">{m.sub}</span>
          </div>
        ))}
      </section>

      <p className="admin-traffic-note">
        Visitor counts, top pages, referrers, devices and clicks live in the{" "}
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vercel project dashboard
        </a>{" "}
        → Analytics &amp; Speed Insights tabs.
      </p>

      <details className="admin-section" open>
        <summary className="admin-section-title">
          Inquiries <span className="admin-count">{inquiries.length}</span>
        </summary>
        {inquiries.length === 0 ? (
          <p className="admin-empty">No messages yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Message</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td className="admin-td-contact">
                      {row.email && <span>{row.email}</span>}
                      {row.phone && <span>{row.phone}</span>}
                    </td>
                    <td className="admin-td-message">{row.message}</td>
                    <td className="admin-td-muted">{fmtDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </details>

      <details className="admin-section">
        <summary className="admin-section-title">
          Waitlist <span className="admin-count">{waitlist.length}</span>
        </summary>
        {waitlist.length === 0 ? (
          <p className="admin-empty">No signups yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((row) => (
                  <tr key={row.email}>
                    <td>{row.email}</td>
                    <td className="admin-td-muted">{fmtDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </details>

      <details className="admin-section">
        <summary className="admin-section-title">
          Survey <span className="admin-count">{survey.length}</span>
        </summary>
        {survey.length === 0 ? (
          <p className="admin-empty">No responses yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Finds people</th>
                  <th>Openness</th>
                  <th>Would go</th>
                  <th>Their spot</th>
                  <th>Email</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {survey.map((row) => (
                  <tr key={row.id}>
                    <td>{row.find_people ?? "—"}</td>
                    <td>{row.openness ?? "—"}</td>
                    <td>{row.would_go != null ? `${row.would_go}/5` : "—"}</td>
                    <td className="admin-td-message">{row.spot ?? "—"}</td>
                    <td className="admin-td-contact">{row.email ?? "—"}</td>
                    <td className="admin-td-muted">{fmtDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </details>
    </div>
  );
}
