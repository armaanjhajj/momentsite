import { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import FeatureRail from '@/components/FeatureRail';
import Counter from '@/components/Counter';
import Competition from '@/components/Competition';
import RevenueLanes from '@/components/RevenueLanes';
import StickyScroller from '@/components/StickyScroller';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Moments – Real connection, in real time',
  description: 'Moments helps students discover authentic social opportunities and meet in person, ending campus loneliness through AI-powered proximity matching.',
  openGraph: {
    title: 'About Moments – Real connection, in real time',
    description: 'Moments helps students discover authentic social opportunities and meet in person, ending campus loneliness through AI-powered proximity matching.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Moments – Real connection, in real time',
    description: 'Moments helps students discover authentic social opportunities and meet in person, ending campus loneliness through AI-powered proximity matching.',
  },
};

export default function AboutPage() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <Hero />

      {/* The Problem & Why Now */}
      <Section id="learn" className="bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            The Loneliness Epidemic on Campus
          </h2>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            The US Surgeon General declared loneliness an epidemic in 2023. Students feel more isolated than ever—despite being surrounded by peers. Universities invest in wellness, but lack a stigma-free, real-time tool that actually bridges the gap between digital and in-person connection.
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-8 md:gap-12 mb-12">
          <Counter target={60} label="Students Feel Isolated" suffix="%" />
          <Counter target={3} label="Hours of Loneliness Daily" suffix="" />
          <Counter target={79} label="Want More Connections" suffix="%" />
        </div>

        {/* Stat bars */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/90 font-medium">Report feeling disconnected from campus community</span>
              <span className="text-white font-semibold">73%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/40 rounded-full" style={{ width: '73%' }} />
            </div>
          </div>
          
          <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/90 font-medium">Find it difficult to make meaningful friendships</span>
              <span className="text-white font-semibold">64%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/40 rounded-full" style={{ width: '64%' }} />
            </div>
          </div>
        </div>
      </Section>

      {/* What Moments Does - 3 Pillars */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            Built for Real Connection
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Moments combines cutting-edge technology with human-centered design to create authentic opportunities for students to meet and connect.
          </p>
        </div>
        <FeatureRail />
      </Section>

      {/* How People Actually Meet */}
      <Section className="bg-white/[0.02]">
        <StickyScroller />
      </Section>

      {/* Market & Differentiation */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            The Market Opportunity
          </h2>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-12">
            20 million US college students represent our total addressable market. We&apos;re focusing on the top 300 campuses with 10M+ students, targeting 40k active users in the first 3 years.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center">
            How We&apos;re Different
          </h3>
          <Competition />
        </div>
      </Section>

      {/* Audience & Value */}
      <Section className="bg-white/[0.02]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            Who Moments Serves
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Students
            </h3>
            <p className="text-white/70 leading-relaxed mb-4">
              College students aged 18–26 seeking authentic friendships, a sense of belonging, and ways to combat loneliness on campus.
            </p>
            <ul className="space-y-2 text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-1">•</span>
                <span>Build meaningful, lasting friendships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-1">•</span>
                <span>Discover spontaneous social opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-1">•</span>
                <span>Feel more connected to campus life</span>
              </li>
            </ul>
          </div>

          <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Organizations & Businesses
            </h3>
            <p className="text-white/70 leading-relaxed mb-4">
              Campus organizations and local businesses looking to increase visibility, drive foot traffic, and engage with the student community.
            </p>
            <ul className="space-y-2 text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-1">•</span>
                <span>Reach engaged student audiences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-1">•</span>
                <span>Promote events and sponsored opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 mt-1">•</span>
                <span>Build authentic community partnerships</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Traction */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            Early Momentum
          </h2>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
            We&apos;re building something students actually want—and the numbers show it.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <Counter target={1200} label="Waitlist Signups" suffix="+" />
          <Counter target={150} label="Beta Testers" suffix="+" />
          <Counter target={500} label="Social Reach" suffix="k+" />
          <Counter target={3} label="Campus Partners" suffix="" />
        </div>
      </Section>

      {/* Business Model */}
      <Section className="bg-white/[0.02]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            Revenue Model
          </h2>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
            Sustainable, scalable revenue streams that align with our mission of authentic connection.
          </p>
        </div>
        <RevenueLanes />
      </Section>

      {/* Closing CTA */}
      <Section className="text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
            Join the Movement
          </h2>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-12">
            Let&apos;s end campus loneliness—one real connection at a time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 bg-white text-black text-lg font-medium hover:bg-white/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 min-w-[200px]"
            >
              Join the Waitlist
            </Link>
            <Link
              href="/businesses"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 bg-white/10 text-white text-lg font-medium hover:bg-white/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 min-w-[200px]"
            >
              Partner With Us
            </Link>
            <Link
              href="/press"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 bg-white/10 text-white text-lg font-medium hover:bg-white/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 min-w-[200px]"
            >
              Media Kit
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
