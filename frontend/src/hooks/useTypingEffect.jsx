import { useState, useEffect } from "react";

const useTypingEffect = (words, baseSpeed = 120, pause = 1000) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];
    const speed = deleting
      ? baseSpeed / 2 + Math.random() * 20
      : baseSpeed + Math.random() * 80;

    const timeout = setTimeout(() => {
      if (!deleting && subIndex === currentWord.length) {
        setTimeout(() => setDeleting(true), pause);
      } else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
      } else {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, words, baseSpeed, pause]);

  // never let text collapse completely
  const text = words[index].substring(0, subIndex) || "\u200B";

  return { text };
};

export default useTypingEffect;
