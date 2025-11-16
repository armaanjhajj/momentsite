import Link from 'next/link';

type AccessPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function AccessPage({ searchParams }: AccessPageProps) {
  const error = typeof searchParams?.error === 'string' ? searchParams?.error : undefined;

  return (
    <main className="container pt-16 pb-24 max-w-xl">
      <h1 className="text-2xl font-semibold">Portal Access</h1>
      <p className="mt-2 text-white/70">Enter the access code to continue.</p>

      {error && (
        <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-2">
          {error === 'missing' ? 'Server is missing access code. Try again later.' : 'Wrong code. Try again.'}
        </div>
      )}

      <form method="POST" action="/portal/access/submit" className="mt-6 space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm text-white/80">Access code</label>
          <input
            id="code"
            name="code"
            type="password"
            autoComplete="off"
            required
            className="mt-2 w-full rounded-md bg-neutral-800/50 border border-neutral-800 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Enter access code"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90"
        >
          Continue
        </button>
        <div className="mt-6 text-sm text-white/60">
          <span>Need help? </span>
          <Link href="/contact" className="underline hover:text-white">Contact us</Link>
        </div>
      </form>
    </main>
  );
}


