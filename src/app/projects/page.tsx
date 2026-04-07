import { Logo } from "@/components/Logo";

const projects = [
  {
    key: "app",
    name: "App",
    description:
      "Trying to revolutionize the way we use social networks on our phones, since the ones we have now seem to pull us further apart than bring us together.",
    icon: "logo" as const,
  },
  {
    key: "impulse",
    name: "Impulse",
    description: (
      <>
        The constantly evolving social engine that powers all of our products.
        Finding new ways to make meeting people as easy as it should be.
        Powered by <span className="accent-orange">Anthropic</span>.
      </>
    ),
    icon: "impulse" as const,
  },
  {
    key: "health",
    name: "Health",
    description:
      "Leveraging our team's background in engineering, healthcare, and software to harness sociology as a leading field of innovation in health, fitness, and any way we can help better society.",
    icon: "health" as const,
  },
  {
    key: "merch",
    name: "Merch",
    description: (
      <>
        GLASSES COMING <span className="accent-yellow">SOON</span>
      </>
    ),
    icon: "glasses" as const,
  },
];

function Icon({ type }: { type: "logo" | "impulse" | "health" | "glasses" }) {
  if (type === "logo") {
    return (
      <div className="project-icon-box">
        <Logo color="white" size={56} strokeWidth={14} />
      </div>
    );
  }
  if (type === "impulse") {
    return (
      <div className="project-icon-box">
        <img src="/impulse.png" alt="" className="project-icon-img" />
      </div>
    );
  }
  if (type === "health") {
    return (
      <div className="project-icon-box">
        <img src="/health.png" alt="" className="project-icon-img" />
      </div>
    );
  }
  return (
    <div className="project-icon-box">
      <img src="/0a.png" alt="" className="project-icon-img no-invert" />
    </div>
  );
}

export default function Projects() {
  return (
    <div className="section-wrapper projects-wrapper">
      <h2 className="section-title">PROJECTS</h2>
      <div className="projects-row">
        {projects.map((project) => (
          <div
            key={project.key}
            className={`project-box project-${project.key}`}
          >
            <div className="project-icon">
              <Icon type={project.icon} />
            </div>
            <h3 className="project-box-name">{project.name}</h3>
            <p className="project-box-desc">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
