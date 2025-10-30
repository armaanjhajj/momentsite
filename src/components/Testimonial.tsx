'use client';

import { motion } from 'framer-motion';

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
}

export default function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <svg
          className="w-12 h-12 text-white/20 mx-auto mb-6"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
        <blockquote className="text-xl md:text-2xl text-white/90 leading-relaxed mb-6">
          {quote}
        </blockquote>
        <div className="text-white/60">
          <div className="font-semibold text-white">{author}</div>
          {role && <div className="text-sm mt-1">{role}</div>}
        </div>
      </div>
    </motion.div>
  );
}

