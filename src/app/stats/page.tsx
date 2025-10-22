import Link from "next/link";

export default function StatsPage() {
  return (
    <main className="container pt-16 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-semibold mb-6">Platform Statistics</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-white/80 mb-8">
            Real-time insights into our growing community and platform engagement.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">1,200+</div>
              <div className="text-sm text-white/70">Active Users</div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-sm text-white/70">Events This Month</div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">15</div>
              <div className="text-sm text-white/70">Partner Universities</div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">2,500+</div>
              <div className="text-sm text-white/70">Connections Made</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold mb-6">Growth Metrics</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">User Engagement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Daily Active Users</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Event Attendance Rate</span>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Connection Success Rate</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Platform Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Posts per Day</span>
                    <span className="text-sm font-medium">150+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">New Events Weekly</span>
                    <span className="text-sm font-medium">25+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Average Session Time</span>
                    <span className="text-sm font-medium">12 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Join Our Growing Community</h2>
            <p className="text-white/70 mb-6">Be part of the movement that&apos;s connecting college students across campuses.</p>
            <Link 
              href="/waitlist" 
              className="inline-flex items-center rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
