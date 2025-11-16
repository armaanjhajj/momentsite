"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const teamMembers = [
  { id: 1, name: "Armaan Jhajj", role: "Co-Founder", image: "/team/team-1.png" },
  { id: 2, name: "Simeon Thomas", role: "Co-Founder", image: "/team/team-2.png" },
  { id: 3, name: "Ajit Sivakumar", role: "Co-Founder", image: "/team/team-3.png" },
  { id: 4, name: "Maggie Suneja", role: "Content Lead", image: "/team/team-4.png" },
  { id: 5, name: "Siya Khokani", role: "Content Lead", image: "/team/team-5.png" },
  { id: 6, name: "Jasmine Levinsky", role: "Content Lead", image: "/team/team-6.png" },
  { id: 7, name: "Shruthi Sriram", role: "Growth", image: "/team/team-7.png" },
];

export default function TeamPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-semibold mb-6">
            Meet the Team
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-4">
            Building the future of authentic connection
          </p>
          <p className="text-white/60 max-w-2xl mx-auto">
            We're a diverse group of builders, designers, and dreamers working to end campus loneliness—one real moment at a time.
          </p>
        </motion.div>
      </section>

      {/* Team Grid */}
      <section className="container pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredId(member.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="group relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === member.id ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-white/70">{member.role}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join Section */}
      <section className="container pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto text-center rounded-2xl border border-neutral-800 bg-neutral-900 p-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Want to join us?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            We're always looking for talented, passionate people to help us build the future of connection on campus.
          </p>
          <a
            href="mailto:careers@havemoments.com"
            className="inline-flex items-center justify-center rounded-2xl px-8 py-4 bg-white text-black text-lg font-medium hover:bg-white/90 transition-all"
          >
            Get in touch
          </a>
        </motion.div>
      </section>
    </main>
  );
}

