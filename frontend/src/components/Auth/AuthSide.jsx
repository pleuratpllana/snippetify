// frontend/src/components/Auth/AuthSideContent.jsx

const AuthSideContent = ({ title, description }) => {
  return (
    <div className="text-center">
      <h3>{title}</h3>
      <p className="mt-2">{description}</p>
      {/* You can add a static or dynamic image/illustration here */}
      {/* <img src="/assets/auth-illustration.svg" alt="Authentication Illustration" className="mt-8" /> */}
    </div>
  );
};

export default AuthSideContent;
