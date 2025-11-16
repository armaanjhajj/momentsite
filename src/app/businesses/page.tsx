import Link from 'next/link';

export default function BusinessesPage() {
  return (
    <main className="container pt-16 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-semibold mb-6">For Local Businesses</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-white/80 mb-8">
            Gain verified status on Moments and become the exclusive meetup destination for students in your area. We&apos;re building a platform that prioritizes local businesses over enterprise franchises.
          </p>
          
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-white/10 to-white/5 p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">Exclusive Featured Placement</h2>
            <p className="text-white/80 text-lg mb-6">
              When students match within a 0.5 mile radius of your verified business, your location becomes the only suggested meetup spot. All other venues are voided, giving you exclusive visibility and driving foot traffic directly to your establishment.
            </p>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-800/50 border border-neutral-800">
              <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-white font-medium mb-1">Local Only</p>
                <p className="text-white/70 text-sm">This feature is exclusively available to independent, local businesses. Enterprise franchises like Starbucks, McDonald&apos;s, and other chains are not eligible.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 p-6">
              <div className="text-3xl mb-3">✅</div>
              <h2 className="text-xl font-semibold mb-3">Get Verified</h2>
              <p className="text-white/70">
                Apply for verification and get featured as an official partner. We review each application to ensure we&apos;re supporting authentic local businesses.
              </p>
            </div>
            
            <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 p-6">
              <div className="text-3xl mb-3">📍</div>
              <h2 className="text-xl font-semibold mb-3">0.5 Mile Radius</h2>
              <p className="text-white/70">
                Your business becomes the exclusive suggestion when students connect within half a mile, ensuring maximum visibility and engagement.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h2 className="text-xl font-semibold mb-3">Drive Foot Traffic</h2>
              <p className="text-white/70">
                Turn digital connections into real-world visits. Students looking for a place to meet will see only your venue as the recommended spot.
              </p>
            </div>
            
            <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 p-6">
              <div className="text-3xl mb-3">🤝</div>
              <h2 className="text-xl font-semibold mb-3">Support Local</h2>
              <p className="text-white/70">
                We&apos;re committed to helping local cafes, restaurants, and small businesses thrive by connecting them with the student community.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-semibold">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Apply for Verification</h3>
                  <p className="text-sm text-white/70">Submit your business information for review. We verify that you&apos;re a local, independent business.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-semibold">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Get Featured Exclusively</h3>
                  <p className="text-sm text-white/70">Once verified, your business becomes the sole meetup suggestion within your 0.5 mile radius whenever students match.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-semibold">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Welcome New Customers</h3>
                  <p className="text-sm text-white/70">Students discover your business as their go-to spot to meet, study, or hang out with new connections.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Verified?</h2>
            <p className="text-white/70 mb-6">Join our network of local businesses and become the preferred meetup spot for students in your area.</p>
            <Link 
              href="/businesses/apply" 
              className="inline-flex items-center rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Apply for Verification
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
