export default function BusinessesPage() {
  return (
    <main className="container pt-16 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-semibold mb-6">For Businesses</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-white/80 mb-8">
            Partner with Moments to reach college students and promote your events, products, and services to an engaged campus community.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Event Promotion</h2>
              <p className="text-white/70">
                Promote your events directly to college students who are actively looking for things to do on campus and in their area.
              </p>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Targeted Reach</h2>
              <p className="text-white/70">
                Connect with students based on their interests, location, and campus affiliation for maximum engagement.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">1. Create Your Event</h3>
                <p className="text-sm text-white/70">Add your business event with details, location, and target audience.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Reach Students</h3>
                <p className="text-sm text-white/70">Your event appears in student feeds and discovery features.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Track Engagement</h3>
                <p className="text-sm text-white/70">Monitor attendance, interest, and engagement with your content.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-white/70 mb-6">Contact us to learn more about business partnerships and event promotion opportunities.</p>
            <a 
              href="mailto:business@havemoments.com" 
              className="inline-flex items-center rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Contact Business Team
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
