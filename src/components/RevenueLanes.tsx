'use client';

import { motion } from 'framer-motion';
import { Building2, BadgeCheck, Megaphone, Users } from 'lucide-react';

const revenueLanes = [
  {
    icon: Building2,
    title: 'Local Business Exclusivity',
    description: 'Premium partnerships with campus area businesses'
  },
  {
    icon: BadgeCheck,
    title: 'Verification Subscriptions',
    description: 'Verified badges and enhanced profiles for organizations'
  },
  {
    icon: Megaphone,
    title: 'Sponsored Content',
    description: 'Promoted events and featured opportunities'
  },
  {
    icon: Users,
    title: 'Campus Activations',
    description: 'University partnerships and on-campus initiatives'
  }
];

export default function RevenueLanes() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {revenueLanes.map((lane, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-white/20 transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-4">
            <lane.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {lane.title}
          </h3>
          <p className="text-sm text-white/60">
            {lane.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

