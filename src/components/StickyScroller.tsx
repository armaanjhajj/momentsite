'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Context',
    description: 'Understanding shared interests, activities, and social circles to create meaningful common ground.'
  },
  {
    title: 'Proximity',
    description: 'Real-time location awareness ensures you\'re matched with people actually nearby, right now.'
  },
  {
    title: 'Timing',
    description: 'Availability synchronization catches those perfect moments when you\'re both free to meet.'
  },
  {
    title: 'Mutual Incentive',
    description: 'Verified spots, events, and shared goals create natural, low-pressure reasons to connect.'
  }
];

export default function StickyScroller() {
  return (
    <div className="relative">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Left side - sticky text */}
        <div className="md:sticky md:top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
              Orchestrating the Perfect Moment
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              Real connection doesn&apos;t happen by accident. It requires the right context, proximity, timing, and mutual incentive—all working together seamlessly.
            </p>
          </motion.div>
        </div>

        {/* Right side - scrolling steps */}
        <div className="space-y-12 md:space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  {step.title}
                </h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

