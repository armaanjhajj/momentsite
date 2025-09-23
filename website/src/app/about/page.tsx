import DeviceFrameImage from "@/components/DeviceFrameImage";
import DemoCombined from "@/components/demos/DemoCombined";

export default function About() {
  return (
    <main className="container py-16">
      <h1 className="text-3xl md:text-5xl font-semibold">About Moments</h1>
      <p className="text-white/80 mt-4 max-w-2xl">Moments helps students reverse missed connections and build real community on campus.</p>

      <section className="mt-10">
        <DeviceFrameImage>
          <DemoCombined />
        </DeviceFrameImage>
      </section>
    </main>
  );
}


