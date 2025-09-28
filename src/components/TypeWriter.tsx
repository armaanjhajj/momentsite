'use client';

import { useState, useEffect } from 'react';

const messages = [
  '"I want to make friends on campus"',
  '"I wish I had a group of girl friends to go out with"',
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
        }, 50); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        // Finished typing current message, wait then start erasing
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Wait 2 seconds before erasing
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 30); // Erasing speed (faster than typing)
        return () => clearTimeout(timeout);
      } else {
        // Finished erasing, move to next message or reset to beginning
        if (currentMessageIndex < messages.length - 1) {
          setCurrentMessageIndex(currentMessageIndex + 1);
          setIsTyping(true);
        } else {
          // Reset to beginning after showing the last message
          const timeout = setTimeout(() => {
            setCurrentMessageIndex(0);
            setIsTyping(true);
          }, 500);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [currentText, currentMessageIndex, isTyping]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const isNeonMessage = currentMessageIndex === messages.length - 1; // Last message is the neon one

  return (
    <h1 className={`mt-2 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight min-h-[1.2em] ${
      isNeonMessage 
        ? 'animate-pulse' 
        : ''
    }`}
    style={isNeonMessage ? {
      color: '#FF4E6A',
      filter: 'drop-shadow(0 0 10px rgba(255, 78, 106, 0.8))'
    } : {}}>
      {currentText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
    </h1>
  );
}
