const Container = ({
  children,
  className = "",
  textAlign = "center",
  ...props
}) => {
  const alignmentClass = textAlign === "left" ? "text-left" : "text-center";

  return (
    <div
      {...props}
      className={`max-w-7xl mx-auto mt-24 lg:mt-40  ${alignmentClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
