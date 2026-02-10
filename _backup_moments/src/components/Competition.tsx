'use client';

import { motion } from 'framer-motion';

const competitors = [
  {
    name: 'Bumble BFF',
    approach: 'Swipe-based friend matching',
    limitation: 'Awkward, lacks real-time spontaneity, feels forced'
  },
  {
    name: 'Meetup',
    approach: 'Planned group events',
    limitation: 'Skews older, not campus-specific, requires advance commitment'
  }
];

export default function Competition() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {competitors.map((competitor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-neutral-800/50 border border-neutral-800 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {competitor.name}
            </h3>
            <p className="text-white/60 text-sm mb-3">
              {competitor.approach}
            </p>
            <p className="text-white/50 text-sm italic">
              {competitor.limitation}
            </p>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-neutral-800/80 border border-white/20 rounded-xl p-8 text-center"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">
          Moments
        </h3>
        <p className="text-white/80 text-lg">
          Spontaneous, proximity-based, student-first, low-pressure meetups
        </p>
        <p className="text-white/60 text-sm mt-3">
          Real-time connection designed for campus life
        </p>
      </motion.div>
    </div>
  );
}

