// OAuthButton.jsx

const OAuthButton = ({ onClick, children, icon }) => (
  <button
    type="button"
    className="button-outlined w-full flex items-center justify-center gap-2 mb-2"
    onClick={onClick}
  >
    {icon}
    {children}
  </button>
);

export default OAuthButton;
