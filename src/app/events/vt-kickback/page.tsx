import Link from "next/link";
import { RsvpLauncher } from "@/components/RsvpLauncher";

export default function VTKickback() {
  return (
    <div className="section-wrapper event-page">
      <Link href="/events" className="back-link">&larr; BACK</Link>

      <div className="event-hero">
        <img src="/logos/vt.png" alt="Virginia Tech" className="event-page-logo" />
        <span className="event-presents">
          <img src="/logos/redbull.svg" alt="Red Bull" className="event-presents-logo" />
          presents
        </span>
        <h1 className="event-page-title">Moments in the &apos;Burg</h1>
        <p className="event-tagline">
          Blacksburg&apos;s first Moments kickback.
          <br />
          Come through, grab a drink, meet someone new.
        </p>
      </div>

      <div className="event-info-grid">
        <div className="event-info-block">
          <span className="event-info-label">DATE</span>
          <span className="event-info-value">April 11, 2026</span>
        </div>
        <div className="event-info-block">
          <span className="event-info-label">TIME</span>
          <span className="event-info-value">4:00 PM</span>
        </div>
        <div className="event-info-block">
          <span className="event-info-label">LOCATION</span>
          <a
            href="https://maps.google.com/?q=37.223698,-80.420227"
            target="_blank"
            rel="noopener noreferrer"
            className="event-info-value event-info-link"
          >
            DX Lawn
          </a>
        </div>
      </div>

      <img
        src="/events/hoakie.png"
        alt="Virginia Tech Hokie"
        className="event-hero-image"
      />

      <section className="event-section">
        <h2 className="event-section-title">What to expect</h2>
        <p className="event-section-body">
          Handmade cold brew, Red Bull, and refreshers on us. Good music, lawn
          games, open air. We&apos;re not running a schedule. Show up when you
          want, stay as long as you want.
        </p>
      </section>

      <section className="event-section">
        <h2 className="event-section-title">Why</h2>
        <p className="event-section-body">
          Moments is a movement built around one idea that people are more
          interesting in person than they are online. We&apos;re starting with
          events like this one. Blacksburg is first.
        </p>
        <p className="event-section-body">
          More cities. More campuses. More kickbacks. This is how it starts.
        </p>
      </section>

      <RsvpLauncher
        eventSlug="vt-kickback"
        eventTitle="Moments in the 'Burg"
      />
    </div>
  );
}
