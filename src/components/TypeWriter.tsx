'use client';

import { useState, useEffect } from 'react';

const messages = [
  '"I want to make friends on campus"',
  '"I wish I had a group of girls to go out with"',
  '"I\'m looking for a cofounder for my next business"',
  '"I need an abg in my life"',
  'Find your moment in real time'
];

export default function TypeWriter() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];
    
    if (isTyping) {
      if (currentText.length < currentMessage.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentMessage.slice(0, currentText.length + 1));
        }, 50); 
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000); 
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 30); 
        return () => clearTimeout(timeout);
      } else {
        if (currentMessageIndex < messages.length - 1) {
          setCurrentMessageIndex(currentMessageIndex + 1);
          setIsTyping(true);
        } else {
          const timeout = setTimeout(() => {
            setCurrentMessageIndex(0);
            setIsTyping(true);
          }, 500);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [currentText, currentMessageIndex, isTyping]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const isNeonMessage = currentMessageIndex === messages.length - 1; 

  return (
    <h1 className={`mt-2 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight min-h-[1.2em] 
    `}
    style={isNeonMessage ? {
      color: '#9CA3AF',
    } : {}}>
      {currentText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
    </h1>
  );
}
