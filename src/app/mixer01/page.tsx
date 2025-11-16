"use client";
import { useState, useEffect } from 'react';

type RSVPStatus = 'pending' | 'attending' | 'maybe' | 'declined';
type GuestCount = 1 | 2;

interface Chapter {
  letters: string;
  name: string;
  type: 'fraternity' | 'sorority' | 'professional';
  inviteCode: string;
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
  // Professional/Academic
  { letters: 'ΘΤ', name: 'Theta Tau', type: 'professional', inviteCode: 'THETATAU2025' },
  { letters: 'ΔΣΠ', name: 'Delta Sigma Pi', type: 'professional', inviteCode: 'DSP2025' },
  { letters: 'ΑΚΨ', name: 'Alpha Kappa Psi', type: 'professional', inviteCode: 'AKPSI2025' },
  { letters: 'ΦΧΘ', name: 'Phi Chi Theta', type: 'professional', inviteCode: 'PCT2025' },
  { letters: 'ΦΑΔ', name: 'Phi Alpha Delta', type: 'professional', inviteCode: 'PAD2025' },
  { letters: 'ΦΔΕ', name: 'Phi Delta Epsilon', type: 'professional', inviteCode: 'PDE2025' },
  { letters: 'ΜΕΔ', name: 'Mu Epsilon Delta', type: 'professional', inviteCode: 'MED2025' },
];

interface ChapterRSVP {
  status: RSVPStatus;
  guestCount?: GuestCount;
  updatedBy?: string;
  updatedAt?: string;
}

export default function MixerPage() {
  const [rsvps, setRsvps] = useState<Record<string, ChapterRSVP>>({});
  const [inviteCode, setInviteCode] = useState('');
  const [presidentName, setPresidentName] = useState('');
  const [authenticatedChapter, setAuthenticatedChapter] = useState<Chapter | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('pending');
  const [guestCount, setGuestCount] = useState<GuestCount>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load RSVPs from API on mount
  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        const response = await fetch('/api/mixer01/rsvp');
        if (response.ok) {
          const data = await response.json();
          setRsvps(data || {});
        }
        // Silently handle errors - table might not exist yet
      } catch {
        // Silently handle errors - table might not exist yet
      }
    };
    fetchRSVPs();
  }, []);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chapter = chapters.find(c => c.inviteCode.toLowerCase() === inviteCode.toLowerCase());
    if (chapter) {
      setAuthenticatedChapter(chapter);
      // Load existing RSVP for this chapter
      const existingRSVP = rsvps[chapter.inviteCode];
      if (existingRSVP) {
        setRsvpStatus(existingRSVP.status);
        setGuestCount(existingRSVP.guestCount || 1);
      }
    } else {
      alert('Invalid invite code. Please check and try again.');
    }
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedChapter) return;

    try {
      const response = await fetch('/api/mixer01/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteCode: authenticatedChapter.inviteCode,
          status: rsvpStatus,
          guestCount: rsvpStatus === 'attending' ? guestCount : undefined,
          updatedBy: presidentName || 'Chapter President',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save RSVP');
      }

      const result = await response.json();
      
      // Refresh RSVPs from server to get latest state
      const refreshResponse = await fetch('/api/mixer01/rsvp');
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setRsvps(refreshedData);
      } else {
        // Fallback: update local state if refresh fails
        const updatedRsvps = {
          ...rsvps,
          [authenticatedChapter.inviteCode]: result.rsvp,
        };
        setRsvps(updatedRsvps);
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error saving RSVP:', error);
      alert('Failed to save RSVP. Please try again.');
    }
  };

  const getStatusColor = (status: RSVPStatus) => {
    switch (status) {
      case 'attending': return 'bg-green-500';
      case 'maybe': return 'bg-yellow-500';
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: RSVPStatus) => {
    switch (status) {
      case 'attending': return 'Confirmed';
      case 'maybe': return 'Maybe / Working on it';
      case 'declined': return "Can't make it";
      default: return 'Awaiting RSVP';
    }
  };

  const getChapterRSVP = (chapter: Chapter): ChapterRSVP => {
    return rsvps[chapter.inviteCode] || { status: 'pending' };
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container pt-12 pb-12 md:pt-16 md:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-6">
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
            Private beta coffee mixer for Rutgers Greek leaders
          </p>
         
        </div>
      </section>

      {/* Event Details Strip */}
      <section className="container pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Date & Time</p>
              <p className="text-lg font-medium">Thursday, November 20</p>
              <p className="text-white/70">5:30 PM</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Location</p>
              <p className="text-lg font-medium">Semicolon Café</p>
              <p className="text-white/70">New Brunswick</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center">
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
                We rented out the entire café so it&apos;s a closed environment just for Greek leaders. 
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
                  <span>Hang out and meet other org leaders</span>
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
                We would love to be partners :)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Panel for Presidents */}
      {!authenticatedChapter && (
        <section className="container pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4">RSVP as Chapter President</h2>
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <label htmlFor="inviteCode" className="block text-sm font-medium mb-2">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    id="inviteCode"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Enter your chapter's invite code"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="presidentName" className="block text-sm font-medium mb-2">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="presidentName"
                    value={presidentName}
                    onChange={(e) => setPresidentName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Your name"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
                >
                  Continue to RSVP
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Authenticated RSVP Form */}
      {authenticatedChapter && (
        <section className="container pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
              <div className="mb-6 pb-6 border-b border-white/10">
                <p className="text-sm text-white/60 mb-2">You&apos;re responding for:</p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{authenticatedChapter.letters}</div>
                  <div>
                    <p className="text-lg font-medium">{authenticatedChapter.name}</p>
                    <p className="text-sm text-white/60 capitalize">{authenticatedChapter.type}</p>
                  </div>
                </div>
              </div>

              {showSuccess && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  Thanks — your chapter is now marked as {getStatusLabel(rsvpStatus)} on the public board.
                </div>
              )}

              <form onSubmit={handleRSVPSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">RSVP Status</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="radio"
                        name="rsvpStatus"
                        value="attending"
                        checked={rsvpStatus === 'attending'}
                        onChange={() => setRsvpStatus('attending')}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <span className="font-medium">Attending</span>
                        {rsvpStatus === 'attending' && (
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setGuestCount(1)}
                              className={`px-3 py-1 text-xs rounded ${
                                guestCount === 1 ? 'bg-white text-black' : 'bg-white/10 text-white/70'
                              }`}
                            >
                              President + 1
                            </button>
                            <button
                              type="button"
                              onClick={() => setGuestCount(2)}
                              className={`px-3 py-1 text-xs rounded ${
                                guestCount === 2 ? 'bg-white text-black' : 'bg-white/10 text-white/70'
                              }`}
                            >
                              President + 2
                            </button>
                          </div>
                        )}
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="radio"
                        name="rsvpStatus"
                        value="maybe"
                        checked={rsvpStatus === 'maybe'}
                        onChange={() => setRsvpStatus('maybe')}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Maybe — I&apos;ll confirm soon</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="radio"
                        name="rsvpStatus"
                        value="declined"
                        checked={rsvpStatus === 'declined'}
                        onChange={() => setRsvpStatus('declined')}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Not Attending</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Update RSVP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthenticatedChapter(null);
                      setInviteCode('');
                    }}
                    className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Change Chapter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Greek Guest List Board */}
      <section className="container pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold mb-2">Invited Chapters</h2>
            <p className="text-white/60">Live RSVP board — updates as presidents respond</p>
          </div>

          {/* Fraternities */}
          <div className="mb-12">
            <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Fraternities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {chapters.filter(c => c.type === 'fraternity').map((chapter) => {
                const rsvp = getChapterRSVP(chapter);
                return (
                  <div
                    key={chapter.inviteCode}
                    className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors relative"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl font-bold">{chapter.letters}</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(rsvp.status)} ${rsvp.status !== 'pending' ? 'animate-pulse' : ''}`} />
                      </div>
                    </div>
                    <p className="text-xs text-white/70 mb-2">{chapter.name}</p>
                    <p className="text-xs text-white/50">{getStatusLabel(rsvp.status)}</p>
                    {rsvp.status === 'attending' && rsvp.guestCount && (
                      <p className="text-xs text-white/60 mt-1">+{rsvp.guestCount}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sororities */}
          <div className="mb-12">
            <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Sororities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {chapters.filter(c => c.type === 'sorority').map((chapter) => {
                const rsvp = getChapterRSVP(chapter);
                return (
                  <div
                    key={chapter.inviteCode}
                    className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors relative"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl font-bold">{chapter.letters}</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(rsvp.status)} ${rsvp.status !== 'pending' ? 'animate-pulse' : ''}`} />
                      </div>
                    </div>
                    <p className="text-xs text-white/70 mb-2">{chapter.name}</p>
                    <p className="text-xs text-white/50">{getStatusLabel(rsvp.status)}</p>
                    {rsvp.status === 'attending' && rsvp.guestCount && (
                      <p className="text-xs text-white/60 mt-1">+{rsvp.guestCount}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Professional/Academic */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Professional & Academic</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {chapters.filter(c => c.type === 'professional').map((chapter) => {
                const rsvp = getChapterRSVP(chapter);
                return (
                  <div
                    key={chapter.inviteCode}
                    className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors relative"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl font-bold">{chapter.letters}</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(rsvp.status)} ${rsvp.status !== 'pending' ? 'animate-pulse' : ''}`} />
                      </div>
                    </div>
                    <p className="text-xs text-white/70 mb-2">{chapter.name}</p>
                    <p className="text-xs text-white/50">{getStatusLabel(rsvp.status)}</p>
                    {rsvp.status === 'attending' && rsvp.guestCount && (
                      <p className="text-xs text-white/60 mt-1">+{rsvp.guestCount}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Map & Logistics */}
      <section className="container pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">Location & Logistics</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
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
          <div className="rounded-lg border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60 mb-2">
              This page is not listed publicly. Please don&apos;t share outside your chapter leadership.
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

