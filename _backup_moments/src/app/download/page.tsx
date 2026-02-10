import Image from "next/image";

export default function Download() {
  return (
    <main className="container py-16">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-semibold">Download</h1>
        <p className="text-white/70 mt-2">App Store badge (preview)</p>
        <div className="mt-8 flex items-center justify-center">
          <Image
            src="https://static.vecteezy.com/system/resources/previews/012/871/374/non_2x/app-store-download-button-in-white-colors-download-on-the-apple-app-store-free-png.png"
            alt="App Store badge"
            width={320}
            height={96}
            className="w-auto h-16 md:h-20"
            priority
          />
        </div>
        <p className="mt-6 text-white/80">Coming very soon. Join waitlist to gain early access.</p>
      </div>
    </main>
  );
}


