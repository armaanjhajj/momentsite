"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function BusinessApplicationPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    description: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/business-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setStatus('success');
      setFormData({
        businessName: '',
        location: '',
        description: '',
        message: '',
      });
    } catch {
      setStatus('error');
      setErrorMessage('Failed to submit application. Please try again or email us directly at support@havemoments.com');
    }
  };

  return (
    <main className="container pt-16 pb-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/businesses" className="text-white/60 hover:text-white text-sm mb-6 inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Businesses
        </Link>

        <h1 className="text-4xl md:text-5xl font-semibold mb-4 mt-6">Apply for Verification</h1>
        <p className="text-white/70 mb-8">
          Fill out the form below to apply for business verification. We&apos;ll review your application and get back to you shortly.
        </p>

        {status === 'success' ? (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold mb-2">Application Submitted!</h2>
            <p className="text-white/70 mb-6">
              Thank you for applying. We&apos;ll review your application and contact you soon.
            </p>
            <Link href="/businesses" className="inline-flex items-center rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors">
              Back to Businesses
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium mb-2">
                Business Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Your business name"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Street address, city, state"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Business Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                placeholder="Tell us about your business (type of establishment, what you offer, etc.)"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Additional Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                placeholder="Any additional information you'd like to share"
              />
            </div>

            {status === 'error' && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Application'}
            </button>

            <p className="text-xs text-white/50 text-center">
              By submitting this form, you confirm that you are an independent, local business and not an enterprise franchise.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

