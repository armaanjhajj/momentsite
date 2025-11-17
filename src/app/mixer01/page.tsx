"use client";
import { useState, useEffect } from 'react';

type RSVPStatus = 'attending' | 'maybe' | 'declined';

interface Chapter {
  letters: string;
  name: string;
  type: 'fraternity' | 'sorority' | 'professional' | 'special';
  inviteCode: string;
}

interface IndividualRSVP {
  id: string;
  chapterInviteCode: string;
  name: string;
  email: string;
  favoriteColor?: string;
  status: RSVPStatus;
  createdAt: string;
}

interface ChapterRSVPSummary {
  attendees: IndividualRSVP[];
  attendingCount: number;
}

const chapters: Chapter[] = [
  // Fraternities
  { letters: 'ΖΨ', name: 'Zeta Psi', type: 'fraternity', inviteCode: 'ZPSI2025' },
  { letters: 'ΧΦ', name: 'Chi Phi', type: 'fraternity', inviteCode: 'CHIPHI2025' },
  { letters: 'ΦΓΔ', name: 'Phi Gamma Delta', type: 'fraternity', inviteCode: 'FIJI2025' },
  { letters: 'ΣΑΜ', name: 'Sigma Alpha Mu', type: 'fraternity', inviteCode: 'SAM2025' },
  { letters: 'ΠΚΦ', name: 'Pi Kappa Phi', type: 'fraternity', inviteCode: 'PIKE2025' },
  { letters: 'ΠΚΑ', name: 'Pi Kappa Alpha', type: 'fraternity', inviteCode: 'PKA2025' },
  { letters: 'ΑΕΠ', name: 'Alpha Epsilon Pi', type: 'fraternity', inviteCode: 'AEPI2025' },
  { letters: 'ΣΧ', name: 'Sigma Chi', type: 'fraternity', inviteCode: 'SIGCHI2025' },
  { letters: 'ΖΒΤ', name: 'Zeta Beta Tau', type: 'fraternity', inviteCode: 'ZBT2025' },
  { letters: 'ΘΧ', name: 'Theta Chi', type: 'fraternity', inviteCode: 'THETACHI2025' },
  { letters: 'ΚΣ', name: 'Kappa Sigma', type: 'fraternity', inviteCode: 'KAPPSIG2025' },
  { letters: 'ΔΧ', name: 'Delta Chi', type: 'fraternity', inviteCode: 'DELCHI2025' },
  { letters: 'ΑΣΦ', name: 'Alpha Sigma Phi', type: 'fraternity', inviteCode: 'ALPHASIG2025' },
  { letters: 'ΣΠ', name: 'Sigma Pi', type: 'fraternity', inviteCode: 'SIGPI2025' },
  { letters: 'ΤΚΕ', name: 'Tau Kappa Epsilon', type: 'fraternity', inviteCode: 'TKE2025' },
  { letters: 'ΣΒΡ', name: 'Sigma Beta Rho', type: 'fraternity', inviteCode: 'SBR2025' },
  // Sororities
  { letters: 'ΣΔΤ', name: 'Sigma Delta Tau', type: 'sorority', inviteCode: 'SDT2025' },
  { letters: 'ΔΓ', name: 'Delta Gamma', type: 'sorority', inviteCode: 'DG2025' },
  { letters: 'ΑΧΩ', name: 'Alpha Chi Omega', type: 'sorority', inviteCode: 'AXO2025' },
  { letters: 'ΖΤΑ', name: 'Zeta Tau Alpha', type: 'sorority', inviteCode: 'ZTA2025' },
  { letters: 'ΦΜ', name: 'Phi Mu', type: 'sorority', inviteCode: 'PHIMU2025' },
  { letters: 'ΣΚ', name: 'Sigma Kappa', type: 'sorority', inviteCode: 'SIGKAPPA2025' },
  { letters: 'ΦΣΣ', name: 'Phi Sigma Sigma', type: 'sorority', inviteCode: 'PSS2025' },
  { letters: 'ΑΓΔ', name: 'Alpha Gamma Delta', type: 'sorority', inviteCode: 'AGD2025' },
  { letters: 'ΓΦΒ', name: 'Gamma Phi Beta', type: 'sorority', inviteCode: 'GPB2025' },
  { letters: 'ΑΚΑ', name: 'Alpha Kappa Alpha', type: 'sorority', inviteCode: 'AKA2025' },
  { letters: 'ΔΚΔ', name: 'Delta Kappa Delta', type: 'sorority', inviteCode: 'DKD2025' },
  // Professional/Academic
  { letters: 'ΘΤ', name: 'Theta Tau', type: 'professional', inviteCode: 'THETATAU2025' },
  { letters: 'ΔΣΠ', name: 'Delta Sigma Pi', type: 'professional', inviteCode: 'DSP2025' },
  { letters: 'ΑΚΨ', name: 'Alpha Kappa Psi', type: 'professional', inviteCode: 'AKPSI2025' },
  { letters: 'ΦΧΘ', name: 'Phi Chi Theta', type: 'professional', inviteCode: 'PCT2025' },
  { letters: 'ΦΑΔ', name: 'Phi Alpha Delta', type: 'professional', inviteCode: 'PAD2025' },
  { letters: 'ΦΔΕ', name: 'Phi Delta Epsilon', type: 'professional', inviteCode: 'PDE2025' },
  { letters: 'ΜΕΔ', name: 'Mu Epsilon Delta', type: 'professional', inviteCode: 'MED2025' },
  { letters: 'ΚΘΠ', name: 'Kappa Theta Pi', type: 'professional', inviteCode: 'KTP2025' },
  // Special groups
  { letters: 'MT', name: 'Moments Team', type: 'special', inviteCode: 'MOMENTS2025' },
  { letters: 'F&F', name: 'Friends & Family', type: 'special', inviteCode: 'FF2025' },
];

export default function MixerPage() {
  const [allRSVPs, setAllRSVPs] = useState<IndividualRSVP[]>([]);
  const [formData, setFormData] = useState({
    inviteCode: '',
    name: '',
    email: '',
    favoriteColor: '',
    status: 'attending' as RSVPStatus
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load RSVPs from API on mount
  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const response = await fetch('/api/mixer01/rsvp');
      if (response.ok) {
        const data = await response.json();
        setAllRSVPs(data || []);
      }
    } catch {
      // Silently handle errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate chapter code exists
    const chapter = chapters.find(
      c => c.inviteCode.toLowerCase() === formData.inviteCode.toLowerCase()
    );
    
    if (!chapter) {
      alert('Invalid invite code. Please check and try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/mixer01/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteCode: chapter.inviteCode,
          name: formData.name,
          email: formData.email,
          favoriteColor: formData.favoriteColor || null,
          status: formData.status
        })
      });

      if (response.ok) {
        await fetchRSVPs();
        setShowSuccess(true);
        setFormData({ inviteCode: '', name: '', email: '', favoriteColor: '', status: 'attending' });
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit RSVP');
      }
    } catch {
      alert('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChapterSummary = (inviteCode: string): ChapterRSVPSummary => {
    const attendees = allRSVPs.filter(r => r.chapterInviteCode === inviteCode);
    const attendingCount = attendees.filter(
      a => a.status === 'attending' || a.status === 'maybe'
    ).length;
    return { attendees, attendingCount };
  };

  const getTotalAttending = (): number => {
    return allRSVPs.filter(
      r => r.status === 'attending' || r.status === 'maybe'
    ).length;
  };

  // Filter to only show chapters with RSVPs
  const chaptersWithRSVPs = chapters.filter(chapter => {
    const summary = getChapterSummary(chapter.inviteCode);
    return summary.attendees.length > 0;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container pt-12 pb-12 md:pt-16 md:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/50 border border-neutral-800 text-xs text-white/60 mb-6">
            <span>Invite-only</span>
            <span>·</span>
            <span>Limited capacity</span>
            <span>·</span>
            <span>RSVP required</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold mb-4">
            Moments × Panhellenic
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-6">
            Private beta coffee mixer for Rutgers Greek life
          </p>
          <p className="text-white/70 max-w-[600px] mx-auto leading-relaxed">
            We&apos;ve rented out Semicolon. It&apos;s a private beta test / mixer. 
            Intention: bring together members across Panhellenic, IFC, MGC, etc., 
            to connect and help shape this new in-person social product.
          </p>
        </div>
      </section>

      {/* Event Details Strip */}
      <section className="container pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Date & Time</p>
              <p className="text-lg font-medium">Thursday, November 20</p>
              <p className="text-white/70">5:30 PM</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Location</p>
              <p className="text-lg font-medium">Semicolon Café</p>
              <p className="text-white/70">New Brunswick</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Format</p>
              <p className="text-lg font-medium">Private Beta Mixer</p>
              <p className="text-white/70">Coffee & Conversations</p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="container pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">What to Expect</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-3">Why this event exists</h3>
              <p className="text-white/70 leading-relaxed">
                We rented out the entire café so it&apos;s a closed environment just for Greek members. 
                It&apos;s a chance to give feedback on Moments before anyone else.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3">What happens there</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-white/40 mt-1">•</span>
                  <span>Grab some coffee / drinks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40 mt-1">•</span>
                  <span>Quick 5–10 min intro to what Moments is</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40 mt-1">•</span>
                  <span>Hang out and meet other org members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40 mt-1">•</span>
                  <span>Give us feedback and help shape the first social app to come out of Rutgers</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3">How you&apos;ll be involved</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-white/40 mt-1">•</span>
                  <span>Quick live demo of the app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40 mt-1">•</span>
                  <span>Honest feedback on the concept</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40 mt-1">•</span>
                  <span>Explore collaborations: co-hosted events, house parties, philanthropy tie-ins, etc.</span>
                </li>
              </ul>
              <p className="mt-4 text-white/70 italic">
                No pressure, no commitment — just coffee and conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Form */}
      <section className="container pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6">RSVP for the Event</h2>
            
            {showSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                ✓ RSVP submitted successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="inviteCode" className="block text-sm font-medium mb-2">
                  Chapter/Group Code *
                </label>
                <input
                  type="text"
                  id="inviteCode"
                  required
                  value={formData.inviteCode}
                  onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}
                  placeholder="Enter your chapter's invite code"
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label htmlFor="favoriteColor" className="block text-sm font-medium mb-2">
                  Favorite Color (optional)
                </label>
                <select
                  id="favoriteColor"
                  value={formData.favoriteColor}
                  onChange={(e) => setFormData({...formData, favoriteColor: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="">Select a color</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                  <option value="pink">Pink</option>
                  <option value="orange">Orange</option>
                  <option value="teal">Teal</option>
                  <option value="cyan">Cyan</option>
                  <option value="indigo">Indigo</option>
                  <option value="lime">Lime</option>
                  <option value="emerald">Emerald</option>
                  <option value="rose">Rose</option>
                  <option value="fuchsia">Fuchsia</option>
                  <option value="violet">Violet</option>
                  <option value="amber">Amber</option>
                  <option value="sky">Sky</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">RSVP Status *</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-800 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="attending"
                      checked={formData.status === 'attending'}
                      onChange={(e) => setFormData({...formData, status: e.target.value as RSVPStatus})}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">Attending</div>
                      <div className="text-sm text-white/60">I&apos;ll be there</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-800 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="maybe"
                      checked={formData.status === 'maybe'}
                      onChange={(e) => setFormData({...formData, status: e.target.value as RSVPStatus})}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">Maybe — I&apos;ll confirm soon</div>
                      <div className="text-sm text-white/60">Not sure yet</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-800 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="declined"
                      checked={formData.status === 'declined'}
                      onChange={(e) => setFormData({...formData, status: e.target.value as RSVPStatus})}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">Not Attending</div>
                      <div className="text-sm text-white/60">Can&apos;t make it</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Chapters Attending */}
      {chaptersWithRSVPs.length > 0 && (
        <section className="container pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold mb-2">Attending Chapters</h2>
              <p className="text-white/60">Live RSVP board — updates as members respond</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chaptersWithRSVPs.map((chapter) => {
                const summary = getChapterSummary(chapter.inviteCode);
                return (
                  <div
                    key={chapter.inviteCode}
                    className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-4 hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-2xl font-bold mb-1">{chapter.letters}</div>
                        <p className="text-xs text-white/70">{chapter.name}</p>
                      </div>
                      <div className="text-sm font-medium text-white/80">
                        {summary.attendingCount} attending
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      {summary.attendees
                        .filter(a => a.status !== 'declined')
                        .map(attendee => (
                          <div key={attendee.id} className="flex items-center gap-2">
                            <span className="text-white/90">
                              {attendee.name}
                            </span>
                            {attendee.status === 'maybe' && (
                              <span className="text-white/40 text-xs">(Maybe)</span>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Map & Logistics */}
      <section className="container pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">Location & Logistics</h2>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 overflow-hidden">
            <div className="aspect-video bg-white/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7448.963947838719!2d-74.45217705554954!3d40.49486851046555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3c7fa9f8acd6d%3A0x9189b788885e5bf4!2sSemicolon%20Cafe!5e0!3m2!1sen!2sus!4v1763272692122!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
            <div className="p-6">
              <p className="text-lg font-medium mb-2">Semicolon Café</p>
              <p className="text-white/70 mb-4">356 George St, New Brunswick, NJ</p>
              <p className="text-sm text-white/60 mb-2">5–7 min walk from campus</p>
              <p className="text-sm text-white/60">
                Arrive any time between 5:30–6:00 PM. We&apos;ll be there the whole time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="container pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-6">
            <p className="text-sm text-white/60 mb-2">
              This page is not listed publicly. Please don&apos;t share outside your chapter.
            </p>
            <p className="text-sm text-white/50">
              Each chapter has a unique invite code — if you need yours resent, contact{' '}
              <a href="mailto:support@havemoments.com" className="text-white/70 hover:text-white underline">
                support@havemoments.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
