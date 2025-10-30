'use client';

import { motion } from 'framer-motion';
import { Radar, MapPin, Shield } from 'lucide-react';

const features = [
  {
    icon: Radar,
    title: 'AI-Powered Proximity Matching',
    description: 'Our algorithm connects you with people nearby who share your interests, energy, and availability right now.'
  },
  {
    icon: MapPin,
    title: 'Campus-Specific Feed',
    description: 'See what\'s happening on your campus in real time—events, spontaneous hangouts, verified spots to meet.'
  },
  {
    icon: Shield,
    title: 'Verified Meetup Spots & Orgs',
    description: 'Discover safe, public spaces and trusted student organizations where real connection happens.'
  }
];

export default function FeatureRail() {
  return (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -8 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">
            {feature.title}
          </h3>
          <p className="text-white/70 leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

