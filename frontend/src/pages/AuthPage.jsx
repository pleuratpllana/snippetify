// src/pages/AuthPage.jsx
import { useParams } from "react-router-dom";
import AuthLayout from "../layouts/Auth";
import AuthForm from "../components/Auth/AuthForm";

const titles = {
  login: {
    title: "Welcome Back",
    subtitle: "Dive back into your vault of snippets",
  },
  register: {
    title: "Create Your Account",
    subtitle: "Sign up in a few clicks",
  },
  forgot: {
    title: "Forgot Password?",
    subtitle: "Let us instruct you how to reset it",
  },
  reset: {
    title: "Reset Password",
    subtitle: "Set a new password for your account",
  },
};

const AuthPage = () => {
  const { mode, code } = useParams();

  if (!["login", "register", "forgot", "reset"].includes(mode)) {
    return <div>Invalid auth mode</div>;
  }

  return (
    <AuthLayout {...titles[mode]}>
      <AuthForm mode={mode} code={code} />
    </AuthLayout>
  );
};

export default AuthPage;
