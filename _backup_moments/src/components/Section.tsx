import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`relative w-full py-24 md:py-36 ${className}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {children}
      </div>
    </section>
  );
}

