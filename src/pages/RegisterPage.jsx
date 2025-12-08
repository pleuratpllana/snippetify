import AuthLayout from "../layouts/Auth";
import AuthForm from "../components/Auth/AuthForm";
import PageWrapper from "./PageWrapper";

const RegisterPage = () => (
  <AuthLayout title="Create Your Account" subtitle="Sign up in a few clicks">
    <PageWrapper>
      <AuthForm mode="register" />
    </PageWrapper>
  </AuthLayout>
);

export default RegisterPage;
