// Global speed multiplier
const SCROLL_SPEED_MULTIPLIER = 0.7; // 1 = normal, >1 slower, <1 faster

const scrollToSection = (id, baseDuration = 500) => {
  const element = document.getElementById(id);
  if (!element) return;

  // Adjust offset based on screen width (header height)
  const offset = window.innerWidth < 768 ? 80 : 120;

  const startPosition = window.scrollY;
  const targetPosition =
    element.getBoundingClientRect().top + startPosition - offset;
  const distance = targetPosition - startPosition;

  // Make duration proportional to distance, then apply multiplier
  const duration =
    Math.max(baseDuration, Math.abs(distance) * 0.5) * SCROLL_SPEED_MULTIPLIER;

  let startTime = null;

  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const animation = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const run = startPosition + distance * easeInOutQuad(progress);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
};

export default scrollToSection;
