import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      children,
      onClick,
      icon: Icon,
      iconClassName = "w-5 h-5",
      count,
      active = false,
      className = "",
      activeBg = "",
      centerContent = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
        className={`flex items-center transition-colors duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : "hover:opacity-90"
        } ${active ? activeBg : ""} ${className}`}
        {...props}
      >
        <div
          className={`flex items-center gap-2 w-full ${
            centerContent ? "justify-center" : "justify-start"
          }`}
        >
          {Icon && (
            <div className="flex-shrink-0">
              <Icon className={iconClassName} />
            </div>
          )}
          {children && (
            <span className={centerContent ? "" : "truncate"}>{children}</span>
          )}
        </div>
        {count !== undefined && <span>{count}</span>}
      </button>
    );
  }
);

export default Button;
