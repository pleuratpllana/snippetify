const BorderedHeading = ({ text }) => (
  <p
    className="
      relative inline-flex items-center justify-center gap-1 px-3 py-1 text-base rounded-full mx-auto text-sm mb-0
      before:absolute before:top-0 before:left-0 before:w-full before:h-[1px]
      before:bg-gradient-to-r before:from-transparent before:via-[var(--color-border)] before:to-transparent
      after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px]
      after:bg-gradient-to-r after:from-transparent after:via-[var(--color-border)] after:to-transparent
    "
  >
    <span className="text-[#bcdb57]">•</span>
    <span>{text}</span>
  </p>
);

export default BorderedHeading;
