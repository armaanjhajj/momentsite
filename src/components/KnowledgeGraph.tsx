"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const NODES = [
  // Center
  { id: "Moments", size: 28, body: "There's not really a perfect way to describe what Moments is since the idea and goal we're chasing has become a pursuit that embodies so many forms. Without being cheesy or anything, we're a team of people trying to make the world more social again. Our movement involves building some cool tools and expressing the mantra through art. We want to help everyone make more Moments." },

  // What it is
  { id: "The Idea", size: 18, body: "We think the internet made the world smaller but left most people feeling more alone. Moments is our attempt to do something about that. One connection (or Moment...lol) at a time." },
  { id: "Strength in Numbers", size: 16, body: "We realized we're not alone in feeling the way we do. There's a pretty huge and growing group of people who feel the same way about social media and want something better. If that sounds like you, you're already part of it." },
  { id: "Problem", size: 14, body: "One of the biggest things we've been bothered by with the current state of internet/social media is the plague of over consumption. Every app on our phones is optimized to keep you scrolling and not actually meet people. Apps like Instagram, TikTok, Twitter are primarily consumption platforms. They borrow the word \"social\" but that's not really what they're for anymore." },
  { id: "Solution", size: 12, body: "We're building something that helps you find people, build a network, and show up IRL. It's closer to the idea that Facebook was supposed to be before it became what it became, except we're doing it with the tools and advancements we have now." },

  // Standalone
  { id: "Loneliness", size: 14, body: "More than half of young adults say they feel lonely most days. Social apps were supposed to help with this. They didn't. That's the gap we're trying to close." },

  // Product
  { id: "Relevance", size: 14, body: "The app we're building focuses on learning about your personality and preferences to make making friends easier. We'll pay attention to what you like, where you hangout, and who you click with. The more you use it, the more relevant it gets." },
  { id: "Identity", size: 16, body: "Without giving too much away, I'm personally building a really cool way to build your identity on the app in ways I feel like current social medias don't let you. (Hopefully you won't need to spend 2 hours picking which 15 seconds of a song to put on your IG story anymore :P)" },
  { id: "Network", size: 16, body: "One of the biggest goals of our app is to build a platform where you can simply connect and grow your network easily and efficiently. LinkedIn does a pretty good job at this in a professional scene but I'd like to not have to worry about someone telling me they \"don't use IG\" the next time I try to exchange socials. We'll help you keep track of the people you've actually met and makes your real-world circle feel like a circle again." },
  { id: "Presence", size: 14, body: "We're taking a huge (and pretty scary) step to try and use proximity to help make this social battle a tiny bit easier. The mere-exposure effect describes the psychological phenomenon where people develop a preference for someone simply because they see them frequently, as familiarity naturally breeds comfort and likability. Our app will allow you to opt-in to this new movement and we'll try to help out without stepping into creepy territory. We're hoping to turn a room of strangers into a room of potential connections; only when you want it to." },

  // Teams
  { id: "Tech", size: 18, body: "As we build out this app, we're constantly looking for ways to make our tool easier to use, more helpful, and as optimal as it can be. This obviously isn't a feat two CS majors can perfect in a year so we're always looking for likeminded and hardworking team members to join the cause and help out." },
  { id: "Content", size: 16, body: "Something we noticed when trying stuff out in the super early days of launching this brand is that nothing really compares to the power of social media in the field of growth. We really aren't a huge fan of annoying promotional spam content which is why we're shifting gears into making thoughtful film projects to put on our pages that help shine light on the problem we're facing while having fun and expressing ourselves in the process. If that sounds like something you'd enjoy, we'd love to have you onboard." },
  { id: "Idea", size: 14, body: "As odd as this sounds, we really do need some creative thinkers. A lot of what it takes in carrying out a goal this huge is really just thought. This is kinda our version of an R&D department but more for people who like to think out of the box and have some funky ideas that \"maybe, possibly, perhaps\" could work." },
  { id: "Growth", size: 12, body: "Our movement is grounded in the concept of being more social. This requires our team to practice just that. We really really need people who are willing to feel uncomfortable and outreach to others to spread the word on what we're all about. The more people that know about us and get to hear about our team and brand, the more friendships we could help make :)" },
];

const LINKS: [string, string][] = [
  // Center connections
  ["Moments", "The Idea"],
  ["Moments", "Problem"],
  ["Moments", "Identity"],
  ["Moments", "Network"],
  ["Moments", "Tech"],

  // What it is cluster
  ["The Idea", "Strength in Numbers"],
  ["The Idea", "Solution"],
  ["Problem", "Solution"],
  ["Problem", "Loneliness"],

  // Product cluster
  ["Identity", "Relevance"],
  ["Identity", "Network"],
  ["Network", "Presence"],
  ["Relevance", "Presence"],

  // Teams cluster
  ["Tech", "Content"],
  ["Tech", "Idea"],
  ["Content", "Growth"],
  ["Growth", "Strength in Numbers"],

  // Cross-cluster
  ["Solution", "Relevance"],
  ["Strength in Numbers", "Content"],
  ["Loneliness", "The Idea"],
  ["Presence", "The Idea"],
];

type NodeDatum = (typeof NODES)[0] & d3.SimulationNodeDatum;

export function KnowledgeGraph({
  open,
  onClose,
  renderTrigger = true,
}: {
  // Controlled mode: pass `open`/`onClose` to drive the overlay from outside
  // (e.g. the exhibits list). Uncontrolled by default, with its own preview card.
  open?: boolean;
  onClose?: () => void;
  renderTrigger?: boolean;
} = {}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const controlled = open !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlled ? open : internalExpanded;
  const [selected, setSelected] = useState<string | null>(null);

  const close = () => {
    setSelected(null);
    if (controlled) onClose?.();
    else setInternalExpanded(false);
  };

  // keep latest `selected` accessible inside d3 handlers without re-running effect
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selected;

  const selectedNode = NODES.find((n) => n.id === selected);
  const connectedIds = selected
    ? LINKS.filter((l) => l[0] === selected || l[1] === selected).map((l) =>
        l[0] === selected ? l[1] : l[0]
      )
    : [];

  // Lock body scroll + ESC to close while expanded
  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  useEffect(() => {
    if (!svgRef.current) return;
    const interactive = expanded;
    const el = svgRef.current;
    const container = el.parentElement;
    const w = container?.clientWidth || window.innerWidth;
    const h = container?.clientHeight || window.innerHeight;

    d3.select(el).selectAll("*").remove();
    const svg = d3.select(el).attr("width", w).attr("height", h);
    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4])
      .on("zoom", (e) => g.attr("transform", e.transform));

    if (interactive) {
      svg.call(zoom);
      svg.on("dblclick.zoom", null);
    }

    const nodeData: NodeDatum[] = NODES.map((n) => ({ ...n }));
    const linkData = LINKS.map(([source, target]) => ({
      source: source as unknown as NodeDatum,
      target: target as unknown as NodeDatum,
    }));

    const simulation = d3
      .forceSimulation<NodeDatum>(nodeData)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, (typeof linkData)[0]>(linkData)
          .id((d) => d.id)
          .distance((d) => {
            const s =
              ((d.source as NodeDatum).size || 10) +
              ((d.target as NodeDatum).size || 10);
            return s * 5 + 60;
          })
          .strength(0.3)
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d) => -(d as NodeDatum).size * 35)
      )
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force(
        "collision",
        d3.forceCollide<NodeDatum>().radius((d) => d.size + 14)
      );

    // Glow filter
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "5")
      .attr("result", "blur");
    filter
      .append("feFlood")
      .attr("flood-color", "#ffffff")
      .attr("flood-opacity", "0.35")
      .attr("result", "color");
    filter
      .append("feComposite")
      .attr("in", "color")
      .attr("in2", "blur")
      .attr("operator", "in")
      .attr("result", "glow");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "glow");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // Links
    const link = g
      .append("g")
      .selectAll("line")
      .data(linkData)
      .join("line")
      .attr("stroke", "rgba(255,255,255,0.08)")
      .attr("stroke-width", 0.8);

    // Nodes
    const node = g
      .append("g")
      .selectAll<SVGGElement, NodeDatum>("g")
      .data(nodeData)
      .join("g")
      .attr("cursor", interactive ? "pointer" : "default");

    if (interactive) {
      node.call(
        d3
          .drag<SVGGElement, NodeDatum>()
          .on("start", (e, d) => {
            if (!e.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (e, d) => {
            d.fx = e.x;
            d.fy = e.y;
          })
          .on("end", (e, d) => {
            if (!e.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );
    }

    node
      .append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => (d.size >= 28 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)"))
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", (d) => (d.size >= 28 ? 0.5 : d.size >= 16 ? 0.3 : 0.18))
      .attr("stroke-width", (d) => (d.size >= 28 ? 2 : d.size >= 16 ? 1.5 : 1));

    node
      .append("text")
      .text((d) => d.id.toUpperCase())
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.size + 16)
      .attr("fill", "#ffffff")
      .attr("fill-opacity", (d) => (d.size >= 28 ? 1 : d.size >= 16 ? 0.75 : 0.55))
      .attr("font-size", (d) =>
        d.size >= 28 ? 11 : d.size >= 16 ? 9 : 8
      )
      .attr("font-family", "Inter, sans-serif")
      .attr("font-weight", "500")
      .attr("letter-spacing", "0.12em");

    if (interactive) {
      // Hover
      node.on("mouseenter", (_e, d) => {
        if (selectedRef.current) return;
        const connected = LINKS.filter(
          (l) => l[0] === d.id || l[1] === d.id
        ).map((l) => (l[0] === d.id ? l[1] : l[0]));

        node
          .select("circle")
          .transition()
          .duration(200)
          .attr("stroke-opacity", (n: NodeDatum) =>
            n.id === d.id || connected.includes(n.id) ? 0.8 : 0.05
          );
        node
          .select("text")
          .transition()
          .duration(200)
          .attr("fill-opacity", (n: NodeDatum) =>
            n.id === d.id || connected.includes(n.id) ? 1 : 0.08
          );
        node
          .filter((n: NodeDatum) => n.id === d.id)
          .select("circle")
          .attr("filter", "url(#glow)");

        link
          .transition()
          .duration(200)
          .attr("stroke", (l) =>
            (l.source as NodeDatum).id === d.id ||
            (l.target as NodeDatum).id === d.id
              ? "rgba(255,255,255,0.35)"
              : "rgba(255,255,255,0.02)"
          )
          .attr("stroke-width", (l) =>
            (l.source as NodeDatum).id === d.id ||
            (l.target as NodeDatum).id === d.id
              ? 1.5
              : 0.8
          );
      });

      node.on("mouseleave", () => {
        if (selectedRef.current) return;
        resetHighlight();
      });
    }

    function resetHighlight() {
      node
        .select("circle")
        .transition()
        .duration(200)
        .attr("stroke-opacity", (d: NodeDatum) =>
          d.size >= 28 ? 0.5 : d.size >= 16 ? 0.3 : 0.18
        )
        .attr("filter", null);
      node
        .select("text")
        .transition()
        .duration(200)
        .attr("fill-opacity", (d: NodeDatum) =>
          d.size >= 28 ? 1 : d.size >= 16 ? 0.75 : 0.55
        );
      link
        .transition()
        .duration(200)
        .attr("stroke", "rgba(255,255,255,0.08)")
        .attr("stroke-width", 0.8);
    }

    if (interactive) {
      // Click
      node.on("click", (e, d) => {
        e.stopPropagation();
        setSelected((prev) => (prev === d.id ? null : d.id));
        const t = d3.zoomIdentity
          .translate(w / 2, h / 2)
          .scale(1.4)
          .translate(-(d.x || 0), -(d.y || 0));
        svg.transition().duration(500).call(zoom.transform, t);
      });

      svg.on("click", () => {
        setSelected(null);
        resetHighlight();
      });
    }

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as NodeDatum).x!)
        .attr("y1", (d) => (d.source as NodeDatum).y!)
        .attr("x2", (d) => (d.target as NodeDatum).x!)
        .attr("y2", (d) => (d.target as NodeDatum).y!);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Initial fit zoom
    const fitScale = interactive ? 0.85 : 0.62;
    const settle = setTimeout(() => {
      svg
        .transition()
        .duration(interactive ? 1000 : 0)
        .call(
          zoom.transform,
          d3.zoomIdentity
            .translate(w / 2, h / 2)
            .scale(fitScale)
            .translate(-w / 2, -h / 2)
        );
    }, interactive ? 600 : 300);

    const handleResize = () => {
      const nw = container?.clientWidth || window.innerWidth;
      const nh = container?.clientHeight || window.innerHeight;
      svg.attr("width", nw).attr("height", nh);
      simulation.force("center", d3.forceCenter(nw / 2, nh / 2));
      simulation.alpha(0.1).restart();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(settle);
      simulation.stop();
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  return (
    <>
      {/* Preview card — click to expand (skipped when externally controlled) */}
      {renderTrigger && (
        <button
          className="graph-frame"
          onClick={() => setInternalExpanded(true)}
          aria-label="Expand artifact"
        >
          {!expanded && <svg ref={svgRef} className="graph-frame-svg" />}
          <div className="graph-frame-overlay">
            <span className="graph-frame-cta">Expand artifact</span>
          </div>
        </button>
      )}

      {/* Expanded full-screen browser */}
      {expanded && (
        <div className="graph-overlay">
          <svg ref={svgRef} className="graph-svg" />

          <button
            className="graph-overlay-close"
            onClick={close}
            aria-label="Back to artifacts"
          >
            &times;
          </button>

          {selectedNode && (
            <div className="graph-sidebar">
              <button className="modal-close" onClick={() => setSelected(null)}>
                &times;
              </button>
              <h3 className="graph-sidebar-title">{selectedNode.id}</h3>
              <p className="graph-sidebar-body">{selectedNode.body}</p>
              {connectedIds.length > 0 && (
                <>
                  <span className="graph-sidebar-label">CONNECTED TO</span>
                  <div className="graph-sidebar-pills">
                    {connectedIds.map((id) => (
                      <button
                        key={id}
                        className="graph-pill"
                        onClick={() => setSelected(id)}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
