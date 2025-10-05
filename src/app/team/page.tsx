"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
// Supabase removed from site; team page uses local access-only UI
import { Home as HomeIcon, Users, Calendar as CalendarIcon, Copy, Menu, ArrowRight, CalendarCheck2, UserSearch, CalendarDays, AlertTriangle, Link as LinkIcon } from "lucide-react";

export default function Team() {
  const [hasAccess, setHasAccess] = useState(true);
  const [selectedSection, setSelectedSection] = useState<"home" | "members" | "scheduler">("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [memberQuery, setMemberQuery] = useState("");

  const allowedNames = [
    "armaan",
    "simeon",
    "arjun",
    "eshika",
    "shivani",
    "valerie",
    "david",
    "anish",
    "dhruv",
    "abdul",
    "nidhi",
    "meet",
    "katelyn",
    "jasmine",
    "nila",
    "siya",
    "kaushi",
    "maggie",
    "shruthi",
  ];

  const onSubmit = async (_e: React.FormEvent) => {};

  // Access is enforced via middleware + cookie at /team; always render content

  const renderHome = () => {
    const events = [
      { id: 1, title: "Studio shoot – promo", date: "Mon", time: "3:30p" },
      { id: 2, title: "Sprint planning", date: "Wed", time: "12:00p" },
      { id: 3, title: "Partnership call", date: "Fri", time: "10:00a" },
    ];

    const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
      <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <div className="mt-4 space-y-2 text-sm leading-relaxed text-white/90">{children}</div>
      </section>
    );

    const QuickTile = ({ icon, title, desc, onClick, ariaLabel }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void; ariaLabel: string }) => (
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className="group w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 text-left shadow-sm transition hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
            {icon}
          </div>
          <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-0.5 transition" />
        </div>
        <div className="mt-3 text-base font-medium">{title}</div>
        <div className="mt-1 text-sm text-white/80">{desc}</div>
      </button>
    );

    return (
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Moments Team Hub</h1>
          <p className="mt-2 text-sm text-white/80 max-w-2xl">Your central place for people, scheduling, and requests. Use it to find teammates, book time, and get help fast.</p>
        </header>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <QuickTile
            icon={<CalendarCheck2 className="h-5 w-5" />}
            title="Book time / Submit a request"
            desc="Use the Scheduler for filming, design/tech help, edits, or 1:1s."
            onClick={() => setSelectedSection("scheduler")}
            ariaLabel="Open Scheduler"
          />
          <QuickTile
            icon={<UserSearch className="h-5 w-5" />}
            title="Find someone"
            desc="Check Members for roles, skills, and contact."
            onClick={() => setSelectedSection("members")}
            ariaLabel="Open Members"
          />
          <QuickTile
            icon={<CalendarDays className="h-5 w-5" />}
            title="View team calendar"
            desc="See shoots, meetings, and deadlines."
            onClick={() => window.open("https://calendar.google.com/calendar/embed?src=bWFrZW1vbWVudHNhcHBAZ21haWwuY29t", "_blank")}
            ariaLabel="Open Calendar"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info grid */}
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="Who We Are (Org Overview)">
              <div>Management: <span className="text-white">Armaan, Simeon</span> <span className="text-white/80">(Ops lead: Arjun)</span></div>
              <div>Engineering (Co-heads: Simeon, Dhruv): App, website, infra</div>
              <div>Marketing (Heads: Armaan, Simeon): Content, digital media, design</div>
              <div>Growth (Head: Shivani): Partnerships, field ops, submissions</div>
              <div className="text-white/75">Tip: The Members page shows each sub-team, leads, and who to ping.</div>
            </InfoCard>

            <InfoCard title="How We Work">
              <div>Communication: Slack first. Use threads; escalate with @team-lead if blocked &gt;24h.</div>
              <div>Docs: Keep assets in shared Drive/Notion folders (linked in each request).</div>
              <div className="space-y-1">
                <div className="font-medium">Cadence:</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Weekly standups by sub-team</li>
                  <li>Content & event calendar reviewed on Mondays</li>
                  <li>Ship small, ship often; post demos in Slack #showcase</li>
                </ul>
              </div>
            </InfoCard>

            <InfoCard title="Request Types (use the Scheduler)">
              <ul className="list-disc pl-5 space-y-1">
                <li>Filming / Studio time – describe shot list, location, talent, props.</li>
                <li>Editing / Design – attach files, brand goal, deadline.</li>
                <li>Engineering – bug, feature, or support; include repro steps and priority.</li>
                <li>Growth / Partnerships – org, contact, desired outcome.</li>
                <li>1:1 / Feedback – pick a lead and add context.</li>
              </ul>
              <div className="mt-3 text-white/80 text-sm">
                <div className="font-medium">Service targets (typical):</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Same-week filming slots if booked ≥48h ahead.</li>
                  <li>Design/edit turnarounds 2–5 days depending on scope.</li>
                  <li>Eng support triage within 24h; critical issues same-day.</li>
                </ul>
              </div>
            </InfoCard>

            <InfoCard title="Scheduling & Calendar">
              <div>Open Scheduler → pick time → add clear description + links.</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>If filming: arrive 10 min early; bring gear/props; confirm location in event.</li>
                <li>If you can’t make it: cancel/reschedule as soon as you know.</li>
              </ul>
            </InfoCard>

            <InfoCard title="Content Workflow (quick)">
              <div>Idea → Script/Shot list → Schedule → Shoot → Edit → Review → Publish</div>
              <div>Use the Scheduler for each step; attach assets. Follow brand kit (logo, neutral accent, tone: friendly, clean).</div>
            </InfoCard>

            <InfoCard title="Engineering Workflow (quick)">
              <div>Issue → Triage → Assign → PR → Review → Deploy → Post demo</div>
              <div>Include repro steps, expected vs actual, screenshots/video. Use the Scheduler for live help.</div>
            </InfoCard>

            <InfoCard title="Onboarding Checklist (for new interns)">
              <ul className="list-disc pl-5 space-y-1">
                <li>Join Slack + channels, add your role to profile.</li>
                <li>Read brand kit + voice guidelines.</li>
                <li>Add availability to Scheduler (recurring).</li>
                <li>Meet your team lead (book 15 min).</li>
                <li>Get Drive/Notion access; browse recent work.</li>
              </ul>
            </InfoCard>

            <InfoCard title="Expectations">
              <ul className="list-disc pl-5 space-y-1">
                <li>Communicate early; over-share context.</li>
                <li>Own your task; ask for help when blocked.</li>
                <li>Protect quality and the brand.</li>
                <li>Be on time; update the event if things change.</li>
              </ul>
            </InfoCard>

            <InfoCard title="Helpful Links">
              <div className="flex flex-wrap gap-3 text-sm">
                {[
                  { label: "Brand kit", href: "#" },
                  { label: "Asset folder", href: "#" },
                  { label: "Shot list template", href: "#" },
                  { label: "Bug report template", href: "#" },
                  { label: "Social calendar", href: "#" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
                    <LinkIcon className="h-3.5 w-3.5" /> {l.label}
                  </a>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Team Task Manager">
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                <iframe
                  src="https://armaanjhajj.notion.site/ebd/2804f405414e8008b3c9d49e11ab8645?v=2804f405414e8026bdef000cfe3cf87b"
                  width="100%"
                  height="600"
                  frameBorder={0}
                  allowFullScreen
                />
              </div>
            </InfoCard>

            <InfoCard title="Moments Calendar">
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                <iframe
                  src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&title=Moments%20Calnedar&src=bWFrZW1vbWVudHNhcHBAZ21haWwuY29t&src=NTY4NzU4MmYyZDQyNTYzMDRjMWJlYzM3Yjk1Mjg2YTdmOGM3OWEzZWQ1MWNhOGVmMzY0YzRiMDVmMjIyZmEwNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039be5&color=%23616161&color=%230b8043"
                  width="100%"
                  height="600"
                  frameBorder={0}
                  scrolling="no"
                />
              </div>
            </InfoCard>

            <InfoCard title="Need help fast?">
              <ul className="list-disc pl-5 space-y-1">
                <li>Production urgent: <span className="text-white">@Management</span></li>
                <li>Tech down / app broken: <span className="text-white">@Engineering-On-Call</span></li>
                <li>Event-day changes: <span className="text-white">@Growth Lead</span></li>
              </ul>
              <div className="mt-2 inline-flex items-center gap-2 text-yellow-300/90"><AlertTriangle className="h-4 w-4" /> Please add as much context as possible.</div>
            </InfoCard>
          </div>

          {/* Right rail */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm text-black">
              <h2 className="text-xl font-semibold tracking-tight">Upcoming events</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {events.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3">
                    <div className="truncate">
                      <div className="font-medium truncate">{e.title}</div>
                      <div className="text-black/60">{e.date} • {e.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <a
                href="https://calendar.google.com/calendar/embed?src=bWFrZW1vbWVudHNhcHBAZ21haWwuY29t"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-black underline"
              >
                Open full calendar <ArrowRight className="h-4 w-4" />
              </a>
            </section>

            <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm text-black">
              <h2 className="text-xl font-semibold tracking-tight">Quick links</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="underline">Scheduler</a></li>
                <li><a href="#" className="underline">Brand kit</a></li>
                <li><a href="#" className="underline">Asset folder</a></li>
              </ul>
            </section>

            <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm text-black">
              <h2 className="text-xl font-semibold tracking-tight">Contact leads</h2>
              <ul className="mt-4 space-y-2 text-sm text-black/80">
                <li><span className="text-black">Management</span> — Armaan, Simeon</li>
                <li><span className="text-black">Engineering</span> — Simeon, Dhruv</li>
                <li><span className="text-black">Marketing</span> — Armaan, Simeon</li>
                <li><span className="text-black">Growth</span> — Shivani</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    );
  };

  const BadgePill = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-xs text-white/80">{children}</span>
  );

  const SectionCard = ({ title, heads, children, copyText }: { title: string; heads?: string; children: React.ReactNode; copyText?: string }) => (
    <section
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-sm transition will-change-transform motion-reduce:transition-none hover:shadow-md hover:-translate-y-px"
      aria-label={title}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <div className="flex items-center gap-2">
          {heads && <BadgePill>Heads: {heads}</BadgePill>}
          {copyText && (
            <button
              type="button"
              aria-label={`Copy ${title} members`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              onClick={() => navigator.clipboard.writeText(copyText)}
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-4 text-sm leading-relaxed">{children}</div>
    </section>
  );

  const MemberList = ({ people }: { people: string[] }) => (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 list-disc pl-5 text-white/90">
      {people.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );

  const renderMembers = () => {
    // Organization data for indexing and rendering search results
    type RoleBlock = { label: string; people: string[] };
    type Subteam = { name: string; roles: RoleBlock[] };
    type Team = { name: string; heads?: string[]; blocks?: string[]; subteams?: Subteam[] };

    const teamsData: Team[] = [
      { name: "Management", blocks: ["Armaan", "Simeon", "Arjun — lead operations and overall manager"] },
      {
        name: "Engineering",
        heads: ["Simeon", "Dhruv"],
        subteams: [
          { name: "App Development", roles: [ { label: "Leads", people: ["Armaan", "Simeon", "Dhruv"] } ] },
          { name: "Website Management", roles: [ { label: "Team", people: ["Armaan", "Simeon"] } ] },
        ],
      },
      {
        name: "Marketing",
        heads: ["Armaan", "Simeon"],
        subteams: [
          {
            name: "Content Media (TikToks, Reels, YouTube)",
            roles: [
              { label: "Lead Content Directors", people: ["Valerie", "David", "Anish"] },
              { label: "Team", people: ["Nidhi", "Katelyn", "Jasmine", "Nila", "David", "Anish", "Valerie (pending)"] },
            ],
          },
          { name: "Digital Media (Blogs, Articles, Case Studies)", roles: [ { label: "Team", people: ["Nidhi", "Armaan", "Simeon", "Katelyn"] } ] },
          { name: "Graphic Design (Infographics, Carousels, Posters)", roles: [ { label: "Team", people: ["Shruthi", "Katelyn", "Armaan"] } ] },
        ],
      },
      {
        name: "Growth",
        heads: ["Shivani"],
        subteams: [
          { name: "Partnerships", roles: [ { label: "Head", people: ["Shivani"] } ] },
          { name: "Field Ops", roles: [ { label: "Team", people: ["Arjun", "Eshika", "Shruthi"] } ] },
          { name: "Submissions (news, blogs, media firms)", roles: [ { label: "Team", people: ["Armaan", "Nidhi"] } ] },
        ],
      },
    ];

    // Build member -> roles index
    const memberIndex: Record<string, { display: string; roles: string[] }> = {};
    const addRole = (nameRaw: string, role: string) => {
      const normalized = nameRaw.toLowerCase().replace(/\s*\(.*?\)\s*/g, "").trim();
      const display = nameRaw;
      if (!memberIndex[normalized]) memberIndex[normalized] = { display, roles: [] };
      memberIndex[normalized].roles.push(role);
    };

    for (const t of teamsData) {
      if (t.blocks) {
        for (const n of t.blocks) addRole(n, `${t.name}`);
      }
      if (t.heads) {
        for (const h of t.heads) addRole(h, `${t.name} — Head`);
      }
      if (t.subteams) {
        for (const s of t.subteams) {
          for (const r of s.roles) {
            for (const p of r.people) addRole(p, `${t.name} › ${s.name}${r.label ? ` — ${r.label}` : ""}`);
          }
        }
      }
    }

    const allNames = Object.values(memberIndex).map((m) => m.display);
    const query = memberQuery.trim().toLowerCase();
    const suggestions = query
      ? Object.entries(memberIndex)
          .filter(([k, v]) => k.includes(query) || v.display.toLowerCase().includes(query))
          .slice(0, 8)
      : [];
    return (
      <div>
        {/* Title + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Team Organization</h1>
          <div className="relative max-w-md w-full">
            <input
              aria-label="Search teams, people"
              placeholder="Search teams, people…"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              value={memberQuery}
              onChange={(e) => setMemberQuery(e.target.value)}
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-white/15 bg-black/90 backdrop-blur p-2 shadow-lg">
                {suggestions.map(([key, m]) => (
                  <button
                    key={key}
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    onClick={() => setMemberQuery(m.display)}
                  >
                    {m.display}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard title="Management" copyText={["Armaan","Simeon","Arjun — lead operations and overall manager"].join(", ")}> 
            <MemberList people={["Armaan","Simeon","Arjun — lead operations and overall manager"]} />
          </SectionCard>

          <SectionCard title="Marketing" heads="Armaan, Simeon">
            <div>
              <div className="text-sm font-semibold text-white/80 flex items-center gap-2">Content Media (TikToks, Reels, YouTube) <BadgePill>Leads</BadgePill></div>
              <div className="mt-2 text-sm text-white/85">Lead Content Directors: Valerie, David, Anish</div>
              <div className="mt-2 text-sm text-white/85 flex items-center gap-2"><BadgePill>Team</BadgePill> Nidhi, Katelyn, Jasmine, Nila, David, Anish, Valerie (pending)</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white/80">Digital Media (Blogs, Articles, Case Studies)</div>
              <div className="mt-2 text-sm text-white/85">Nidhi, Armaan, Simeon, Katelyn</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white/80">Graphic Design (Infographics, Carousels, Posters)</div>
              <div className="mt-2 text-sm text-white/85">Shruthi, Katelyn, Armaan</div>
            </div>
          </SectionCard>

          <SectionCard title="Engineering" heads="Simeon, Dhruv">
            <div>
              <div className="text-sm font-semibold text-white/80 flex items-center gap-2">App Development <BadgePill>Leads</BadgePill></div>
              <div className="mt-2 text-sm text-white/85">Leads: Armaan, Simeon; Dhruv — future feature dev, team lead, project manager</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white/80">Website Management</div>
              <div className="mt-2 text-sm text-white/85">Armaan, Simeon</div>
            </div>
          </SectionCard>

          <SectionCard title="Growth" heads="Shivani">
            <div>
              <div className="text-sm font-semibold text-white/80">Partnerships</div>
              <div className="mt-2 text-sm text-white/85">Shivani</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white/80">Field Ops</div>
              <div className="mt-2 text-sm text-white/85">Arjun, Eshika, Shruthi</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white/80">Submissions (news, blogs, media firms)</div>
              <div className="mt-2 text-sm text-white/85">Armaan, Nidhi</div>
            </div>
          </SectionCard>
        </div>

        <section className="mb-10 mt-8">
          <h2 className="text-xl md:text-2xl font-semibold">Miro Board</h2>
          <div className="mb-3 text-sm text-white/80">
            <a href="https://miro.com/app/live-embed/uXjVJBBYFF0=/?focusWidget=3458764642306243956&embedMode=view_only_without_ui&embedId=574208405857" target="_blank" rel="noopener noreferrer" className="underline">Open Miro in a new tab</a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-black/10 bg-white">
            <iframe
              width="100%"
              height="640"
              src="https://miro.com/app/live-embed/uXjVJBBYFF0=/?focusWidget=3458764642306243956&embedMode=view_only_without_ui&embedId=574208405857"
              frameBorder={0}
              scrolling="no"
              allow="fullscreen; clipboard-read; clipboard-write"
              allowFullScreen
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold">All Members</h2>
          {/* Live search results */}
          {memberQuery && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/80 mb-2">Search results</div>
              <ul className="space-y-3">
                {suggestions.map(([key, m]) => (
                  <li key={`res-${key}`} className="rounded-lg border border-white/10 p-3">
                    <div className="font-medium">{m.display}</div>
                    <ul className="mt-2 list-disc pl-5 text-sm text-white/85 space-y-1">
                      {m.roles.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </li>
                ))}
                {suggestions.length === 0 && (
                  <li className="text-sm text-white/60">No matches yet. Keep typing…</li>
                )}
              </ul>
            </div>
          )}

          <MemberList people={allNames.map((n) => n.toLowerCase())} />
        </section>
      </div>
    );
  };

  const renderScheduler = () => {
    return (
      <div>
        <div className="mb-3 text-sm text-white/80">
          <a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0B-wkLeaZMNvHvWwEdfmNvqSIlcbHdJQLhnU0TTSETnGVw1WQ2M3xy-p6VT3gFGghl5iNwyIlo?gv=true" target="_blank" rel="noopener noreferrer" className="underline">Open Scheduler in a new tab</a>
        </div>
        <div className="rounded-2xl overflow-hidden border border-black/10 bg-white">
          <iframe
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0B-wkLeaZMNvHvWwEdfmNvqSIlcbHdJQLhnU0TTSETnGVw1WQ2M3xy-p6VT3gFGghl5iNwyIlo?gv=true"
            style={{ border: 0 }}
            width="100%"
            height="600"
            frameBorder={0}
            scrolling="yes"
          />
        </div>
      </div>
    );
  };

  const brandStyle = { ['--brand' as string]: '#9CA3AF' } as CSSProperties;

  return (
    <main className="py-16" style={brandStyle}>
      {/* Mobile drawer toggle */}
      <div className="px-4 md:hidden mb-3 flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="text-sm text-white/70">Menu</div>
      </div>

      {/* Sidebar (desktop) */}
      <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-[320px] border-r border-white/10 bg-white/5 backdrop-blur z-20">
        <nav className="h-full p-3 text-sm flex flex-col gap-2">
          <button
            type="button"
            className={`group w-full text-left px-3 py-2 rounded-md ring-1 transition ${selectedSection === 'home' ? 'ring-white/10 text-[var(--brand)] bg-white/5' : 'text-white/85 hover:bg-white/10 hover:shadow-sm'}`}
            onClick={() => setSelectedSection('home')}
            aria-label="Home"
          >
            <span className="inline-flex items-center gap-2">
              <HomeIcon className="h-4 w-4" /> Home
            </span>
          </button>
          <button
            type="button"
            className={`group w-full text-left px-3 py-2 rounded-md ring-1 transition ${selectedSection === 'members' ? 'ring-white/10 text-[var(--brand)] bg-white/5' : 'text-white/85 hover:bg-white/10 hover:shadow-sm'}`}
            onClick={() => setSelectedSection('members')}
            aria-label="Members"
          >
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" /> Members
            </span>
          </button>
          <button
            type="button"
            className={`group w-full text-left px-3 py-2 rounded-md ring-1 transition ${selectedSection === 'scheduler' ? 'ring-white/10 text-[var(--brand)] bg-white/5' : 'text-white/85 hover:bg-white/10 hover:shadow-sm'}`}
            onClick={() => setSelectedSection('scheduler')}
            aria-label="Scheduler"
          >
            <span className="inline-flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> Scheduler
            </span>
          </button>
        </nav>
      </aside>

      {/* Drawer (mobile) */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px] border-r border-white/10 bg-black/95 backdrop-blur p-3">
            <nav className="text-sm flex flex-col gap-2">
              <button
                type="button"
                className={`w-full text-left px-3 py-2 rounded-md ring-1 transition ${selectedSection === 'home' ? 'ring-white/10 text-[var(--brand)] bg-white/5' : 'text-white/85 hover:bg-white/10 hover:shadow-sm'}`}
                onClick={() => { setSelectedSection('home'); setDrawerOpen(false); }}
              >
                <span className="inline-flex items-center gap-2">
                  <HomeIcon className="h-4 w-4" /> Home
                </span>
              </button>
              <button
                type="button"
                className={`w-full text-left px-3 py-2 rounded-md ring-1 transition ${selectedSection === 'members' ? 'ring-white/10 text-[var(--brand)] bg-white/5' : 'text-white/85 hover:bg-white/10 hover:shadow-sm'}`}
                onClick={() => { setSelectedSection('members'); setDrawerOpen(false); }}
              >
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" /> Members
                </span>
              </button>
              <button
                type="button"
                className={`w-full text-left px-3 py-2 rounded-md ring-1 transition ${selectedSection === 'scheduler' ? 'ring-white/10 text-[var(--brand)] bg-white/5' : 'text-white/85 hover:bg-white/10 hover:shadow-sm'}`}
                onClick={() => { setSelectedSection('scheduler'); setDrawerOpen(false); }}
              >
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Scheduler
                </span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 ml-0 md:ml-[320px]">
        {selectedSection === 'home' && renderHome()}
        {selectedSection === 'members' && renderMembers()}
        {selectedSection === 'scheduler' && renderScheduler()}
      </section>
    </main>
  );
}



