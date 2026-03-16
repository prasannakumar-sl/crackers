'use client';

import { useEffect, useRef } from 'react';
import '../styles/paradise-animation.css';

export default function ParadiseAnimation({ text = 'PARADISE' }) {
  const containerRef = useRef(null);
  const letters = text.toUpperCase().split('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous animation
    const existingLetters = container.querySelectorAll('.paradise-letter');
    existingLetters.forEach(el => el.remove());

    // Create letters with animation
    letters.forEach((letter, index) => {
      const letterEl = document.createElement('span');
      letterEl.className = 'paradise-letter';
      letterEl.textContent = letter;
      letterEl.style.animationDelay = `${index * 0.15}s`;
      container.appendChild(letterEl);

      // Create sparks for each letter
      for (let i = 0; i < 8; i++) {
        const spark = document.createElement('span');
        spark.className = 'paradise-spark';
        const sparkDelay = index * 0.15 + i * 0.05;
        spark.style.animationDelay = `${sparkDelay}s`;

        // Calculate angle in radians
        const angle = (360 / 8) * i * (Math.PI / 180);
        const distance = 80;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        spark.style.setProperty('--spark-x', `${x}px`);
        spark.style.setProperty('--spark-y', `${y}px`);
        letterEl.appendChild(spark);
      }
    });
  }, [letters]);

  return (
    <div className="paradise-container" ref={containerRef}>
      {/* Letters will be added dynamically */}
    </div>
  );
}
