import Link from "next/link";

const events = [
  {
    title: "VT Kickback",
    href: "/events/vt-kickback",
    enabled: true,
    logo: "/logos/vt.png",
  },
  {
    title: "Princeton Pop-Up",
    href: "/events/princeton-popup",
    enabled: false,
    logo: "/logos/princeton.png",
  },
  {
    title: "Rutgers Open Tab",
    href: "/events/rutgers-open-tab",
    enabled: false,
    logo: "/logos/rutgers.png",
  },
];

export default function Events() {
  return (
    <div className="section-wrapper">
      <h2 className="section-title">EVENTS</h2>
      <div className="events-grid">
        {events.map((event) =>
          event.enabled ? (
            <Link
              key={event.title}
              href={event.href}
              className="event-btn event-active"
              title={event.title}
            >
              <img src={event.logo} alt={event.title} className="event-btn-logo" />
            </Link>
          ) : (
            <div
              key={event.title}
              className="event-btn event-locked"
              title={event.title}
            >
              <img src={event.logo} alt={event.title} className="event-btn-logo" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
