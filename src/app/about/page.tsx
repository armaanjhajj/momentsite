import { AboutGallery } from "@/components/AboutGallery";
import { FriendsList } from "@/components/FriendsList";
import { FounderCard } from "@/components/FounderCard";
import { FOUNDERS } from "@/lib/founders";

export default function About() {
  return (
    <div className="section-wrapper about-page">
      <h2 className="section-title">ABOUT</h2>

      <p className="section-text">
        Moments is a collective of friends who got
        pretty fed up of how hard it&apos;s become to make friends. We&apos;re
        on a journey to try and make it a tiny bit easier. We're constantly iterating on our products, hosting events, and creating content to bring people together IRL and online. We have a lot of fun doing it, and we hope you have fun using what we create. We have a lot of exciting stuff in the pipeline, and we can&apos;t wait to share it with you. Follow us on social media to keep up with what we&apos;re
        building, and doing a bunch of really cool stuff.
      </p>

      <p className="section-text">
        We're on a relentless pursuit to make Moments.
      </p>

      <h3 className="about-subheader">RPM Team</h3>
      <p className="section-text">
        Our founding team is <FounderCard founder={FOUNDERS.maaj} />,{" "}
        <FounderCard founder={FOUNDERS.sim} />,{" "}
        <FounderCard founder={FOUNDERS.pop} />, and{" "}
        <FounderCard founder={FOUNDERS.mirr} />. We&apos;ve had tons of other{" "}
        <FriendsList /> contribute to our success on social media and help set
        up our first few events at Rutgers. They&apos;re our goats.
      </p>

      <p className="section-text">
        We&apos;re always looking to expand our team.{" "}
        <a href="/apply" className="about-link">
          Apply Here
        </a>
        .
      </p>

      <div className="section-details">
        <div className="detail-block">
          <span className="detail-label">FOUNDED</span>
          <span className="detail-value">October 2025</span>
        </div>
        <div className="detail-block">
          <span className="detail-label">BASED IN</span>
          <span className="detail-value">New Brunswick, NJ</span>
        </div>
        <div className="detail-block">
          <span className="detail-label">FOCUS</span>
          <span className="detail-value">Community & Events</span>
        </div>
      </div>

      <AboutGallery />
    </div>
  );
}
