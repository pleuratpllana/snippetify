// src/pages/ResetPasswordPage.jsx
import { useSearchParams } from "react-router-dom";
import AuthLayout from "../layouts/Auth";
import AuthForm from "../components/Auth/AuthForm";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code"); // This comes from the reset email link

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      <AuthForm mode="reset" code={code} />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
