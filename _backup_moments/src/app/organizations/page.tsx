export default function OrganizationsPage() {
  return (
    <main className="container pt-16 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-semibold mb-6">Organizations</h1>
        <p className="text-lg text-white/80 mb-8">
          Connect with student organizations and discover opportunities to get involved on campus.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 p-6">
            <h2 className="text-xl font-semibold mb-4">For Students</h2>
            <p className="text-white/70 mb-4">
              Discover and join student organizations that align with your interests and goals.
            </p>
            <ul className="text-sm text-white/60 space-y-2">
              <li>• Browse organization profiles and events</li>
              <li>• Request to join organizations</li>
              <li>• Stay updated on organization activities</li>
              <li>• Connect with like-minded students</li>
            </ul>
          </div>
          
          <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 p-6">
            <h2 className="text-xl font-semibold mb-4">For Organizations</h2>
            <p className="text-white/70 mb-4">
              Manage your organization, approve members, and promote events to the campus community.
            </p>
            <ul className="text-sm text-white/60 space-y-2">
              <li>• Create and manage your organization profile</li>
              <li>• Approve and manage member requests</li>
              <li>• Promote events and activities</li>
              <li>• Track engagement and growth</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-800/50 p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 mb-6">
            Join the waitlist to be notified when organizations features become available.
          </p>
          <a 
            href="/waitlist" 
            className="inline-flex items-center rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </main>
  );
}