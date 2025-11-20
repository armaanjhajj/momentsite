"use client";
import { useState } from 'react';

export default function MixerPage() {
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/mixer01/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setShowSuccess(true);
        setEmail('');
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit');
      }
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-semibold mb-6">
            Sign Up
          </h1>
          <p className="text-2xl md:text-3xl text-white/60">
            Enter your email to RSVP
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {showSuccess && (
            <div className="mb-8 p-6 rounded-2xl bg-green-500/10 border-2 border-green-500/30 text-green-400 text-center text-xl">
              ✓ Successfully signed up!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-8 py-6 text-2xl bg-neutral-950 border-2 border-neutral-800 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-6 text-2xl bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
