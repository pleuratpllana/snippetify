import AuthLayout from "../layouts/Auth";
import AuthForm from "../components/Auth/AuthForm";

const ForgotPasswordPage = () => (
  <AuthLayout title="Forgot Password" subtitle="Enter your email to reset">
    <AuthForm mode="forgot" />
  </AuthLayout>
);

export default ForgotPasswordPage;
