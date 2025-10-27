'use client';

import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['why', 'mission', 'how', 'plan', 'launch'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'why', title: 'Why Moments?', emoji: '💬' },
    { id: 'mission', title: 'Our Mission', emoji: '🧠' },
    { id: 'how', title: 'How It Works', emoji: '📱' },
    { id: 'plan', title: 'Our Plan', emoji: '🎯' },
    { id: 'launch', title: 'Launch Details', emoji: '🚀' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="container pt-20 pb-16">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 text-white">
            About Moments
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
            Breaking down social barriers, one connection at a time
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
                  activeSection === index
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="mr-2">{section.emoji}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Moments Section */}
      <section id="why" className="container pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">
              <span className="text-4xl mr-3">💬</span>
              Why Moments?
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <p className="text-lg text-white/80 leading-relaxed">
                Making friends these days happens almost entirely online. Over time, a bunch of social barriers have just formed that make it really hard to just walk up to people and make friendships (ESPECIALLY for college students). People stick to their cliques and it almost feels off-limits to just approach people nowadays.
              </p>
            </div>
            
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <p className="text-lg text-white/80 leading-relaxed">
                Now, people like me and Sim will still do it anyway because we don&apos;t really care about being annoying as sh*t. But we also recognize how powerful it could be to have a tool that lowers that barrier and basically something that makes authentic in person connection feel natural again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section id="mission" className="container pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">
              <span className="text-4xl mr-3">🧠</span>
              Our Mission
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <h3 className="text-xl font-semibold mb-3 text-white">The Goal (basically)</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                We created <strong>Moments</strong> to help break down those barriers.
              </p>
            </div>
            
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <h3 className="text-xl font-semibold mb-3 text-white">Academic Partnerships</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                We&apos;re partnering with professors and students, particularly within the <strong>Sociology</strong>, <strong>Wellness</strong>, and <strong>Psychology</strong> departments, to understand how tools like this can actually <em>encourage</em> people to connect in real life and not just scroll past each other.
              </p>
            </div>
            
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <h3 className="text-xl font-semibold mb-3 text-white">The Reality</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                Honestly, we&apos;re just tired of walking around campus and feeling like everyone&apos;s unapproachable. Even as relatively resilient guys, loneliness has had <em>huge</em> impacts on both of us, whether we admit it or not.
              </p>
            </div>
            
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <h3 className="text-xl font-semibold mb-3 text-white">The Truth</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                The truth is, you could be the most social or popular person on campus and still feel incredibly lonely. Because being surrounded by people isn&apos;t the same as being <em>known</em> by them. Our goal is to change that.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="container pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">
              <span className="text-4xl mr-3">📱</span>
              How Moments Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Nearby Connections */}
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-xl">📍</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Nearby Connections</h3>
              </div>
              <div className="space-y-3 text-white/80">
                <p className="text-sm leading-relaxed">
                  Discover people around you and build meaningful relationships.
                </p>
                <p className="text-sm leading-relaxed">
                  Moments lets you write a short &quot;mini journal entry&quot; your own honest, unfiltered prompt about who you are and what you&apos;re looking for. Think of it like talking to ChatGPT about your problems, frustrations, or what kind of people you wish you could meet. Just be real.
                </p>
                <p className="text-sm leading-relaxed">
                  From there, <strong>we use AI</strong> to help you discover people nearby with shared vibes, values, or interests and prompt you to meet up.
                </p>
                <p className="text-sm leading-relaxed font-medium">
                  No fake personas, no algorithms chasing clicks. Just honest connection.
                </p>
                <p className="text-sm leading-relaxed italic">
                  (And no, we don&apos;t sell your data.... yet 😉)
                </p>
              </div>
            </div>

            {/* Event Discovery */}
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎉</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Event Discovery</h3>
              </div>
              <div className="space-y-3 text-white/80">
                <p className="text-sm leading-relaxed">
                  Find and join events happening on your campus and nearby.
                </p>
                <p className="text-sm leading-relaxed">
                  Whether you&apos;re hosting a <strong>poker night</strong>, planning a <strong>Smash Bros. tournament</strong>, or you&apos;re part of an <strong>organization</strong> throwing a big campus event and you can post it all here.
                </p>
                <p className="text-sm leading-relaxed">
                  Moments helps you see what&apos;s happening <em>right now</em> on campus, so you&apos;ll never have to say &quot;there&apos;s nothing to do&quot; again. It&apos;s all there and easy to find, easy to join, and super visible to everyone around you.
                </p>
              </div>
            </div>

            {/* Social Feed */}
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-xl">📸</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Social Feed</h3>
              </div>
              <div className="space-y-3 text-white/80">
                <p className="text-sm leading-relaxed">
                  Share your favorite Moments and stay connected with your community.
                </p>
                <p className="text-sm leading-relaxed">
                  You can post memories, selfies, or candid shots from your day and and share them on your campus feed. No need to feel embarrassed; we&apos;ll be posting random, real stuff too.
                </p>
                <p className="text-sm leading-relaxed font-medium">
                  No filters, no fakeness and just people being people. :P
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Plan Section */}
      <section id="plan" className="container pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">
              <span className="text-4xl mr-3">🎯</span>
              Our Plan
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <h3 className="text-xl font-semibold mb-3 text-white">Campus First</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                We&apos;re rolling out on college campuses with the app fully optimized for campus life and local meet-up spots, including partnerships with <strong>cafés and restaurants</strong> that offer verified hangout locations.
              </p>
            </div>
            
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <h3 className="text-xl font-semibold mb-3 text-white">Safe & Verified</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                When you set up a meet-up, Moments will suggest a safe, public place to go and all verified, all nearby. Every user is <strong>.edu verified</strong>, so there&apos;s no risk of random strangers or off-campus weirdos joining in.
              </p>
            </div>
            
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <h3 className="text-xl font-semibold mb-3 text-white">Community Guidelines</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                ⚠️ Quick disclaimer: don&apos;t post anything inappropriate or violate community guidelines. Behavior that violates our TOS will be handled directly through appropriate channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Launch Details Section */}
      <section id="launch" className="container pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">
              <span className="text-4xl mr-3">🚀</span>
              Launch Details
            </h2>
          </div>
          
          <div className="rounded-2xl border border-white/10 p-8 bg-white/5 backdrop-blur text-center">
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
                <h3 className="text-2xl font-semibold text-white mb-4">Timeline</h3>
                <p className="text-lg text-white/80 leading-relaxed">
                  We&apos;re planning our <strong>official rollout before Halloween</strong> or <strong>the first week of November</strong>.
                </p>
              </div>
              
              <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
                <h3 className="text-2xl font-semibold text-white mb-4">Early Access</h3>
                <p className="text-lg text-white/80 leading-relaxed mb-3">
                  During this early access period, you&apos;ll need a <strong>referral code</strong> to join — available through our team or any official &quot;Friends of Moments&quot; on campus.
                </p>
                <p className="text-base text-white/70">
                  We&apos;ll go public soon, but for now:
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xl font-semibold text-white mb-4">happy friend-making, smelly guys! :D</p>
                <div className="flex justify-center space-x-3 text-2xl">
                  <span className="animate-bounce">🎉</span>
                  <span className="animate-bounce" style={{animationDelay: '0.1s'}}>🤝</span>
                  <span className="animate-bounce" style={{animationDelay: '0.2s'}}>✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Ready to Make Real Connections?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join the waitlist and be among the first to experience Moments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/waitlist" 
              className="inline-flex items-center px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
            >
              Find Your Moment
            </a>
            <a 
              href="/download" 
              className="inline-flex items-center px-6 py-3 border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
