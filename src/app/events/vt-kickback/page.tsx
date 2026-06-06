import { ExhibitClose } from "@/components/ExhibitClose";

export default function VTKickback() {
  return (
    <div className="section-wrapper event-page">
      <ExhibitClose />

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
          A lawn, some drinks, and a bunch of strangers who didn&apos;t stay
          strangers.
        </p>
      </div>

      {/* The flier that went out for the kickback */}
      <img
        src="/events/hoakie.png"
        alt="Moments in the 'Burg kickback flier"
        className="event-hero-image"
      />

      <p className="event-meta-line">
        April 11, 2026
        <span className="event-meta-dot">·</span>
        DX Lawn
        <span className="event-meta-dot">·</span>
        Blacksburg, VA
      </p>

      <section className="event-section">
        <h2 className="event-section-title">What it was</h2>
        <p className="event-section-body">
          No stage, no schedule, no sign-in sheet. Just a kickback on the lawn.
          We set up out on DX Lawn with handmade cold brew, a cooler of Red
          Bull, and refreshers, put on some music, and let people show up
          whenever they wanted and stay as long as they felt like.
        </p>
        <p className="event-section-body">
          Lawn games, volleyball, and a folding table covered in snacks did the
          rest. The whole point was an easy excuse to be outside and actually
          talk to the person next to you.
        </p>
      </section>

      <div className="event-gallery">
        <img src="/exhibits/vtkickback/1.jpg" alt="Volleyball on DX Lawn at the kickback" />
        <img src="/exhibits/vtkickback/3.jpg" alt="The snack and drink table" />
        <img src="/exhibits/vtkickback/2.jpg" alt="The Moments crew in Blacksburg" />
        <img src="/exhibits/vtkickback/4.png" alt="Hanging out on the lawn" />
      </div>

      <section className="event-section">
        <h2 className="event-section-title">Why it mattered</h2>
        <p className="event-section-body">
          Moments is built around one idea: people are more interesting in
          person than they are online. Blacksburg was the first stop, and it
          proved the thing we keep betting on, that a patch of grass and a few
          drinks is all it takes to get people talking.
        </p>
        <p className="event-section-body">
          More cities. More campuses. More kickbacks. This is how it starts.
        </p>
      </section>
    </div>
  );
}
